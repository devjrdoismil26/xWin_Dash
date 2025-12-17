/**
 * @module ConditionKeywordNode
 * @description Componente de nó para condição baseada em palavra-chave em fluxos do Aura.
 * 
 * Este componente permite configurar uma condição que verifica se uma palavra-chave
 * específica está presente na mensagem do usuário, permitindo criar ramificações
 * condicionais no fluxo baseadas no conteúdo da mensagem.
 * 
 * @example
 * ```tsx
 * <ConditionKeywordNode
 *   config={ keyword: "suporte" } *   onChange={ (newConfig: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';

/**
 * Interface para as propriedades do componente ConditionKeywordNode
 * 
 * @interface ConditionKeywordNodeProps
 * @property {Record<string, any>} [config] - Configuração do nó de condição
 * @property {string} [config.keyword] - Palavra-chave a ser verificada na mensagem
 * @property {(config: Record<string, any>) => void} [onChange] - Callback chamado quando a configuração é alterada
 */
interface ConditionKeywordNodeProps {
  /** Configuração do nó de condição */
config?: {
/** Palavra-chave a ser verificada na mensagem do usuário */
keyword?: string;
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
 * Componente de nó para condição baseada em palavra-chave
 * 
 * @param {ConditionKeywordNodeProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const ConditionKeywordNode: React.FC<ConditionKeywordNodeProps> = ({ config = {} as any, onChange }) => (
  <Card title="Condição por Palavra-chave" />
    <div className=" ">$2</div><Input 
        value={ config.keyword || '' }
        onChange={(e: unknown) => onChange?.({ ...config, keyword: e.target.value })} 
        placeholder="Palavra-chave" /></div></Card>);

export default ConditionKeywordNode;
