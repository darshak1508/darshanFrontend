/**
 * Authentication Utilities
 * 
 * Centralized authentication functions and API call helper.
 * Handles JWT token storage, retrieval, and automatic injection into requests.
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Token Management
export const auth = {
    /**
     * Save authentication token and user data
     */
    saveToken: (token, user) => {
        localStorage.setItem('token', token);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    },

    /**
     * Get stored token
     */
    getToken: () => {
        return localStorage.getItem('token');
    },

    /**
     * Get stored user data
     */
    getUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    /**
     * Clear authentication data
     */
    clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    /**
     * Logout user and redirect to login
     */
    logout: () => {
        auth.clearAuth();
        window.location.href = '/login';
    },
};

/**
 * API Call Helper with Automatic Authentication
 * 
 * Replaces all direct fetch calls throughout the application.
 * Automatically injects JWT token and handles 401 responses.
 * 
 * @param {string} endpoint - API endpoint (e.g., '/firm' or '/api/firm')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<any>} - Response data
 */
export async function apiCall(endpoint, options = {}) {
    const token = auth.getToken();

    // Ensure endpoint starts with /api
    const normalizedEndpoint = endpoint.startsWith('/api')
        ? endpoint
        : `/api${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    // Build request configuration
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    // Add Authorization header if token exists
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL.replace('/api', '')}${normalizedEndpoint}`, config);

        // Handle 401 Unauthorized
        if (response.status === 401) {
            console.warn('Unauthorized access - redirecting to login');
            auth.logout();
            throw new Error('Unauthorized');
        }

        // Return the response object for manual handling
        return response;
    } catch (error) {
        // Re-throw network errors
        throw error;
    }
}

/**
 * Login API Call
 */
export async function login(username, password) {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
        auth.saveToken(data.token, data.user);
        return { success: true, data };
    } else {
        return { success: false, message: data.message || 'Login failed' };
    }
}

/**
 * Register API Call
 */
export async function register(username, email, password) {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        // Auto-login after successful registration
        auth.saveToken(data.token, data.user);
        return { success: true, data };
    } else {
        return { success: false, message: data.message || 'Registration failed' };
    }
}

export default apiCall;
