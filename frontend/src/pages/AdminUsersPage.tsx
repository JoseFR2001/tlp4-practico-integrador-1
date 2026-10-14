import React, { useEffect, useState, useMemo } from 'react';
import { usersApi } from '../api/users.api';
import type { User, Role } from '../types';
import { useToast } from '../context/useToast';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import {
  UsersIcon,
  ShieldIcon,
  SearchIcon,
  RefreshCwIcon,
} from '../components/Icons';

export const AdminUsersPage: React.FC = () => {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Role confirmation modal
  const [pendingChange, setPendingChange] = useState<{
    user: User;
    newRole: Role;
  } | null>(null);
  const [updating, setUpdating] = useState(false);

  const reloadUsers = async (showToast = false) => {
    try {
      setRefreshing(true);
      const data = await usersApi.getAll();
      setUsers(data);
      if (showToast) toast.success('Lista de usuarios actualizada');
    } catch (err: unknown) {
      toast.error(`Error al cargar usuarios: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    usersApi
      .getAll()
      .then((data) => {
        if (isMounted) {
          setUsers(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          toast.error(`Error al cargar usuarios: ${err instanceof Error ? err.message : 'Error desconocido'}`);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [toast]);

  const handleSelectRole = (user: User, newRole: Role) => {
    if (user.rol === newRole) return;
    setPendingChange({ user, newRole });
  };

  const handleConfirmRoleChange = async () => {
    if (!pendingChange) return;
    const { user, newRole } = pendingChange;

    try {
      setUpdating(true);
      await usersApi.assignRole(user.id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, rol: newRole } : u))
      );
      toast.success(`Rol de "${user.nombre}" actualizado a "${newRole}" correctamente.`);
      setPendingChange(null);
    } catch (err: unknown) {
      toast.error(`Error al actualizar rol: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setUpdating(false);
    }
  };

  // Metrics
  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.rol === 'admin').length;
    const operadores = users.filter((u) => u.rol === 'operador').length;
    const lectores = users.filter((u) => u.rol === 'usuario').length;
    return { total, admins, operadores, lectores };
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span className="role-badge admin">Panel de Control</span>
          </div>
          <h1 className="page-title heading-serif">Administración de Usuarios</h1>
          <p className="page-description">
            Gestiona los miembros registrados en el sistema y asigna privilegios operacionales según los requerimientos de seguridad RBAC (RF6).
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => void reloadUsers(true)}
          disabled={refreshing}
        >
          <RefreshCwIcon size={16} className={refreshing ? 'spinning' : ''} />
          <span>Actualizar Lista</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-info">
            <span className="stat-label">Total Usuarios</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-icon-wrapper">
            <UsersIcon size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #7e22ce' }}>
          <div className="stat-info">
            <span className="stat-label">Administradores</span>
            <span className="stat-value">{stats.admins}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#f3e8ff', color: '#7e22ce' }}>
            <ShieldIcon size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div className="stat-info">
            <span className="stat-label">Operadores</span>
            <span className="stat-value">{stats.operadores}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <UsersIcon size={24} />
          </div>
        </div>

        <div className="stat-card disponible">
          <div className="stat-info">
            <span className="stat-label">Lectores (Usuarios)</span>
            <span className="stat-value">{stats.lectores}</span>
          </div>
          <div className="stat-icon-wrapper">
            <UsersIcon size={24} />
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="catalog-toolbar">
        <div className="search-box">
          <SearchIcon size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre o correo electrónico..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="admin-table-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <RefreshCwIcon size={32} className="spinning" style={{ margin: '0 auto 1rem' }} />
            <p>Cargando lista de usuarios...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <p>No se encontraron usuarios coincidentes con la búsqueda.</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo Electrónico</th>
                <th>Rol Actual</th>
                <th style={{ textAlign: 'right' }}>Asignar Nuevo Rol</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const initials = u.nombre
                  ? u.nombre
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                  : 'U';

                return (
                  <tr key={u.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-small">{initials}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                            {u.nombre}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                            ID: {u.id.substring(u.id.length - 8)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>

                    <td>
                      <span className={`role-badge ${u.rol}`}>
                        {u.rol === 'admin' ? '👑 Admin' : u.rol === 'operador' ? '⚡ Operador' : '📖 Lector'}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <select
                        className="form-select"
                        style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem', display: 'inline-block' }}
                        value={u.rol}
                        onChange={(e) => handleSelectRole(u, e.target.value as Role)}
                      >
                        <option value="usuario">Lector (usuario)</option>
                        <option value="operador">Operador de Biblioteca</option>
                        <option value="admin">Administrador General</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Role Change Confirmation Modal */}
      {pendingChange && (
        <ConfirmModal
          isOpen={Boolean(pendingChange)}
          title="Confirmar Cambio de Rol"
          description={`¿Estás seguro de modificar el rol de "${pendingChange.user.nombre}" de "${pendingChange.user.rol}" a "${pendingChange.newRole}"?`}
          confirmLabel="Modificar Rol"
          cancelLabel="Cancelar"
          isDestructive={pendingChange.newRole === 'usuario' && pendingChange.user.rol === 'admin'}
          loading={updating}
          onConfirm={handleConfirmRoleChange}
          onCancel={() => setPendingChange(null)}
        />
      )}
    </div>
  );
};
