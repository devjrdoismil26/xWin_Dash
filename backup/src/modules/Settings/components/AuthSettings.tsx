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
import { useAuthSettings } from '../AuthSettings/hooks/useAuthSettings';
import { SettingsToggle } from './SettingsToggle';
import { SettingsCard } from './SettingsCard';
import { 
  Save, 
  RefreshCw, 
  RotateCcw, 
  Shield,
  Lock,
  Key,
  Clock,
  Users,
  Eye,
  EyeOff,
  TestTube,
  AlertTriangle
} from 'lucide-react';

// =========================================
// INTERFACES
// =========================================

export interface AuthSettingsProps {
  className?: string;
  onSave?: (settings: any) => void;
  onReset?: () => void;
  showAdvancedOptions?: boolean;
  compact?: boolean;
}

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

export const AuthSettings: React.FC<AuthSettingsProps> = ({
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
    updatePasswordSettings,
    updateSessionSettings,
    updateTwoFactorSettings,
    updateOAuthSettings,
    updateJWTSettings,
    updateIPSettings,
    updateRateLimitingSettings,
    testAuthSettings,
    validatePasswordStrength,
    generateBackupCodes,
    refreshSettings,
    clearError
  } = useAuthSettings();

  // ===== ESTADO LOCAL =====
  const [formData, setFormData] = useState({
    password_min_length: 8,
    password_require_uppercase: true,
    password_require_lowercase: true,
    password_require_numbers: true,
    password_require_symbols: false,
    password_expiry_days: 90,
    password_history_count: 5,
    session_timeout: 3600,
    max_login_attempts: 5,
    lockout_duration: 900,
    two_factor_enabled: false,
    two_factor_method: 'email' as 'email' | 'sms' | 'app' | 'backup_codes',
    two_factor_backup_codes_count: 10,
    oauth_providers: [] as string[],
    jwt_secret_key: '',
    jwt_expiry_time: 3600,
    refresh_token_expiry_time: 604800,
    remember_me_enabled: true,
    remember_me_duration: 2592000,
    auto_logout_enabled: true,
    auto_logout_warning_time: 300,
    ip_whitelist: [] as string[],
    ip_blacklist: [] as string[],
    rate_limiting_enabled: true,
    rate_limiting_requests: 100,
    rate_limiting_window: 900
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [passwordStrength, setPasswordStrength] = useState<any>(null);

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
    if (window.confirm('Tem certeza que deseja resetar todas as configurações de autenticação?')) {
      const success = await resetSettings();
      if (success) {
        setHasUnsavedChanges(false);
        onReset?.();
        await refreshSettings();
      }
    }
  }, [resetSettings, onReset, refreshSettings]);

  /**
   * Testar configurações
   */
  const handleTestSettings = useCallback(async () => {
    try {
      const success = await testAuthSettings();
      setTestResults({
        success,
        message: success ? 'Configurações testadas com sucesso' : 'Erro ao testar configurações',
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      setTestResults({
        success: false,
        message: err.message || 'Erro ao testar configurações',
        timestamp: new Date().toISOString()
      });
    }
  }, [testAuthSettings]);

  /**
   * Validar força da senha
   */
  const handleValidatePassword = useCallback(async (password: string) => {
    if (password.length < 3) return;
    
    try {
      const result = await validatePasswordStrength(password);
      setPasswordStrength(result);
    } catch (err) {
      console.error('Erro ao validar senha:', err);
    }
  }, [validatePasswordStrength]);

  /**
   * Gerar códigos de backup
   */
  const handleGenerateBackupCodes = useCallback(async () => {
    try {
      const success = await generateBackupCodes();
      if (success) {
        alert('Códigos de backup gerados com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao gerar códigos de backup:', err);
    }
  }, [generateBackupCodes]);

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
            title="Erro ao carregar configurações de autenticação"
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
            description="Não há configurações de autenticação disponíveis no momento."
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
                <Shield className="h-6 w-6" />
                Configurações de Autenticação
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Configure as configurações de segurança e autenticação
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleTestSettings}
                className="flex items-center gap-2"
              >
                <TestTube className="h-4 w-4" />
                Testar
              </Button>
              
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
              <Card.Title>Estatísticas de Segurança</Card.Title>
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
                    {stats.twoFactorEnabled ? 'Ativo' : 'Inativo'}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">2FA</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.oauthEnabled ? 'Ativo' : 'Inativo'}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">OAuth</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.rateLimitingEnabled ? 'Ativo' : 'Inativo'}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Rate Limit</p>
                </div>
              </ResponsiveGrid>
            </Card.Content>
          </Card>
        </div>

        {/* Resultados de Teste */}
        {testResults && (
          <div className="mb-6">
            <Card className={testResults.success ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'}>
              <Card.Content className="pt-6">
                <div className={`flex items-center gap-2 ${testResults.success ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults.success ? (
                    <TestTube className="h-5 w-5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                  <span className="font-medium">{testResults.message}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Testado em: {new Date(testResults.timestamp).toLocaleString('pt-BR')}
                </p>
              </Card.Content>
            </Card>
          </div>
        )}

        {/* Configurações de Senha */}
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Configurações de Senha
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tamanho Mínimo da Senha
                  </label>
                  <Input
                    type="number"
                    value={formData.password_min_length}
                    onChange={(e) => handleFieldChange('password_min_length', parseInt(e.target.value))}
                    min="6"
                    max="50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiração da Senha (dias)
                  </label>
                  <Input
                    type="number"
                    value={formData.password_expiry_days}
                    onChange={(e) => handleFieldChange('password_expiry_days', parseInt(e.target.value))}
                    min="30"
                    max="365"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Histórico de Senhas
                  </label>
                  <Input
                    type="number"
                    value={formData.password_history_count}
                    onChange={(e) => handleFieldChange('password_history_count', parseInt(e.target.value))}
                    min="1"
                    max="10"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <SettingsToggle
                  id="password_require_uppercase"
                  label="Exigir Letras Maiúsculas"
                  description="A senha deve conter pelo menos uma letra maiúscula"
                  value={formData.password_require_uppercase}
                  onChange={(value) => handleFieldChange('password_require_uppercase', value)}
                  category="auth"
                />
                
                <SettingsToggle
                  id="password_require_lowercase"
                  label="Exigir Letras Minúsculas"
                  description="A senha deve conter pelo menos uma letra minúscula"
                  value={formData.password_require_lowercase}
                  onChange={(value) => handleFieldChange('password_require_lowercase', value)}
                  category="auth"
                />
                
                <SettingsToggle
                  id="password_require_numbers"
                  label="Exigir Números"
                  description="A senha deve conter pelo menos um número"
                  value={formData.password_require_numbers}
                  onChange={(value) => handleFieldChange('password_require_numbers', value)}
                  category="auth"
                />
                
                <SettingsToggle
                  id="password_require_symbols"
                  label="Exigir Símbolos"
                  description="A senha deve conter pelo menos um símbolo especial"
                  value={formData.password_require_symbols}
                  onChange={(value) => handleFieldChange('password_require_symbols', value)}
                  category="auth"
                />
              </div>
            </Card.Content>
          </Card>

          {/* Configurações de Sessão */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Configurações de Sessão
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timeout de Sessão (segundos)
                  </label>
                  <Input
                    type="number"
                    value={formData.session_timeout}
                    onChange={(e) => handleFieldChange('session_timeout', parseInt(e.target.value))}
                    min="300"
                    max="86400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Máximo de Tentativas
                  </label>
                  <Input
                    type="number"
                    value={formData.max_login_attempts}
                    onChange={(e) => handleFieldChange('max_login_attempts', parseInt(e.target.value))}
                    min="1"
                    max="10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duração do Bloqueio (segundos)
                  </label>
                  <Input
                    type="number"
                    value={formData.lockout_duration}
                    onChange={(e) => handleFieldChange('lockout_duration', parseInt(e.target.value))}
                    min="60"
                    max="3600"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <SettingsToggle
                  id="remember_me_enabled"
                  label="Lembrar-me"
                  description="Permitir que usuários mantenham a sessão ativa"
                  value={formData.remember_me_enabled}
                  onChange={(value) => handleFieldChange('remember_me_enabled', value)}
                  category="auth"
                />
                
                <SettingsToggle
                  id="auto_logout_enabled"
                  label="Logout Automático"
                  description="Fazer logout automático após inatividade"
                  value={formData.auto_logout_enabled}
                  onChange={(value) => handleFieldChange('auto_logout_enabled', value)}
                  category="auth"
                />
              </div>
            </Card.Content>
          </Card>

          {/* Configurações de 2FA */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Autenticação de Dois Fatores (2FA)
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <SettingsToggle
                id="two_factor_enabled"
                label="Habilitar 2FA"
                description="Ativar autenticação de dois fatores"
                value={formData.two_factor_enabled}
                onChange={(value) => handleFieldChange('two_factor_enabled', value)}
                category="auth"
                isRequired
              />
              
              {formData.two_factor_enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Método de 2FA
                    </label>
                    <Select
                      value={formData.two_factor_method}
                      onValueChange={(value) => handleFieldChange('two_factor_method', value)}
                    >
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="app">Aplicativo</option>
                      <option value="backup_codes">Códigos de Backup</option>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Número de Códigos de Backup
                    </label>
                    <Input
                      type="number"
                      value={formData.two_factor_backup_codes_count}
                      onChange={(e) => handleFieldChange('two_factor_backup_codes_count', parseInt(e.target.value))}
                      min="5"
                      max="20"
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={handleGenerateBackupCodes}
                    className="flex items-center gap-2"
                  >
                    <Key className="h-4 w-4" />
                    Gerar Códigos de Backup
                  </Button>
                </>
              )}
            </Card.Content>
          </Card>

          {/* Configurações de JWT */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Configurações de JWT
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chave Secreta JWT
                </label>
                <Input
                  type="password"
                  value={formData.jwt_secret_key}
                  onChange={(e) => handleFieldChange('jwt_secret_key', e.target.value)}
                  placeholder="Digite a chave secreta"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiração do Token (segundos)
                  </label>
                  <Input
                    type="number"
                    value={formData.jwt_expiry_time}
                    onChange={(e) => handleFieldChange('jwt_expiry_time', parseInt(e.target.value))}
                    min="300"
                    max="86400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiração do Refresh Token (segundos)
                  </label>
                  <Input
                    type="number"
                    value={formData.refresh_token_expiry_time}
                    onChange={(e) => handleFieldChange('refresh_token_expiry_time', parseInt(e.target.value))}
                    min="3600"
                    max="2592000"
                  />
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Configurações de Rate Limiting */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Rate Limiting
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <SettingsToggle
                id="rate_limiting_enabled"
                label="Habilitar Rate Limiting"
                description="Limitar o número de requisições por usuário"
                value={formData.rate_limiting_enabled}
                onChange={(value) => handleFieldChange('rate_limiting_enabled', value)}
                category="auth"
              />
              
              {formData.rate_limiting_enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Máximo de Requisições
                    </label>
                    <Input
                      type="number"
                      value={formData.rate_limiting_requests}
                      onChange={(e) => handleFieldChange('rate_limiting_requests', parseInt(e.target.value))}
                      min="10"
                      max="1000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Janela de Tempo (segundos)
                    </label>
                    <Input
                      type="number"
                      value={formData.rate_limiting_window}
                      onChange={(e) => handleFieldChange('rate_limiting_window', parseInt(e.target.value))}
                      min="60"
                      max="3600"
                    />
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

// =========================================
// EXPORTS
// =========================================

export default AuthSettings;
