import { useChatStore } from '@/store/chat-store';
import { useAuthStore } from '@/store/useAuthStore';
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private readonly SOCKET_URL = 'http://172.30.10.136:3001/chat';
  private isConnected = false;

  getConnectionStatus() {
    return this.isConnected;
  }

  connect(receiverId: string) {
    const token = useAuthStore.getState().token;

    if (!token) {
      console.error('No authentication token or user found');
      return;
    }

    console.log('Connecting to socket server with token:', token);

    this.socket = io(this.SOCKET_URL, {
      auth: {
        token,
      },
      query: {
        receiverId,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Connected to socket server');
      console.log('Socket ID:', this.socket?.id);
      console.log('Transport:', this.socket?.io.engine.transport.name);
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('Disconnected from socket server');
    });

    this.socket.on('connect_error', (error) => {
      this.isConnected = false;
      console.error('Socket connection error:', error);
      console.log('Connection details:', {
        url: this.SOCKET_URL,
        transport: this.socket?.io.engine.transport.name,
        token: !!useAuthStore.getState().token,
      });

      if (error.message === 'Invalid token') {
        useAuthStore.getState().logout();
      }
    });

    this.socket.on('message', (message) => {
      const { addMessage } = useChatStore.getState();

      console.log(message);

      addMessage(message.roomId, {
        ...message,
        isMine: false,
        status: 'received',
      });
    });

    // this.socket.on('message:status', ({ chatId, messageId, status }) => {
    //   const { updateMessageStatus } = useChatStore.getState();
    //   updateMessageStatus(chatId, messageId, status);
    // });

    // this.socket.on('user:typing', ({ chatId, userId, name }) => {
    //   const { setTyping } = useChatStore.getState();
    //   setTyping(chatId, userId, name);
    // });

    // this.socket.on('user:stop-typing', ({ chatId, userId }) => {
    //   const { clearTyping } = useChatStore.getState();
    //   clearTyping(chatId, userId);
    // });
  }

  sendMessage(content: string) {
    if (!this.socket) {
      console.error('Socket not connected');
      return null;
    }

    const messageId =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    this.socket.emit('sendMessage', {
      message: content,
      messageId,
    });

    return messageId;
  }

  sendTypingStatus(chatId: string, isTyping: boolean) {
    if (!this.socket) return;

    this.socket.emit(isTyping ? 'typing:start' : 'typing:stop', {
      chatId,
      userId: 'user-1', // Replace with actual user ID
      name: 'You', // Replace with actual user name
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendTyping(chatId: string, isTyping: boolean) {
    if (!this.socket) return;

    this.socket.emit(isTyping ? 'user:typing' : 'user:stop-typing', {
      chatId,
    });
  }

  // Add reaction to message
  addReaction(chatId: string, messageId: string, emoji: string) {
    if (!this.socket) return;

    this.socket.emit('message:react', {
      chatId,
      messageId,
      emoji,
    });
  }

  // Remove reaction from message
  removeReaction(chatId: string, messageId: string, emoji: string) {
    if (!this.socket) return;

    this.socket.emit('message:unreact', {
      chatId,
      messageId,
      emoji,
    });
  }
}

export const socketService = new SocketService();
