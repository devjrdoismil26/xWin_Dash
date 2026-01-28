import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
const TransferHumanNode = ({ config = {}, onChange }) => {
  const handleMessageChange = (e) => {
    onChange?.({ ...config, transfer_message: e.target.value });
  };
  return (
    <Card title="Transferir para Humano">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensagem de transferência (opcional)
          </label>
          <Input 
            value={config.transfer_message || ''} 
            onChange={handleMessageChange}
            placeholder="Aguarde, você será transferido para um atendente..."
          />
          <div className="mt-2 text-xs text-gray-500">
            Esta mensagem será enviada antes da transferência
          </div>
        </div>
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-2">⚠️</div>
            <div className="text-sm text-yellow-800">
              <strong>Atenção:</strong> Este nó finaliza o fluxo automatizado e transfere a conversa para atendimento humano.
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default TransferHumanNode;
