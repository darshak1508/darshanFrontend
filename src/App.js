/**
 * Business Manager Dashboard
 * Modern enterprise application
 */

import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Routes
import routes from './routes-new';

// Global styles
import './design-system/styles/globals.css';

export default function App() {
  const { pathname } = useLocation();

  // Scroll to top when changing route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Generate routes from config
  const getRoutes = (allRoutes) =>
    allRoutes
      .map((route) => {
        if (route.route) {
          return <Route exact path={route.route} element={route.component} key={route.key} />;
        }
        return null;
      })
      .filter(Boolean);

  return (
    <Routes>
      {getRoutes(routes)}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
