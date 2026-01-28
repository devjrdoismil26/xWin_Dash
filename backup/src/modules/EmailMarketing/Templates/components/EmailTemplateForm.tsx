import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Textarea from '@/components/ui/Textarea';
import { Select } from '@/components/ui/select';
import Button from '@/components/ui/Button';
const EmailTemplateForm: React.FC<{template?: any, onSave, onCancel}> = ({ template = null, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: template?.name || '',
    subject: template?.subject || '',
    content: template?.content || '',
    category: template?.category || 'newsletter',
    is_active: template?.is_active ?? true,
  });
  useEffect(() => {
    if (template) {
      setForm({
        name: template.name || '',
        subject: template.subject || '',
        content: template.content || '',
        category: template.category || 'newsletter',
        is_active: template.is_active ?? true,
      });
    }
  }, [template]);
  const save: React.FC<e> = (e) => {
    e?.preventDefault?.();
    onSave?.(form);
  };
  return (
    <Card>
      <Card.Header>
        <Card.Title>{template ? 'Editar Template' : 'Novo Template'}</Card.Title>
      </Card.Header>
      <Card.Content>
        <form className="space-y-4" onSubmit={save}>
          <div>
            <InputLabel htmlFor="name">Nome *</InputLabel>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <InputLabel htmlFor="subject">Assunto *</InputLabel>
            <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div>
            <InputLabel htmlFor="category">Categoria</InputLabel>
            <Select
              id="category"
              options={[
                { value: 'newsletter', label: 'Newsletter' },
                { value: 'promotional', label: 'Promocional' },
                { value: 'transactional', label: 'Transacional' },
              ]}
              value={form.category}
              onChange={(val) => setForm({ ...form, category: val })}
            />
          </div>
          <div>
            <InputLabel htmlFor="content">Conteúdo *</InputLabel>
            <Textarea id="content" rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
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
EmailTemplateForm.propTypes = {
  template: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};
export default EmailTemplateForm;
