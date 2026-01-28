import React from 'react';
import Card from '@/components/ui/Card';
const NodePanel = ({ nodes = [], onAdd }) => (
  <Card title="Blocos">
    <div className="p-4 space-y-2">
      {nodes.map((n) => (
        <button key={n.type} className="w-full text-left p-2 rounded border hover:bg-gray-50" onClick={() => onAdd?.(n)}>
          {n.label}
        </button>
      ))}
    </div>
  </Card>
);
export default NodePanel;
