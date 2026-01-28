import React from 'react';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';
const SendMessageNode = ({ config = {}, onChange }) => (
  <Card title="Enviar Mensagem">
    <div className="space-y-3">
      <Textarea 
        value={config.message || ''} 
        onChange={(e) => onChange?.({ ...config, message: e.target.value })} 
        placeholder="Digite sua mensagem..."
        className="min-h-[100px]"
      />
      {config.message && (
        <div className="text-xs text-gray-500">
          {config.message.length} caracteres
        </div>
      )}
    </div>
  </Card>
);
export default SendMessageNode;
