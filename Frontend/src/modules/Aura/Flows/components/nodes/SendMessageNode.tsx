/**
 * @module SendMessageNode
 * @description Componente de n? para enviar mensagens de texto em fluxos do Aura.
 * 
 * Este componente permite enviar mensagens de texto ao usu?rio durante a execu??o de um fluxo.
 * ? o componente mais b?sico e frequentemente usado em fluxos de conversa??o, permitindo
 * comunica??o direta com o usu?rio atrav?s de mensagens personalizadas.
 * 
 * @example
 * ```tsx
 * <SendMessageNode
 *   config={ message: "Ol?! Como posso ajudar?" } *   onChange={ (newConfig: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Textarea from '@/shared/components/ui/Textarea';

/**
 * Interface para as propriedades do componente SendMessageNode
 * 
 * @interface SendMessageNodeProps
 * @property {Record<string, any>} [config] - Configura??o do n? de envio de mensagem
 * @property {string} [config.message] - Texto da mensagem a ser enviada ao usu?rio
 * @property {(config: Record<string, any>) => void} [onChange] - Callback chamado quando a configura??o ? alterada
 */
interface SendMessageNodeProps {
  /** Configura??o do n? de envio de mensagem */
config?: {
/** Texto da mensagem a ser enviada ao usu?rio */
message?: string;
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
 * Componente de n? para enviar mensagens de texto ao usu?rio
 * 
 * @param {SendMessageNodeProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const SendMessageNode: React.FC<SendMessageNodeProps> = ({ config = {} as any, onChange }) => (
  <Card title="Enviar Mensagem" />
    <div className=" ">$2</div><Textarea 
        value={ config.message || '' }
        onChange={(e: unknown) => onChange?.({ ...config, message: e.target.value })} 
        placeholder="Digite sua mensagem..."
        className="min-h-[100px]" />
      {config.message && (
        <div className="{config.message.length} caracteres">$2</div>
    </div>
  )}
    </div>
  </Card>);

export default SendMessageNode;
