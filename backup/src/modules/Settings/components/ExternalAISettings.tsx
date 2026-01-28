import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Button from '@/components/ui/Button';
const ExternalAISettings = ({ configs = [] }) => {
  const find = (k) => configs.find((c) => c.key === k)?.value;
  const [providerUrl, setProviderUrl] = useState(find('external_ai_url') || '');
  const [apiKey, setApiKey] = useState(find('external_ai_api_key') || '');
  return (
    <Card>
      <Card.Header>
        <Card.Title>IA Externa</Card.Title>
      </Card.Header>
      <Card.Content>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div>
            <InputLabel htmlFor="url">URL do provedor</InputLabel>
            <Input id="url" value={providerUrl} onChange={(e) => setProviderUrl(e.target.value)} />
          </div>
          <div>
            <InputLabel htmlFor="apiKey">API Key</InputLabel>
            <Input id="apiKey" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
          </div>
          <Button type="submit">Salvar</Button>
        </form>
      </Card.Content>
    </Card>
  );
};
export default ExternalAISettings;
