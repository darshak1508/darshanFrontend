/**
 * UserProfile Component
 * 
 * Professional user profile display in sidebar footer.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall, auth } from '../../../utils/auth';
import { useAuth } from '../../../contexts/AuthContext';
import './UserProfile.css';

// Icons
const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const LogoutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const UserProfile = () => {
    const navigate = useNavigate();
    const { user: contextUser, logout: contextLogout } = useAuth();
    const [user, setUser] = useState(contextUser);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch user details from /api/auth/me
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!user || !user.username) {
                setIsLoading(true);
                try {
                    const response = await apiCall('/auth/me');
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchUserDetails();
    }, [user]);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            contextLogout();
            auth.clearAuth();
            navigate('/login');
        }
    };

    if (isLoading) {
        return (
            <div className="user-profile user-profile--loading">
                <div className="user-profile__skeleton"></div>
            </div>
        );
    }

    return (
        <div className="user-profile">
            <div className="user-profile__card">
                <div className="user-profile__avatar">
                    <UserIcon />
                </div>
                <div className="user-profile__info">
                    <span className="user-profile__name">
                        {user?.username || user?.name || 'User'}
                    </span>
                    <span className="user-profile__email">
                        {user?.email || 'user@example.com'}
                    </span>
                </div>
            </div>

            <button
                className="user-profile__logout"
                onClick={handleLogout}
                title="Logout"
            >
                <LogoutIcon />
                <span>Logout</span>
            </button>
        </div>
    );
};

export default UserProfile;
