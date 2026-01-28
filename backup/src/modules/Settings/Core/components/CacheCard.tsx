import React from 'react';
import Card from '@/components/ui/Card';
export function CacheCard({ cache = {} }) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Cache</Card.Title>
      </Card.Header>
      <Card.Content>
        <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(cache, null, 2)}</pre>
      </Card.Content>
    </Card>
  );
}
export default CacheCard;
