import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Textarea from '@/shared/components/ui/Textarea';
import Button from '@/shared/components/ui/Button';
interface EmailSettingsProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const EmailSettings = ({ configs = [] as unknown[] }) => { const find = (k: unknown) => configs.find((c: unknown) => c.key === k)?.value;
  const [fromAddress, setFromAddress] = useState(find('email_from_address') || '');

  const [fromName, setFromName] = useState(find('email_from_name') || '');

  const [replyTo, setReplyTo] = useState(find('email_reply_to') || '');

  const [subjectPrefix, setSubjectPrefix] = useState(find('email_subject_prefix') || '');

  const [header, setHeader] = useState(find('email_template_header') || '');

  const [footer, setFooter] = useState(find('email_template_footer') || '');

  const [batchSize, setBatchSize] = useState(find('email_batch_size') || '100');

  const [delay, setDelay] = useState(find('email_delay_between_batches') || '5');

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Email</Card.Title>
      </Card.Header>
      <Card.Content />
        <form className="space-y-3" onSubmit={onSubmit } />
          <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="fromAddress">Remetente</InputLabel>
              <Input id="fromAddress" type="email" value={fromAddress} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setFromAddress(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="fromName">Nome</InputLabel>
              <Input id="fromName" value={fromName} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setFromName(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="replyTo">Reply-To</InputLabel>
              <Input id="replyTo" type="email" value={replyTo} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setReplyTo(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="subjectPrefix">Prefixo do Assunto</InputLabel>
              <Input id="subjectPrefix" value={subjectPrefix} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSubjectPrefix(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="header">Cabeçalho padrão</InputLabel>
            <Textarea id="header" rows={3} value={header} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setHeader(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="footer">Rodapé padrão</InputLabel>
            <Textarea id="footer" rows={3} value={footer} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setFooter(e.target.value) } /></div><div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="batchSize">Tamanho do Lote</InputLabel>
              <Input id="batchSize" type="number" value={batchSize} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setBatchSize(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="delay">Atraso por lote (s)</InputLabel>
              <Input id="delay" type="number" value={delay} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setDelay(e.target.value) } /></div><Button type="submit">Salvar</Button></form></Card.Content>
    </Card>);};

export default EmailSettings;
