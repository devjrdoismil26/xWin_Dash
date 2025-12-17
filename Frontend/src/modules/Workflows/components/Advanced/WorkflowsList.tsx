import React from 'react';
import Card from '@/shared/components/ui/Card';

interface WorkflowsListProps {
  workflows: string[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const WorkflowsList: React.FC<WorkflowsListProps> = ({ workflows    }) => {
  return (
        <>
      <Card className="p-4" />
      <h3 className="font-semibold mb-4">Workflows</h3>
      <div className="{workflows.length === 0 && ">$2</div><p className="text-gray-500">Nenhum workflow</p>}
      </div>
    </Card>);};
