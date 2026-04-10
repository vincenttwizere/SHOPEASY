import { Navigate, useLocation } from 'react-router-dom';

const parseJwt = (token) => {
    if (!token) return null;
    try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(payload);
    } catch {
        return null;
    }
};

export function RequireAuth({ children }) {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const user = parseJwt(token);

    if (!user) {
        // save the location user was trying to access so we can redirect after login
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return children;
}

export function RequireAdmin({ children }) {
    const token = localStorage.getItem('token');
    const user = parseJwt(token);

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
}
