import React from 'react';
import { useAuth } from '../context/useAuth';

interface CanProps {
  permission: string;
  children: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ permission, children }) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return null;
  }

  return <>{children}</>;
};
