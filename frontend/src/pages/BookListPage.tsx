import React, { useEffect, useState } from 'react';
import { booksApi } from '../api/books.api';
import type { Libro, EstadoLibro } from '../types';
import { Can } from '../components/Can';
import { useAuth } from '../context/useAuth';

interface BookListPageProps {
  onSelectBook: (id: string) => void;
  onCreateBook: () => void;
}

export const BookListPage: React.FC<BookListPageProps> = ({ onSelectBook, onCreateBook }) => {
  const { hasPermission } = useAuth();
  const [books, setBooks] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reloadBooks = async () => {
    try {
      const data = await booksApi.getAll();
      setBooks(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar libros');
    }
  };

  useEffect(() => {
    let isMounted = true;

    booksApi
      .getAll()
      .then((data) => {
        if (isMounted) {
          setBooks(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar libros');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChangeStatus = async (id: string, nuevoEstado: EstadoLibro) => {
    try {
      await booksApi.changeStatus(id, nuevoEstado);
      await reloadBooks();
    } catch (err: unknown) {
      alert(`Error al cambiar estado: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  const getStatusBadge = (estado: EstadoLibro) => {
    const colors: Record<EstadoLibro, string> = {
      DISPONIBLE: '#38a169',
      PRESTADO: '#dd6b20',
      EN_REPARACION: '#e53e3e',
    };
    return (
      <span
        style={{
          backgroundColor: colors[estado] || '#718096',
          color: 'white',
          padding: '0.2rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: 600,
        }}
      >
        {estado}
      </span>
    );
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Catálogo de Libros</h2>
        <Can permission="libro:create">
          <button
            onClick={onCreateBook}
            style={{
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            + Nuevo Libro
          </button>
        </Can>
      </div>

      {loading && <p>Cargando libros...</p>}
      {error && <div style={{ color: '#e53e3e', padding: '1rem', backgroundColor: '#fff5f5' }}>{error}</div>}

      {!loading && books.length === 0 && (
        <p>No hay libros registrados aún en la biblioteca.</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {books.map((libro) => (
          <div
            key={libro.id}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1.25rem',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{libro.titulo}</h3>
                {getStatusBadge(libro.estado)}
              </div>
              <p style={{ margin: '0 0 0.5rem 0', color: '#718096', fontSize: '0.9rem' }}>Autor: {libro.autor}</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#4a5568' }}>{libro.descripcion}</p>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #edf2f7', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => onSelectBook(libro.id)}
                style={{
                  backgroundColor: '#edf2f7',
                  border: '1px solid #cbd5e0',
                  padding: '0.4rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Ver Detalle / Suscribirse
              </button>

              {hasPermission('libro:change-status') && (
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#718096' }}>Estado:</span>
                  <select
                    value={libro.estado}
                    onChange={(e) => void handleChangeStatus(libro.id, e.target.value as EstadoLibro)}
                    style={{ fontSize: '0.8rem', padding: '0.2rem', flex: 1 }}
                  >
                    <option value="DISPONIBLE">DISPONIBLE</option>
                    <option value="PRESTADO">PRESTADO</option>
                    <option value="EN_REPARACION">EN_REPARACION</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
