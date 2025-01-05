import { socketService } from '@/services/socket';
import { FileAttachment, Message, useChatStore } from '@/store/chat-store';
import { useAuthStore } from '@/store/useAuthStore';
import { useCallback, useState } from 'react';
// import { UploadedFile } from '@/services/upload-service'

export function useChatConnection(chatId: string) {
  const { isAuthenticated } = useAuthStore();
  const { updateMessageStatus, addMessage } = useChatStore();
  const [isConnected, setIsConnected] = useState(false);

  const sendMessage = useCallback(
    async (content: string, attachments?: FileAttachment[]) => {
      const messageId = socketService.sendMessage(content);
      const { currentUser } = useAuthStore.getState();

      if (messageId) {
        const message: Message = {
          id: messageId,
          chatId,
          content,
          contentType: 'TEXT',
          isRead: false,
          sender: {
            id: currentUser?.id || '',
            username: currentUser?.username || '',
            profile_photo: currentUser?.profile_photo || null,
          },
          createdAt: new Date().toISOString(),
          isSender: true,
          attachments,
        };
        addMessage(chatId, message);
      }
    },
    [chatId, addMessage]
  );

  const sendTypingStatus = useCallback(
    (isTyping: boolean) => {
      socketService.sendTyping(chatId, isTyping);
    },
    [chatId]
  );

  const addReaction = useCallback(
    (messageId: string, emoji: string) => {
      socketService.addReaction(chatId, messageId, emoji);
    },
    [chatId]
  );

  const removeReaction = useCallback(
    (messageId: string, emoji: string) => {
      socketService.removeReaction(chatId, messageId, emoji);
    },
    [chatId]
  );

  return {
    isConnected,
    sendMessage,
    sendTypingStatus,
    addReaction,
    removeReaction,
  };
}
