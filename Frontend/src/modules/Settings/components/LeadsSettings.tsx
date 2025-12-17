import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Select from '@/shared/components/ui/Select';
import InputLabel from '@/shared/components/ui/InputLabel';
import Button from '@/shared/components/ui/Button';
interface LeadsSettingsProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const LeadsSettings = ({ configs = [] as unknown[] }) => { const find = (k: unknown) => configs.find((c: unknown) => c.key === k)?.value;
  const [assignment, setAssignment] = useState(find('leads_assignment_strategy') || 'round_robin');

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Leads</Card.Title>
      </Card.Header>
      <Card.Content />
        <form className="space-y-3" onSubmit={onSubmit } />
          <div>
           
        </div><InputLabel htmlFor="assign">Estratégia de distribuição</InputLabel>
            <Select id="assign" value={assignment} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setAssignment(e.target.value)  }>
              <option value="round_robin">Round Robin</option>
              <option value="random">Aleatório</option></Select></div>
          <Button type="submit">Salvar</Button></form></Card.Content>
    </Card>);};

export default LeadsSettings;
