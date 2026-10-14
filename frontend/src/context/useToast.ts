import { useContext } from 'react';
import { ToastContext } from './toast-context';
import type { ToastContextValue } from './toast-context';

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser utilizado dentro de un ToastProvider');
  }
  return context;
};
