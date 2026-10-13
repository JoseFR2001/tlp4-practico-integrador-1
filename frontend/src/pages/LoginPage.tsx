import React, { useState } from 'react';
import { authApi } from '../api/auth.api';
import { useAuth } from '../context/useAuth';

interface LoginPageProps {
  onSuccess: () => void;
  onGoToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onGoToRegister }) => {
  const { login } = useAuth();
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
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '2rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Iniciar Sesión</h2>
      {error && <div style={{ color: '#e53e3e', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fff5f5', borderRadius: '4px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#3182ce',
            color: 'white',
            padding: '0.75rem',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Ingresando...' : 'Entrar'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #edf2f7', fontSize: '0.85rem' }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Accesos rápidos de prueba (pass: 123456):</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => handleQuickLogin('admin@tp.com')} style={{ padding: '2px 8px', fontSize: '0.8rem', cursor: 'pointer' }}>Admin</button>
          <button type="button" onClick={() => handleQuickLogin('operador@tp.com')} style={{ padding: '2px 8px', fontSize: '0.8rem', cursor: 'pointer' }}>Operador</button>
          <button type="button" onClick={() => handleQuickLogin('usuario@tp.com')} style={{ padding: '2px 8px', fontSize: '0.8rem', cursor: 'pointer' }}>Usuario</button>
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
        ¿No tienes cuenta?{' '}
        <span onClick={onGoToRegister} style={{ color: '#3182ce', cursor: 'pointer', textDecoration: 'underline' }}>
          Regístrate aquí
        </span>
      </p>
    </div>
  );
};
