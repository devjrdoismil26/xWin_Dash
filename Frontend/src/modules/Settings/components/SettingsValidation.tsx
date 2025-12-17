/**
 * Validação de configurações do sistema
 *
 * @description
 * Componente para configurar regras de validação para configurações do sistema.
 * Permite definir valores mínimos, máximos, padrões e mensagens de erro customizadas.
 *
 * @module modules/Settings/components/SettingsValidation
 * @since 1.0.0
 */

import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import Textarea from '@/shared/components/ui/Textarea';
import { Shield } from 'lucide-react';
import { SystemSetting } from '../types/settingsTypes';

/**
 * Props do componente SettingsValidation
 *
 * @interface SettingsValidationProps
 * @property {Partial<SystemSetting>} formData - Dados do formulário
 * @property {(field: string, value: unknown) => void} onValidationChange - Callback quando validação muda
 * @property {'create' | 'edit' | 'view' | 'bulk'} mode - Modo do formulário
 */
interface SettingsValidationProps {
  formData: Partial<SystemSetting>;
  onValidationChange?: (e: any) => void;
  mode: 'create' | 'edit' | 'view' | 'bulk';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente SettingsValidation
 *
 * @description
 * Renderiza painel de configuração de validação com campos para min, max,
 * padrão e mensagens de erro. Suporta modo somente leitura.
 *
 * @param {SettingsValidationProps} props - Props do componente
 * @returns {JSX.Element} Painel de validação
 */
export const SettingsValidation: React.FC<SettingsValidationProps> = ({ formData,
  onValidationChange,
  mode
   }) => {
  return (
        <>
      <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
      <Card.Header />
        <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2" />
          <Shield className="h-5 w-5 text-green-600" />
          Validação
        </Card.Title>
        <Card.Description className="text-gray-600 dark:text-gray-300" />
          Configure as regras de validação para esta configuração
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-4" />
        <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
              Valor Mínimo
            </label>
            <Input
              type="number"
              value={ formData.validation?.min || '' }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onValidationChange('min', e.target.value ? Number(e.target.value) : undefined) }
              placeholder="Valor mínimo"
              className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
              disabled={ mode === 'view' } /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
              Valor Máximo
            </label>
            <Input
              type="number"
              value={ formData.validation?.max || '' }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onValidationChange('max', e.target.value ? Number(e.target.value) : undefined) }
              placeholder="Valor máximo"
              className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
              disabled={ mode === 'view' } /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
            Padrão (Regex)
          </label>
          <Input
            value={ formData.validation?.pattern || '' }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onValidationChange('pattern', e.target.value) }
            placeholder="^[a-zA-Z0-9]+$"
            className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
            disabled={ mode === 'view' } /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
            Opções (uma por linha)
          </label>
          <Textarea
            value={ formData.validation?.options?.join('\n') || '' }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onValidationChange('options', e.target.value.split('\n').filter(opt => opt.trim())) }
            placeholder="opção1&#10;opção2&#10;opção3"
            className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
            disabled={ mode === 'view' }
            rows={ 4 } /></div></Card.Content>
    </Card>);};

export default SettingsValidation;