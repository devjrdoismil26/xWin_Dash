import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
export default function UserPermissions() {
  return (
    <div className="py-6">
      <Card>
        <Card.Header>
          <Card.Title>Permissões</Card.Title>
        </Card.Header>
        <Card.Content>
          <p>Gerencie permissões do usuário.</p>
        </Card.Content>
        <Card.Footer>
          <Button>Salvar</Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
