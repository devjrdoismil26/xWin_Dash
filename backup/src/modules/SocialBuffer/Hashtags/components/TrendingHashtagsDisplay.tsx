import React from 'react';
import Card from '@/components/ui/Card';
const TrendingHashtagsDisplay = ({ items = [] }) => (
  <Card>
    <Card.Header>
      <Card.Title>Em Alta</Card.Title>
    </Card.Header>
    <Card.Content>
      <div className="flex flex-wrap gap-2 text-sm">
        {items.map((t) => (
          <span key={t} className="px-2 py-1 bg-gray-100 rounded">#{t}</span>
        ))}
        {items.length === 0 && <span className="text-gray-500">Sem dados</span>}
      </div>
    </Card.Content>
  </Card>
);
export default TrendingHashtagsDisplay;
