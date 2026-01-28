import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
const WebhookNode = ({ config = {}, onChange }) => {
  const handleUrlChange = (e) => {
    onChange?.({ ...config, url: e.target.value });
  };
  const handleMethodChange = (e) => {
    onChange?.({ ...config, method: e.target.value });
  };
  const handleNameChange = (e) => {
    onChange?.({ ...config, webhook_name: e.target.value });
  };
  return (
    <Card title="Webhook">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Webhook
          </label>
          <Input 
            value={config.webhook_name || ''} 
            onChange={handleNameChange}
            placeholder="Ex: Criar Lead, Notificar Sistema..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL do Webhook
          </label>
          <Input 
            type="url"
            value={config.url || ''} 
            onChange={handleUrlChange}
            placeholder="https://api.exemplo.com/webhook"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Método HTTP
          </label>
          <Select
            value={config.method || 'POST'}
            onChange={(value) => onChange?.({ ...config, method: value })}
            options={[
              { value: 'POST', label: 'POST' },
              { value: 'GET', label: 'GET' },
              { value: 'PUT', label: 'PUT' },
              { value: 'PATCH', label: 'PATCH' }
            ]}
          />
        </div>
        <div className="text-xs text-gray-500">
          O webhook receberá dados da conversa e variáveis do fluxo
        </div>
      </div>
    </Card>
  );
};
export default WebhookNode;
