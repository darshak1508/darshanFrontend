/**
 * Login Page
 * 
 * Premium authentication page with modern design.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login, auth } from '../../utils/auth';
import { useAuth } from '../../contexts/AuthContext';
import '../../design-system/styles/globals.css';
import './Auth.css';

// Icons
const LockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);

const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login: authLogin, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validation
        if (!formData.username || !formData.password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        try {
            const result = await login(formData.username, formData.password);

            if (result.success) {
                // Update auth context
                authLogin(result.data.token, result.data.user);

                // Redirect to the page they tried to access, or dashboard
                const from = location.state?.from || '/dashboard';
                navigate(from, { replace: true });
            } else {
                setError(result.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="auth-background__gradient"></div>
                <div className="auth-background__grid"></div>
            </div>

            <div className="auth-content">
                {/* Left Side - Branding */}
                <div className="auth-branding">
                    <div className="auth-branding__content">
                        <div className="auth-branding__icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0v-4m-14 4H3m2 0v-4m0-5h14M5 7h14M5 11h14" />
                            </svg>
                        </div>
                        <h1 className="auth-branding__title">Jay GuruDev</h1>
                        <p className="auth-branding__subtitle">
                            Professional business management platform for modern enterprises
                        </p>

                        <div className="auth-features">
                            <div className="auth-feature">
                                <CheckCircleIcon />
                                <span>Comprehensive Analytics</span>
                            </div>
                            <div className="auth-feature">
                                <CheckCircleIcon />
                                <span>Real-time Tracking</span>
                            </div>
                            <div className="auth-feature">
                                <CheckCircleIcon />
                                <span>Secure & Reliable</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="auth-form-container">
                    <div className="auth-form-wrapper">
                        <div className="auth-form-header">
                            <h2 className="auth-form-title">Welcome Back</h2>
                            <p className="auth-form-subtitle">
                                Enter your credentials to access your account
                            </p>
                        </div>

                        {error && (
                            <div className="auth-alert auth-alert--error">
                                <span>⚠️</span>
                                <p>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="auth-input-group">
                                <label htmlFor="username" className="auth-label">
                                    Username
                                </label>
                                <div className="auth-input-wrapper">
                                    <UserIcon />
                                    <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        className="auth-input"
                                        placeholder="Enter your username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        autoComplete="username"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="auth-input-group">
                                <label htmlFor="password" className="auth-label">
                                    Password
                                </label>
                                <div className="auth-input-wrapper">
                                    <LockIcon />
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        className="auth-input"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="auth-spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
