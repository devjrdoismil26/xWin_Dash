/**
 * @module GoToFlow
 * @description Componente de n? para redirecionamento para outro fluxo no Aura.
 * 
 * Este componente permite que um fluxo seja redirecionado para outro fluxo durante
 * a execu??o, criando uma estrutura de fluxos interconectados. ?til para modularizar
 * fluxos complexos em sub-fluxos menores e reutiliz?veis.
 * 
 * @example
 * ```tsx
 * <GoToFlow
 *   config={ flowId: "flow-123" } *   onChange={ (newConfig: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';

/**
 * Interface para as propriedades do componente GoToFlow
 * 
 * @interface GoToFlowProps
 * @property {Record<string, any>} [config] - Configura??o do n? de redirecionamento
 * @property {string} [config.flowId] - ID do fluxo destino para onde redirecionar
 * @property {(config: Record<string, any>) => void} [onChange] - Callback chamado quando a configura??o ? alterada
 */
interface GoToFlowProps {
  /** Configura??o do n? de redirecionamento */
config?: {
/** ID do fluxo destino para onde redirecionar a execu??o */
flowId?: string;
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
 * Componente de n? para redirecionamento para outro fluxo
 * 
 * @param {GoToFlowProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const GoToFlow: React.FC<GoToFlowProps> = ({ config = {} as any, onChange }) => (
  <Card title="Ir para Fluxo" />
    <div className=" ">$2</div><Input 
        value={ config.flowId || '' }
        onChange={(e: unknown) => onChange?.({ ...config, flowId: e.target.value })} 
        placeholder="ID do fluxo" /></div></Card>);

export default GoToFlow;
