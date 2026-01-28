// =========================================
// PRODUCTS HEADER - HEADER E NAVEGAÇÃO
// =========================================
// Header do módulo Products
// Máximo: 150 linhas

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/layouts/Breadcrumbs';
import { Tooltip } from '@/components/ui/Tooltip';
import {
  Plus, 
  LayoutGrid, 
  List,
  Settings,
  RotateCcw,
  Cog
} from 'lucide-react';

interface ProductsHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onRefresh?: () => void;
  loading?: boolean;
  className?: string;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions = [],
  viewMode = 'grid',
  onViewModeChange,
  onRefresh,
  loading = false,
  className = ''
}) => {
  // =========================================
  // AÇÕES PADRÃO
  // =========================================

  const defaultActions = [
    {
      label: 'Novo Produto',
      onClick: () => {
        // Navegar para página de criação
        window.location.href = '/products/create';
      },
      variant: 'primary' as const,
      icon: <Plus className="w-4 h-4" />
    },
    {
      label: 'Configurações',
      onClick: () => {
        // Abrir configurações
        console.log('Abrir configurações');
      },
      variant: 'secondary' as const,
      icon: <Cog className="w-4 h-4" />
    }
  ];

  const allActions = [...defaultActions, ...actions];

  // =========================================
  // HANDLERS
  // =========================================

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    onViewModeChange?.(mode);
  };

  const handleRefresh = () => {
    onRefresh?.();
  };

  // =========================================
  // RENDERIZAÇÃO
  // =========================================

  return (
    <div className={`products-header ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} className="mb-4" />
      )}

      {/* Header principal */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Ações */}
        <div className="flex items-center space-x-3">
          {/* Controles de visualização */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Tooltip content="Visualização em grade">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip content="Visualização em lista">
              <button
                onClick={() => handleViewModeChange('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>

          {/* Botão de refresh */}
          {onRefresh && (
            <Tooltip content="Atualizar">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="p-2"
              >
                <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </Tooltip>
          )}

          {/* Ações personalizadas */}
          {allActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'secondary'}
              size="sm"
              onClick={action.onClick}
              disabled={action.disabled || loading}
              className="flex items-center space-x-2"
            >
              {action.icon}
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsHeader;
