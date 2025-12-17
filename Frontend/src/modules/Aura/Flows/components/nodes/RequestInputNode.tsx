/**
 * @module RequestInputNode
 * @description Componente de n? para solicitar entrada de dados do usu?rio em fluxos do Aura.
 * 
 * Este componente permite solicitar que o usu?rio forne?a uma entrada de texto durante
 * a execu??o de um fluxo. A entrada do usu?rio pode ser armazenada em vari?veis e usada
 * em n?s subsequentes do fluxo.
 * 
 * @example
 * ```tsx
 * <RequestInputNode
 *   config={ placeholder: "Digite seu nome" } *   onChange={ (newConfig: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';

/**
 * Interface para as propriedades do componente RequestInputNode
 * 
 * @interface RequestInputNodeProps
 * @property {Record<string, any>} [config] - Configura??o do n? de solicita??o de entrada
 * @property {string} [config.placeholder] - Texto placeholder exibido no campo de entrada
 * @property {(config: Record<string, any>) => void} [onChange] - Callback chamado quando a configura??o ? alterada
 */
interface RequestInputNodeProps {
  /** Configura??o do n? de solicita??o de entrada */
config?: {
/** Texto placeholder exibido no campo de entrada para guiar o usu?rio */
placeholder?: string;
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
 * Componente de n? para solicitar entrada de dados do usu?rio
 * 
 * @param {RequestInputNodeProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const RequestInputNode: React.FC<RequestInputNodeProps> = ({ config = {} as any, onChange }) => (
  <Card title="Solicitar Entrada" />
    <div className=" ">$2</div><Input 
        value={ config.placeholder || '' }
        onChange={(e: unknown) => onChange?.({ ...config, placeholder: e.target.value })} 
        placeholder="Placeholder" /></div></Card>);

export default RequestInputNode;
