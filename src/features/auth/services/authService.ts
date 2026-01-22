import { apiClient } from '@/core/api/axios';
import { AUTH_ENDPOINTS } from '@/core/api/endpoint';
import { useAuthStore } from '@/core/store';
import { LoginCredentials, SignupCredentials, AuthUser } from '../types';

interface LoginResponse {
  success: boolean;
  Message: string;
  user: AuthUser;
  Token: string;
}

interface SignupResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );

    // Store auth data in Zustand
    const { user, Token } = response.data;
    useAuthStore.getState().setAuth(user, Token);

    return response.data;
  },

  signup: async (credentials: SignupCredentials): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>(
      AUTH_ENDPOINTS.REGISTER,
      credentials
    );

    // Store auth data in Zustand
    const { user, token, refreshToken } = response.data;
    useAuthStore.getState().setAuth(user, token, refreshToken);

    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth state regardless of API call success
      useAuthStore.getState().logout();
    }
  },

  refreshToken: async (): Promise<string> => {
    const refreshToken = useAuthStore.getState().refreshToken;

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ token: string }>(
      AUTH_ENDPOINTS.REFRESH_TOKEN,
      { refreshToken }
    );

    const newToken = response.data.token;
    useAuthStore.getState().setToken(newToken);

    return newToken;
  },

  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await apiClient.get<AuthUser>(AUTH_ENDPOINTS.ME);
    useAuthStore.getState().setUser(response.data);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
      token,
      newPassword,
    });
  },
};
