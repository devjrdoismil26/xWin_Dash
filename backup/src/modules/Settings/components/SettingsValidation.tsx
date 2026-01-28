import React from 'react';
import { Card } from "@/components/ui/Card";
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { Shield } from 'lucide-react';
import { SystemSetting } from '../types/settingsTypes';

// =========================================
// INTERFACES
// =========================================

interface SettingsValidationProps {
  formData: Partial<SystemSetting>;
  onValidationChange: (field: string, value: any) => void;
  mode: 'create' | 'edit' | 'view' | 'bulk';
}

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

export const SettingsValidation: React.FC<SettingsValidationProps> = ({
  formData,
  onValidationChange,
  mode
}) => {
  return (
    <Card className="backdrop-blur-xl bg-white/10 border-white/20">
      <Card.Header>
        <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Validação
        </Card.Title>
        <Card.Description className="text-gray-600 dark:text-gray-300">
          Configure as regras de validação para esta configuração
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor Mínimo
            </label>
            <Input
              type="number"
              value={formData.validation?.min || ''}
              onChange={(e) => onValidationChange('min', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Valor mínimo"
              className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor Máximo
            </label>
            <Input
              type="number"
              value={formData.validation?.max || ''}
              onChange={(e) => onValidationChange('max', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Valor máximo"
              className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
              disabled={mode === 'view'}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Padrão (Regex)
          </label>
          <Input
            value={formData.validation?.pattern || ''}
            onChange={(e) => onValidationChange('pattern', e.target.value)}
            placeholder="^[a-zA-Z0-9]+$"
            className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
            disabled={mode === 'view'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Opções (uma por linha)
          </label>
          <Textarea
            value={formData.validation?.options?.join('\n') || ''}
            onChange={(e) => onValidationChange('options', e.target.value.split('\n').filter(opt => opt.trim()))}
            placeholder="opção1&#10;opção2&#10;opção3"
            className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
            disabled={mode === 'view'}
            rows={4}
          />
        </div>
      </Card.Content>
    </Card>
  );
};

export default SettingsValidation;