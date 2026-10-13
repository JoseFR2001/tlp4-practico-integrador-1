import React from 'react';
import { useAuth } from '../context/useAuth';
import { NotificationBell } from './NotificationBell';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#1a202c',
        color: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <h2
          style={{ margin: 0, cursor: 'pointer', fontSize: '1.25rem' }}
          onClick={() => onNavigate('books')}
        >
          📚 BookQuery
        </h2>
        {user && (
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => onNavigate('books')}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === 'books' ? '#63b3ed' : '#e2e8f0',
                cursor: 'pointer',
                fontWeight: currentPage === 'books' ? 'bold' : 'normal',
              }}
            >
              Catálogo de Libros
            </button>
            {user.rol === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: currentPage === 'admin' ? '#63b3ed' : '#e2e8f0',
                  cursor: 'pointer',
                  fontWeight: currentPage === 'admin' ? 'bold' : 'normal',
                }}
              >
                Panel Usuarios
              </button>
            )}
          </nav>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <NotificationBell onNavigate={() => onNavigate('notifications')} />
            <span style={{ fontSize: '0.9rem', color: '#cbd5e0' }}>
              Hola, <strong>{user.nombre}</strong> ({user.rol})
            </span>
            <button
              onClick={logout}
              style={{
                backgroundColor: '#e53e3e',
                color: 'white',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onNavigate('login')}
              style={{
                backgroundColor: '#3182ce',
                color: 'white',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => onNavigate('register')}
              style={{
                backgroundColor: '#4a5568',
                color: 'white',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Registrarse
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
