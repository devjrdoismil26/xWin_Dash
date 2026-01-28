import React, { useState, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import { Animated } from '@/components/ui/AdvancedAnimations';
import { 
  Check, 
  X, 
  AlertTriangle, 
  Info, 
  Settings as Settings,
  RefreshCw
} from 'lucide-react';

// =========================================
// INTERFACES
// =========================================

export interface SettingsToggleProps {
  id: string;
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  onSave?: (value: boolean) => Promise<boolean>;
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;
  category?: string;
  isRequired?: boolean;
  isSensitive?: boolean;
  validationRules?: any[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card' | 'minimal';
  showStatus?: boolean;
  showDescription?: boolean;
  showCategory?: boolean;
  showValidation?: boolean;
  autoSave?: boolean;
  saveDelay?: number;
}

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

export const SettingsToggle: React.FC<SettingsToggleProps> = ({
  id,
  label,
  description,
  value,
  onChange,
  onSave,
  disabled = false,
  loading = false,
  error = null,
  category,
  isRequired = false,
  isSensitive = false,
  validationRules = [],
  className = '',
  size = 'md',
  variant = 'default',
  showStatus = true,
  showDescription = true,
  showCategory = true,
  showValidation = true,
  autoSave = false,
  saveDelay = 1000
}) => {
  // ===== ESTADO LOCAL =====
  const [internalValue, setInternalValue] = useState<boolean>(value);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // ===== HANDLERS =====

  /**
   * Alterar valor
   */
  const handleToggle = useCallback(async () => {
    if (disabled || loading) return;

    const newValue = !internalValue;
    setInternalValue(newValue);
    setHasUnsavedChanges(true);
    setSaveError(null);
    
    // Validar valor
    if (showValidation && validationRules.length > 0) {
      const validation = validateValue(newValue);
      if (!validation.isValid) {
        setValidationError(validation.error);
        return;
      }
    }

    onChange(newValue);

    // Auto-save se habilitado
    if (autoSave && onSave) {
      setTimeout(async () => {
        await handleSave(newValue);
      }, saveDelay);
    }
  }, [internalValue, disabled, loading, onChange, autoSave, onSave, saveDelay, showValidation, validationRules]);

  /**
   * Salvar valor
   */
  const handleSave = useCallback(async (valueToSave?: boolean) => {
    if (!onSave) return;

    const value = valueToSave !== undefined ? valueToSave : internalValue;
    setIsSaving(true);
    setSaveError(null);

    try {
      const success = await onSave(value);
      if (success) {
        setHasUnsavedChanges(false);
        setValidationError(null);
      } else {
        setSaveError('Erro ao salvar configuração');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Erro ao salvar configuração');
    } finally {
      setIsSaving(false);
    }
  }, [onSave, internalValue]);

  /**
   * Validar valor
   */
  const validateValue = useCallback((value: boolean): { isValid: boolean; error?: string } => {
    for (const rule of validationRules) {
      if (rule.type === 'required' && !value) {
        return { isValid: false, error: rule.message || 'Este campo é obrigatório' };
      }
    }
    return { isValid: true };
  }, [validationRules]);

  // ===== EFEITOS =====

  // Sincronizar valor interno com prop
  useEffect(() => {
    setInternalValue(value);
    setHasUnsavedChanges(false);
  }, [value]);

  // ===== UTILITÁRIOS =====

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
   * Obter tamanhos
   */
  const getSizes = useCallback(() => {
    const sizes = {
      sm: {
        toggle: 'h-4 w-7',
        thumb: 'h-3 w-3',
        text: 'text-sm',
        description: 'text-xs'
      },
      md: {
        toggle: 'h-5 w-9',
        thumb: 'h-4 w-4',
        text: 'text-base',
        description: 'text-sm'
      },
      lg: {
        toggle: 'h-6 w-11',
        thumb: 'h-5 w-5',
        text: 'text-lg',
        description: 'text-base'
      }
    };
    return sizes[size];
  }, [size]);

  // ===== RENDERIZAÇÃO =====

  const sizes = getSizes();
  const categoryColor = category ? getCategoryColor(category) : 'gray';
  const hasError = error || saveError || validationError;
  const isDisabled = disabled || loading || isSaving;

  // Variante minimal
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <button
          onClick={handleToggle}
          disabled={isDisabled}
          className={`relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            internalValue ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          } ${sizes.toggle} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block rounded-full bg-white shadow transform transition-transform ${
              internalValue ? 'translate-x-4' : 'translate-x-0.5'
            } ${sizes.thumb}`}
          />
        </button>
        
        <div className="flex-1 min-w-0">
          <label className={`block font-medium text-gray-900 dark:text-white ${sizes.text}`}>
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          {showDescription && description && (
            <p className={`text-gray-600 dark:text-gray-400 ${sizes.description}`}>
              {description}
            </p>
          )}
        </div>

        {showStatus && (
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-xs">
                Não salvo
              </Badge>
            )}
            {hasError && (
              <Tooltip content={hasError}>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </Tooltip>
            )}
            {isSaving && (
              <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
            )}
          </div>
        )}
      </div>
    );
  }

  // Variante card
  if (variant === 'card') {
    return (
      <Card className={`${className} ${hasError ? 'border-red-200 dark:border-red-800' : ''}`}>
        <Card.Header className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Card.Title className={`${sizes.text} font-medium`}>
                  {label}
                  {isRequired && <span className="text-red-500 ml-1">*</span>}
                </Card.Title>
                
                {showCategory && category && (
                  <Badge variant="outline" className={`text-xs bg-${categoryColor}-50 text-${categoryColor}-600 dark:bg-${categoryColor}-900/20 dark:text-${categoryColor}-400`}>
                    {category}
                  </Badge>
                )}
                
                {isSensitive && (
                  <Badge variant="outline" className="text-xs">
                    Sensível
                  </Badge>
                )}
              </div>

              {showDescription && description && (
                <p className={`text-gray-600 dark:text-gray-400 ${sizes.description}`}>
                  {description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggle}
                disabled={isDisabled}
                className={`relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  internalValue ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                } ${sizes.toggle} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block rounded-full bg-white shadow transform transition-transform ${
                    internalValue ? 'translate-x-4' : 'translate-x-0.5'
                  } ${sizes.thumb}`}
                />
              </button>

              {!autoSave && onSave && hasUnsavedChanges && (
                <Button
                  size="sm"
                  onClick={() => handleSave()}
                  disabled={isSaving}
                  className="h-8"
                >
                  {isSaving ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    'Salvar'
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card.Header>

        {showStatus && (hasError || hasUnsavedChanges) && (
          <Card.Content className="pt-0">
            <div className="flex items-center gap-2">
              {hasError && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  {hasError}
                </div>
              )}
              {hasUnsavedChanges && !hasError && (
                <div className="flex items-center gap-1 text-yellow-600 text-sm">
                  <Info className="h-4 w-4" />
                  Alterações não salvas
                </div>
              )}
            </div>
          </Card.Content>
        )}
      </Card>
    );
  }

  // Variante default
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <label className={`block font-medium text-gray-900 dark:text-white ${sizes.text}`}>
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          {showDescription && description && (
            <p className={`text-gray-600 dark:text-gray-400 ${sizes.description}`}>
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {showCategory && category && (
            <Badge variant="outline" className={`text-xs bg-${categoryColor}-50 text-${categoryColor}-600 dark:bg-${categoryColor}-900/20 dark:text-${categoryColor}-400`}>
              {category}
            </Badge>
          )}

          <button
            onClick={handleToggle}
            disabled={isDisabled}
            className={`relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              internalValue ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            } ${sizes.toggle} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block rounded-full bg-white shadow transform transition-transform ${
                internalValue ? 'translate-x-4' : 'translate-x-0.5'
              } ${sizes.thumb}`}
            />
          </button>

          {!autoSave && onSave && hasUnsavedChanges && (
            <Button
              size="sm"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="h-8"
            >
              {isSaving ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                'Salvar'
              )}
            </Button>
          )}
        </div>
      </div>

      {showStatus && (hasError || hasUnsavedChanges) && (
        <div className="flex items-center gap-2">
          {hasError && (
            <div className="flex items-center gap-1 text-red-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              {hasError}
            </div>
          )}
          {hasUnsavedChanges && !hasError && (
            <div className="flex items-center gap-1 text-yellow-600 text-sm">
              <Info className="h-4 w-4" />
              Alterações não salvas
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// =========================================
// EXPORTS
// =========================================

export default SettingsToggle;
