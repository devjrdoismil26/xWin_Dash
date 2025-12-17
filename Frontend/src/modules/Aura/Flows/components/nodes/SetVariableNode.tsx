/**
 * @module SetVariableNode
 * @description Componente de nó para definir variáveis em fluxos do Aura.
 * 
 * Este componente permite criar ou atualizar variáveis durante a execução de um fluxo.
 * As variáveis podem armazenar dados do usuário, resultados de consultas, ou qualquer
 * informação que precise ser reutilizada em nós subsequentes do fluxo.
 * 
 * @example
 * ```tsx
 * <SetVariableNode
 *   config={ key: "user_name", value: "João" } *   onChange={ (newConfig: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';

/**
 * Interface para as propriedades do componente SetVariableNode
 * 
 * @interface SetVariableNodeProps
 * @property {Record<string, any>} [config] - Configuração do nó de definição de variável
 * @property {string} [config.key] - Nome/chave da variável a ser definida
 * @property {string} [config.value] - Valor a ser atribuído à variável
 * @property {(config: Record<string, any>) => void} [onChange] - Callback chamado quando a configuração é alterada
 */
interface SetVariableNodeProps {
  /** Configuração do nó de definição de variável */
config?: {
/** Nome/chave da variável a ser definida ou atualizada */
key?: string;
  /** Valor a ser atribuído à variável */
value?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void;
  [key: string]: unknown; };

  /** Callback chamado quando a configuração é alterada */
  onChange?: (e: any) => void;
}

/**
 * Componente de nó para definir variáveis no fluxo
 * 
 * @param {SetVariableNodeProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const SetVariableNode: React.FC<SetVariableNodeProps> = ({ config = {} as any, onChange }) => (
  <Card title="Definir Variável" />
    <div className=" ">$2</div><Input 
        value={ config.key || '' }
        onChange={(e: unknown) => onChange?.({ ...config, key: e.target.value })} 
        placeholder="Chave" />
      <Input 
        value={ config.value || '' }
        onChange={(e: unknown) => onChange?.({ ...config, value: e.target.value })} 
        placeholder="Valor" /></div></Card>);

export default SetVariableNode;
