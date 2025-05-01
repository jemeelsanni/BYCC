import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const location = useLocation();
    const { isAuthenticated, isAdmin, loading } = useAuth();

    console.log(`Route path: ${location.pathname}`);
    console.log(`[ProtectedRoute] Auth state:`, { isAuthenticated, isAdmin, loading });
    console.log(`Auth state: ${isAuthenticated ? 'Logged in' : 'Not logged in'}`);
    console.log(`Admin state: ${isAdmin ? 'Is admin' : 'Not admin'}`);
    console.log(`Requires admin: ${requireAdmin ? 'Yes' : 'No'}`);

    if (loading) {
        return <div>Checking authentication...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
        console.log("Admin access denied");
        return <Navigate to="/unauthorized" replace />;
    }
    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;