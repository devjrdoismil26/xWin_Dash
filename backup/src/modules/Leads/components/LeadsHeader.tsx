// ========================================
// LEADS HEADER COMPONENT
// ========================================
// Componente de cabeçalho para páginas do módulo Leads
// Máximo: 150 linhas

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/layouts/Breadcrumbs';

// ========================================
// INTERFACES
// ========================================

interface Action {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
}

interface Breadcrumb {
  name: string;
  href: string;
  current?: boolean;
}

interface LeadsHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: Action[];
  className?: string;
}

// ========================================
// COMPONENTE
// ========================================

export const LeadsHeader: React.FC<LeadsHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions = [],
  className = ''
}) => {
  return (
    <div className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 ${className}`}>
      <div className="container mx-auto px-4 py-6">
        
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        {/* Header Content */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Title Section */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>

          {/* Actions Section */}
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    onClick={action.onClick}
                    variant={action.variant || 'secondary'}
                    size="sm"
                    loading={action.loading}
                    disabled={action.disabled}
                  >
                    {Icon && <Icon className="w-4 h-4 mr-2" />}
                    {action.label}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadsHeader;
