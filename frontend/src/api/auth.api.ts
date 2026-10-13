import { apiClient } from './client';
import type { AuthResponse } from '../types';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email: string, password: string, nombre: string): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, nombre }),
    });
  },
};
