import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Button from '@/components/ui/Button';
export default function SecuritySettings() {
  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Segurança</h1>
      <Card>
        <Card.Header>
          <Card.Title>Política de Senhas</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="minLength">Mínimo de caracteres</InputLabel>
              <Input id="minLength" type="number" value={passwordMinLength} onChange={(e) => setPasswordMinLength(parseInt(e.target.value || '0', 10))} />
            </div>
            <div>
              <InputLabel htmlFor="maxAttempts">Máx. tentativas de login</InputLabel>
              <Input id="maxAttempts" type="number" value={maxLoginAttempts} onChange={(e) => setMaxLoginAttempts(parseInt(e.target.value || '0', 10))} />
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
