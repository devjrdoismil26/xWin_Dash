import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import InputError from '@/shared/components/ui/InputError';
const EmailSubscriberForm: React.FC<{subscriber?: string, onSave, onCancel}> = ({ subscriber = null, onSave, onCancel    }) => {
  const isEditing = Boolean(subscriber);

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: subscriber?.name || '',
    email: subscriber?.email || '',
    status: subscriber?.status || 'active',
  });

  const validate = useCallback(() => {
    const next = {} as any;
    if (!data.email.trim()) next.email = 'Email é obrigatório.';
    setErrors(next);

    return Object.keys(next).length === 0;
  }, [data]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    setLoading(true);

    try {
      onSave?.(data);

    } finally {
      setLoading(false);

    } , [data, onSave, validate]);

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>{isEditing ? 'Editar Inscrito' : 'Novo Inscrito'}</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-4" />
        <div>
           
        </div><InputLabel htmlFor="email">Email *</InputLabel>
          <Input id="email" value={data.email} onChange={(e: unknown) => setData((p: unknown) => ({ ...p, email: e.target.value }))} placeholder="email@exemplo.com" className={errors.email ? 'border-red-500' : '' } />
          <InputError text={errors.email} / /></div><div>
           
        </div><InputLabel htmlFor="name">Nome</InputLabel>
          <Input id="name" value={data.name} onChange={(e: unknown) => setData((p: unknown) => ({ ...p, name: e.target.value }))} placeholder="Nome do inscrito" /></div></Card.Content>
      <Card.Footer className="flex justify-end gap-2" />
        <Button variant="outline" onClick={onCancel} disabled={ loading }>Cancelar</Button>
        <Button onClick={handleSubmit} disabled={ loading }>{loading ? 'Salvando...' : 'Salvar'}</Button>
      </Card.Footer>
    </Card>);};

EmailSubscriberForm.propTypes = {
  subscriber: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,};

export default EmailSubscriberForm;
