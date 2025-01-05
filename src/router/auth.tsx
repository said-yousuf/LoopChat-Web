import { LoginPage } from '@/pages/(auth)/login';
import { RouteObject } from 'react-router-dom';
import { LoginPasswordPage } from '@/pages/(auth)/login-password';
import { SignUpPage } from '@/pages/(auth)/signup';
import { VerifyOTPPage } from '@/pages/(auth)/verify-otp';
import { CompleteProfilePage } from '@/pages/(auth)/complete-profile';

export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/login/password',
    element: <LoginPasswordPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },

  {
    path: '/verify-otp',
    element: <VerifyOTPPage />,
  },
  {
    path: '/complete-profile',
    element: <CompleteProfilePage />,
  }
];
