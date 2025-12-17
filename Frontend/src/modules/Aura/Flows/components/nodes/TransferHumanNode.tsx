/**
 * @module TransferHumanNode
 * @description Componente de nó para transferir conversa para atendimento humano no Aura.
 * 
 * Este componente permite transferir a conversa de um fluxo automatizado para um atendente
 * humano. Quando o fluxo atinge este nó, a conversa é marcada para transferência e o usuário
 * é notificado através de uma mensagem opcional antes da transferência ser efetivada.
 * 
 * @example
 * ```tsx
 * <TransferHumanNode
 *   config={ transfer_message: "Aguarde, você será transferido para um atendente..." } *   onChange={ (newConfig: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';

/**
 * Interface para as propriedades do componente TransferHumanNode
 * 
 * @interface TransferHumanNodeProps
 * @property {Record<string, any>} [config] - Configuração do nó de transferência
 * @property {string} [config.transfer_message] - Mensagem opcional a ser enviada antes da transferência
 * @property {(config: Record<string, any>) => void} [onChange] - Callback chamado quando a configuração é alterada
 */
interface TransferHumanNodeProps {
  /** Configuração do nó de transferência para atendimento humano */
config?: {
/** Mensagem opcional a ser enviada ao usuário antes da transferência para atendente humano */
transfer_message?: string;
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
 * Componente de nó para transferir conversa para atendimento humano
 * 
 * @param {TransferHumanNodeProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const TransferHumanNode: React.FC<TransferHumanNodeProps> = ({ config = {} as any, onChange }) => {
  /**
   * Manipula a mudança na mensagem de transferência
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de mudança do input
   */
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({ ...config, transfer_message: e.target.value });};

  return (
        <>
      <Card title="Transferir para Humano" />
      <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
            Mensagem de transferência (opcional)
          </label>
          <Input 
            value={ config.transfer_message || '' }
            onChange={ handleMessageChange }
            placeholder="Aguarde, você será transferido para um atendente..."
          / />
          <div className="Esta mensagem será enviada antes da transferência">$2</div>
          </div>
        <div className=" ">$2</div><div className=" ">$2</div><div className="text-yellow-600 mr-2">⚠️</div>
            <div className=" ">$2</div><strong>Atenção:</strong> Este nó finaliza o fluxo automatizado e transfere a conversa para atendimento humano.
            </div></div></Card>);};

export default TransferHumanNode;
