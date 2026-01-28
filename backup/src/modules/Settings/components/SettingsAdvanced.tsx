import React from 'react';
import { Card } from "@/components/ui/Card";
import Textarea from '@/components/ui/Textarea';
import { Wrench } from 'lucide-react';
import { SystemSetting } from '../types/settingsTypes';

// =========================================
// INTERFACES
// =========================================

interface SettingsAdvancedProps {
  formData: Partial<SystemSetting>;
  onInputChange: (field: keyof SystemSetting, value: any) => void;
  mode: 'create' | 'edit' | 'view' | 'bulk';
}

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

export const SettingsAdvanced: React.FC<SettingsAdvancedProps> = ({
  formData,
  onInputChange,
  mode
}) => {
  return (
    <Card className="backdrop-blur-xl bg-white/10 border-white/20">
      <Card.Header>
        <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
          <Wrench className="h-5 w-5 text-orange-600" />
          Configurações Avançadas
        </Card.Title>
        <Card.Description className="text-gray-600 dark:text-gray-300">
          Configurações técnicas e avançadas
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Valor Atual
          </label>
          <Textarea
            value={typeof formData.value === 'string' ? formData.value : JSON.stringify(formData.value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                onInputChange('value', parsed);
              } catch {
                onInputChange('value', e.target.value);
              }
            }}
            placeholder="Valor da configuração"
            className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30 font-mono text-sm"
            disabled={mode === 'view'}
            rows={6}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Criado em
            </label>
            <div className="p-3 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20">
              <span className="text-sm text-gray-900 dark:text-white">
                {formData.created_at ? new Date(formData.created_at).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Atualizado em
            </label>
            <div className="p-3 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20">
              <span className="text-sm text-gray-900 dark:text-white">
                {formData.updated_at ? new Date(formData.updated_at).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default SettingsAdvanced;