import { ChatView } from '@/components/chat/ChatView';
import { getMessages, getUsers } from '@/services/chat';
import { socketService } from '@/services/socket';
import { Chat, useChatStore } from '@/store/chat-store';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function ChatPage() {
  const { setCurrentChat, setChats, setMessages, chats } = useChatStore();
  const { userId } = useParams();

  useEffect(() => {
    // Load available users as chats
    const loadUsers = async () => {
      try {
        const users = await getUsers();
        const chats: Chat[] = users.map((user) => ({
          id: user.roomId,
          userId: user.id,
          chatId: user.roomId,
          name: user.username,
          avatar: user.profile_photo || undefined,
          status: 'offline',
          unread: 0,
          lastMessage: user.lastMessage?.content,
        }));

        setChats(chats);

        // Move this inside the try block after setChats
        const currentChat = chats.find((chat) => chat.userId === userId);

        if (currentChat) {
          setCurrentChat(currentChat.chatId);

          // Load messages immediately after setting current chat
          const messages = await getMessages(currentChat.chatId);
          setMessages(currentChat.chatId, messages);

          // Connect socket
          socketService.connect(currentChat.userId);
        }
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };

    loadUsers();

    return () => {
      socketService.disconnect();
    };
  }, [userId]);

  const currentChat = chats.find((chat) => chat.userId === userId);

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center flex-1 h-full bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Chat not found</h1>
          <p className="text-muted-foreground">
            The chat you're looking for doesn't exist
          </p>
        </div>
      </div>
    );
  }

  return <ChatView chat={currentChat} />;
}
