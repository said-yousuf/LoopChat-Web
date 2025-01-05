import { ChatPage } from '@/pages/chat';
import { RouteObject } from 'react-router-dom';

export const mainRoutes: RouteObject[] = [
  {
    path: '/main',
    element: <ChatPage />,
  },
  {
    path: '/chat/:userId',
    element: <ChatPage />,
  },
];
