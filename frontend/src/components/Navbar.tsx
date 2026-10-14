import React from 'react';
import { useAuth } from '../context/useAuth';
import { NotificationBell } from './NotificationBell';
import {
  BookOpenIcon,
  ShieldIcon,
  LogOutIcon,
  LibraryIcon,
  LayersIcon,
} from './Icons';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenPatterns: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenPatterns }) => {
  const { user, logout } = useAuth();

  const getRoleLabel = (rol: string) => {
    switch (rol) {
      case 'admin':
        return { label: 'Admin', class: 'user-role-admin' };
      case 'operador':
        return { label: 'Operador', class: 'user-role-operador' };
      default:
        return { label: 'Lector', class: 'user-role-usuario' };
    }
  };

  const userInitials = user?.nombre
    ? user.nombre
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
    : 'U';

  const roleInfo = user ? getRoleLabel(user.rol) : null;

  return (
    <header className="app-navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand-wrapper" onClick={() => onNavigate('books')}>
          <div className="brand-icon-box">
            <BookOpenIcon size={24} />
          </div>
          <div className="brand-title-group">
            <span className="brand-title">BookQuery</span>
            <span className="brand-subtitle">Biblioteca Inteligente</span>
          </div>
        </div>

        {/* Center Nav Links */}
        {user && (
          <nav className="nav-links">
            <button
              type="button"
              className={`nav-btn ${currentPage === 'books' || currentPage === 'book-detail' || currentPage === 'book-form' ? 'active' : ''}`}
              onClick={() => onNavigate('books')}
            >
              <LibraryIcon size={17} />
              <span>Catálogo</span>
            </button>

            {user.rol === 'admin' && (
              <button
                type="button"
                className={`nav-btn ${currentPage === 'admin' ? 'active' : ''}`}
                onClick={() => onNavigate('admin')}
              >
                <ShieldIcon size={17} />
                <span>Usuarios & Roles</span>
              </button>
            )}
          </nav>
        )}

        {/* Actions / User controls */}
        <div className="navbar-actions">
          {/* Design patterns info trigger */}
          <button
            type="button"
            className="patterns-trigger-btn"
            onClick={onOpenPatterns}
            title="Ver los 4 Patrones de Diseño implementados en el TP"
          >
            <LayersIcon size={15} />
            <span>Patrones SOLID</span>
          </button>

          {user ? (
            <>
              <NotificationBell
                onNavigate={() => onNavigate('notifications')}
                isActive={currentPage === 'notifications'}
              />

              <div className="user-pill">
                <div className="user-avatar">{userInitials}</div>
                <div className="user-info">
                  <span className="user-name" title={user.nombre}>{user.nombre}</span>
                  {roleInfo && (
                    <span className={`user-role-tag ${roleInfo.class}`}>
                      {roleInfo.label}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={logout}
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <LogOutIcon size={18} />
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${currentPage === 'login' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => onNavigate('login')}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                className={`btn btn-sm ${currentPage === 'register' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onNavigate('register')}
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
