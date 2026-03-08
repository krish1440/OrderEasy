import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import { Loader } from './components/Loader';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Exports from './pages/Exports';
import Admin from './pages/Admin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// ... (previous imports)

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen message="Loading OrderEasy..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Home Page */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/orders" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />

      <Route path="/orders/:id" element={
        <ProtectedRoute>
          <OrderDetail />
        </ProtectedRoute>
      } />

      <Route path="/analytics" element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      } />

      <Route path="/exports" element={
        <ProtectedRoute>
          <Exports />
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Supabase appends #access_token=...&type=recovery to the redirect_to URL.
    // We send them to the root URL (/) so Vercel SPA routing doesn't 404.
    // We intercept that raw token string here, and pipe it firmly into the React HashRouter format.
    const hash = window.location.hash;
    if (hash.includes('access_token') && hash.includes('type=recovery')) {
      const tokenString = hash.replace('#', '?');
      window.location.href = `${window.location.origin}/#/reset-password${tokenString}`;
    }
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;