import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { 
  Settings, 
  Shield, 
  Zap, 
  Wrench,
  Calendar,
  Clock
} from 'lucide-react';
import { 
  SystemSetting, 
  SettingType,
  SettingCategory as SettingCategoryType,
  SettingGroup as SettingGroupType
} from '../types/settingsTypes';

// =========================================
// INTERFACES
// =========================================

interface SettingsFormProps {
  formData: Partial<SystemSetting>;
  onInputChange: (field: keyof SystemSetting, value: any) => void;
  validationErrors: Record<string, string>;
  mode: 'create' | 'edit' | 'view' | 'bulk';
}

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

export const SettingsForm: React.FC<SettingsFormProps> = ({
  formData,
  onInputChange,
  validationErrors,
  mode
}) => {
  const settingTypes: { value: SettingType; label: string; icon: any }[] = [
    { value: 'string', label: 'Texto', icon: Settings },
    { value: 'number', label: 'Número', icon: Settings },
    { value: 'boolean', label: 'Verdadeiro/Falso', icon: Settings },
    { value: 'json', label: 'JSON', icon: Settings },
    { value: 'array', label: 'Lista', icon: Settings },
    { value: 'object', label: 'Objeto', icon: Settings },
    { value: 'file', label: 'Arquivo', icon: Settings },
    { value: 'select', label: 'Seleção', icon: Settings },
    { value: 'multiselect', label: 'Múltipla Seleção', icon: Settings },
    { value: 'radio', label: 'Radio', icon: Settings },
    { value: 'checkbox', label: 'Checkbox', icon: Settings },
    { value: 'textarea', label: 'Área de Texto', icon: Settings },
    { value: 'password', label: 'Senha', icon: Shield },
    { value: 'email', label: 'Email', icon: Settings },
    { value: 'url', label: 'URL', icon: Settings },
    { value: 'date', label: 'Data', icon: Calendar },
    { value: 'time', label: 'Hora', icon: Clock },
    { value: 'datetime', label: 'Data e Hora', icon: Calendar }
  ];

  const settingCategories: { value: SettingCategoryType; label: string; icon: any; color: string }[] = [
    { value: 'general', label: 'Geral', icon: Settings, color: 'blue' },
    { value: 'auth', label: 'Autenticação', icon: Shield, color: 'red' },
    { value: 'users', label: 'Usuários', icon: Settings, color: 'green' },
    { value: 'database', label: 'Banco de Dados', icon: Settings, color: 'purple' },
    { value: 'email', label: 'Email', icon: Settings, color: 'orange' },
    { value: 'integrations', label: 'Integrações', icon: Zap, color: 'yellow' },
    { value: 'ai', label: 'IA', icon: Settings, color: 'indigo' },
    { value: 'api', label: 'API', icon: Settings, color: 'gray' },
    { value: 'security', label: 'Segurança', icon: Shield, color: 'red' },
    { value: 'cache', label: 'Cache', icon: Settings, color: 'blue' },
    { value: 'logs', label: 'Logs', icon: Settings, color: 'gray' },
    { value: 'notifications', label: 'Notificações', icon: Settings, color: 'green' },
    { value: 'storage', label: 'Armazenamento', icon: Settings, color: 'purple' },
    { value: 'performance', label: 'Performance', icon: Settings, color: 'orange' }
  ];

  const settingGroups: { value: SettingGroupType; label: string; icon: any }[] = [
    { value: 'basic', label: 'Básico', icon: Settings },
    { value: 'advanced', label: 'Avançado', icon: Wrench },
    { value: 'security', label: 'Segurança', icon: Shield },
    { value: 'performance', label: 'Performance', icon: Settings },
    { value: 'integrations', label: 'Integrações', icon: Zap },
    { value: 'notifications', label: 'Notificações', icon: Settings },
    { value: 'backup', label: 'Backup', icon: Settings },
    { value: 'monitoring', label: 'Monitoramento', icon: Settings }
  ];

  return (
    <Card className="backdrop-blur-xl bg-white/10 border-white/20">
      <Card.Header>
        <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          Informações Básicas
        </Card.Title>
        <Card.Description className="text-gray-600 dark:text-gray-300">
          Configure as informações principais da configuração
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chave *
            </label>
            <Input
              value={formData.key || ''}
              onChange={(e) => onInputChange('key', e.target.value)}
              placeholder="ex: site_name"
              className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
              disabled={mode === 'view' || mode === 'edit'}
            />
            {validationErrors.key && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.key}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo *
            </label>
            <Select 
              value={formData.type || 'string'} 
              onValueChange={(value) => onInputChange('type', value)}
              disabled={mode === 'view'}
            >
              <Select.Trigger className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30">
                <Select.Value placeholder="Selecione o tipo" />
              </Select.Trigger>
              <Select.Content>
                {settingTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <Select.Item key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span>{type.label}</span>
                      </div>
                    </Select.Item>
                  );
                })}
              </Select.Content>
            </Select>
            {validationErrors.type && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.type}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rótulo *
          </label>
          <Input
            value={formData.label || ''}
            onChange={(e) => onInputChange('label', e.target.value)}
            placeholder="Nome exibido da configuração"
            className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
            disabled={mode === 'view'}
          />
          {validationErrors.label && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.label}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descrição
          </label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder="Descrição da configuração"
            className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
            disabled={mode === 'view'}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Placeholder
          </label>
          <Input
            value={formData.placeholder || ''}
            onChange={(e) => onInputChange('placeholder', e.target.value)}
            placeholder="Texto de exemplo"
            className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
            disabled={mode === 'view'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria *
            </label>
            <Select 
              value={formData.category || 'general'} 
              onValueChange={(value) => onInputChange('category', value)}
              disabled={mode === 'view'}
            >
              <Select.Trigger className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30">
                <Select.Value placeholder="Selecione a categoria" />
              </Select.Trigger>
              <Select.Content>
                {settingCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Select.Item key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span>{category.label}</span>
                      </div>
                    </Select.Item>
                  );
                })}
              </Select.Content>
            </Select>
            {validationErrors.category && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Grupo *
            </label>
            <Select 
              value={formData.group || 'basic'} 
              onValueChange={(value) => onInputChange('group', value)}
              disabled={mode === 'view'}
            >
              <Select.Trigger className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30">
                <Select.Value placeholder="Selecione o grupo" />
              </Select.Trigger>
              <Select.Content>
                {settingGroups.map((group) => {
                  const IconComponent = group.icon;
                  return (
                    <Select.Item key={group.value} value={group.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span>{group.label}</span>
                      </div>
                    </Select.Item>
                  );
                })}
              </Select.Content>
            </Select>
            {validationErrors.group && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.group}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.required || false}
                onChange={(e) => onInputChange('required', e.target.checked)}
                disabled={mode === 'view'}
                className="rounded border-white/30 bg-white/10"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Obrigatório
              </span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.readonly || false}
                onChange={(e) => onInputChange('readonly', e.target.checked)}
                disabled={mode === 'view'}
                className="rounded border-white/30 bg-white/10"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Somente leitura
              </span>
            </label>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default SettingsForm;