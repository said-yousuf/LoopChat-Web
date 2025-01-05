import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  currentUser: {
    id: string;
    username: string;
    profile_photo: string | null;
  } | null;
  setToken: (token: string | null) => void;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      currentUser: null,
      setCurrentUser: (user: any) => set({ currentUser: user }),
      setToken: (token: string | null) =>
        set({ token, isAuthenticated: !!token }),

      login: (token: string) => set({ token, isAuthenticated: true }),

      logout: () => set({ token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
