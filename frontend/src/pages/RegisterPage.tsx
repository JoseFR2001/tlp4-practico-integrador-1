import React, { useState } from 'react';
import { authApi } from '../api/auth.api';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';
import { BookOpenIcon } from '../components/Icons';

interface RegisterPageProps {
  onSuccess: () => void;
  onGoToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onGoToLogin }) => {
  const { login } = useAuth();
  const toast = useToast();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authApi.register(email, password, nombre);
      login(res.token, res.user);
      toast.success(`¡Registro exitoso! Bienvenido a BookQuery, ${res.user.nombre}`);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrarse';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand-icon">
            <BookOpenIcon size={28} />
          </div>
          <h2 className="auth-title heading-serif">Crear Nueva Cuenta</h2>
          <p className="auth-subtitle">
            Regístrate para explorar el catálogo y recibir alertas en tiempo real
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: '#fff1f2',
              color: '#e11d48',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.88rem',
              marginBottom: '1.25rem',
              border: '1px solid #fecdd3',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="register-nombre">
              Nombre y Apellido
            </label>
            <input
              id="register-nombre"
              type="text"
              className="form-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Ana García"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              Correo Electrónico
            </label>
            <input
              id="register-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ana.garcia@tp.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">
              Contraseña
            </label>
            <input
              id="register-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />
            <span className="form-hint">
              Por especificación (RF2), se te asignará el rol inicial <strong>usuario (lector)</strong>.
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Completar Registro'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          ¿Ya tienes cuenta registrada?{' '}
          <button
            type="button"
            onClick={onGoToLogin}
            style={{
              color: 'var(--primary-600)',
              fontWeight: 700,
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
};
