import React, { useState } from 'react';
import { authApi } from '../api/auth.api';
import { useAuth } from '../context/useAuth';

interface RegisterPageProps {
  onSuccess: () => void;
  onGoToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onGoToLogin }) => {
  const { login } = useAuth();
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
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '2rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Registro de Usuario</h2>
      {error && <div style={{ color: '#e53e3e', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fff5f5', borderRadius: '4px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Nombre completo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
          />
        </div>

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
            backgroundColor: '#38a169',
            color: 'white',
            padding: '0.75rem',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
        ¿Ya tienes cuenta?{' '}
        <span onClick={onGoToLogin} style={{ color: '#3182ce', cursor: 'pointer', textDecoration: 'underline' }}>
          Inicia sesión aquí
        </span>
      </p>
    </div>
  );
};
