import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import { Select } from '@/components/ui/select';
import InputLabel from '@/components/ui/InputLabel';
import Button from '@/components/ui/Button';
const LeadsSettings = ({ configs = [] }) => {
  const find = (k) => configs.find((c) => c.key === k)?.value;
  const [assignment, setAssignment] = useState(find('leads_assignment_strategy') || 'round_robin');
  return (
    <Card>
      <Card.Header>
        <Card.Title>Leads</Card.Title>
      </Card.Header>
      <Card.Content>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div>
            <InputLabel htmlFor="assign">Estratégia de distribuição</InputLabel>
            <Select id="assign" value={assignment} onChange={(e) => setAssignment(e.target.value)}>
              <option value="round_robin">Round Robin</option>
              <option value="random">Aleatório</option>
            </Select>
          </div>
          <Button type="submit">Salvar</Button>
        </form>
      </Card.Content>
    </Card>
  );
};
export default LeadsSettings;
