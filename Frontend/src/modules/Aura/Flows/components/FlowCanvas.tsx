import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const FlowCanvas: React.FC<{ nodes: string[]; selectedNode: unknown; onSelectNode?: (e: any) => void }> = ({ nodes, selectedNode, onSelectNode }) => (
  <Card className="h-full backdrop-blur-xl bg-white/10 border-white/20" />
    <Card.Content className="p-4 h-full flex items-center justify-center text-gray-400" />
      Canvas do Flow ({nodes.length} nós)
    </Card.Content>
  </Card>);
