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
import { useUserSettings } from '../UserSettings/hooks/useUserSettings';
import { SettingsToggle } from './SettingsToggle';
import { SettingsCard } from './SettingsCard';
import { 
  Save, 
  RefreshCw, 
  RotateCcw, 
  Users,
  UserPlus,
  Shield,
  Lock,
  Eye,
  Bell,
  Settings as Settings,
  TestTube,
  CheckCircle,
  XCircle
} from 'lucide-react';

// =========================================
// INTERFACES
// =========================================

export interface UserSettingsProps {
  className?: string;
  onSave?: (settings: any) => void;
  onReset?: () => void;
  showAdvancedOptions?: boolean;
  compact?: boolean;
}

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

export const UserSettings: React.FC<UserSettingsProps> = ({
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
    updateRegistrationSettings,
    updateProfileSettings,
    updateUsernameSettings,
    updatePasswordSettings,
    updateAccountLockingSettings,
    updateSessionSettings,
    updatePrivacySettings,
    updateNotificationSettings,
    testUserSettings,
    validateUsername,
    checkUsernameAvailability,
    refreshSettings,
    clearError
  } = useUserSettings();

  // ===== ESTADO LOCAL =====
  const [formData, setFormData] = useState({
    default_role: 'user',
    auto_approve_users: false,
    require_email_verification: true,
    allow_self_registration: true,
    registration_approval_required: false,
    default_user_status: 'pending' as 'active' | 'inactive' | 'pending',
    user_profile_fields: ['name', 'email', 'phone', 'bio', 'avatar'],
    required_profile_fields: ['name', 'email'],
    optional_profile_fields: ['phone', 'bio', 'avatar'],
    avatar_upload_enabled: true,
    avatar_max_size: 2097152,
    avatar_allowed_types: ['jpg', 'jpeg', 'png', 'gif'],
    profile_picture_required: false,
    username_requirements: {
      min_length: 3,
      max_length: 20,
      allowed_characters: 'a-zA-Z0-9_-',
      unique_required: true
    },
    password_requirements: {
      min_length: 8,
      require_uppercase: true,
      require_lowercase: true,
      require_numbers: true,
      require_symbols: false
    },
    account_locking: {
      enabled: true,
      max_attempts: 5,
      lockout_duration: 900,
      unlock_after: 3600
    },
    session_management: {
      max_concurrent_sessions: 3,
      session_timeout: 3600,
      remember_me_enabled: true,
      remember_me_duration: 2592000
    },
    privacy_settings: {
      profile_visibility: 'public' as 'public' | 'private' | 'friends',
      activity_visibility: 'public' as 'public' | 'private' | 'friends',
      data_sharing: false,
      analytics_tracking: true
    },
    notification_preferences: {
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      desktop_notifications: true
    }
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [usernameValidation, setUsernameValidation] = useState<any>(null);

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
   * Atualizar campo aninhado
   */
  const handleNestedFieldChange = useCallback((parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
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
    if (window.confirm('Tem certeza que deseja resetar todas as configurações de usuário?')) {
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
      const success = await testUserSettings();
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
  }, [testUserSettings]);

  /**
   * Validar username
   */
  const handleValidateUsername = useCallback(async (username: string) => {
    if (username.length < 3) return;
    
    try {
      const result = await validateUsername(username);
      setUsernameValidation(result);
    } catch (err) {
      console.error('Erro ao validar username:', err);
    }
  }, [validateUsername]);

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
            title="Erro ao carregar configurações de usuário"
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
            description="Não há configurações de usuário disponíveis no momento."
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
                <Users className="h-6 w-6" />
                Configurações de Usuário
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Configure as configurações de usuários e perfis
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
              <Card.Title>Estatísticas de Usuários</Card.Title>
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
                    {stats.activeUsers}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Ativos</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.pendingUsers}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Pendentes</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.registeredUsers}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Registrados</p>
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
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
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

        {/* Configurações de Registro */}
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Configurações de Registro
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Função Padrão
                  </label>
                  <Select
                    value={formData.default_role}
                    onValueChange={(value) => handleFieldChange('default_role', value)}
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Administrador</option>
                    <option value="moderator">Moderador</option>
                    <option value="guest">Convidado</option>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status Padrão
                  </label>
                  <Select
                    value={formData.default_user_status}
                    onValueChange={(value) => handleFieldChange('default_user_status', value)}
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="pending">Pendente</option>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-3">
                <SettingsToggle
                  id="allow_self_registration"
                  label="Permitir Auto-registro"
                  description="Permitir que usuários se registrem automaticamente"
                  value={formData.allow_self_registration}
                  onChange={(value) => handleFieldChange('allow_self_registration', value)}
                  category="users"
                />
                
                <SettingsToggle
                  id="require_email_verification"
                  label="Exigir Verificação de Email"
                  description="Exigir verificação de email para novos usuários"
                  value={formData.require_email_verification}
                  onChange={(value) => handleFieldChange('require_email_verification', value)}
                  category="users"
                />
                
                <SettingsToggle
                  id="registration_approval_required"
                  label="Aprovação de Registro Obrigatória"
                  description="Exigir aprovação manual para novos registros"
                  value={formData.registration_approval_required}
                  onChange={(value) => handleFieldChange('registration_approval_required', value)}
                  category="users"
                />
                
                <SettingsToggle
                  id="auto_approve_users"
                  label="Aprovação Automática"
                  description="Aprovar usuários automaticamente após verificação"
                  value={formData.auto_approve_users}
                  onChange={(value) => handleFieldChange('auto_approve_users', value)}
                  category="users"
                />
              </div>
            </Card.Content>
          </Card>

          {/* Configurações de Perfil */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações de Perfil
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tamanho Máximo do Avatar (bytes)
                  </label>
                  <Input
                    type="number"
                    value={formData.avatar_max_size}
                    onChange={(e) => handleFieldChange('avatar_max_size', parseInt(e.target.value))}
                    min="1024"
                    max="10485760"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipos de Arquivo Permitidos
                  </label>
                  <Input
                    value={formData.avatar_allowed_types.join(', ')}
                    onChange={(e) => handleFieldChange('avatar_allowed_types', e.target.value.split(', '))}
                    placeholder="jpg, jpeg, png, gif"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <SettingsToggle
                  id="avatar_upload_enabled"
                  label="Upload de Avatar Habilitado"
                  description="Permitir que usuários façam upload de avatares"
                  value={formData.avatar_upload_enabled}
                  onChange={(value) => handleFieldChange('avatar_upload_enabled', value)}
                  category="users"
                />
                
                <SettingsToggle
                  id="profile_picture_required"
                  label="Foto de Perfil Obrigatória"
                  description="Exigir que usuários tenham uma foto de perfil"
                  value={formData.profile_picture_required}
                  onChange={(value) => handleFieldChange('profile_picture_required', value)}
                  category="users"
                />
              </div>
            </Card.Content>
          </Card>

          {/* Configurações de Username */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Configurações de Username
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tamanho Mínimo
                  </label>
                  <Input
                    type="number"
                    value={formData.username_requirements.min_length}
                    onChange={(e) => handleNestedFieldChange('username_requirements', 'min_length', parseInt(e.target.value))}
                    min="2"
                    max="10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tamanho Máximo
                  </label>
                  <Input
                    type="number"
                    value={formData.username_requirements.max_length}
                    onChange={(e) => handleNestedFieldChange('username_requirements', 'max_length', parseInt(e.target.value))}
                    min="5"
                    max="50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Caracteres Permitidos
                </label>
                <Input
                  value={formData.username_requirements.allowed_characters}
                  onChange={(e) => handleNestedFieldChange('username_requirements', 'allowed_characters', e.target.value)}
                  placeholder="a-zA-Z0-9_-"
                />
              </div>
              
              <SettingsToggle
                id="username_unique_required"
                label="Username Único Obrigatório"
                description="Exigir que usernames sejam únicos no sistema"
                value={formData.username_requirements.unique_required}
                onChange={(value) => handleNestedFieldChange('username_requirements', 'unique_required', value)}
                category="users"
              />
            </Card.Content>
          </Card>

          {/* Configurações de Senha */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Configurações de Senha
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tamanho Mínimo da Senha
                </label>
                <Input
                  type="number"
                  value={formData.password_requirements.min_length}
                  onChange={(e) => handleNestedFieldChange('password_requirements', 'min_length', parseInt(e.target.value))}
                  min="6"
                  max="128"
                />
              </div>
              
              <div className="space-y-3">
                <SettingsToggle
                  id="password_require_uppercase"
                  label="Exigir Letras Maiúsculas"
                  description="A senha deve conter pelo menos uma letra maiúscula"
                  value={formData.password_requirements.require_uppercase}
                  onChange={(value) => handleNestedFieldChange('password_requirements', 'require_uppercase', value)}
                  category="users"
                />
                
                <SettingsToggle
                  id="password_require_lowercase"
                  label="Exigir Letras Minúsculas"
                  description="A senha deve conter pelo menos uma letra minúscula"
                  value={formData.password_requirements.require_lowercase}
                  onChange={(value) => handleNestedFieldChange('password_requirements', 'require_lowercase', value)}
                  category="users"
                />
                
                <SettingsToggle
                  id="password_require_numbers"
                  label="Exigir Números"
                  description="A senha deve conter pelo menos um número"
                  value={formData.password_requirements.require_numbers}
                  onChange={(value) => handleNestedFieldChange('password_requirements', 'require_numbers', value)}
                  category="users"
                />
                
                <SettingsToggle
                  id="password_require_symbols"
                  label="Exigir Símbolos"
                  description="A senha deve conter pelo menos um símbolo especial"
                  value={formData.password_requirements.require_symbols}
                  onChange={(value) => handleNestedFieldChange('password_requirements', 'require_symbols', value)}
                  category="users"
                />
              </div>
            </Card.Content>
          </Card>

          {/* Configurações de Bloqueio de Conta */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Bloqueio de Conta
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <SettingsToggle
                id="account_locking_enabled"
                label="Bloqueio de Conta Habilitado"
                description="Bloquear contas após múltiplas tentativas de login"
                value={formData.account_locking.enabled}
                onChange={(value) => handleNestedFieldChange('account_locking', 'enabled', value)}
                category="users"
              />
              
              {formData.account_locking.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Máximo de Tentativas
                    </label>
                    <Input
                      type="number"
                      value={formData.account_locking.max_attempts}
                      onChange={(e) => handleNestedFieldChange('account_locking', 'max_attempts', parseInt(e.target.value))}
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
                      value={formData.account_locking.lockout_duration}
                      onChange={(e) => handleNestedFieldChange('account_locking', 'lockout_duration', parseInt(e.target.value))}
                      min="60"
                      max="3600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Desbloqueio Automático (segundos)
                    </label>
                    <Input
                      type="number"
                      value={formData.account_locking.unlock_after}
                      onChange={(e) => handleNestedFieldChange('account_locking', 'unlock_after', parseInt(e.target.value))}
                      min="300"
                      max="86400"
                    />
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Configurações de Privacidade */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Configurações de Privacidade
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Visibilidade do Perfil
                  </label>
                  <Select
                    value={formData.privacy_settings.profile_visibility}
                    onValueChange={(value) => handleNestedFieldChange('privacy_settings', 'profile_visibility', value)}
                  >
                    <option value="public">Público</option>
                    <option value="private">Privado</option>
                    <option value="friends">Apenas Amigos</option>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Visibilidade da Atividade
                  </label>
                  <Select
                    value={formData.privacy_settings.activity_visibility}
                    onValueChange={(value) => handleNestedFieldChange('privacy_settings', 'activity_visibility', value)}
                  >
                    <option value="public">Público</option>
                    <option value="private">Privado</option>
                    <option value="friends">Apenas Amigos</option>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-3">
                <SettingsToggle
                  id="data_sharing"
                  label="Compartilhamento de Dados"
                  description="Permitir compartilhamento de dados para melhorias"
                  value={formData.privacy_settings.data_sharing}
                  onChange={(value) => handleNestedFieldChange('privacy_settings', 'data_sharing', value)}
                  category="users"
                />
                
                <SettingsToggle
                  id="analytics_tracking"
                  label="Rastreamento de Analytics"
                  description="Permitir rastreamento para analytics"
                  value={formData.privacy_settings.analytics_tracking}
                  onChange={(value) => handleNestedFieldChange('privacy_settings', 'analytics_tracking', value)}
                  category="users"
                />
              </div>
            </Card.Content>
          </Card>

          {/* Configurações de Notificação */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificação
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="space-y-3">
                <SettingsToggle
                  id="email_notifications"
                  label="Notificações por Email"
                  description="Enviar notificações por email"
                  value={formData.notification_preferences.email_notifications}
                  onChange={(value) => handleNestedFieldChange('notification_preferences', 'email_notifications', value)}
                  category="users"
                />
                
                <SettingsToggle
                  id="push_notifications"
                  label="Notificações Push"
                  description="Enviar notificações push"
                  value={formData.notification_preferences.push_notifications}
                  onChange={(value) => handleNestedFieldChange('notification_preferences', 'push_notifications', value)}
                  category="users"
                />
                
                <SettingsToggle
                  id="sms_notifications"
                  label="Notificações por SMS"
                  description="Enviar notificações por SMS"
                  value={formData.notification_preferences.sms_notifications}
                  onChange={(value) => handleNestedFieldChange('notification_preferences', 'sms_notifications', value)}
                  category="users"
                />
                
                <SettingsToggle
                  id="desktop_notifications"
                  label="Notificações Desktop"
                  description="Mostrar notificações no desktop"
                  value={formData.notification_preferences.desktop_notifications}
                  onChange={(value) => handleNestedFieldChange('notification_preferences', 'desktop_notifications', value)}
                  category="users"
                />
              </div>
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

export default UserSettings;
