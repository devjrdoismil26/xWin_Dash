import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Button from '@/shared/components/ui/Button';
export default function SecuritySettings() {
  const [passwordMinLength, setPasswordMinLength] = useState(8);

  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);

  return (
            <div className=" ">$2</div><h1 className="text-2xl font-semibold">Segurança</h1>
      <Card />
        <Card.Header />
          <Card.Title>Política de Senhas</Card.Title>
        </Card.Header>
        <Card.Content />
          <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="minLength">Mínimo de caracteres</InputLabel>
              <Input id="minLength" type="number" value={passwordMinLength} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setPasswordMinLength(parseInt(e.target.value || '0', 10)) } /></div><div>
           
        </div><InputLabel htmlFor="maxAttempts">Máx. tentativas de login</InputLabel>
              <Input id="maxAttempts" type="number" value={maxLoginAttempts} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setMaxLoginAttempts(parseInt(e.target.value || '0', 10)) } /></div></Card.Content>
        <Card.Footer />
          <Button>Salvar</Button>
        </Card.Footer></Card></div>);

}
