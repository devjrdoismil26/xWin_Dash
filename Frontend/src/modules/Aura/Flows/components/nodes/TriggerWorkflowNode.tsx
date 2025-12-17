/**
 * @module TriggerWorkflowNode
 * @description Componente de n? para disparar workflows em fluxos do Aura.
 * 
 * Este componente permite disparar a execu??o de um workflow externo durante a execu??o
 * de um fluxo do Aura. ?til para integrar a??es de workflows mais complexos ou executar
 * processos automatizados em paralelo ou sequencialmente.
 * 
 * @example
 * ```tsx
 * <TriggerWorkflowNode
 *   config={ workflow: "processar-pedido" } *   onChange={ (newConfig: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';

/**
 * Interface para as propriedades do componente TriggerWorkflowNode
 * 
 * @interface TriggerWorkflowNodeProps
 * @property {Record<string, any>} [config] - Configura??o do n? de disparo de workflow
 * @property {string} [config.workflow] - Nome ou ID do workflow a ser disparado
 * @property {(config: Record<string, any>) => void} [onChange] - Callback chamado quando a configura??o ? alterada
 */
interface TriggerWorkflowNodeProps {
  /** Configura??o do n? de disparo de workflow */
config?: {
/** Nome ou ID do workflow a ser disparado */
workflow?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void;
  [key: string]: unknown; };

  /** Callback chamado quando a configura??o ? alterada */
  onChange?: (e: any) => void;
}

/**
 * Componente de n? para disparar workflows
 * 
 * @param {TriggerWorkflowNodeProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const TriggerWorkflowNode: React.FC<TriggerWorkflowNodeProps> = ({ config = {} as any, onChange }) => (
  <Card title="Disparar Workflow" />
    <div className=" ">$2</div><Input 
        value={ config.workflow || '' }
        onChange={(e: unknown) => onChange?.({ ...config, workflow: e.target.value })} 
        placeholder="Nome do workflow" /></div></Card>);

export default TriggerWorkflowNode;
