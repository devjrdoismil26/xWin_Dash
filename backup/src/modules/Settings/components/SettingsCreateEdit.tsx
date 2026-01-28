import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import Button from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { PageTransition } from '@/components/ui/AdvancedAnimations';
import { ErrorState } from '@/components/ui/ErrorState';
import Tooltip from '@/components/ui/Tooltip';
import { 
  Save, 
  X,
  Trash2,
  Eye,
  Settings,
  Shield,
  Zap,
  Wrench
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { SystemSetting } from '../types/settingsTypes';
import SettingsForm from './SettingsForm';
import SettingsValidation from './SettingsValidation';
import SettingsDependencies from './SettingsDependencies';
import SettingsAdvanced from './SettingsAdvanced';

// =========================================
// INTERFACES
// =========================================

interface SettingsCreateEditProps {
  auth?: any;
  settingId?: string;
  categoryId?: string;
  groupId?: string;
  mode?: 'create' | 'edit' | 'view' | 'bulk';
  onClose?: () => void;
  onSave?: (setting: SystemSetting) => void;
}

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

const SettingsCreateEdit: React.FC<SettingsCreateEditProps> = ({ 
  auth,
  settingId,
  categoryId,
  groupId,
  mode = 'create',
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<SystemSetting>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'validation' | 'dependencies' | 'advanced'>('basic');

  const {
    settings,
    categories,
    groups,
    loading: settingsLoading,
    error: settingsError,
    createSetting,
    updateSetting,
    deleteSetting,
    getSettingById,
    validateSetting
  } = useSettings();

  useEffect(() => {
    if (settingId && mode !== 'create' && mode !== 'bulk') {
      loadSetting();
    } else if (mode === 'create' || mode === 'bulk') {
      initializeForm();
    }
  }, [settingId, mode]);

  const loadSetting = async () => {
    if (!settingId) return;
    
    setLoading(true);
    try {
      const setting = await getSettingById(settingId);
      if (setting) {
        setFormData(setting);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar configuração');
    } finally {
      setLoading(false);
    }
  };

  const initializeForm = () => {
    const baseForm = {
      key: '',
      value: '',
      type: 'string' as const,
      category: categoryId || 'general',
      group: groupId || 'basic',
      label: '',
      description: '',
      placeholder: '',
      required: false,
      readonly: false,
      validation: {},
      dependencies: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: auth?.user?.id || ''
    };

    setFormData(baseForm);
  };

  const handleInputChange = (field: keyof SystemSetting, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleValidationChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      validation: {
        ...prev.validation,
        [field]: value
      }
    }));
  };

  const addDependency = () => {
    setFormData(prev => ({
      ...prev,
      dependencies: [
        ...(prev.dependencies || []),
        {
          setting_key: '',
          operator: 'equals',
          value: '',
          action: 'show'
        }
      ]
    }));
  };

  const updateDependency = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies?.map((dep, i) => 
        i === index ? { ...dep, [field]: value } : dep
      ) || []
    }));
  };

  const removeDependency = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies?.filter((_, i) => i !== index) || []
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.key?.trim()) {
      errors.key = 'Chave é obrigatória';
    }

    if (!formData.label?.trim()) {
      errors.label = 'Rótulo é obrigatória';
    }

    if (!formData.type) {
      errors.type = 'Tipo é obrigatório';
    }

    if (!formData.category) {
      errors.category = 'Categoria é obrigatória';
    }

    if (!formData.group) {
      errors.group = 'Grupo é obrigatório';
    }

    // Validate setting key format
    if (formData.key && !/^[a-z_][a-z0-9_]*$/.test(formData.key)) {
      errors.key = 'Chave deve conter apenas letras minúsculas, números e underscores';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let savedSetting: SystemSetting;

      if (mode === 'create') {
        savedSetting = await createSetting(formData as SystemSetting);
      } else {
        savedSetting = await updateSetting(settingId!, formData as SystemSetting);
      }

      if (onSave) {
        onSave(savedSetting);
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar configuração');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!settingId || mode === 'create' || mode === 'bulk') return;

    if (!confirm('Tem certeza que deseja excluir esta configuração?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteSetting(settingId);
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir configuração');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <SettingsForm
            formData={formData}
            onInputChange={handleInputChange}
            validationErrors={validationErrors}
            mode={mode}
          />
        );
      case 'validation':
        return (
          <SettingsValidation
            formData={formData}
            onValidationChange={handleValidationChange}
            mode={mode}
          />
        );
      case 'dependencies':
        return (
          <SettingsDependencies
            formData={formData}
            onAddDependency={addDependency}
            onUpdateDependency={updateDependency}
            onRemoveDependency={removeDependency}
            mode={mode}
          />
        );
      case 'advanced':
        return (
          <SettingsAdvanced
            formData={formData}
            onInputChange={handleInputChange}
            mode={mode}
          />
        );
      default:
        return (
          <SettingsForm
            formData={formData}
            onInputChange={handleInputChange}
            validationErrors={validationErrors}
            mode={mode}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        icon={Settings}
        title="Erro"
        description={error}
        actions={[
          {
            label: "Tentar Novamente",
            onClick: () => setError(null),
            variant: "default",
            icon: Settings
          }
        ]}
      />
    );
  }

  return (
    <PageTransition type="fade" duration={500}>
      <AppLayout
        title={`${mode === 'create' ? 'Criar' : mode === 'edit' ? 'Editar' : mode === 'bulk' ? 'Edição em Lote' : 'Visualizar'} Configuração`}
        subtitle={mode === 'create' ? 'Criar nova configuração' : mode === 'edit' ? 'Modificar configuração existente' : mode === 'bulk' ? 'Editar múltiplas configurações' : 'Detalhes da configuração'}
        showSidebar={true}
        showBreadcrumbs={true}
        breadcrumbs={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Settings', href: '/settings' },
          { name: mode === 'create' ? 'Criar' : mode === 'edit' ? 'Editar' : mode === 'bulk' ? 'Edição em Lote' : 'Visualizar', current: true }
        ]}
        actions={
          <div className="flex items-center gap-3">
            {mode !== 'view' && (
              <Tooltip content="Salvar alterações">
                <Button 
                  onClick={handleSave}
                  disabled={loading}
                  className="backdrop-blur-sm bg-green-500/20 border-green-500/30 hover:bg-green-500/30 text-green-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </Tooltip>
            )}
            
            {mode === 'edit' && (
              <Tooltip content="Excluir configuração">
                <Button 
                  variant="outline"
                  onClick={handleDelete}
                  disabled={loading}
                  className="backdrop-blur-sm bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </Tooltip>
            )}

            <Tooltip content="Pré-visualizar">
              <Button 
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Ocultar Preview' : 'Preview'}
              </Button>
            </Tooltip>

            {onClose && (
              <Tooltip content="Fechar">
                <Button 
                  variant="outline"
                  onClick={onClose}
                  className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
                >
                  <X className="h-4 w-4 mr-2" />
                  Fechar
                </Button>
              </Tooltip>
            )}
          </div>
        }
      >
        <Head title={`${mode === 'create' ? 'Criar' : mode === 'edit' ? 'Editar' : mode === 'bulk' ? 'Edição em Lote' : 'Visualizar'} Configuração - xWin Dash`} />
        
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'basic' ? 'default' : 'outline'}
              onClick={() => setActiveTab('basic')}
              size="sm"
              className="backdrop-blur-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Básico
            </Button>
            <Button
              variant={activeTab === 'validation' ? 'default' : 'outline'}
              onClick={() => setActiveTab('validation')}
              size="sm"
              className="backdrop-blur-sm"
            >
              <Shield className="h-4 w-4 mr-2" />
              Validação
            </Button>
            <Button
              variant={activeTab === 'dependencies' ? 'default' : 'outline'}
              onClick={() => setActiveTab('dependencies')}
              size="sm"
              className="backdrop-blur-sm"
            >
              <Zap className="h-4 w-4 mr-2" />
              Dependências
            </Button>
            <Button
              variant={activeTab === 'advanced' ? 'default' : 'outline'}
              onClick={() => setActiveTab('advanced')}
              size="sm"
              className="backdrop-blur-sm"
            >
              <Wrench className="h-4 w-4 mr-2" />
              Avançado
            </Button>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </AppLayout>
    </PageTransition>
  );
};

export default SettingsCreateEdit;