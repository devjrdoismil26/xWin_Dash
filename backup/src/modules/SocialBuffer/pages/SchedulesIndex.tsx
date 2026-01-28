import React from 'react';
import Card from '@/components/ui/Card';
const SchedulesIndexPage: React.FC = () => (
  <div className="py-6">
    <Card>
      <Card.Header>
        <Card.Title>Agendamentos</Card.Title>
      </Card.Header>
      <Card.Content>
        <p>Lista de agendamentos.</p>
      </Card.Content>
    </Card>
  </div>
);
export default SchedulesIndexPage;
