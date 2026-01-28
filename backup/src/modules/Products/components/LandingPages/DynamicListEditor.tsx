import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
const DynamicListEditor = ({ items = [], onChange }) => {
  const [list, setList] = useState(items);
  const addItem = () => { const next = [...list, { id: Date.now(), text: '' }]; setList(next); onChange?.(next); };
  const updateItem = (idx, value) => { const next = list.slice(); next[idx] = { ...next[idx], text: value }; setList(next); onChange?.(next); };
  const removeItem = (idx) => { const next = list.filter((_, i) => i !== idx); setList(next); onChange?.(next); };
  return (
    <Card>
      <Card.Header>
        <Card.Title>Lista Dinâmica</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="space-y-2">
          {list.map((it, idx) => (
            <div key={it.id} className="flex items-center gap-2">
              <Input value={it.text} onChange={(e) => updateItem(idx, e.target.value)} />
              <Button size="sm" variant="outline" onClick={() => removeItem(idx)}>Remover</Button>
            </div>
          ))}
          <Button size="sm" onClick={addItem}>Adicionar</Button>
        </div>
      </Card.Content>
    </Card>
  );
};
export default DynamicListEditor;
