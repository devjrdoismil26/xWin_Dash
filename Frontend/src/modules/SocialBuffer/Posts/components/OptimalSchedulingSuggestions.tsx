import React from 'react';
import Card from '@/shared/components/ui/Card';
interface OptimalSchedulingSuggestionsProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const OptimalSchedulingSuggestions = ({ suggestions = [] as unknown[] }) => (
  <Card />
    <Card.Header />
      <Card.Title>Melhores horários</Card.Title>
    </Card.Header>
    <Card.Content />
      <ul className="list-disc pl-5 text-sm" />
        {(suggestions || []).map((s: unknown, i: unknown) => (<li key={ i }>{s}</li>))}
        {suggestions.length === 0 && <li className="list-none text-gray-500">Sem sugestões</li>}
      </ul>
    </Card.Content>
  </Card>);

export default OptimalSchedulingSuggestions;
