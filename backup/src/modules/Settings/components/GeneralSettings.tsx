import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner, LoadingSkeleton } from '@/components/ui/LoadingStates';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTransition, Animated } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { useGeneralSettings } from '../GeneralSettings/hooks/useGeneralSettings';
import { SettingsToggle } from './SettingsToggle';
import { SettingsCard } from './SettingsCard';
import { 
  Save, 
  RefreshCw, 
  RotateCcw, 
  Settings as Settings,
  Globe,
  Palette,
  Clock,
  FileText,
  Shield,
  Database
} from 'lucide-react';

// =========================================
// INTERFACES
// =========================================

export interface GeneralSettingsProps {
  className?: string;
  onSave?: (settings: any) => void;
  onReset?: () => void;
  showAdvancedOptions?: boolean;
  compact?: boolean;
}

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  className = '',
  onSave,
  onReset,
  showAdvancedOptions = false,
  compact = false
}) => {
  // ===== HOOKS =====
  const {
    settings,
    currentSetting,
    loading,
    error,
    stats,
    createSetting,
    updateSetting,
    updateMultipleSettings,
    resetSettings,
    updateTheme,
    updateLanguage,
    updateTimezone,
    updateMaintenanceMode,
    updateDebugMode,
    updateLogLevel,
    refreshSettings,
    clearError
  } = useGeneralSettings();

  // ===== ESTADO LOCAL =====
  const [formData, setFormData] = useState({
    app_name: '',
    app_version: '',
    app_description: '',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR',
    currency: 'BRL',
    date_format: 'DD/MM/YYYY',
    time_format: '24h' as '12h' | '24h',
    theme: 'light' as 'light' | 'dark' | 'auto',
    maintenance_mode: false,
    debug_mode: false,
    log_level: 'info' as 'error' | 'warn' | 'info' | 'debug',
    max_upload_size: 10485760,
    allowed_file_types: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
    session_timeout: 3600,
    auto_logout: true
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ===== HANDLERS =====

  /**
   * Atualizar campo do formulário
   */
  const handleFieldChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  }, []);

  /**
   * Salvar configurações
   */
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const success = await updateMultipleSettings(formData);
      if (success) {
        setHasUnsavedChanges(false);
        onSave?.(formData);
      }
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
    } finally {
      setIsSaving(false);
    }
  }, [formData, updateMultipleSettings, onSave]);

  /**
   * Resetar configurações
   */
  const handleReset = useCallback(async () => {
    if (window.confirm('Tem certeza que deseja resetar todas as configurações gerais?')) {
      const success = await resetSettings();
      if (success) {
        setHasUnsavedChanges(false);
        onReset?.();
        await refreshSettings();
      }
    }
  }, [resetSettings, onReset, refreshSettings]);

  /**
   * Atualizar configurações específicas
   */
  const handleSpecificUpdate = useCallback(async (field: string, value: any) => {
    try {
      let success = false;
      
      switch (field) {
        case 'theme':
          success = await updateTheme(value);
          break;
        case 'language':
          success = await updateLanguage(value);
          break;
        case 'timezone':
          success = await updateTimezone(value);
          break;
        case 'maintenance_mode':
          success = await updateMaintenanceMode(value);
          break;
        case 'debug_mode':
          success = await updateDebugMode(value);
          break;
        case 'log_level':
          success = await updateLogLevel(value);
          break;
        default:
          success = await updateSetting(field, { [field]: value });
      }
      
      if (success) {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasUnsavedChanges(false);
      }
    } catch (err) {
      console.error(`Erro ao atualizar ${field}:`, err);
    }
  }, [updateTheme, updateLanguage, updateTimezone, updateMaintenanceMode, updateDebugMode, updateLogLevel, updateSetting]);

  // ===== EFEITOS =====

  // Carregar configurações na inicialização
  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // Sincronizar formulário com dados carregados
  useEffect(() => {
    if (settings.length > 0) {
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, any>);

      setFormData(prev => ({
        ...prev,
        ...settingsMap
      }));
    }
  }, [settings]);

  // ===== RENDERIZAÇÃO =====

  if (loading) {
    return (
      <PageTransition type="fade" duration={500}>
        <div className={`py-6 ${className}`}>
          <div className="space-y-6">
            <LoadingSkeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-32" />
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition type="fade" duration={500}>
        <div className={`py-6 ${className}`}>
          <ErrorState
            title="Erro ao carregar configurações gerais"
            message={error}
            onRetry={refreshSettings}
          />
        </div>
      </PageTransition>
    );
  }

  if (settings.length === 0) {
    return (
      <PageTransition type="fade" duration={500}>
        <div className={`py-6 ${className}`}>
          <EmptyState
            title="Nenhuma configuração encontrada"
            description="Não há configurações gerais disponíveis no momento."
            action={{
              label: 'Criar configuração padrão',
              onClick: () => {
                // Implementar criação de configuração padrão
              }
            }}
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition type="fade" duration={500}>
      <div className={`py-6 ${className}`}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Configurações Gerais
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Configure as configurações básicas do sistema
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={refreshSettings}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <RotateCcw className="h-4 w-4" />
                Resetar
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <LoadingSpinner className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar
              </Button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mb-6">
          <Card>
            <Card.Header>
              <Card.Title>Estatísticas</Card.Title>
            </Card.Header>
            <Card.Content>
              <ResponsiveGrid columns={{ xs: 2, sm: 4 }} gap={4}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.total}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.active}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Ativas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.maintenanceMode ? 'Sim' : 'Não'}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Manutenção</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.debugMode ? 'Sim' : 'Não'}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Debug</p>
                </div>
              </ResponsiveGrid>
            </Card.Content>
          </Card>
        </div>

        {/* Configurações Básicas */}
        <div className="space-y-6">
          {/* Informações da Aplicação */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações da Aplicação
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome da Aplicação
                  </label>
                  <Input
                    value={formData.app_name}
                    onChange={(e) => handleFieldChange('app_name', e.target.value)}
                    placeholder="Nome da aplicação"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Versão
                  </label>
                  <Input
                    value={formData.app_version}
                    onChange={(e) => handleFieldChange('app_version', e.target.value)}
                    placeholder="1.0.0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição
                </label>
                <Input
                  value={formData.app_description}
                  onChange={(e) => handleFieldChange('app_description', e.target.value)}
                  placeholder="Descrição da aplicação"
                />
              </div>
            </Card.Content>
          </Card>

          {/* Configurações Regionais */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configurações Regionais
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Idioma
                  </label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => handleSpecificUpdate('language', value)}
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                    <option value="fr-FR">Français</option>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timezone
                  </label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => handleSpecificUpdate('timezone', value)}
                  >
                    <option value="America/Sao_Paulo">São Paulo</option>
                    <option value="America/New_York">New York</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Moeda
                  </label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleFieldChange('currency', value)}
                  >
                    <option value="BRL">Real (BRL)</option>
                    <option value="USD">Dólar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">Libra (GBP)</option>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Formato de Data
                  </label>
                  <Select
                    value={formData.date_format}
                    onValueChange={(value) => handleFieldChange('date_format', value)}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Formato de Hora
                  </label>
                  <Select
                    value={formData.time_format}
                    onValueChange={(value) => handleFieldChange('time_format', value)}
                  >
                    <option value="24h">24 horas</option>
                    <option value="12h">12 horas</option>
                  </Select>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Configurações de Interface */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Configurações de Interface
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tema
                </label>
                <Select
                  value={formData.theme}
                  onValueChange={(value) => handleSpecificUpdate('theme', value)}
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                  <option value="auto">Automático</option>
                </Select>
              </div>
            </Card.Content>
          </Card>

          {/* Configurações de Sistema */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Sistema
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <SettingsToggle
                id="maintenance_mode"
                label="Modo de Manutenção"
                description="Ativa o modo de manutenção do sistema"
                value={formData.maintenance_mode}
                onChange={(value) => handleSpecificUpdate('maintenance_mode', value)}
                category="general"
                isRequired
              />
              
              <SettingsToggle
                id="debug_mode"
                label="Modo de Debug"
                description="Ativa logs detalhados para desenvolvimento"
                value={formData.debug_mode}
                onChange={(value) => handleSpecificUpdate('debug_mode', value)}
                category="general"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nível de Log
                </label>
                <Select
                  value={formData.log_level}
                  onValueChange={(value) => handleSpecificUpdate('log_level', value)}
                >
                  <option value="error">Erro</option>
                  <option value="warn">Aviso</option>
                  <option value="info">Informação</option>
                  <option value="debug">Debug</option>
                </Select>
              </div>
            </Card.Content>
          </Card>

          {/* Configurações Avançadas */}
          {showAdvancedOptions && (
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Configurações Avançadas
                </Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tamanho Máximo de Upload (bytes)
                    </label>
                    <Input
                      type="number"
                      value={formData.max_upload_size}
                      onChange={(e) => handleFieldChange('max_upload_size', parseInt(e.target.value))}
                      placeholder="10485760"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timeout de Sessão (segundos)
                    </label>
                    <Input
                      type="number"
                      value={formData.session_timeout}
                      onChange={(e) => handleFieldChange('session_timeout', parseInt(e.target.value))}
                      placeholder="3600"
                    />
                  </div>
                </div>
                
                <SettingsToggle
                  id="auto_logout"
                  label="Logout Automático"
                  description="Ativa logout automático após inatividade"
                  value={formData.auto_logout}
                  onChange={(value) => handleFieldChange('auto_logout', value)}
                  category="general"
                />
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

// =========================================
// EXPORTS
// =========================================

export default GeneralSettings;
