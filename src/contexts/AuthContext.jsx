/**
 * Authentication Context
 * 
 * Provides authentication state and functions throughout the app.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount
    useEffect(() => {
        const token = auth.getToken();
        const userData = auth.getUser();

        if (token && userData) {
            setUser(userData);
            setIsAuthenticated(true);
        }

        setIsLoading(false);
    }, []);

    const handleLogin = (token, userData) => {
        auth.saveToken(token, userData);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        auth.clearAuth();
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
export function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Save the current location to redirect back after login
            navigate('/login', { state: { from: location.pathname } });
        }
    }, [isAuthenticated, isLoading, navigate, location]);

    // Show loading state
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'var(--color-bg-primary)'
            }}>
                <div style={{ color: 'var(--color-text-primary)' }}>Loading...</div>
            </div>
        );
    }

    // Render children if authenticated
    return isAuthenticated ? children : null;
}

export default AuthContext;
