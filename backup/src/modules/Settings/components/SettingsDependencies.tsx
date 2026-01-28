import React from 'react';
import { Card } from "@/components/ui/Card";
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import Button from '@/components/ui/Button';
import { Zap, Plus, Trash2 } from 'lucide-react';
import { SystemSetting } from '../types/settingsTypes';

// =========================================
// INTERFACES
// =========================================

interface SettingsDependenciesProps {
  formData: Partial<SystemSetting>;
  onAddDependency: () => void;
  onUpdateDependency: (index: number, field: string, value: any) => void;
  onRemoveDependency: (index: number) => void;
  mode: 'create' | 'edit' | 'view' | 'bulk';
}

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

export const SettingsDependencies: React.FC<SettingsDependenciesProps> = ({
  formData,
  onAddDependency,
  onUpdateDependency,
  onRemoveDependency,
  mode
}) => {
  return (
    <Card className="backdrop-blur-xl bg-white/10 border-white/20">
      <Card.Header>
        <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-600" />
          Dependências
        </Card.Title>
        <Card.Description className="text-gray-600 dark:text-gray-300">
          Configure dependências condicionais para esta configuração
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-4">
        {formData.dependencies?.map((dependency, index) => (
          <div key={index} className="p-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Configuração
                </label>
                <Input
                  value={dependency.setting_key || ''}
                  onChange={(e) => onUpdateDependency(index, 'setting_key', e.target.value)}
                  placeholder="setting_key"
                  className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
                  disabled={mode === 'view'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Operador
                </label>
                <Select 
                  value={dependency.operator || 'equals'} 
                  onValueChange={(value) => onUpdateDependency(index, 'operator', value)}
                  disabled={mode === 'view'}
                >
                  <Select.Trigger className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30">
                    <Select.Value placeholder="Operador" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="equals">Igual</Select.Item>
                    <Select.Item value="not_equals">Diferente</Select.Item>
                    <Select.Item value="greater_than">Maior que</Select.Item>
                    <Select.Item value="less_than">Menor que</Select.Item>
                    <Select.Item value="contains">Contém</Select.Item>
                    <Select.Item value="not_contains">Não contém</Select.Item>
                    <Select.Item value="in">Em lista</Select.Item>
                    <Select.Item value="not_in">Não em lista</Select.Item>
                  </Select.Content>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valor
                </label>
                <Input
                  value={dependency.value || ''}
                  onChange={(e) => onUpdateDependency(index, 'value', e.target.value)}
                  placeholder="Valor"
                  className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
                  disabled={mode === 'view'}
                />
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ação
                  </label>
                  <Select 
                    value={dependency.action || 'show'} 
                    onValueChange={(value) => onUpdateDependency(index, 'action', value)}
                    disabled={mode === 'view'}
                  >
                    <Select.Trigger className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30">
                      <Select.Value placeholder="Ação" />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="show">Mostrar</Select.Item>
                      <Select.Item value="hide">Ocultar</Select.Item>
                      <Select.Item value="enable">Habilitar</Select.Item>
                      <Select.Item value="disable">Desabilitar</Select.Item>
                      <Select.Item value="require">Obrigatório</Select.Item>
                      <Select.Item value="optional">Opcional</Select.Item>
                    </Select.Content>
                  </Select>
                </div>
                {mode !== 'view' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveDependency(index)}
                    className="backdrop-blur-sm bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {mode !== 'view' && (
          <Button
            variant="outline"
            onClick={onAddDependency}
            className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Dependência
          </Button>
        )}
      </Card.Content>
    </Card>
  );
};

export default SettingsDependencies;