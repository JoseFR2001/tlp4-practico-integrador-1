import { apiClient } from './client';
import type { Libro, EstadoLibro } from '../types';

export const booksApi = {
  getAll: async (): Promise<Libro[]> => {
    return apiClient<Libro[]>('/libros');
  },

  getById: async (id: string): Promise<Libro> => {
    return apiClient<Libro>(`/libros/${id}`);
  },

  create: async (data: { titulo: string; autor: string; descripcion: string; estado?: EstadoLibro }): Promise<Libro> => {
    return apiClient<Libro>('/libros', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Libro>): Promise<Libro> => {
    return apiClient<Libro>(`/libros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  changeStatus: async (id: string, estado: EstadoLibro): Promise<Libro> => {
    return apiClient<Libro>(`/libros/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    });
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiClient<{ message: string }>(`/libros/${id}`, {
      method: 'DELETE',
    });
  },

  subscribe: async (id: string): Promise<unknown> => {
    return apiClient(`/subscriptions/${id}/subscribe`, {
      method: 'POST',
    });
  },

  unsubscribe: async (id: string): Promise<{ message: string }> => {
    return apiClient<{ message: string }>(`/subscriptions/${id}/subscribe`, {
      method: 'DELETE',
    });
  },

  checkSubscription: async (id: string): Promise<{ isSubscribed: boolean }> => {
    return apiClient<{ isSubscribed: boolean }>(`/subscriptions/${id}/is-subscribed`);
  },
};
