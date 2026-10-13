import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { User, Role } from '../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const reloadUsers = async () => {
    try {
      const data = await apiClient<User[]>('/users');
      setUsers(data);
    } catch (err: unknown) {
      alert(`Error al cargar usuarios: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  useEffect(() => {
    let isMounted = true;

    apiClient<User[]>('/users')
      .then((data) => {
        if (isMounted) {
          setUsers(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          alert(`Error al cargar usuarios: ${err instanceof Error ? err.message : 'Error desconocido'}`);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRoleChange = async (id: string, rol: Role) => {
    try {
      await apiClient(`/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ rol }),
      });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, rol } : u)));
      alert('Rol actualizado con éxito');
    } catch (err: unknown) {
      alert(`Error al actualizar rol: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Administración de Usuarios</h2>
        <button
          onClick={() => void reloadUsers()}
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

      <p style={{ color: '#718096' }}>Permite a los administradores asignar roles a los usuarios.</p>

      {loading && <p>Cargando usuarios...</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
        <thead>
          <tr style={{ backgroundColor: '#f7fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '0.75rem' }}>Nombre</th>
            <th style={{ padding: '0.75rem' }}>Email</th>
            <th style={{ padding: '0.75rem' }}>Rol Actual</th>
            <th style={{ padding: '0.75rem' }}>Asignar Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid #edf2f7' }}>
              <td style={{ padding: '0.75rem' }}>{u.nombre}</td>
              <td style={{ padding: '0.75rem' }}>{u.email}</td>
              <td style={{ padding: '0.75rem' }}>
                <span style={{ fontWeight: 'bold' }}>{u.rol}</span>
              </td>
              <td style={{ padding: '0.75rem' }}>
                <select
                  value={u.rol}
                  onChange={(e) => void handleRoleChange(u.id, e.target.value as Role)}
                  style={{ padding: '0.3rem', borderRadius: '4px' }}
                >
                  <option value="usuario">usuario</option>
                  <option value="operador">operador</option>
                  <option value="admin">admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
