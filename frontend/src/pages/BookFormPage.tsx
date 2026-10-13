import React, { useState } from 'react';
import { booksApi } from '../api/books.api';
import type { EstadoLibro } from '../types';

interface BookFormPageProps {
  onBack: () => void;
  onCreated: () => void;
}

export const BookFormPage: React.FC<BookFormPageProps> = ({ onBack, onCreated }) => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState<EstadoLibro>('DISPONIBLE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await booksApi.create({ titulo, autor, descripcion, estado });
      onCreated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear libro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff' }}>
      <button onClick={onBack} style={{ marginBottom: '1rem', cursor: 'pointer', background: 'none', border: 'none', color: '#3182ce' }}>
        ← Volver
      </button>

      <h2>Registrar Nuevo Libro</h2>
      {error && <div style={{ color: '#e53e3e', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fff5f5' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Autor</label>
          <input
            type="text"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={3}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Estado Inicial</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value as EstadoLibro)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
          >
            <option value="DISPONIBLE">DISPONIBLE</option>
            <option value="PRESTADO">PRESTADO</option>
            <option value="EN_REPARACION">EN_REPARACION</option>
          </select>
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
          {loading ? 'Guardando...' : 'Crear Libro'}
        </button>
      </form>
    </div>
  );
};
