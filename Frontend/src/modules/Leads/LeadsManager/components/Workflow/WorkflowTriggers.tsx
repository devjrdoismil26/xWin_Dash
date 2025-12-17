import React from 'react';
import Card from '@/shared/components/ui/Card';

interface WorkflowTriggersProps {
  triggers: string[];
  onAdd??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const WorkflowTriggers: React.FC<WorkflowTriggersProps> = ({ triggers, onAdd    }) => {
  return (
        <>
      <Card className="p-4" />
      <h3 className="font-semibold mb-2">Triggers</h3>
      <button onClick={onAdd} className="text-blue-600">+ Add Trigger</button>
    </Card>);};
