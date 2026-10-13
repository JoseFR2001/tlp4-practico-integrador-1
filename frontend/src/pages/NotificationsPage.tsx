import React, { useEffect, useState } from 'react';
import { notificationsApi } from '../api/notifications.api';
import type { Notification } from '../types';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const reloadNotifications = async () => {
    try {
      const data = await notificationsApi.getMyNotifications();
      setNotifications(data);
    } catch (err: unknown) {
      alert(`Error al cargar notificaciones: ${err instanceof Error ? err.message : 'Error desconocido'}`);
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
          alert(`Error al cargar notificaciones: ${err instanceof Error ? err.message : 'Error desconocido'}`);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
    } catch (err: unknown) {
      alert(`Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Bandeja de Notificaciones</h2>
        <button
          onClick={() => void reloadNotifications()}
          style={{
            backgroundColor: '#edf2f7',
            border: '1px solid #cbd5e0',
            padding: '0.3rem 0.6rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          🔄 Actualizar
        </button>
      </div>

      <p style={{ color: '#718096' }}>
        Aquí verás las notificaciones de los libros a los que estás suscrito cuando cambian de estado.
      </p>

      {loading && <p>Cargando notificaciones...</p>}
      {!loading && notifications.length === 0 && (
        <p>No tienes ninguna notificación por el momento.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              padding: '1rem',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              backgroundColor: n.leida ? '#fff' : '#ebf8ff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                {n.libroTitulo} ({n.estadoAnterior} → {n.estadoNuevo})
              </div>
              <div style={{ fontSize: '0.85rem', color: '#4a5568', marginTop: '0.25rem' }}>
                {n.mensaje}
              </div>
            </div>

            {!n.leida && (
              <button
                onClick={() => void handleMarkAsRead(n.id)}
                style={{
                  backgroundColor: '#3182ce',
                  color: 'white',
                  border: 'none',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Marcar leída
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
