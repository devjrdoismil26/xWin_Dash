import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Textarea from '@/shared/components/ui/Textarea';
import Select from '@/shared/components/ui/Select';
import Button from '@/shared/components/ui/Button';
const EmailTemplateForm: React.FC<{template?: string, onSave, onCancel}> = ({ template = null, onSave, onCancel    }) => {
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

    } , [template]);

  const save: React.FC<e> = (e: unknown) => {
    e?.preventDefault?.();

    onSave?.(form);};

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>{template ? 'Editar Template' : 'Novo Template'}</Card.Title>
      </Card.Header>
      <Card.Content />
        <form className="space-y-4" onSubmit={ save } />
          <div>
           
        </div><InputLabel htmlFor="name">Nome *</InputLabel>
            <Input id="name" value={form.name} onChange={(e: unknown) => setForm({ ...form, name: e.target.value })} /></div><div>
           
        </div><InputLabel htmlFor="subject">Assunto *</InputLabel>
            <Input id="subject" value={form.subject} onChange={(e: unknown) => setForm({ ...form, subject: e.target.value })} /></div><div>
           
        </div><InputLabel htmlFor="category">Categoria</InputLabel>
            <Select
              id="category"
              options={[
                { value: 'newsletter', label: 'Newsletter' },
                { value: 'promotional', label: 'Promocional' },
                { value: 'transactional', label: 'Transacional' },
              ]}
              value={ form.category }
              onChange={(val: unknown) => setForm({ ...form, category: val })} /></div><div>
           
        </div><InputLabel htmlFor="content">Conteúdo *</InputLabel>
            <Textarea id="content" rows={10} value={form.content} onChange={(e: unknown) => setForm({ ...form, content: e.target.value })} /></div><div className=" ">$2</div><Button type="button" variant="outline" onClick={ () => onCancel?.() }>Cancelar</Button>
            <Button type="submit">Salvar</Button></div></form>
      </Card.Content>
    </Card>);};

EmailTemplateForm.propTypes = {
  template: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,};

export default EmailTemplateForm;
