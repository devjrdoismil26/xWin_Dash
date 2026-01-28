import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Button from '@/components/ui/Button';
const WhatsAppSettings = ({ configs = [] }) => {
  const find = (k) => configs.find((c) => c.key === k)?.value;
  const [phone, setPhone] = useState(find('whatsapp_phone') || '');
  const [apiKey, setApiKey] = useState(find('whatsapp_api_key') || '');
  return (
    <Card>
      <Card.Header>
        <Card.Title>WhatsApp Business</Card.Title>
      </Card.Header>
      <Card.Content>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div>
            <InputLabel htmlFor="phone">Telefone</InputLabel>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
export default WhatsAppSettings;
