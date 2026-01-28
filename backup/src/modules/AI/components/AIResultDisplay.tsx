import React from 'react';
import { Card } from "@/components/ui/Card"
const AIResultDisplay = ({ result }) => {
  if (!result) {
    return (
      <Card>
        <Card.Content className="p-6 text-sm text-gray-500">Nenhum resultado disponível</Card.Content>
      </Card>
    );
  }
  return (
    <Card>
      <Card.Header>
        <Card.Title>Resultado</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 space-y-3">
        {result.imageUrl && (
          <img src={result.imageUrl} alt="AI Generated" className="max-w-full rounded" />
        )}
        {result.text && (
          <div className="whitespace-pre-wrap text-sm">{result.text}</div>
        )}
        <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
      </Card.Content>
    </Card>
  );
};
export default AIResultDisplay;
