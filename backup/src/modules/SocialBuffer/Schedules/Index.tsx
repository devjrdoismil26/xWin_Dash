import React from 'react';
import Card from '@/components/ui/Card';
const SchedulesIndex: React.FC = () => (
  <div className="py-6">
    <Card>
      <Card.Header>
        <Card.Title>Agendamentos</Card.Title>
      </Card.Header>
      <Card.Content>
        <p>Gerencie seus agendamentos de posts.</p>
      </Card.Content>
    </Card>
  </div>
);
export default SchedulesIndex;
