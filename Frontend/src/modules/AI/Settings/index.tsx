import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
interface AISettingsProps {
  auth?: Record<string, any>;
  geminiIntegration?: { api_key?: string;
  status?: string
children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

}

const AISettings: React.FC<AISettingsProps> = ({ auth, geminiIntegration    }) => {
  const [apiKey, setApiKey] = useState(geminiIntegration?.api_key || '');

  const [processing, setProcessing] = useState(false);

  const [status, setStatus] = useState(geminiIntegration?.status || 'Não Verificado');

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();

    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);

      setStatus('Válido');

    }, 500);};

  const handleVerifyApiKey = () => {
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);

      setStatus(apiKey ? 'Válido' : 'Inválido');

    }, 500);};

  return (
        <>
      <AuthenticatedLayout user={ auth?.user } />
      <Head title="Configurações de IA" / />
      <Card className="max-w-2xl mx-auto" />
        <Card.Content className="p-6" />
          <h3 className="text-lg font-semibold mb-4">Google Gemini</h3>
          <form onSubmit={handleSaveApiKey} className="space-y-4" />
            <div>
           
        </div><label htmlFor="apiKey" className="text-sm font-medium">API Key</label>
              <Input id="apiKey" type="password" value={apiKey} onChange={(e: unknown) => setApiKey(e.target.value)} placeholder="Sua chave de API do Google Gemini" className="mt-1" /></div><div className=" ">$2</div><Button type="submit" disabled={ processing }>{processing ? 'Salvando...' : 'Salvar Chave'}</Button>
              <Button type="button" variant="outline" onClick={handleVerifyApiKey} disabled={ processing }>{processing ? 'Verificando...' : 'Verificar Conexão'}</Button></div></form>
          <div className=" ">$2</div><h4 className="font-medium mb-2">Status da Conexão:</h4>
            <p className={`text-sm ${status === 'Válido' ? 'text-green-600' : status === 'Inválido' ? 'text-red-600' : ''} `}>{status}</p></div></Card.Content></Card></AuthenticatedLayout>);};

export default AISettings;
