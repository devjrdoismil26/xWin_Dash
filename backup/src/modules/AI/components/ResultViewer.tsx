import React from 'react';
import Card from '@/components/ui/Card';
const ResultViewer = ({ item }) => {
  if (!item) {
    return (
      <Card>
        <Card.Content className="p-6 text-gray-500">Nada para mostrar</Card.Content>
      </Card>
    );
  }
  return (
    <Card>
      <Card.Header>
        <Card.Title>Detalhes</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 space-y-3">
        {item.type === 'image' && <img src={item.url} alt="result" className="max-w-full rounded" />}
        {item.type === 'text' && <pre className="text-sm whitespace-pre-wrap">{item.text}</pre>}
        <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">{JSON.stringify(item, null, 2)}</pre>
      </Card.Content>
    </Card>
  );
};
export default ResultViewer;
