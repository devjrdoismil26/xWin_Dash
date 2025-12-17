/**
 * @module LoopNode
 * @description Componente de nó para criar loops/repetições em fluxos do Aura.
 * 
 * Este componente permite executar uma sequência de nós múltiplas vezes dentro de um fluxo.
 * Útil para processar listas, tentar novamente em caso de falha, ou executar ações
 * repetitivas automaticamente.
 * 
 * @example
 * ```tsx
 * <LoopNode
 *   config={ times: 3 } *   onChange={ (newConfig: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';

/**
 * Interface para as propriedades do componente LoopNode
 * 
 * @interface LoopNodeProps
 * @property {Record<string, any>} [config] - Configuração do nó de loop
 * @property {number} [config.times] - Número de vezes que o loop deve ser executado
 * @property {(config: Record<string, any>) => void} [onChange] - Callback chamado quando a configuração é alterada
 */
interface LoopNodeProps {
  /** Configuração do nó de loop */
config?: {
/** Número de vezes que o loop deve ser executado (padrão: 0) */
times?: number;
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
 * Componente de nó para criar loops/repetições no fluxo
 * 
 * @param {LoopNodeProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const LoopNode: React.FC<LoopNodeProps> = ({ config = {} as any, onChange }) => (
  <Card title="Repetição" />
    <div className=" ">$2</div><Input 
        type="number" 
        value={ config.times || 0 }
        onChange={(e: unknown) => onChange?.({ ...config, times: parseInt(e.target.value) || 0 })} 
        placeholder="Número de vezes" /></div></Card>);

export default LoopNode;
