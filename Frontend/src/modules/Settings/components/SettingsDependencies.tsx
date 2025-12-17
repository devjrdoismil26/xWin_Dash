import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import Select, { SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/Select';
import Button from '@/shared/components/ui/Button';
import { Zap, Plus, Trash2 } from 'lucide-react';
import { SystemSetting } from '../types/settingsTypes';

// =========================================
// INTERFACES
// =========================================

interface SettingsDependenciesProps {
  formData: Partial<SystemSetting>;
  onAddDependency??: (e: any) => void;
  onUpdateDependency?: (e: any) => void;
  onRemoveDependency?: (e: any) => void;
  mode: 'create' | 'edit' | 'view' | 'bulk';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

export const SettingsDependencies: React.FC<SettingsDependenciesProps> = ({ formData,
  onAddDependency,
  onUpdateDependency,
  onRemoveDependency,
  mode
   }) => {
  return (
        <>
      <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
      <Card.Header />
        <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2" />
          <Zap className="h-5 w-5 text-purple-600" />
          Dependências
        </Card.Title>
        <Card.Description className="text-gray-600 dark:text-gray-300" />
          Configure dependências condicionais para esta configuração
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-4" />
        {formData.dependencies?.map((dependency: unknown, index: unknown) => (
          <div key={index} className="p-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/20">
           
        </div><div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
                  Configuração
                </label>
                <Input
                  value={ dependency.setting_key || '' }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onUpdateDependency(index, 'setting_key', e.target.value) }
                  placeholder="setting_key"
                  className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
                  disabled={ mode === 'view' } /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
                  Operador
                </label>
                <Select 
                  value={ dependency.operator || 'equals' }
                  onValueChange={ (value: unknown) => onUpdateDependency(index, 'operator', value) }
                  disabled={ mode === 'view'  }>
                  <SelectTrigger className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30" />
                    <SelectValue placeholder="Operador" / /></SelectTrigger><SelectContent />
                    <SelectItem value="equals">Igual</SelectItem>
                    <SelectItem value="not_equals">Diferente</SelectItem>
                    <SelectItem value="greater_than">Maior que</SelectItem>
                    <SelectItem value="less_than">Menor que</SelectItem>
                    <SelectItem value="contains">Contém</SelectItem>
                    <SelectItem value="not_contains">Não contém</SelectItem>
                    <SelectItem value="in">Em lista</SelectItem>
                    <SelectItem value="not_in">Não em lista</SelectItem></SelectContent></Select></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
                  Valor
                </label>
                <Input
                  value={ dependency.value || '' }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onUpdateDependency(index, 'value', e.target.value) }
                  placeholder="Valor"
                  className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
                  disabled={ mode === 'view' } /></div><div className=" ">$2</div><div className=" ">$2</div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
                    Ação
                  </label>
                  <Select 
                    value={ dependency.action || 'show' }
                    onValueChange={ (value: unknown) => onUpdateDependency(index, 'action', value) }
                    disabled={ mode === 'view'  }>
                    <SelectTrigger className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30" />
                      <SelectValue placeholder="Ação" / /></SelectTrigger><SelectContent />
                      <SelectItem value="show">Mostrar</SelectItem>
                      <SelectItem value="hide">Ocultar</SelectItem>
                      <SelectItem value="enable">Habilitar</SelectItem>
                      <SelectItem value="disable">Desabilitar</SelectItem>
                      <SelectItem value="require">Obrigatório</SelectItem>
                      <SelectItem value="optional">Opcional</SelectItem></SelectContent></Select>
                </div>
                {mode !== 'view' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={ () => onRemoveDependency(index) }
                    className="backdrop-blur-sm bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
    </div>
  ))}
        
        {mode !== 'view' && (
          <Button
            variant="outline"
            onClick={ onAddDependency }
            className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20" />
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Dependência
          </Button>
        )}
      </Card.Content>
    </Card>);};

export default SettingsDependencies;