import React, { useState } from 'react';
import type { User } from '../types';
import { AuthContext } from './auth-context';

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'libro:read',
    'libro:create',
    'libro:update',
    'libro:change-status',
    'libro:delete',
    'subscription:create',
    'subscription:delete',
    'notification:read',
    'user:read',
    'user:assign-role',
  ],
  operador: [
    'libro:read',
    'libro:create',
    'libro:update',
    'libro:change-status',
    'subscription:create',
    'subscription:delete',
    'notification:read',
  ],
  usuario: [
    'libro:read',
    'subscription:create',
    'subscription:delete',
    'notification:read',
  ],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const hasPermission = (action: string): boolean => {
    if (!user || !user.rol) return false;
    const permissions = ROLE_PERMISSIONS[user.rol] || [];
    return permissions.includes(action);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
