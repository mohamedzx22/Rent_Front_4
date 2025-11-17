import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useTokenRefresh = () => {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('userToken')); // ⬅️ حالة للتوكن
    const navigate = useNavigate();

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
        setLoading(true);
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5062/api/Account/refresh-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: refreshToken }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert('Failed to refresh the token, you will be redirected to the login page.❌');
                localStorage.removeItem('userToken');
                localStorage.removeItem('refreshToken');
                navigate('/login');
                return;
            }

            localStorage.setItem('userToken', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('Role', data.role);
            localStorage.setItem('UserId', data.userId);

            setToken(data.token); 
            console.log('✅ Token refreshed successfully');
            console.log('🔐 New Access Token:', data.token);
            console.log('♻️ Refresh Token:', data.refreshToken);
            

            window.dispatchEvent(new Event("storage"));
        } catch (err) {
            console.error('❌ Failed to refresh token:', err);
            alert('حدث خطأ أثناء تجديد التوكن');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) return;

        const decoded = parseJwt(token);
        if (!decoded?.exp) return;

        const expirationTime = decoded.exp * 1000;
        const now = Date.now();
        const timeUntilExpiry = expirationTime - now;

        if (timeUntilExpiry <= 0) {
            refreshAccessToken();
        } else {
            const delay = Math.max(timeUntilExpiry - 1000, 0); // تجديد قبل انتهاء التوكن بـ ثانية
            const timeoutId = setTimeout(refreshAccessToken, delay);
            return () => clearTimeout(timeoutId);
        }
    }, [token]); // ⬅️ إعادة التنفيذ عند تغير التوكن

    return { loading };
};

export default useTokenRefresh;
