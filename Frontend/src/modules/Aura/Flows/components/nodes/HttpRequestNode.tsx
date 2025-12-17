/**
 * @module HttpRequestNode
 * @description Componente de nó para execução de requisições HTTP em fluxos do Aura.
 * 
 * Este componente permite fazer requisições HTTP (GET, POST, PUT, DELETE, etc.) para
 * APIs externas durante a execução de um fluxo. Útil para integrar com serviços externos,
 * buscar dados de APIs, ou enviar informações para sistemas externos.
 * 
 * @example
 * ```tsx
 * <HttpRequestNode
 *   config={ 
 *     url: "https://api.example.com/data",
 *     body: '{"key": "value"}'
 *   } *   onChange={ (newConfig: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import Textarea from '@/shared/components/ui/Textarea';

/**
 * Interface para as propriedades do componente HttpRequestNode
 * 
 * @interface HttpRequestNodeProps
 * @property {Record<string, any>} [config] - Configuração do nó de requisição HTTP
 * @property {string} [config.url] - URL da requisição HTTP
 * @property {string} [config.body] - Corpo da requisição em formato JSON (para POST, PUT, etc.)
 * @property {(config: Record<string, any>) => void} [onChange] - Callback chamado quando a configuração é alterada
 */
interface HttpRequestNodeProps {
  /** Configuração do nó de requisição HTTP */
config?: {
/** URL da requisição HTTP a ser executada */
url?: string;
  /** Corpo da requisição em formato JSON (usado principalmente para POST, PUT, PATCH) */
body?: string;
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
 * Componente de nó para execução de requisições HTTP
 * 
 * @param {HttpRequestNodeProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const HttpRequestNode: React.FC<HttpRequestNodeProps> = ({ config = {} as any, onChange }) => (
  <Card title="Requisição HTTP" />
    <div className=" ">$2</div><Input 
        value={ config.url || '' }
        onChange={(e: unknown) => onChange?.({ ...config, url: e.target.value })} 
        placeholder="URL" />
      <Textarea 
        value={ config.body || '' }
        onChange={(e: unknown) => onChange?.({ ...config, body: e.target.value })} 
        placeholder="Corpo (JSON)" /></div></Card>);

export default HttpRequestNode;
