import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { BookListPage } from './pages/BookListPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { BookFormPage } from './pages/BookFormPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('books');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

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
            onDeleted={() => setCurrentPage('books')}
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
        return <AdminUsersPage />;

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
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar currentPage={currentPage} onNavigate={(p) => setCurrentPage(p)} />
      <main style={{ paddingBottom: '3rem' }}>{renderPage()}</main>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
