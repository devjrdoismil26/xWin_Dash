import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Button from '@/shared/components/ui/Button';
interface WhatsAppSettingsProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const WhatsAppSettings = ({ configs = [] as unknown[] }) => { const find = (k: unknown) => configs.find((c: unknown) => c.key === k)?.value;
  const [phone, setPhone] = useState(find('whatsapp_phone') || '');

  const [apiKey, setApiKey] = useState(find('whatsapp_api_key') || '');

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>WhatsApp Business</Card.Title>
      </Card.Header>
      <Card.Content />
        <form className="space-y-3" onSubmit={onSubmit } />
          <div>
           
        </div><InputLabel htmlFor="phone">Telefone</InputLabel>
            <Input id="phone" value={phone} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="apiKey">API Key</InputLabel>
            <Input id="apiKey" type="password" value={apiKey} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value) } /></div><Button type="submit">Salvar</Button></form></Card.Content>
    </Card>);};

export default WhatsAppSettings;
