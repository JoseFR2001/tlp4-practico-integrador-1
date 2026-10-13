import React, { useEffect, useState } from 'react';
import { notificationsApi } from '../api/notifications.api';
import { useAuth } from '../context/useAuth';

interface NotificationBellProps {
  onNavigate: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onNavigate }) => {
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
      onClick={onNavigate}
      style={{
        position: 'relative',
        background: 'none',
        border: 'none',
        fontSize: '1.25rem',
        cursor: 'pointer',
        padding: '0.25rem 0.5rem',
      }}
      title="Bandeja de Notificaciones"
    >
      🔔
      {unreadCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-4px',
            backgroundColor: '#e53e3e',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          {unreadCount}
        </span>
      )}
    </button>
  );
};
