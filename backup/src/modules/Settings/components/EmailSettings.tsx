import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
const EmailSettings = ({ configs = [] }) => {
  const find = (k) => configs.find((c) => c.key === k)?.value;
  const [fromAddress, setFromAddress] = useState(find('email_from_address') || '');
  const [fromName, setFromName] = useState(find('email_from_name') || '');
  const [replyTo, setReplyTo] = useState(find('email_reply_to') || '');
  const [subjectPrefix, setSubjectPrefix] = useState(find('email_subject_prefix') || '');
  const [header, setHeader] = useState(find('email_template_header') || '');
  const [footer, setFooter] = useState(find('email_template_footer') || '');
  const [batchSize, setBatchSize] = useState(find('email_batch_size') || '100');
  const [delay, setDelay] = useState(find('email_delay_between_batches') || '5');
  return (
    <Card>
      <Card.Header>
        <Card.Title>Email</Card.Title>
      </Card.Header>
      <Card.Content>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <InputLabel htmlFor="fromAddress">Remetente</InputLabel>
              <Input id="fromAddress" type="email" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} />
            </div>
            <div>
              <InputLabel htmlFor="fromName">Nome</InputLabel>
              <Input id="fromName" value={fromName} onChange={(e) => setFromName(e.target.value)} />
            </div>
            <div>
              <InputLabel htmlFor="replyTo">Reply-To</InputLabel>
              <Input id="replyTo" type="email" value={replyTo} onChange={(e) => setReplyTo(e.target.value)} />
            </div>
            <div>
              <InputLabel htmlFor="subjectPrefix">Prefixo do Assunto</InputLabel>
              <Input id="subjectPrefix" value={subjectPrefix} onChange={(e) => setSubjectPrefix(e.target.value)} />
            </div>
          </div>
          <div>
            <InputLabel htmlFor="header">Cabeçalho padrão</InputLabel>
            <Textarea id="header" rows={3} value={header} onChange={(e) => setHeader(e.target.value)} />
          </div>
          <div>
            <InputLabel htmlFor="footer">Rodapé padrão</InputLabel>
            <Textarea id="footer" rows={3} value={footer} onChange={(e) => setFooter(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <InputLabel htmlFor="batchSize">Tamanho do Lote</InputLabel>
              <Input id="batchSize" type="number" value={batchSize} onChange={(e) => setBatchSize(e.target.value)} />
            </div>
            <div>
              <InputLabel htmlFor="delay">Atraso por lote (s)</InputLabel>
              <Input id="delay" type="number" value={delay} onChange={(e) => setDelay(e.target.value)} />
            </div>
          </div>
          <Button type="submit">Salvar</Button>
        </form>
      </Card.Content>
    </Card>
  );
};
export default EmailSettings;
