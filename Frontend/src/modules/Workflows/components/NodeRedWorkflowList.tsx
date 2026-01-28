import React from 'react';
import Card from '@/components/ui/Card';
const NodeRedWorkflowList = ({ items = [] }) => (
  <Card>
    <Card.Header>
      <Card.Title>Workflows Node-RED</Card.Title>
    </Card.Header>
    <Card.Content>
      <ul className="divide-y text-sm">
        {items.map((i) => (<li key={i.id} className="py-2">{i.name}</li>))}
        {items.length === 0 && <li className="py-6 text-center text-gray-500">Sem itens</li>}
      </ul>
    </Card.Content>
  </Card>
);
export default NodeRedWorkflowList;
