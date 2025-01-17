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
    async (
      content: string,
      typingUsers?: any,
      attachments?: FileAttachment[]
    ) => {
      const messageId = socketService.sendMessage(content, typingUsers);
      const { currentUser } = useAuthStore.getState();
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
