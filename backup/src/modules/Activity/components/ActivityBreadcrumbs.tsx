/**
 * Componente de breadcrumbs do módulo Activity
 * Navegação hierárquica
 */

import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, Home, Activity } from 'lucide-react';

interface ActivityBreadcrumbsProps {
  className?: string;
}

export const ActivityBreadcrumbs: React.FC<ActivityBreadcrumbsProps> = ({ className }) => {
  const breadcrumbs = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home
    },
    {
      name: 'Atividades',
      href: '/activity',
      icon: Activity,
      current: true
    }
  ];

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      {breadcrumbs.map((breadcrumb, index) => {
        const Icon = breadcrumb.icon;
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <React.Fragment key={breadcrumb.name}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
            
            {isLast ? (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Icon className="h-4 w-4" />
                <span className="font-medium">{breadcrumb.name}</span>
              </div>
            ) : (
              <Link
                href={breadcrumb.href}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Icon className="h-4 w-4" />
                <span>{breadcrumb.name}</span>
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default ActivityBreadcrumbs;
