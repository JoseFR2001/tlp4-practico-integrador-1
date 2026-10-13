import React from 'react';
import { useAuth } from '../context/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback || <div>Debes iniciar sesión para ver esta sección.</div>}</>;
  }

  return <>{children}</>;
};
