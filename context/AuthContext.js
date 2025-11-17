// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Initialize user state from localStorage
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('role');

        if (token && refreshToken && userId && role) {
            setUser({
                token,
                refreshToken,
                userId,
                role
            });
        }
        setLoading(false);
    }, []);

    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(base64));
        } catch (e) {
            return null;
        }
    };

    const refreshAccessToken = async () => {
        const refreshToken = user?.refreshToken || localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
            logout();
            return null;
        }

        try {
            const response = await fetch('http://localhost:5062/api/Account/refresh-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: refreshToken }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            const newUser = {
                token: data.token,
                refreshToken: data.refreshToken,
                userId: data.userId,
                role: data.role
            };

            localStorage.setItem('userToken', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('role', data.role);

            setUser(newUser);
            return data.token;
        } catch (err) {
            console.error('Failed to refresh token:', err);
            logout();
            return null;
        }
    };

    const login = (token, refreshToken, userId, role) => {
        const userData = { token, refreshToken, userId, role };
        localStorage.setItem('userToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('role', role);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        setUser(null);
        navigate('/login');
    };

    const getAccessToken = async () => {
        if (!user?.token) return null;

        const decoded = parseJwt(user.token);
        if (!decoded?.exp) return user.token;

        const expirationTime = decoded.exp * 1000;
        const now = Date.now();
        const buffer = 60 * 1000; // 1 minute buffer

        if (expirationTime - now <= buffer) {
            return await refreshAccessToken();
        }

        return user.token;
    };

    // Auto-refresh token logic
    useEffect(() => {
        if (!user?.token) return;

        const decoded = parseJwt(user.token);
        if (!decoded?.exp) return;

        const expirationTime = decoded.exp * 1000;
        const now = Date.now();
        const timeUntilExpiry = expirationTime - now;
        const buffer = 60 * 1000; // 1 minute buffer

        if (timeUntilExpiry <= buffer) {
            refreshAccessToken();
        } else {
            const timeoutId = setTimeout(refreshAccessToken, timeUntilExpiry - buffer);
            return () => clearTimeout(timeoutId);
        }
    }, [user?.token]);

    const value = {
        user,
        loading,
        login,
        logout,
        getAccessToken,
        refreshAccessToken
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};