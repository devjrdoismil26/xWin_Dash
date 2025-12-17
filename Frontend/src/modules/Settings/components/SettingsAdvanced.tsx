/**
 * Configurações avançadas do sistema
 *
 * @description
 * Componente para gerenciar configurações avançadas e técnicas do sistema.
 * Permite editar configurações JSON, valores complexos e opções avançadas.
 * Suporta diferentes modos de operação.
 *
 * @module modules/Settings/components/SettingsAdvanced
 * @since 1.0.0
 */

import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import Textarea from '@/shared/components/ui/Textarea';
import { Wrench } from 'lucide-react';
import { SystemSetting } from '../types/settingsTypes';

/**
 * Props do componente SettingsAdvanced
 *
 * @interface SettingsAdvancedProps
 * @property {Partial<SystemSetting>} formData - Dados do formulário
 * @property {(field: keyof SystemSetting, value: unknown) => void} onInputChange - Callback quando campo muda
 * @property {'create' | 'edit' | 'view' | 'bulk'} mode - Modo do formulário
 */
interface SettingsAdvancedProps {
  formData: Partial<SystemSetting>;
  onInputChange?: (e: any) => void;
  mode: 'create' | 'edit' | 'view' | 'bulk';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente SettingsAdvanced
 *
 * @description
 * Renderiza painel de configurações avançadas com campos para valores JSON
 * e configurações técnicas. Exibe descrição e suporte a modo somente leitura.
 *
 * @param {SettingsAdvancedProps} props - Props do componente
 * @returns {JSX.Element} Painel de configurações avançadas
 */
export const SettingsAdvanced: React.FC<SettingsAdvancedProps> = ({ formData,
  onInputChange,
  mode
   }) => {
  return (
        <>
      <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
      <Card.Header />
        <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2" />
          <Wrench className="h-5 w-5 text-orange-600" />
          Configurações Avançadas
        </Card.Title>
        <Card.Description className="text-gray-600 dark:text-gray-300" />
          Configurações técnicas e avançadas
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-4" />
        <div>
           
        </div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
            Valor Atual
          </label>
          <Textarea
            value={ typeof formData.value === 'string' ? formData.value : JSON.stringify(formData.value, null, 2) }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              try {
                const parsed = JSON.parse(e.target.value);

                onInputChange('value', parsed);

              } catch {
                onInputChange('value', e.target.value);

              } }
            placeholder="Valor da configuração"
            className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30 font-mono text-sm"
            disabled={ mode === 'view' }
            rows={ 6 } /></div><div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
              Criado em
            </label>
            <div className=" ">$2</div><span className="{formData.created_at ? new Date(formData.created_at).toLocaleString() : 'N/A'}">$2</span>
              </span></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
              Atualizado em
            </label>
            <div className=" ">$2</div><span className="{formData.updated_at ? new Date(formData.updated_at).toLocaleString() : 'N/A'}">$2</span>
              </span></div></div>
      </Card.Content>
    </Card>);};

export default SettingsAdvanced;