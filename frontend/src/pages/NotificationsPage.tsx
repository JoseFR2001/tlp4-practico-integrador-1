import React, { useEffect, useState, useMemo } from 'react';
import { notificationsApi } from '../api/notifications.api';
import type { Notification } from '../types';
import { useToast } from '../context/useToast';
import {
  BellIcon,
  CheckIcon,
  RefreshCwIcon,
  ClockIcon,
} from '../components/Icons';

export const NotificationsPage: React.FC = () => {
  const toast = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const reloadNotifications = async (showToast = false) => {
    try {
      setRefreshing(true);
      const data = await notificationsApi.getMyNotifications();
      setNotifications(data);
      if (showToast) toast.success('Bandeja de notificaciones actualizada');
    } catch (err: unknown) {
      toast.error(`Error al cargar notificaciones: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    notificationsApi
      .getMyNotifications()
      .then((data) => {
        if (isMounted) {
          setNotifications(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          toast.error(`Error al cargar notificaciones: ${err instanceof Error ? err.message : 'Error desconocido'}`);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [toast]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
      toast.success('Notificación marcada como leída');
    } catch (err: unknown) {
      toast.error(`Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.leida);
    if (unread.length === 0) return;

    try {
      for (const n of unread) {
        await notificationsApi.markAsRead(n.id);
      }
      setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
      toast.success('Todas las notificaciones fueron marcadas como leídas');
    } catch (err: unknown) {
      toast.error(`Error al marcar todas: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.leida).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter((n) => !n.leida);
    }
    return notifications;
  }, [notifications, activeTab]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Reciente';
    try {
      const d = new Date(dateString);
      return d.toLocaleString('es-AR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="page-wrapper notifications-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <h1 className="page-title heading-serif" style={{ margin: 0 }}>
              Bandeja de Notificaciones
            </h1>
            <div className="polling-indicator">
              <span className="polling-dot" />
              <span>Observer en Vivo (5s)</span>
            </div>
          </div>
          <p className="page-description">
            Registro en tiempo real emitido por el <code>EventPublisher</code> cada vez que un libro al que estás suscrito cambia de estado de disponibilidad.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {unreadCount > 0 && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => void handleMarkAllAsRead()}
            >
              <CheckIcon size={16} />
              <span>Marcar todas leídas</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => void reloadNotifications(true)}
            disabled={refreshing}
          >
            <RefreshCwIcon size={16} className={refreshing ? 'spinning' : ''} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <button
          type="button"
          className={`filter-pill ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Todas ({notifications.length})
        </button>
        <button
          type="button"
          className={`filter-pill ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveTab('unread')}
        >
          No leídas ({unreadCount})
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <RefreshCwIcon size={32} className="spinning" style={{ margin: '0 auto 1rem' }} />
          <p>Consultando notificaciones en la base de datos...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredNotifications.length === 0 && (
        <div
          style={{
            background: '#fff',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-strong)',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <BellIcon size={32} />
          </div>
          <h3 className="heading-serif" style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
            {activeTab === 'unread' ? 'No tienes notificaciones pendientes' : 'Bandeja de notificaciones vacía'}
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 1.5rem', fontSize: '0.92rem' }}>
            Para recibir avisos, ingresa a cualquier libro del catálogo y presiona <strong>"Suscribirme a Alertas"</strong>. Cuando un operador actualice su disponibilidad, serás notificado al instante.
          </p>
        </div>
      )}

      {/* Notifications list */}
      {!loading && filteredNotifications.length > 0 && (
        <div>
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${!n.leida ? 'unread' : ''}`}
            >
              <div style={{ flex: 1 }}>
                <div className="notif-header">
                  <span className="notif-book-title">{n.libroTitulo}</span>
                  <span className="notif-transition-tag">
                    {n.estadoAnterior} ➔ {n.estadoNuevo}
                  </span>
                  {!n.leida && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: 'var(--primary-600)',
                        background: 'var(--primary-100)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-full)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Nueva
                    </span>
                  )}
                </div>

                <p className="notif-message">{n.mensaje}</p>

                <div className="notif-date">
                  <ClockIcon size={14} />
                  <span>{formatDate(n.fecha)}</span>
                </div>
              </div>

              {!n.leida && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => void handleMarkAsRead(n.id)}
                  title="Marcar como leída"
                >
                  <CheckIcon size={15} />
                  <span>Leída</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
