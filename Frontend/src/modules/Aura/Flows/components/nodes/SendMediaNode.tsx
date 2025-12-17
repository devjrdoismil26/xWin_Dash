/**
 * @module SendMediaNode
 * @description Componente de nó para enviar mídia (imagens, vídeos, documentos) em fluxos do Aura.
 * 
 * Este componente permite enviar arquivos de mídia ao usuário durante a execução de um fluxo.
 * Suporta diferentes tipos de mídia através de URLs (imagens, vídeos, áudios, documentos).
 * 
 * @example
 * ```tsx
 * <SendMediaNode
 *   config={ url: "https://example.com/image.jpg" } *   onChange={ (newConfig: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';

/**
 * Interface para as propriedades do componente SendMediaNode
 * 
 * @interface SendMediaNodeProps
 * @property {Record<string, any>} [config] - Configuração do nó de envio de mídia
 * @property {string} [config.url] - URL da mídia a ser enviada (imagem, vídeo, áudio ou documento)
 * @property {(config: Record<string, any>) => void} [onChange] - Callback chamado quando a configuração é alterada
 */
interface SendMediaNodeProps {
  /** Configuração do nó de envio de mídia */
config?: {
/** URL da mídia a ser enviada (imagem, vídeo, áudio ou documento) */
url?: string;
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
 * Componente de nó para enviar mídia ao usuário
 * 
 * @param {SendMediaNodeProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const SendMediaNode: React.FC<SendMediaNodeProps> = ({ config = {} as any, onChange }) => (
  <Card title="Enviar Mídia" />
    <div className=" ">$2</div><Input 
        value={ config.url || '' }
        onChange={(e: unknown) => onChange?.({ ...config, url: e.target.value })} 
        placeholder="URL da mídia" /></div></Card>);

export default SendMediaNode;
