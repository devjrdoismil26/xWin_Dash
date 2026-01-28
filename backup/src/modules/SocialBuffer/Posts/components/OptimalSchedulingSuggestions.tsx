import React from 'react';
import Card from '@/components/ui/Card';
const OptimalSchedulingSuggestions = ({ suggestions = [] }) => (
  <Card>
    <Card.Header>
      <Card.Title>Melhores horários</Card.Title>
    </Card.Header>
    <Card.Content>
      <ul className="list-disc pl-5 text-sm">
        {suggestions.map((s, i) => (<li key={i}>{s}</li>))}
        {suggestions.length === 0 && <li className="list-none text-gray-500">Sem sugestões</li>}
      </ul>
    </Card.Content>
  </Card>
);
export default OptimalSchedulingSuggestions;
