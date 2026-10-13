import { apiClient } from './client';
import type { Notification } from '../types';

export const notificationsApi = {
  getMyNotifications: async (): Promise<Notification[]> => {
    return apiClient<Notification[]>('/notifications');
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    return apiClient<{ count: number }>('/notifications/unread-count');
  },

  markAsRead: async (id: string): Promise<{ message: string }> => {
    return apiClient<{ message: string }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },
};
