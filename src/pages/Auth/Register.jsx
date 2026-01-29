/**
 * Registration Page
 * 
 * User registration with modern design.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../utils/auth';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

// Icons
const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const MailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const LockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

function Register() {
    const navigate = useNavigate();
    const { login: authLogin, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

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
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            const result = await register(formData.username, formData.email, formData.password);

            if (result.success) {
                // Update auth context
                authLogin(result.data.token, result.data.user);

                // Redirect to dashboard
                navigate('/dashboard', { replace: true });
            } else {
                setError(result.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
            console.error('Registration error:', err);
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
                            Join thousands of businesses managing their operations efficiently
                        </p>

                        <div className="auth-features">
                            <div className="auth-feature">
                                <CheckCircleIcon />
                                <span>Easy Setup</span>
                            </div>
                            <div className="auth-feature">
                                <CheckCircleIcon />
                                <span>Powerful Tools</span>
                            </div>
                            <div className="auth-feature">
                                <CheckCircleIcon />
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Registration Form */}
                <div className="auth-form-container">
                    <div className="auth-form-wrapper">
                        <div className="auth-form-header">
                            <h2 className="auth-form-title">Create Account</h2>
                            <p className="auth-form-subtitle">
                                Get started with your business management journey
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
                                        placeholder="Choose a username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            <div className="auth-input-group">
                                <label htmlFor="email" className="auth-label">
                                    Email Address
                                </label>
                                <div className="auth-input-wrapper">
                                    <MailIcon />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        className="auth-input"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        autoComplete="email"
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
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <div className="auth-input-group">
                                <label htmlFor="confirmPassword" className="auth-label">
                                    Confirm Password
                                </label>
                                <div className="auth-input-wrapper">
                                    <LockIcon />
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        name="confirmPassword"
                                        className="auth-input"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        autoComplete="new-password"
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
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p className="auth-footer-text">
                                Already have an account?{' '}
                                <Link to="/login" className="auth-link">
                                    Sign in instead
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
