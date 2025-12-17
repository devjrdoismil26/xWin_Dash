import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { MessageSquare, Clock, Filter } from 'lucide-react';

const nodeTypes = [
  { type: 'message', label: 'Mensagem', icon: MessageSquare },
  { type: 'delay', label: 'Delay', icon: Clock },
  { type: 'condition', label: 'Condição', icon: Filter }
];

export const FlowNodePalette: React.FC<{ onAddNode?: (e: any) => void }> = ({ onAddNode }) => (
  <div className="{nodeTypes.map(({ type, label, icon: Icon }) => (">$2</div>
      <Button key={type} onClick={() => onAddNode({ id: Date.now(), type })} variant="outline" className="w-full justify-start">
        <Icon className="h-4 w-4 mr-2" />{label}
      </Button>
    ))}
  </div>);
