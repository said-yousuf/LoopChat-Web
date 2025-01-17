import { useChatStore } from '@/store/chat-store';
import { useAuthStore } from '@/store/useAuthStore';
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private readonly SOCKET_URL = 'http://localhost:3001/chat';
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
      const { currentUser } = useAuthStore.getState();

      addMessage(message.roomId, {
        ...message,
        isSender: message.user === currentUser?.id ? true : false,
        sender: {
          id: message.user,
          username: message.name,
        },
      });
    });

    this.socket.on('user:status', ({ userId, username, status }) => {
      const { updateUserStatus } = useChatStore.getState();

      updateUserStatus(userId, status);
    });

    this.socket.on('users:online', (onlineUsers) => {
      const { updateUserStatus } = useChatStore.getState();
      onlineUsers.forEach((user: any) => {
        updateUserStatus(user.id, user.status);
      });
    });

    this.socket.on('message:read', ({ roomId, recieverId, isRead }) => {
      const { updateMessageStatus } = useChatStore.getState();

      updateMessageStatus(roomId, recieverId, isRead);
    });

    this.socket.on('userTyping', ({ chatId, userId, name }) => {
      const { setTyping } = useChatStore.getState();
      setTyping(chatId, userId, name);
    });

    this.socket.on('stopTyping', ({ chatId, userId }) => {
      const { clearTyping } = useChatStore.getState();
      clearTyping(chatId, userId);
    });
  }

  sendMessage(content: string, typingUsers: any) {
    if (!this.socket) {
      console.error('Socket not connected');
      return null;
    }

    const messageId =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    this.socket.emit('sendMessage', {
      message: content,
      name: typingUsers.name,
      userId: typingUsers.userId,
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

    this.socket.emit(isTyping ? 'startTyping' : 'stopTyping');
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
