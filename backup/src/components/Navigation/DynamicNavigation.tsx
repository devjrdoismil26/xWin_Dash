import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { routesConfig } from '@/config/routes.js';
import useAuth from '@/hooks/api/useAuth.jsx';

const DynamicNavigation = () => {
  const { url } = usePage();
  const { user, isAuthenticated } = useAuth();

  const getVisibleRoutes = () => {
    return routesConfig.filter((route) => {
      if (route.requiresAuth && !isAuthenticated) return false;
      if (route.requiredPermissions && route.requiredPermissions.length > 0) {
        const userPermissions = user?.permissions || [];
        return route.requiredPermissions.every((permission) => userPermissions.includes(permission));
      }
      return true;
    });
  };

  const visibleRoutes = getVisibleRoutes();

  return (
    <nav className="space-y-1">
      {visibleRoutes.map((route) => {
        const isActive = location.pathname.startsWith(route.path);
        return (
          <Link
            key={route.path}
            to={route.path}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className={`mr-3 h-6 w-6 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>{route.icon || null}</span>
            {route.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default DynamicNavigation;
