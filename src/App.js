/**
 * Jay GuruDev Dashboard
 * Modern enterprise application with JWT authentication
 */

import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// Routes
import routes from './routes-new';

// Authentication
import { AuthProvider, ProtectedRoute, useAuth } from './contexts/AuthContext';

// Global styles
import './design-system/styles/globals.css';

function AppRoutes() {
  const { pathname } = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Scroll to top when changing route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Redirect logic for authenticated users on auth pages
  useEffect(() => {
    if (!isLoading && isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, pathname, navigate]);

  // Generate routes from config
  const getRoutes = (allRoutes) =>
    allRoutes
      .map((route) => {
        if (route.route) {
          // Public routes (login, register)
          if (route.public) {
            return <Route exact path={route.route} element={route.component} key={route.key} />;
          }

          // Protected routes (everything else)
          return (
            <Route
              exact
              path={route.route}
              element={<ProtectedRoute>{route.component}</ProtectedRoute>}
              key={route.key}
            />
          );
        }
        return null;
      })
      .filter(Boolean);

  return (
    <Routes>
      {getRoutes(routes)}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
