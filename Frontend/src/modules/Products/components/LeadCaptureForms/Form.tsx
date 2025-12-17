import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Textarea from '@/shared/components/ui/Textarea';
import Button from '@/shared/components/ui/Button';
const LeadCaptureFormForm = ({ leadCaptureForm = null, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: leadCaptureForm?.name || '',
    description: leadCaptureForm?.description || '',
  });

  const submit = (e: unknown) => { e?.preventDefault?.(); onSave?.(form);};

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>{leadCaptureForm ? 'Editar Formulário' : 'Criar Novo Formulário'}</Card.Title>
      </Card.Header>
      <Card.Content />
        <form onSubmit={submit} className="space-y-4" />
          <div>
           
        </div><InputLabel htmlFor="name">Nome</InputLabel>
            <Input id="name" value={form.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} /></div><div>
           
        </div><InputLabel htmlFor="description">Descrição</InputLabel>
            <Textarea id="description" rows={3} value={form.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, description: e.target.value })} /></div><div className=" ">$2</div><Button type="button" variant="outline" onClick={ () => onCancel?.() }>Cancelar</Button>
            <Button type="submit">Salvar</Button></div></form>
      </Card.Content>
    </Card>);};

export default LeadCaptureFormForm;
