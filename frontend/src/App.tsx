import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { useAuth } from './context/useAuth';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { BookListPage } from './pages/BookListPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { BookFormPage } from './pages/BookFormPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { PatternsModal } from './components/ui/PatternsModal';

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('books');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [isPatternsModalOpen, setIsPatternsModalOpen] = useState(false);

  const renderPage = () => {
    // Si no está autenticado y no está en register, mostrar login
    if (!user) {
      if (currentPage === 'register') {
        return (
          <RegisterPage
            onSuccess={() => setCurrentPage('books')}
            onGoToLogin={() => setCurrentPage('login')}
          />
        );
      }
      return (
        <LoginPage
          onSuccess={() => setCurrentPage('books')}
          onGoToRegister={() => setCurrentPage('register')}
        />
      );
    }

    // Usuario autenticado
    switch (currentPage) {
      case 'book-detail':
        return selectedBookId ? (
          <BookDetailPage
            bookId={selectedBookId}
            onBack={() => setCurrentPage('books')}
            onDeleted={() => {
              setSelectedBookId(null);
              setCurrentPage('books');
            }}
          />
        ) : (
          <BookListPage
            onSelectBook={(id) => {
              setSelectedBookId(id);
              setCurrentPage('book-detail');
            }}
            onCreateBook={() => setCurrentPage('book-form')}
          />
        );

      case 'book-form':
        return (
          <BookFormPage
            onBack={() => setCurrentPage('books')}
            onCreated={() => setCurrentPage('books')}
          />
        );

      case 'notifications':
        return <NotificationsPage />;

      case 'admin':
        return user.rol === 'admin' ? (
          <AdminUsersPage />
        ) : (
          <BookListPage
            onSelectBook={(id) => {
              setSelectedBookId(id);
              setCurrentPage('book-detail');
            }}
            onCreateBook={() => setCurrentPage('book-form')}
          />
        );

      case 'books':
      default:
        return (
          <BookListPage
            onSelectBook={(id) => {
              setSelectedBookId(id);
              setCurrentPage('book-detail');
            }}
            onCreateBook={() => setCurrentPage('book-form')}
          />
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentPage={currentPage}
        onNavigate={(p) => setCurrentPage(p)}
        onOpenPatterns={() => setIsPatternsModalOpen(true)}
      />

      <main style={{ flex: 1 }}>{renderPage()}</main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          background: '#fff',
          padding: '1.75rem 1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.82rem',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-serif)' }}>BookQuery</strong> — Sistema de Biblioteca con Patrón Observer
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span>Arquitectura SOLID:</span>
            <code style={{ fontSize: '0.78rem', background: 'var(--bg-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
              Singleton · Observer · Factory · Adapter
            </code>
          </div>
        </div>
      </footer>

      {/* Patterns Academic Modal */}
      <PatternsModal
        isOpen={isPatternsModalOpen}
        onClose={() => setIsPatternsModalOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
