// =========================================
// PRODUCTS ACTIONS - AÇÕES EM LOTE
// =========================================
// Componente de ações em lote do módulo Products
// Máximo: 150 linhas

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Trash2,
  Check,
  X,
  Download,
  Tag,
  Settings
} from 'lucide-react';

interface ProductsActionsProps {
  selectedCount: number;
  onBulkAction: (action: string) => void;
  loading?: boolean;
  className?: string;
}

export const ProductsActions: React.FC<ProductsActionsProps> = ({
  selectedCount,
  onBulkAction,
  loading = false,
  className = ''
}) => {
  const [showActions, setShowActions] = useState(false);

  // =========================================
  // AÇÕES DISPONÍVEIS
  // =========================================

  const actions = [
    {
      id: 'activate',
      label: 'Ativar',
      icon: <Check className="w-4 h-4" />,
      variant: 'secondary' as const,
      description: 'Ativar produtos selecionados'
    },
    {
      id: 'deactivate',
      label: 'Desativar',
      icon: <X className="w-4 h-4" />,
      variant: 'secondary' as const,
      description: 'Desativar produtos selecionados'
    },
    {
      id: 'export',
      label: 'Exportar',
      icon: <Download className="w-4 h-4" />,
      variant: 'secondary' as const,
      description: 'Exportar dados dos produtos'
    },
    {
      id: 'tag',
      label: 'Adicionar Tag',
      icon: <Tag className="w-4 h-4" />,
      variant: 'secondary' as const,
      description: 'Adicionar tag aos produtos'
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: <Settings className="w-4 h-4" />,
      variant: 'secondary' as const,
      description: 'Configurações em lote'
    },
    {
      id: 'delete',
      label: 'Excluir',
      icon: <Trash2 className="w-4 h-4" />,
      variant: 'danger' as const,
      description: 'Excluir produtos permanentemente'
    }
  ];

  // =========================================
  // HANDLERS
  // =========================================

  const handleAction = (actionId: string) => {
    onBulkAction(actionId);
    setShowActions(false);
  };

  const handleToggleActions = () => {
    setShowActions(!showActions);
  };

  // =========================================
  // RENDERIZAÇÃO
  // =========================================

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className={`products-actions ${className}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          {/* Informações de seleção */}
          <div className="flex items-center space-x-3">
            <Badge variant="primary" className="text-sm">
              {selectedCount} selecionado{selectedCount !== 1 ? 's' : ''}
            </Badge>
            <span className="text-sm text-gray-600">
              Ações em lote disponíveis
            </span>
          </div>

          {/* Botões de ação */}
          <div className="flex items-center space-x-2">
            {/* Ações rápidas */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleAction('activate')}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Ativar</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleAction('deactivate')}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Desativar</span>
            </Button>

            {/* Menu de ações */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleActions}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Mais ações</span>
              </Button>

              {/* Dropdown de ações */}
              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    {actions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleAction(action.id)}
                        disabled={loading}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                          action.variant === 'danger' 
                            ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                            : 'text-gray-700'
                        }`}
                      >
                        {action.icon}
                        <div>
                          <div className="font-medium">{action.label}</div>
                          <div className="text-xs text-gray-500">
                            {action.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Aviso para ações destrutivas */}
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0">
              <svg className="h-4 w-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-yellow-700">
              <p className="font-medium">Atenção:</p>
              <p>As ações em lote serão aplicadas a todos os produtos selecionados. Certifique-se de que deseja continuar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsActions;
