import React, { useState, useCallback } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Tooltip } from '@/shared/components/ui/Tooltip';
import { Animated } from '@/shared/components/ui/AdvancedAnimations';
import { Edit, Trash2, Copy, Eye, EyeOff, Check, X, AlertTriangle, Info, Settings as Settings } from 'lucide-react';

// =========================================
// INTERFACES
// =========================================

export interface SettingItem {
  id: string;
  key: string;
  value: string | number | boolean | Record<string, any> | unknown[];
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  category: string;
  description?: string;
  isRequired: boolean;
  isPublic: boolean;
  isSensitive: boolean;
  validationRules?: string[];
  createdAt?: string;
  updatedAt?: string; }

export interface SettingsCardProps {
  setting: SettingItem;
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  onDuplicate??: (e: any) => void;
  onToggleVisibility??: (e: any) => void;
  onView??: (e: any) => void;
  className?: string;
  showActions?: boolean;
  compact?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelect??: (e: any) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

export const SettingsCard: React.FC<SettingsCardProps> = ({ setting,
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
  const formatValue = useCallback((value: unknown, type: string): string => {
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

    } , []);

  /**
   * Obter cor do tipo
   */
  const getTypeColor = useCallback((type: string): string => {
    const colors = {
      string: 'blue',
      number: 'green',
      boolean: 'purple',
      json: 'orange',
      array: 'pink'};

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
      api: 'gray'};

    return colors[category as keyof typeof colors] || 'gray';
  }, []);

  /**
   * Verificar se valor é válido
   */
  const isValidValue = useCallback((value: unknown, type: string): boolean => {
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
    } , []);

  // ===== RENDERIZAÇÃO =====

  const isValid = isValidValue(setting.value, setting.type);

  const typeColor = getTypeColor(setting.type);

  const categoryColor = getCategoryColor(setting.category);

  return (
        <>
      <Animated type="fade" duration={ 300 } />
      <Card 
        className={`transition-all duration-200 hover:shadow-md ${
          selected ? 'ring-2 ring-blue-500' : ''
        } ${
          !isValid ? 'border-red-200 dark:border-red-800' : ''
        } ${className}`} />
        <Card.Header className={compact ? 'pb-2' : '' } />
          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Card.Title className={`text-sm font-medium truncate ${compact ? 'text-xs' : ''} `} />
                  {setting.key}
                </Card.Title>
                
                {/* Badges */}
                <div className="{setting.isRequired && (">$2</div>
                    <Badge variant="destructive" className="text-xs" />
                      Obrigatório
                    </Badge>
                  )}
                  
                  {!setting.isPublic && (
                    <Badge variant="secondary" className="text-xs" />
                      Privado
                    </Badge>
                  )}
                  
                  {setting.isSensitive && (
                    <Badge variant="outline" className="text-xs" />
                      Sensível
                    </Badge>
                  )}
                  
                  {!isValid && (
                    <Tooltip content="Valor inválido" />
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </Tooltip>
                  )}
                </div>

              {/* Descrição */}
              {!compact && setting.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2" />
                  {setting.description}
                </p>
              )}

              {/* Categoria e tipo */}
              <div className=" ">$2</div><Badge variant="outline" className={`text-xs bg-${categoryColor} -50 text-${categoryColor}-600 dark:bg-${categoryColor}-900/20 dark:text-${categoryColor}-400`} />
                  {setting.category}
                </Badge>
                <Badge variant="outline" className={`text-xs bg-${typeColor} -50 text-${typeColor}-600 dark:bg-${typeColor}-900/20 dark:text-${typeColor}-400`} />
                  {setting.type}
                </Badge>
              </div>

            {/* Checkbox de seleção */}
            {selectable && (
              <div className=" ">$2</div><input
                  type="checkbox"
                  checked={ selected }
                  onChange={ handleSelect }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                / />
              </div>
            )}
          </div>
        </Card.Header>

        <Card.Content className={compact ? 'pt-0' : '' } />
          {/* Valor */}
          <div className=" ">$2</div><div className=" ">$2</div><span className="Valor:">$2</span>
              </span>
              {setting.isSensitive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={ handleToggleVisibility }
                  className="h-6 w-6 p-0" />
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
            } `}>
           
        </div><pre className={`text-xs font-mono whitespace-pre-wrap break-words ${
                showValue ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
              } `} />
                {showValue 
                  ? formatValue(setting.value, setting.type)
                  : '••••••••••••••••'
                }
              </pre>
            </div>

          {/* Metadados */}
          {!compact && (
            <div className="{setting.updatedAt && (">$2</div>
                <div>
          Atualizado: 
        </div>{new Date(setting.updatedAt).toLocaleString('pt-BR')}
                </div>
              )}
              {setting.createdAt && (
                <div>
          Criado: 
        </div>{new Date(setting.createdAt).toLocaleString('pt-BR')}
                </div>
              )}
            </div>
          )}
        </Card.Content>

        {/* Ações */}
        {showActions && (
          <Card.Footer className="pt-0" />
            <div className=" ">$2</div><div className=" ">$2</div><Tooltip content="Visualizar" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={ handleView }
                    className="h-8 w-8 p-0" />
                    <Eye className="h-4 w-4" /></Button></Tooltip>

                <Tooltip content="Editar" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={ handleEdit }
                    className="h-8 w-8 p-0" />
                    <Edit className="h-4 w-4" /></Button></Tooltip>

                <Tooltip content="Duplicar" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={ handleDuplicate }
                    className="h-8 w-8 p-0" />
                    <Copy className="h-4 w-4" /></Button></Tooltip></div><div className=" ">$2</div><Tooltip content="Deletar" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={ handleDelete }
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" />
                    <Trash2 className="h-4 w-4" /></Button></Tooltip></div></Card.Footer>
        )}
      </Card>
    </Animated>);};

// =========================================
// EXPORTS
// =========================================

export default SettingsCard;
