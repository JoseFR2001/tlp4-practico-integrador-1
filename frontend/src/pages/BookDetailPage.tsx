import React, { useEffect, useState } from 'react';
import { booksApi } from '../api/books.api';
import type { Libro, EstadoLibro } from '../types';
import { Can } from '../components/Can';
import { useAuth } from '../context/useAuth';

interface BookDetailPageProps {
  bookId: string;
  onBack: () => void;
  onDeleted: () => void;
}

export const BookDetailPage: React.FC<BookDetailPageProps> = ({ bookId, onBack, onDeleted }) => {
  const { hasPermission } = useAuth();
  const [book, setBook] = useState<Libro | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      booksApi.getById(bookId),
      booksApi.checkSubscription(bookId),
    ])
      .then(([b, sub]) => {
        if (isMounted) {
          setBook(b);
          setIsSubscribed(sub.isSubscribed);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          alert(`Error al cargar libro: ${err instanceof Error ? err.message : 'Error desconocido'}`);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [bookId]);

  const handleToggleSubscription = async () => {
    if (!book) return;
    try {
      setActionLoading(true);
      if (isSubscribed) {
        await booksApi.unsubscribe(book.id);
        setIsSubscribed(false);
      } else {
        await booksApi.subscribe(book.id);
        setIsSubscribed(true);
      }
    } catch (err: unknown) {
      alert(`Error con suscripción: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeStatus = async (nuevoEstado: EstadoLibro) => {
    if (!book) return;
    try {
      setActionLoading(true);
      const updated = await booksApi.changeStatus(book.id, nuevoEstado);
      setBook(updated);
      alert('¡Estado actualizado! Se notificó a todos los observadores registrados.');
    } catch (err: unknown) {
      alert(`Error al actualizar estado: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!book || !confirm('¿Estás seguro de eliminar este libro?')) return;
    try {
      setActionLoading(true);
      await booksApi.delete(book.id);
      onDeleted();
    } catch (err: unknown) {
      alert(`Error al eliminar: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      setActionLoading(false);
    }
  };

  if (loading) return <div style={{ maxWidth: '600px', margin: '2rem auto' }}>Cargando detalle del libro...</div>;
  if (!book) return <div style={{ maxWidth: '600px', margin: '2rem auto' }}>Libro no encontrado.</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff' }}>
      <button onClick={onBack} style={{ marginBottom: '1rem', cursor: 'pointer', background: 'none', border: 'none', color: '#3182ce' }}>
        ← Volver al catálogo
      </button>

      <h2>{book.titulo}</h2>
      <p style={{ color: '#718096' }}><strong>Autor:</strong> {book.autor}</p>
      <p><strong>Descripción:</strong> {book.descripcion}</p>
      <p><strong>Estado Actual:</strong> <span style={{ fontWeight: 'bold', color: '#2b6cb0' }}>{book.estado}</span></p>

      <hr style={{ margin: '1.5rem 0', borderColor: '#edf2f7' }} />

      {/* Sección Suscripciones */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4>Suscripción a notificaciones</h4>
        <p style={{ fontSize: '0.9rem', color: '#718096' }}>
          {isSubscribed
            ? 'Estás suscrito a este libro. Recibirás una notificación cuando cambie su estado.'
            : 'No estás suscrito a este libro. Puedes suscribirte para recibir alertas de cambios de estado.'}
        </p>
        <button
          onClick={handleToggleSubscription}
          disabled={actionLoading}
          style={{
            backgroundColor: isSubscribed ? '#e53e3e' : '#3182ce',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: actionLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {isSubscribed ? 'Desuscribirme de este libro' : 'Suscribirme a este libro'}
        </button>
      </div>

      {/* Sección Cambiar Estado (operador / admin) */}
      {hasPermission('libro:change-status') && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>Cambiar Estado (Operador / Admin)</h4>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['DISPONIBLE', 'PRESTADO', 'EN_REPARACION'] as EstadoLibro[]).map((st) => (
              <button
                key={st}
                onClick={() => void handleChangeStatus(st)}
                disabled={actionLoading || book.estado === st}
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.85rem',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e0',
                  backgroundColor: book.estado === st ? '#cbd5e0' : '#fff',
                  cursor: book.estado === st ? 'default' : 'pointer',
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Eliminar (solo admin) */}
      <Can permission="libro:delete">
        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button
            onClick={handleDelete}
            disabled={actionLoading}
            style={{
              backgroundColor: '#fff',
              color: '#e53e3e',
              border: '1px solid #e53e3e',
              padding: '0.4rem 0.8rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Eliminar Libro
          </button>
        </div>
      </Can>
    </div>
  );
};
