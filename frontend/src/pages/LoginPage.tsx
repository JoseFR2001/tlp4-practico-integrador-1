import React, { useState } from 'react';
import { authApi } from '../api/auth.api';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';
import { BookOpenIcon, SparklesIcon } from '../components/Icons';

interface LoginPageProps {
  onSuccess: () => void;
  onGoToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onGoToRegister }) => {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authApi.login(email, password);
      login(res.token, res.user);
      toast.success(`¡Bienvenido de nuevo, ${res.user.nombre}!`);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
    setError(null);
    toast.info(`Credenciales completadas para ${demoEmail}`);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand-icon">
            <BookOpenIcon size={28} />
          </div>
          <h2 className="auth-title heading-serif">Acceso a BookQuery</h2>
          <p className="auth-subtitle">
            Gestión bibliotecaria con notificaciones reactivas (Patrón Observer)
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
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Correo Electrónico
            </label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@tp.com"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Ingresando al sistema...' : 'Ingresar a la Biblioteca'}
          </button>
        </form>

        {/* Demo Roles Bar */}
        <div className="demo-credentials-box">
          <div className="demo-title">
            <span>Accesos rápidos de evaluación (pass: 123456)</span>
            <SparklesIcon size={14} />
          </div>
          <div className="demo-chips">
            <button
              type="button"
              className="demo-chip"
              onClick={() => handleQuickLogin('admin@tp.com')}
              title="Rol: admin (Permisos totales + Panel de usuarios)"
            >
              👑 Admin
            </button>
            <button
              type="button"
              className="demo-chip"
              onClick={() => handleQuickLogin('operador@tp.com')}
              title="Rol: operador (Cambio de estados y disparador del Observer)"
            >
              ⚡ Operador
            </button>
            <button
              type="button"
              className="demo-chip"
              onClick={() => handleQuickLogin('usuario@tp.com')}
              title="Rol: usuario (Suscripción y recepción de notificaciones)"
            >
              📖 Lector
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          ¿Aún no tienes cuenta?{' '}
          <button
            type="button"
            onClick={onGoToRegister}
            style={{
              color: 'var(--primary-600)',
              fontWeight: 700,
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Crear cuenta nueva
          </button>
        </p>
      </div>
    </div>
  );
};
