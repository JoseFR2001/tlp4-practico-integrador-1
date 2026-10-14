import React, { useEffect, useState, useMemo } from 'react';
import { booksApi } from '../api/books.api';
import type { Libro, EstadoLibro } from '../types';
import { Can } from '../components/Can';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';
import {
  BookIcon,
  BookOpenIcon,
  PlusIcon,
  SearchIcon,
  RefreshCwIcon,
  SparklesIcon,
  ClockIcon,
} from '../components/Icons';

interface BookListPageProps {
  onSelectBook: (id: string) => void;
  onCreateBook: () => void;
}

export const BookListPage: React.FC<BookListPageProps> = ({ onSelectBook, onCreateBook }) => {
  const { hasPermission } = useAuth();
  const toast = useToast();
  const [books, setBooks] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('TODOS');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'recent'>('recent');

  const reloadBooks = async (showToast = false) => {
    try {
      setRefreshing(true);
      const data = await booksApi.getAll();
      setBooks(data);
      if (showToast) toast.success('Catálogo actualizado');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al cargar libros');
    } finally {
      setRefreshing(false);
      setLoading(false);
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
          toast.error(err instanceof Error ? err.message : 'Error al cargar libros');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [toast]);

  const handleChangeStatus = async (e: React.MouseEvent, id: string, nuevoEstado: EstadoLibro) => {
    e.stopPropagation();
    try {
      await booksApi.changeStatus(id, nuevoEstado);
      toast.success(`Estado actualizado a ${nuevoEstado}. Se notificó a los observadores.`);
      await reloadBooks();
    } catch (err: unknown) {
      toast.error(`Error al cambiar estado: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = books.length;
    const disponibles = books.filter((b) => b.estado === 'DISPONIBLE').length;
    const prestados = books.filter((b) => b.estado === 'PRESTADO').length;
    const enReparacion = books.filter((b) => b.estado === 'EN_REPARACION').length;
    return { total, disponibles, prestados, enReparacion };
  }, [books]);

  // Filtering and sorting
  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.titulo.toLowerCase().includes(q) ||
          b.autor.toLowerCase().includes(q) ||
          b.descripcion.toLowerCase().includes(q)
      );
    }

    if (selectedFilter !== 'TODOS') {
      result = result.filter((b) => b.estado === selectedFilter);
    }

    if (sortBy === 'title') {
      result.sort((a, b) => a.titulo.localeCompare(b.titulo));
    } else if (sortBy === 'author') {
      result.sort((a, b) => a.autor.localeCompare(b.autor));
    } else if (sortBy === 'recent') {
      result.sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      });
    }

    return result;
  }, [books, searchQuery, selectedFilter, sortBy]);

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title heading-serif">Catálogo de Libros</h1>
          <p className="page-description">
            Explora las obras de la colección, gestiona préstamos y suscríbete a notificaciones automáticas mediante el patrón Observer.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => void reloadBooks(true)}
            disabled={refreshing}
            title="Refrescar catálogo"
          >
            <RefreshCwIcon size={16} className={refreshing ? 'spinning' : ''} />
            <span>Actualizar</span>
          </button>

          <Can permission="libro:create">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onCreateBook}
            >
              <PlusIcon size={18} />
              <span>Nuevo Libro</span>
            </button>
          </Can>
        </div>
      </div>

      {/* Stats Counter Overview */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-info">
            <span className="stat-label">Total en Colección</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-icon-wrapper">
            <BookIcon size={24} />
          </div>
        </div>

        <div className="stat-card disponible">
          <div className="stat-info">
            <span className="stat-label">Disponibles</span>
            <span className="stat-value">{stats.disponibles}</span>
          </div>
          <div className="stat-icon-wrapper">
            <SparklesIcon size={24} />
          </div>
        </div>

        <div className="stat-card prestado">
          <div className="stat-info">
            <span className="stat-label">En Préstamo</span>
            <span className="stat-value">{stats.prestados}</span>
          </div>
          <div className="stat-icon-wrapper">
            <ClockIcon size={24} />
          </div>
        </div>

        <div className="stat-card reparacion">
          <div className="stat-info">
            <span className="stat-label">En Reparación</span>
            <span className="stat-value">{stats.enReparacion}</span>
          </div>
          <div className="stat-icon-wrapper">
            <BookOpenIcon size={24} />
          </div>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="catalog-toolbar">
        <div className="search-box">
          <SearchIcon size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por título, autor o contenido..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          {(['TODOS', 'DISPONIBLE', 'PRESTADO', 'EN_REPARACION'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              className={`filter-pill ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter === 'TODOS'
                ? `Todos (${books.length})`
                : filter === 'DISPONIBLE'
                ? `Disponibles (${stats.disponibles})`
                : filter === 'PRESTADO'
                ? `Prestados (${stats.prestados})`
                : `En Reparación (${stats.enReparacion})`}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Ordenar:
          </span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'title' | 'author' | 'recent')}
          >
            <option value="recent">Más recientes</option>
            <option value="title">Título (A-Z)</option>
            <option value="author">Autor (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <RefreshCwIcon size={32} className="spinning" style={{ margin: '0 auto 1rem' }} />
          <p>Consultando catálogo bibliotecario...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredBooks.length === 0 && (
        <div
          style={{
            background: '#fff',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-strong)',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <BookOpenIcon size={32} />
          </div>
          <h3 className="heading-serif" style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
            No se encontraron libros
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            {searchQuery || selectedFilter !== 'TODOS'
              ? 'No hay ejemplares que coincidan con los criterios de búsqueda o filtros seleccionados.'
              : 'Aún no se han incorporado títulos a la colección.'}
          </p>
          {(searchQuery || selectedFilter !== 'TODOS') && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('TODOS');
              }}
            >
              Restablecer Filtros
            </button>
          )}
        </div>
      )}

      {/* Books Grid */}
      {!loading && filteredBooks.length > 0 && (
        <div className="books-grid">
          {filteredBooks.map((libro) => (
            <div
              key={libro.id}
              className="book-card"
              onClick={() => onSelectBook(libro.id)}
            >
              {/* Color Spine Accent */}
              <div className={`book-spine-accent ${libro.estado}`} />

              <div className="book-card-body">
                <div className="book-header">
                  <h3 className="book-title">{libro.titulo}</h3>
                  <span className={`badge badge-${libro.estado}`}>
                    <span className="badge-dot" />
                    {libro.estado}
                  </span>
                </div>

                <div className="book-author">
                  <BookOpenIcon size={15} />
                  <span>{libro.autor}</span>
                </div>

                <p className="book-description">{libro.descripcion}</p>

                <div className="book-footer">
                  {/* Operator quick-status change station */}
                  {hasPermission('libro:change-status') && (
                    <div
                      className="book-operator-controls"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="book-operator-label">Modificar Estado:</span>
                      <select
                        className="quick-status-select"
                        value={libro.estado}
                        onChange={(e) =>
                          void handleChangeStatus(e as unknown as React.MouseEvent, libro.id, e.target.value as EstadoLibro)
                        }
                      >
                        <option value="DISPONIBLE">DISPONIBLE</option>
                        <option value="PRESTADO">PRESTADO</option>
                        <option value="EN_REPARACION">EN_REPARACION</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%' }}
                    onClick={() => onSelectBook(libro.id)}
                  >
                    <span>Ver Ficha & Suscribirse</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
