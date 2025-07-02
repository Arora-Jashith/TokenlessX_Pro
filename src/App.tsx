import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Page imports
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import TrustNetworkPage from './pages/TrustNetworkPage';
import AdminPage from './pages/AdminPage';

// Create a client
const queryClient = new QueryClient();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state for smoother transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Workaround to remove Spline badge/watermark
    const interval = setInterval(() => {
      // Remove from main DOM
      document.querySelectorAll('[data-testid="spline-watermark"]').forEach(el => el.remove());
      // Remove from shadow roots (if possible)
      document.querySelectorAll('iframe').forEach(iframe => {
        try {
          const badge = iframe.contentDocument?.querySelector('[data-testid="spline-watermark"]');
          if (badge) badge.remove();
        } catch (e) {}
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-3xl font-bold text-gradient">TokenlessX</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary>
          <Toaster position="top-right" richColors />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transaction-history" element={<TransactionHistoryPage />} />
            <Route path="/trust-network" element={<TrustNetworkPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Router>
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
