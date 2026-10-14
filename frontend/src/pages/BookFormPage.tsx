import React, { useState } from 'react';
import { booksApi } from '../api/books.api';
import type { EstadoLibro } from '../types';
import { useToast } from '../context/useToast';
import { ArrowLeftIcon, BookOpenIcon, SparklesIcon } from '../components/Icons';

interface BookFormPageProps {
  onBack: () => void;
  onCreated: () => void;
}

export const BookFormPage: React.FC<BookFormPageProps> = ({ onBack, onCreated }) => {
  const toast = useToast();
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
      toast.success(`¡El libro "${titulo}" fue incorporado al catálogo exitosamente!`);
      onCreated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al crear libro';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '640px' }}>
      <button type="button" onClick={onBack} className="back-link">
        <ArrowLeftIcon size={16} />
        <span>Volver al Catálogo</span>
      </button>

      <div
        style={{
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '1.75rem 2rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'linear-gradient(135deg, var(--bg-deep) 0%, #1e1b4b 100%)',
            color: '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(217, 119, 6, 0.25)',
                border: '1px solid rgba(217, 119, 6, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-300)',
              }}
            >
              <BookOpenIcon size={22} />
            </div>
            <div>
              <h2 className="heading-serif" style={{ color: '#fff', fontSize: '1.4rem' }}>
                Registrar Nuevo Ejemplar
              </h2>
              <p style={{ color: 'var(--primary-100)', fontSize: '0.82rem', marginTop: '0.15rem' }}>
                Completa los datos del libro para incorporarlo al catálogo
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          {error && (
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#fff1f2',
                color: '#e11d48',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                marginBottom: '1.5rem',
                border: '1px solid #fecdd3',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="book-title">
                Título de la Obra *
              </label>
              <input
                id="book-title"
                type="text"
                className="form-input"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. El Aleph"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="book-author">
                Autor / Escritor *
              </label>
              <input
                id="book-author"
                type="text"
                className="form-input"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                placeholder="Ej. Jorge Luis Borges"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="book-description">
                Sinopsis / Descripción *
              </label>
              <textarea
                id="book-description"
                className="form-textarea"
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Breve reseña sobre la trama, temática y contenido del libro..."
                required
              />
              <span className="form-hint">
                Los lectores podrán leer este resumen para decidir si solicitar un préstamo o suscribirse a alertas.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="book-status">
                Estado Inicial de Disponibilidad
              </label>
              <select
                id="book-status"
                className="form-select"
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoLibro)}
              >
                <option value="DISPONIBLE">DISPONIBLE — Disponible para consulta y préstamo</option>
                <option value="PRESTADO">PRESTADO — En poder de un usuario</option>
                <option value="EN_REPARACION">EN_REPARACION — En encuadernación o conservación</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onBack}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                <SparklesIcon size={16} />
                <span>{loading ? 'Incorporando al catálogo...' : 'Crear y Publicar Libro'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
