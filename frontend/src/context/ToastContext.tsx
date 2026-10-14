import React, { useState, useCallback, useMemo } from 'react';
import { ToastContext } from './toast-context';
import type { ToastItem, ToastType } from './toast-context';
import { CheckIcon, AlertCircleIcon, XIcon, SparklesIcon } from '../components/Icons';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4200);
  }, [removeToast]);

  const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
  const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
  const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);
  const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast]);

  const contextValue = useMemo(
    () => ({ showToast, success, error, info, warning }),
    [showToast, success, error, info, warning]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="toast-viewport" aria-live="polite">
        {toasts.map((toast) => {
          const typeIcons = {
            success: <CheckIcon size={18} className="toast-icon success" />,
            error: <AlertCircleIcon size={18} className="toast-icon error" />,
            warning: <AlertCircleIcon size={18} className="toast-icon warning" />,
            info: <SparklesIcon size={18} className="toast-icon info" />,
          };

          return (
            <div key={toast.id} className={`toast-card toast-${toast.type}`} role="status">
              <div className="toast-content">
                {typeIcons[toast.type]}
                <span className="toast-message">{toast.message}</span>
              </div>
              <button
                type="button"
                className="toast-close"
                onClick={() => removeToast(toast.id)}
                aria-label="Cerrar notificación"
              >
                <XIcon size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
