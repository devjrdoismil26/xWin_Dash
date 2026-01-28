import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Button from '@/components/ui/Button';
export default function UserEdit() {
  return (
    <div className="py-6">
      <Card>
        <Card.Header>
          <Card.Title>Editar Usuário</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-3">
            <div>
              <InputLabel htmlFor="name">Nome</InputLabel>
              <Input id="name" />
            </div>
            <div>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input id="email" type="email" />
            </div>
          </div>
        </Card.Content>
        <Card.Footer>
          <Button>Salvar</Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
