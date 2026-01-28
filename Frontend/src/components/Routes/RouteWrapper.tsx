import React, { Suspense } from 'react';
import ProtectedRoute from './ProtectedRoute.jsx';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary.jsx';
import { LoadingSpinner } from '@/components/ui/LoadingStates';

const RouteWrapper = ({ children, requiresAuth = false, requiredPermissions = [], fallback = <LoadingSpinner /> }) => {
  const wrappedChildren = (
    <ErrorBoundary>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );

  if (requiresAuth) {
    return <ProtectedRoute requiredPermissions={requiredPermissions}>{wrappedChildren}</ProtectedRoute>;
  }

  return wrappedChildren;
};

export default RouteWrapper;
