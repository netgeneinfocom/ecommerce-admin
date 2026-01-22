import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, UserRole } from '@/features/auth/types';



interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setAuth: (user: AuthUser, token: string, refreshToken?: string) => void;
  setUser: (user: AuthUser) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: (user, token, refreshToken) => {
        set({
          user,
          token,
          refreshToken,
          role: user.role,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      setUser: (user) => {
        set({
          user,
        });
      },

      setToken: (token) => {
        set({ token });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          role: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
