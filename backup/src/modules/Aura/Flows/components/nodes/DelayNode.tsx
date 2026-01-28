import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
const DelayNode = ({ config = {}, onChange }) => {
  const handleDelayChange = (e) => {
    const seconds = parseInt(e.target.value) || 0;
    onChange?.({ ...config, delay_seconds: seconds });
  };
  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };
  return (
    <Card title="Aguardar">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tempo de espera (segundos)
          </label>
          <Input 
            type="number" 
            min="1"
            max="3600"
            value={config.delay_seconds || 5} 
            onChange={handleDelayChange}
            placeholder="5"
          />
          {config.delay_seconds && (
            <div className="mt-2 text-xs text-gray-500">
              Aguardar: {formatTime(config.delay_seconds)}
            </div>
          )}
        </div>
        <div className="text-xs text-gray-400">
          Máximo: 1 hora (3600 segundos)
        </div>
      </div>
    </Card>
  );
};
export default DelayNode;
