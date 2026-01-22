import { apiClient } from '@/core/api/axios/client';
import { USER_ENDPOINTS } from '@/core/api/endpoint/endpoints';
import { User, UserFormData } from '../types';

export interface UserResponse {
  success: boolean;
  message: string;
  users: User[];
}

export interface SingleUserResponse {
  success: boolean;
  message: string;
  user: User;
}

export const userService = {
  getUsers: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>(USER_ENDPOINTS.LIST);
    return response.data;
  },

  createUser: async (data: UserFormData): Promise<SingleUserResponse> => {
    const response = await apiClient.post<SingleUserResponse>(
      USER_ENDPOINTS.CREATE,
      data
    );
    return response.data;
  },

  updateUser: async (userId: string, data: UserFormData): Promise<SingleUserResponse> => {
    const response = await apiClient.put<SingleUserResponse>(
      `${USER_ENDPOINTS.UPDATE}?user_id=${userId}`,
      data
    );
    return response.data;
  },

  deleteUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `${USER_ENDPOINTS.DELETE}/${userId}`
    );
    return response.data;
  },
};
