import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';
interface DynamicListEditorProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const DynamicListEditor = ({ items = [] as unknown[], onChange }) => {
  const [list, setList] = useState(items);

  const addItem = () => { const next = [...list, { id: Date.now(), text: '' }]; setList(next); onChange?.(next);};

  const updateItem = (idx: unknown, value: unknown) => { const next = list.slice(); next[idx] = { ...next[idx], text: value }; setList(next); onChange?.(next);};

  const removeItem = (idx: unknown) => { const next = (list || []).filter((_: unknown, i: unknown) => i !== idx); setList(next); onChange?.(next);};

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Lista Dinâmica</Card.Title>
      </Card.Header>
      <Card.Content />
        <div className="{(list || []).map((it: unknown, idx: unknown) => (">$2</div>
            <div key={it.id} className="flex items-center gap-2">
           
        </div><Input value={it.text} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => updateItem(idx, e.target.value) } />
              <Button size="sm" variant="outline" onClick={ () => removeItem(idx) }>Remover</Button>
      </div>
    </>
  ))}
          <Button size="sm" onClick={ addItem }>Adicionar</Button></div></Card.Content>
    </Card>);};

export default DynamicListEditor;
