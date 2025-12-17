import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import Button from '@/shared/components/ui/Button';
interface SMTPSettingsProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const SMTPSettings = ({ configs = [] as unknown[] }) => { const find = (k: unknown) => configs.find((c: unknown) => c.key === k)?.value;
  const [host, setHost] = useState(find('smtp_host') || '');

  const [port, setPort] = useState(find('smtp_port') || '587');

  const [username, setUsername] = useState(find('smtp_username') || '');

  const [password, setPassword] = useState(find('smtp_password') || '');

  const [encryption, setEncryption] = useState(find('smtp_encryption') || 'tls');

  const [fromAddress, setFromAddress] = useState(find('smtp_from_address') || '');

  const [fromName, setFromName] = useState(find('smtp_from_name') || '');

  const [timeout, setTimeoutVal] = useState(find('smtp_timeout') || '30');

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>SMTP</Card.Title>
      </Card.Header>
      <Card.Content />
        <form className="space-y-3" onSubmit={onSubmit } />
          <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="host">Host</InputLabel>
              <Input id="host" value={host} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHost(e.target.value)} placeholder="smtp.example.com" /></div><div>
           
        </div><InputLabel htmlFor="port">Porta</InputLabel>
              <Input id="port" type="number" value={port} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setPort(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="username">Usuário</InputLabel>
              <Input id="username" value={username} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="password">Senha</InputLabel>
              <Input id="password" type="password" value={password} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="encryption">Criptografia</InputLabel>
              <Select id="encryption" value={encryption} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setEncryption(e.target.value)  }>
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
                <option value="none">Nenhuma</option></Select></div>
            <div>
           
        </div><InputLabel htmlFor="fromAddress">Remetente</InputLabel>
              <Input id="fromAddress" type="email" value={fromAddress} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setFromAddress(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="fromName">Nome</InputLabel>
              <Input id="fromName" value={fromName} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setFromName(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="timeout">Timeout (s)</InputLabel>
              <Input id="timeout" type="number" value={timeout} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setTimeoutVal(e.target.value) } /></div><Button type="submit">Salvar</Button></form></Card.Content>
    </Card>);};

export default SMTPSettings;
