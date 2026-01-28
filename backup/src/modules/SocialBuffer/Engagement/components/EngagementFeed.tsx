import React from 'react';
import Card from '@/components/ui/Card';
const EngagementFeed = ({ items = [] }) => (
  <Card>
    <Card.Header>
      <Card.Title>Feed</Card.Title>
    </Card.Header>
    <Card.Content>
      <ul className="divide-y">
        {items.map((it) => (
          <li key={it.id} className="py-3 text-sm">
            {it.text}
          </li>
        ))}
        {items.length === 0 && <li className="py-6 text-center text-gray-500">Sem itens</li>}
      </ul>
    </Card.Content>
  </Card>
);
export default EngagementFeed;
