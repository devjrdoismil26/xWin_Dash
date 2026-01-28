import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
const LeadCaptureFormForm = ({ leadCaptureForm = null, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: leadCaptureForm?.name || '',
    description: leadCaptureForm?.description || '',
  });
  const submit = (e) => { e?.preventDefault?.(); onSave?.(form); };
  return (
    <Card>
      <Card.Header>
        <Card.Title>{leadCaptureForm ? 'Editar Formulário' : 'Criar Novo Formulário'}</Card.Title>
      </Card.Header>
      <Card.Content>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <InputLabel htmlFor="name">Nome</InputLabel>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <InputLabel htmlFor="description">Descrição</InputLabel>
            <Textarea id="description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onCancel?.()}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};
export default LeadCaptureFormForm;
