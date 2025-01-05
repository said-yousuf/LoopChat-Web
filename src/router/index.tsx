import { MainLayout } from '@/components/layout/main';
import { createBrowserRouter } from 'react-router-dom';
import { mainRoutes } from './main';
import { authRoutes } from './auth';
import { AuthLayout } from '@/components/layout/auth';


export const router = createBrowserRouter([
  {
    path: '/',
    children: mainRoutes,
    element: <MainLayout />,
  },

  {
    children: authRoutes,
    element: <AuthLayout />,
  },
]);
