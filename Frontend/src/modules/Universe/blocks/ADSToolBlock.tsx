import React from 'react';
import { Handle, Position } from 'reactflow';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
const ADSToolBlock = ({ data = {} as any, isConnectable = true }) => {
  return (
            <div className=" ">$2</div><Handle type="target" position={Position.Left} id="data-in" isConnectable={isConnectable} / />
      <Handle type="source" position={Position.Right} id="data-out" isConnectable={isConnectable} / />
      <Handle type="source" position={Position.Top} id="trigger-out" isConnectable={isConnectable} / />
      <div className=" ">$2</div><div className="font-medium text-gray-900 dark:text-white">ADS</div>
        <Badge variant="secondary">Marketing</Badge></div><div className=" ">$2</div><Button size="sm" variant="outline" className="w-full">Criar Campanha</Button>
        <Button size="sm" variant="outline" className="w-full">Otimizar ROAS</Button>
      </div>);};

export default ADSToolBlock;
