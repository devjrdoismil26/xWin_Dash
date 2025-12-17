/**
 * @module WebhookNode
 * @description Componente de nó para configurar webhooks em fluxos do Aura.
 * 
 * Este componente permite configurar webhooks que serão disparados durante a execução
 * de um fluxo. Os webhooks podem enviar dados da conversa e variáveis do fluxo para
 * URLs externas usando diferentes métodos HTTP (POST, GET, PUT, PATCH).
 * 
 * @example
 * ```tsx
 * <WebhookNode
 *   config={ 
 *     webhook_name: "Criar Lead",
 *     url: "https://api.exemplo.com/webhook",
 *     method: "POST"
 *   } *   onChange={ (newConfig: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';

/**
 * Tipo para métodos HTTP suportados
 */
type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH';

/**
 * Interface para as propriedades do componente WebhookNode
 * 
 * @interface WebhookNodeProps
 * @property {Record<string, any>} [config] - Configuração do nó de webhook
 * @property {string} [config.webhook_name] - Nome descritivo do webhook
 * @property {string} [config.url] - URL do webhook que receberá os dados
 * @property {HttpMethod} [config.method] - Método HTTP a ser usado (padrão: 'POST')
 * @property {(config: Record<string, any>) => void} [onChange] - Callback chamado quando a configuração é alterada
 */
interface WebhookNodeProps {
  /** Configuração do nó de webhook */
config?: {
/** Nome descritivo do webhook para identificação */
webhook_name?: string;
  /** URL do webhook que receberá os dados da conversa e variáveis do fluxo */
url?: string;
  /** Método HTTP a ser usado na requisição (padrão: 'POST') */
method?: HttpMethod;
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
 * Componente de nó para configurar webhooks no fluxo
 * 
 * @param {WebhookNodeProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const WebhookNode: React.FC<WebhookNodeProps> = ({ config = {} as any, onChange }) => {
  /**
   * Manipula a mudança na URL do webhook
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de mudança do input
   */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({ ...config, url: e.target.value });};

  /**
   * Manipula a mudança no método HTTP
   * 
   * @param {string} value - Novo valor do método HTTP
   */
  const handleMethodChange = (value: string) => {
    onChange?.({ ...config, method: value as HttpMethod });};

  /**
   * Manipula a mudança no nome do webhook
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de mudança do input
   */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({ ...config, webhook_name: e.target.value });};

  return (
        <>
      <Card title="Webhook" />
      <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
            Nome do Webhook
          </label>
          <Input 
            value={ config.webhook_name || '' }
            onChange={ handleNameChange }
            placeholder="Ex: Criar Lead, Notificar Sistema..."
          / /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
            URL do Webhook
          </label>
          <Input 
            type="url"
            value={ config.url || '' }
            onChange={ handleUrlChange }
            placeholder="https://api.exemplo.com/webhook"
          / /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
            Método HTTP
          </label>
          <Select
            value={ config.method || 'POST' }
            onChange={ handleMethodChange }
            options={[
              { value: 'POST', label: 'POST' },
              { value: 'GET', label: 'GET' },
              { value: 'PUT', label: 'PUT' },
              { value: 'PATCH', label: 'PATCH' }
            ]}
          / /></div><div className="O webhook receberá dados da conversa e variáveis do fluxo">$2</div>
        </div>
    </Card>);};

export default WebhookNode;
