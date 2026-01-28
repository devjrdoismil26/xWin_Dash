import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import Button from '@/components/ui/Button';
const SMTPSettings = ({ configs = [] }) => {
  const find = (k) => configs.find((c) => c.key === k)?.value;
  const [host, setHost] = useState(find('smtp_host') || '');
  const [port, setPort] = useState(find('smtp_port') || '587');
  const [username, setUsername] = useState(find('smtp_username') || '');
  const [password, setPassword] = useState(find('smtp_password') || '');
  const [encryption, setEncryption] = useState(find('smtp_encryption') || 'tls');
  const [fromAddress, setFromAddress] = useState(find('smtp_from_address') || '');
  const [fromName, setFromName] = useState(find('smtp_from_name') || '');
  const [timeout, setTimeoutVal] = useState(find('smtp_timeout') || '30');
  return (
    <Card>
      <Card.Header>
        <Card.Title>SMTP</Card.Title>
      </Card.Header>
      <Card.Content>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <InputLabel htmlFor="host">Host</InputLabel>
              <Input id="host" value={host} onChange={(e) => setHost(e.target.value)} placeholder="smtp.example.com" />
            </div>
            <div>
              <InputLabel htmlFor="port">Porta</InputLabel>
              <Input id="port" type="number" value={port} onChange={(e) => setPort(e.target.value)} />
            </div>
            <div>
              <InputLabel htmlFor="username">Usuário</InputLabel>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <InputLabel htmlFor="password">Senha</InputLabel>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <InputLabel htmlFor="encryption">Criptografia</InputLabel>
              <Select id="encryption" value={encryption} onChange={(e) => setEncryption(e.target.value)}>
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
                <option value="none">Nenhuma</option>
              </Select>
            </div>
            <div>
              <InputLabel htmlFor="fromAddress">Remetente</InputLabel>
              <Input id="fromAddress" type="email" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} />
            </div>
            <div>
              <InputLabel htmlFor="fromName">Nome</InputLabel>
              <Input id="fromName" value={fromName} onChange={(e) => setFromName(e.target.value)} />
            </div>
            <div>
              <InputLabel htmlFor="timeout">Timeout (s)</InputLabel>
              <Input id="timeout" type="number" value={timeout} onChange={(e) => setTimeoutVal(e.target.value)} />
            </div>
          </div>
          <Button type="submit">Salvar</Button>
        </form>
      </Card.Content>
    </Card>
  );
};
export default SMTPSettings;
