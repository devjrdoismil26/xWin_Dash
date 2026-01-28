import React from 'react';
import Card from '@/components/ui/Card';
import ProtectedRoute from '@/components/Routes/ProtectedRoute';
const UsersAdminIndex: React.FC = () => (
  <ProtectedRoute requiredPermissions={['admin', 'user_management']}>
    <div className="py-6">
      <Card>
        <Card.Header>
          <Card.Title>Administração de Usuários</Card.Title>
        </Card.Header>
        <Card.Content>
          <p>Ferramentas administrativas.</p>
        </Card.Content>
      </Card>
    </div>
  </ProtectedRoute>
);
export default UsersAdminIndex;
