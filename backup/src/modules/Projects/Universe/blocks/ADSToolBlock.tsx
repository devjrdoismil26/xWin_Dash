import React from 'react';
import { Handle, Position } from 'reactflow';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
const ADSToolBlock = ({ data = {}, isConnectable = true }) => {
  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 universe-node">
      <Handle type="target" position={Position.Left} id="data-in" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} id="data-out" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Top} id="trigger-out" isConnectable={isConnectable} />
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium text-gray-900 dark:text-white">ADS</div>
        <Badge variant="secondary">Marketing</Badge>
      </div>
      <div className="space-y-2">
        <Button size="sm" variant="outline" className="w-full">Criar Campanha</Button>
        <Button size="sm" variant="outline" className="w-full">Otimizar ROAS</Button>
      </div>
    </div>
  );
};
export default ADSToolBlock;
