import React from 'react';
import { router } from '@inertiajs/react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingStates';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    router.visit('/login');
    return null;
  }

  if (requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.every((p) => user?.permissions?.includes(p));
    if (!hasPermission) {
      router.visit('/unauthorized');
      return null;
    }
  }

  return children;
};

export default ProtectedRoute;
