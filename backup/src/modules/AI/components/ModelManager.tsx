import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
interface ModelManagerProps { models?: string[] }
const ModelManager: React.FC<ModelManagerProps> = ({ models = [] }) => {
  const [items, setItems] = useState<string[]>(models);
  const [value, setValue] = useState('');
  return (
    <Card>
      <Card.Header>
        <Card.Title>Modelos</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-3">
        <div className="flex gap-2">
          <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Adicionar modelo" />
          <Button onClick={() => { if (value.trim()) { setItems((p) => [...p, value.trim()]); setValue(''); } }}>Adicionar</Button>
        </div>
        <ul className="list-disc ml-5 text-sm">
          {items.map((m, i) => (
            <li key={i} className="flex justify-between items-center">
              <span>{m}</span>
              <Button size="sm" variant="outline" onClick={() => setItems((p) => p.filter((x) => x !== m))}>Remover</Button>
            </li>
          ))}
        </ul>
      </Card.Content>
    </Card>
  );
};
export default ModelManager;
