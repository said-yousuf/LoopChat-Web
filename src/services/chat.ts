import { getRequest } from '@/lib/http';

/*
/ ----------------------------------
/ Get Profile
/ ----------------------------------
*/

interface UserProfile {
  id: string;
  username: string;
  email: string;
  profile_photo: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export function getProfile() {
  return getRequest<UserProfile>('/chat/profile');
}

/*
/ ----------------------------------
/ Chat
/ ----------------------------------
*/

interface UserResponse {
  id: string;
  username: string;
  email: string;
  profile_photo: string | null;
  lastMessage?: {
    content: string;
    createdAt: string;
    isRead: boolean;
    isSender: boolean;
  };
  roomId: string;
}

export function getUsers() {
  return getRequest<UserResponse[]>('/chat/users');
}

/*
/ ----------------------------------
/ Messages
/ ----------------------------------
*/

export function getMessages(roomId: string) {
  return getRequest<any[]>(`/chat/rooms/${roomId}/messages`).then((messages) =>
    messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      chatId: roomId,
      contentType: msg.contentType,
      isRead: msg.isRead,
      sender: msg.sender,
      createdAt: msg.createdAt,
      isSender: msg.isSender,
    }))
  );
}
