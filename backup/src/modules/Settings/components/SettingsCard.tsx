import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import { Animated } from '@/components/ui/AdvancedAnimations';
import { 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertTriangle,
  Info,
  Settings as Settings
} from 'lucide-react';

// =========================================
// INTERFACES
// =========================================

export interface SettingItem {
  id: string;
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  category: string;
  description?: string;
  isRequired: boolean;
  isPublic: boolean;
  isSensitive: boolean;
  validationRules?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SettingsCardProps {
  setting: SettingItem;
  onEdit?: (setting: SettingItem) => void;
  onDelete?: (setting: SettingItem) => void;
  onDuplicate?: (setting: SettingItem) => void;
  onToggleVisibility?: (setting: SettingItem) => void;
  onView?: (setting: SettingItem) => void;
  className?: string;
  showActions?: boolean;
  compact?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (setting: SettingItem, selected: boolean) => void;
}

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

export const SettingsCard: React.FC<SettingsCardProps> = ({
  setting,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onView,
  className = '',
  showActions = true,
  compact = false,
  selectable = false,
  selected = false,
  onSelect
}) => {
  // ===== ESTADO LOCAL =====
  const [showValue, setShowValue] = useState<boolean>(!setting.isSensitive);

  // ===== HANDLERS =====

  /**
   * Editar configuração
   */
  const handleEdit = useCallback(() => {
    onEdit?.(setting);
  }, [setting, onEdit]);

  /**
   * Deletar configuração
   */
  const handleDelete = useCallback(() => {
    onDelete?.(setting);
  }, [setting, onDelete]);

  /**
   * Duplicar configuração
   */
  const handleDuplicate = useCallback(() => {
    onDuplicate?.(setting);
  }, [setting, onDuplicate]);

  /**
   * Toggle visibilidade
   */
  const handleToggleVisibility = useCallback(() => {
    setShowValue(!showValue);
    onToggleVisibility?.(setting);
  }, [showValue, setting, onToggleVisibility]);

  /**
   * Visualizar configuração
   */
  const handleView = useCallback(() => {
    onView?.(setting);
  }, [setting, onView]);

  /**
   * Selecionar configuração
   */
  const handleSelect = useCallback(() => {
    onSelect?.(setting, !selected);
  }, [setting, selected, onSelect]);

  // ===== UTILITÁRIOS =====

  /**
   * Formatar valor para exibição
   */
  const formatValue = useCallback((value: any, type: string): string => {
    if (value === null || value === undefined) {
      return 'Não definido';
    }

    switch (type) {
      case 'boolean':
        return value ? 'Sim' : 'Não';
      case 'number':
        return new Intl.NumberFormat('pt-BR').format(value);
      case 'json':
        return JSON.stringify(value, null, 2);
      case 'array':
        return Array.isArray(value) ? value.join(', ') : String(value);
      default:
        return String(value);
    }
  }, []);

  /**
   * Obter cor do tipo
   */
  const getTypeColor = useCallback((type: string): string => {
    const colors = {
      string: 'blue',
      number: 'green',
      boolean: 'purple',
      json: 'orange',
      array: 'pink'
    };
    return colors[type as keyof typeof colors] || 'gray';
  }, []);

  /**
   * Obter cor da categoria
   */
  const getCategoryColor = useCallback((category: string): string => {
    const colors = {
      general: 'blue',
      auth: 'red',
      users: 'green',
      database: 'purple',
      email: 'orange',
      integrations: 'yellow',
      ai: 'indigo',
      api: 'gray'
    };
    return colors[category as keyof typeof colors] || 'gray';
  }, []);

  /**
   * Verificar se valor é válido
   */
  const isValidValue = useCallback((value: any, type: string): boolean => {
    if (value === null || value === undefined) {
      return false;
    }

    switch (type) {
      case 'string':
        return typeof value === 'string' && value.length > 0;
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'json':
        try {
          JSON.parse(typeof value === 'string' ? value : JSON.stringify(value));
          return true;
        } catch {
          return false;
        }
      case 'array':
        return Array.isArray(value);
      default:
        return true;
    }
  }, []);

  // ===== RENDERIZAÇÃO =====

  const isValid = isValidValue(setting.value, setting.type);
  const typeColor = getTypeColor(setting.type);
  const categoryColor = getCategoryColor(setting.category);

  return (
    <Animated type="fade" duration={300}>
      <Card 
        className={`transition-all duration-200 hover:shadow-md ${
          selected ? 'ring-2 ring-blue-500' : ''
        } ${
          !isValid ? 'border-red-200 dark:border-red-800' : ''
        } ${className}`}
      >
        <Card.Header className={compact ? 'pb-2' : ''}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Card.Title className={`text-sm font-medium truncate ${compact ? 'text-xs' : ''}`}>
                  {setting.key}
                </Card.Title>
                
                {/* Badges */}
                <div className="flex items-center gap-1">
                  {setting.isRequired && (
                    <Badge variant="destructive" className="text-xs">
                      Obrigatório
                    </Badge>
                  )}
                  
                  {!setting.isPublic && (
                    <Badge variant="secondary" className="text-xs">
                      Privado
                    </Badge>
                  )}
                  
                  {setting.isSensitive && (
                    <Badge variant="outline" className="text-xs">
                      Sensível
                    </Badge>
                  )}
                  
                  {!isValid && (
                    <Tooltip content="Valor inválido">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </Tooltip>
                  )}
                </div>
              </div>

              {/* Descrição */}
              {!compact && setting.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {setting.description}
                </p>
              )}

              {/* Categoria e tipo */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs bg-${categoryColor}-50 text-${categoryColor}-600 dark:bg-${categoryColor}-900/20 dark:text-${categoryColor}-400`}>
                  {setting.category}
                </Badge>
                <Badge variant="outline" className={`text-xs bg-${typeColor}-50 text-${typeColor}-600 dark:bg-${typeColor}-900/20 dark:text-${typeColor}-400`}>
                  {setting.type}
                </Badge>
              </div>
            </div>

            {/* Checkbox de seleção */}
            {selectable && (
              <div className="ml-2">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={handleSelect}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </Card.Header>

        <Card.Content className={compact ? 'pt-0' : ''}>
          {/* Valor */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Valor:
              </span>
              {setting.isSensitive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleVisibility}
                  className="h-6 w-6 p-0"
                >
                  {showValue ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
            
            <div className={`mt-1 p-2 rounded-md bg-gray-50 dark:bg-gray-800 ${
              !isValid ? 'border border-red-200 dark:border-red-800' : ''
            }`}>
              <pre className={`text-xs font-mono whitespace-pre-wrap break-words ${
                showValue ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {showValue 
                  ? formatValue(setting.value, setting.type)
                  : '••••••••••••••••'
                }
              </pre>
            </div>
          </div>

          {/* Metadados */}
          {!compact && (
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              {setting.updatedAt && (
                <div>
                  Atualizado: {new Date(setting.updatedAt).toLocaleString('pt-BR')}
                </div>
              )}
              {setting.createdAt && (
                <div>
                  Criado: {new Date(setting.createdAt).toLocaleString('pt-BR')}
                </div>
              )}
            </div>
          )}
        </Card.Content>

        {/* Ações */}
        {showActions && (
          <Card.Footer className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Tooltip content="Visualizar">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleView}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Tooltip>

                <Tooltip content="Editar">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </Tooltip>

                <Tooltip content="Duplicar">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDuplicate}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </Tooltip>
              </div>

              <div className="flex items-center gap-1">
                <Tooltip content="Deletar">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </Card.Footer>
        )}
      </Card>
    </Animated>
  );
};

// =========================================
// EXPORTS
// =========================================

export default SettingsCard;
