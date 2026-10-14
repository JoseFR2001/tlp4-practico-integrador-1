import { apiClient } from './client';
import type { User, Role } from '../types';

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    return apiClient<User[]>('/users');
  },

  assignRole: async (id: string, rol: Role): Promise<User> => {
    return apiClient<User>(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ rol }),
    });
  },
};

