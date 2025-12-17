import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Button from '@/shared/components/ui/Button';
interface ExternalAISettingsProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const ExternalAISettings = ({ configs = [] as unknown[] }) => { const find = (k: unknown) => configs.find((c: unknown) => c.key === k)?.value;
  const [providerUrl, setProviderUrl] = useState(find('external_ai_url') || '');

  const [apiKey, setApiKey] = useState(find('external_ai_api_key') || '');

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>IA Externa</Card.Title>
      </Card.Header>
      <Card.Content />
        <form className="space-y-3" onSubmit={onSubmit } />
          <div>
           
        </div><InputLabel htmlFor="url">URL do provedor</InputLabel>
            <Input id="url" value={providerUrl} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setProviderUrl(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="apiKey">API Key</InputLabel>
            <Input id="apiKey" type="password" value={apiKey} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value) } /></div><Button type="submit">Salvar</Button></form></Card.Content>
    </Card>);};

export default ExternalAISettings;
