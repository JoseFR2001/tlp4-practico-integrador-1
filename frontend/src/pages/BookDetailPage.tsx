import React, { useEffect, useState } from 'react';
import { booksApi } from '../api/books.api';
import type { Libro, EstadoLibro } from '../types';
import { Can } from '../components/Can';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { Modal } from '../components/ui/Modal';
import {
  ArrowLeftIcon,
  BookmarkIcon,
  BookmarkCheckIcon,
  EditIcon,
  TrashIcon,
} from '../components/Icons';

interface BookDetailPageProps {
  bookId: string;
  onBack: () => void;
  onDeleted: () => void;
}

export const BookDetailPage: React.FC<BookDetailPageProps> = ({ bookId, onBack, onDeleted }) => {
  const { hasPermission } = useAuth();
  const toast = useToast();
  const [book, setBook] = useState<Libro | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [editTitulo, setEditTitulo] = useState('');
  const [editAutor, setEditAutor] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');

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
          setEditTitulo(b.titulo);
          setEditAutor(b.autor);
          setEditDescripcion(b.descripcion);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          toast.error(`Error al cargar libro: ${err instanceof Error ? err.message : 'Error desconocido'}`);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [bookId, toast]);

  const handleToggleSubscription = async () => {
    if (!book) return;
    try {
      setActionLoading(true);
      if (isSubscribed) {
        await booksApi.unsubscribe(book.id);
        setIsSubscribed(false);
        toast.info('Te has desuscrito de este libro.');
      } else {
        await booksApi.subscribe(book.id);
        setIsSubscribed(true);
        toast.success('¡Suscripción confirmada! Te avisaremos cuando cambie su estado.');
      }
    } catch (err: unknown) {
      toast.error(`Error con suscripción: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeStatus = async (nuevoEstado: EstadoLibro) => {
    if (!book || book.estado === nuevoEstado) return;
    try {
      setActionLoading(true);
      const updated = await booksApi.changeStatus(book.id, nuevoEstado);
      setBook(updated);
      toast.success(
        `Estado actualizado a ${nuevoEstado}. El EventPublisher notificó a todos los suscriptores.`
      );
    } catch (err: unknown) {
      toast.error(`Error al actualizar estado: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;
    try {
      setActionLoading(true);
      const updated = await booksApi.update(book.id, {
        titulo: editTitulo,
        autor: editAutor,
        descripcion: editDescripcion,
      });
      setBook(updated);
      setIsEditModalOpen(false);
      toast.success('Información del libro actualizada correctamente.');
    } catch (err: unknown) {
      toast.error(`Error al editar libro: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!book) return;
    try {
      setActionLoading(true);
      await booksApi.delete(book.id);
      toast.success('Libro eliminado de la colección.');
      setIsDeleteModalOpen(false);
      onDeleted();
    } catch (err: unknown) {
      toast.error(`Error al eliminar: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <p>Cargando ficha bibliográfica...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="page-wrapper">
        <button type="button" onClick={onBack} className="back-link">
          <ArrowLeftIcon size={16} />
          <span>Volver al catálogo</span>
        </button>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <h3>No se pudo encontrar el ejemplar solicitado.</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper detail-container">
      {/* Navigation Breadcrumb */}
      <button type="button" onClick={onBack} className="back-link">
        <ArrowLeftIcon size={16} />
        <span>Volver al Catálogo</span>
      </button>

      <div className="detail-card">
        {/* Hero Section */}
        <div className="detail-hero-banner">
          <div className="detail-book-mockup">
            <span className="mockup-title">{book.titulo}</span>
            <span className="mockup-author">{book.autor}</span>
          </div>

          <div className="detail-header-text">
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span className={`badge badge-${book.estado}`}>
                <span className="badge-dot" />
                {book.estado}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                ID: {book.id.substring(book.id.length - 8)}
              </span>
            </div>

            <h1 className="detail-main-title">{book.titulo}</h1>
            <p className="detail-meta-author">Por {book.autor}</p>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Can permission="libro:update">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsEditModalOpen(true)}
                  disabled={actionLoading}
                >
                  <EditIcon size={15} />
                  <span>Editar Datos</span>
                </button>
              </Can>

              <Can permission="libro:delete">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={actionLoading}
                >
                  <TrashIcon size={15} />
                  <span>Eliminar Ejemplar</span>
                </button>
              </Can>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="detail-content-section">
          <div className="detail-section-title">Sinopsis / Descripción</div>
          <p className="detail-description-text">{book.descripcion}</p>

          {/* Observer Pattern Subscription Hub */}
          <div className="subscription-panel">
            <div className="subscription-info-group">
              <div className={`subscription-icon-box ${isSubscribed ? 'subscribed' : ''}`}>
                {isSubscribed ? <BookmarkCheckIcon size={24} /> : <BookmarkIcon size={24} />}
              </div>
              <div>
                <h4 className="subscription-title">
                  {isSubscribed ? 'Suscripción Activa (Observador)' : 'Suscripción a Cambios de Estado'}
                </h4>
                <p className="subscription-desc">
                  {isSubscribed
                    ? 'Estás registrado en el EventPublisher. Recibirás alertas instantáneas cuando este libro cambie de estado.'
                    : 'Suscríbete como Observador para recibir notificaciones automáticas In-App y en consola.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              className={`btn ${isSubscribed ? 'btn-outline-danger' : 'btn-primary'}`}
              onClick={handleToggleSubscription}
              disabled={actionLoading}
            >
              {isSubscribed ? (
                <>
                  <TrashIcon size={16} />
                  <span>Cancelar Suscripción</span>
                </>
              ) : (
                <>
                  <BookmarkIcon size={16} />
                  <span>Suscribirme a Alertas</span>
                </>
              )}
            </button>
          </div>

          {/* Operator / Admin Status Management Station */}
          {hasPermission('libro:change-status') && (
            <div className="status-station">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    Estación de Control de Estado (Operador / Admin)
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Al cambiar el estado se dispara el patrón <strong>Observer</strong>, notificando a todos los observadores registrados.
                  </p>
                </div>
                <span className="role-badge operador">Acción Operativa</span>
              </div>

              <div className="status-buttons-row">
                <button
                  type="button"
                  className={`status-choice-btn ${book.estado === 'DISPONIBLE' ? 'active' : ''}`}
                  onClick={() => void handleChangeStatus('DISPONIBLE')}
                  disabled={actionLoading || book.estado === 'DISPONIBLE'}
                >
                  <span style={{ color: 'var(--state-disponible)' }}>● DISPONIBLE</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                    En sala / Listo para préstamo
                  </span>
                </button>

                <button
                  type="button"
                  className={`status-choice-btn ${book.estado === 'PRESTADO' ? 'active' : ''}`}
                  onClick={() => void handleChangeStatus('PRESTADO')}
                  disabled={actionLoading || book.estado === 'PRESTADO'}
                >
                  <span style={{ color: 'var(--state-prestado)' }}>● PRESTADO</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                    Entregado a un lector
                  </span>
                </button>

                <button
                  type="button"
                  className={`status-choice-btn ${book.estado === 'EN_REPARACION' ? 'active' : ''}`}
                  onClick={() => void handleChangeStatus('EN_REPARACION')}
                  disabled={actionLoading || book.estado === 'EN_REPARACION'}
                >
                  <span style={{ color: 'var(--state-reparacion)' }}>● EN REPARACIÓN</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                    Mantenimiento o taller
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Book Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Datos del Libro"
        subtitle="Actualiza la información en la base de datos"
      >
        <form onSubmit={handleUpdateBook}>
          <div className="form-group">
            <label className="form-label">Título</label>
            <input
              type="text"
              className="form-input"
              value={editTitulo}
              onChange={(e) => setEditTitulo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Autor</label>
            <input
              type="text"
              className="form-input"
              value={editAutor}
              onChange={(e) => setEditAutor(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={editDescripcion}
              onChange={(e) => setEditDescripcion(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={actionLoading}
            >
              {actionLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="¿Eliminar este ejemplar?"
        description={`Esta acción eliminará "${book.titulo}" de forma irreversible de la base de datos MongoDB.`}
        confirmLabel="Eliminar definitivamente"
        cancelLabel="Conservar libro"
        isDestructive={true}
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
