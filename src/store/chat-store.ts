import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileAttachment {
  url: string;
  name: string;
  size: number;
  type: string;
  thumbnailUrl?: string;
}

export interface Message {
  id: string;
  content: string;
  chatId: string;
  contentType: 'TEXT' | 'IMAGE' | 'FILE';
  isRead: boolean;
  sender: {
    id: string;
    username: string;
    profile_photo: string | null;
  };
  createdAt: string;
  isSender: boolean;
  attachments?: FileAttachment[];
  reactions?: Record<string, string[]>;
}

export interface Chat {
  id: string;
  userId: string;
  chatId: string;
  name: string;
  avatar?: string;
  status: UserStatus;
  unread: number;
  lastMessage?: string;
  lastSeen?: Date;
}

export type UserStatus = 'online' | 'offline' | 'away';

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, { userId: string; name: string }>;
  userStatuses: Record<string, UserStatus>;
  setCurrentChat: (chatId: string | null) => void;
  addMessage: (roomId: string, message: Message) => void;
  updateMessageStatus: (
    chatId: string,
    messageId: string,
    status: Message['isRead']
  ) => void;
  markAsRead: (chatId: string) => void;
  setTyping: (chatId: string, userId: string, name: string) => void;
  clearTyping: (chatId: string, userId: string) => void;
  addReaction: (
    chatId: string,
    messageId: string,
    emoji: string,
    userId: string
  ) => void;
  removeReaction: (
    chatId: string,
    messageId: string,
    emoji: string,
    userId: string
  ) => void;
  setChats: (chats: Chat[]) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  updateUserStatus: (userId: string, status: UserStatus) => void;
  getUserStatus: (userId: string) => UserStatus;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChatId: null,
      messages: {},
      typingUsers: {},
      userStatuses: {},
      setCurrentChat: (chatId) => set({ currentChatId: chatId }),
      addMessage: (chatId, message) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: [...(state.messages[chatId] || []), message],
          },
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  lastMessage: message.content,
                  unread: message.isSender ? chat.unread : chat.unread + 1,
                }
              : chat
          ),
        })),
      updateMessageStatus: (chatId, userId, status) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: state.messages[chatId].map((msg) =>
              msg.sender.id === userId ? { ...msg, isRead: status } : msg
            ),
          },
        })),
      markAsRead: (chatId) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, unread: 0 } : chat
          ),
        })),
      setTyping: (chatId, userId, name) =>
        set((state) => ({
          typingUsers: {
            ...state.typingUsers,
            [chatId]: { userId, name },
          },
        })),
      clearTyping: (chatId) =>
        set((state) => {
          const { [chatId]: _, ...rest } = state.typingUsers;
          return { typingUsers: rest };
        }),
      addReaction: (chatId, messageId, emoji, userId) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: state.messages[chatId].map((msg) =>
              msg.id === messageId
                ? {
                    ...msg,
                    reactions: {
                      ...(msg.reactions || {}),
                      [emoji]: [...(msg.reactions?.[emoji] ?? []), userId],
                    },
                  }
                : msg
            ),
          },
        })),
      removeReaction: (chatId, messageId, emoji, userId) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: state.messages[chatId].map((msg) =>
              msg.id === messageId
                ? {
                    ...msg,
                    reactions: {
                      ...(msg.reactions || {}),
                      [emoji]:
                        msg.reactions?.[emoji]?.filter((id) => id !== userId) ??
                        [],
                    },
                  }
                : msg
            ),
          },
        })),
      setChats: (chats) => set({ chats }),
      setMessages: (chatId, messages) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: messages,
          },
        })),
      updateUserStatus: (userId, status) =>
        set((state) => ({
          userStatuses: {
            ...state.userStatuses,
            [userId]: status,
          },
          chats: state.chats.map((chat) =>
            chat.userId === userId ? { ...chat, status } : chat
          ),
        })),
      getUserStatus: (userId) => {
        const state = get();
        return state.userStatuses[userId] || 'offline';
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        chats: state.chats,
        messages: state.messages,
        currentChatId: state.currentChatId,
        userStatuses: state.userStatuses,
      }),
    }
  )
);
