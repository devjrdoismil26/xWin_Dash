import React from 'react';
import Card from '@/components/ui/Card';
const UserTasksSchedulerPage: React.FC = () => (
  <div className="py-6">
    <Card>
      <Card.Header>
        <Card.Title>Agendador de Tarefas</Card.Title>
      </Card.Header>
      <Card.Content>
        <p>Planeje tarefas do usuário.</p>
      </Card.Content>
    </Card>
  </div>
);
export default UserTasksSchedulerPage;
