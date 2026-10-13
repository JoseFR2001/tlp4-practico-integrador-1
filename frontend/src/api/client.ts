const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Error HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) errorMessage = errorData.message;
    } catch {
      // Ignorar error de parsing si no es JSON
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

