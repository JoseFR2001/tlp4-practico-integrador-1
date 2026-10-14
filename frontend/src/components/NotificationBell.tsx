import React, { useEffect, useState } from 'react';
import { notificationsApi } from '../api/notifications.api';
import { useAuth } from '../context/useAuth';
import { BellIcon } from './Icons';

interface NotificationBellProps {
  onNavigate: () => void;
  isActive: boolean;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onNavigate, isActive }) => {
  const { token } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    const fetchCount = async () => {
      try {
        const res = await notificationsApi.getUnreadCount();
        if (isMounted) {
          setUnreadCount(res.count);
        }
      } catch {
        // Ignorar error transitorio en polling
      }
    };

    void fetchCount();
    const interval = setInterval(() => {
      void fetchCount();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [token]);

  return (
    <button
      type="button"
      onClick={onNavigate}
      className={`bell-trigger ${isActive ? 'active' : ''}`}
      title="Bandeja de Notificaciones (Observer)"
      aria-label={`Notificaciones ${unreadCount > 0 ? `(${unreadCount} no leídas)` : ''}`}
    >
      <BellIcon size={20} />
      {unreadCount > 0 && (
        <span className="bell-badge" aria-hidden="true">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};
