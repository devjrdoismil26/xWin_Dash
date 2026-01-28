import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
const AISettings: React.FC<{ auth?: any; geminiIntegration?: { api_key?: string; status?: string } }> = ({ auth, geminiIntegration }) => {
  const [apiKey, setApiKey] = useState(geminiIntegration?.api_key || '');
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState(geminiIntegration?.status || 'Não Verificado');
  const handleSaveApiKey = (e: any) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStatus('Válido');
    }, 500);
  };
  const handleVerifyApiKey = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStatus(apiKey ? 'Válido' : 'Inválido');
    }, 500);
  };
  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Configurações de IA" />
      <Card className="max-w-2xl mx-auto">
        <Card.Content className="p-6">
          <h3 className="text-lg font-semibold mb-4">Google Gemini</h3>
          <form onSubmit={handleSaveApiKey} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="text-sm font-medium">API Key</label>
              <Input id="apiKey" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Sua chave de API do Google Gemini" className="mt-1" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={processing}>{processing ? 'Salvando...' : 'Salvar Chave'}</Button>
              <Button type="button" variant="outline" onClick={handleVerifyApiKey} disabled={processing}>{processing ? 'Verificando...' : 'Verificar Conexão'}</Button>
            </div>
          </form>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Status da Conexão:</h4>
            <p className={`text-sm ${status === 'Válido' ? 'text-green-600' : status === 'Inválido' ? 'text-red-600' : ''}`}>{status}</p>
          </div>
        </Card.Content>
      </Card>
    </AuthenticatedLayout>
  );
};
export default AISettings;
