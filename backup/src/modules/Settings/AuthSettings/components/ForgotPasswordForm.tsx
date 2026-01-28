import React from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import InputError from '@/components/ui/InputError';
import InputLabel from '@/components/ui/InputLabel';
const ForgotPasswordForm = ({ status }) => {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });
  const submit = (e) => {
    e.preventDefault();
    post(route('password.email'));
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      {status && (
        <div className="mb-4">
          <Badge variant="success" className="w-full justify-center py-2">
            {status}
          </Badge>
        </div>
      )}
      <div>
        <InputLabel htmlFor="email" value="Email" />
        <Input
          id="email"
          type="email"
          name="email"
          value={data.email}
          className="mt-1 block w-full"
          autoComplete="email"
          placeholder="seu@email.com"
          onChange={(e) => setData('email', e.target.value)}
          required
        />
        <InputError text={errors.email} className="mt-2" />
      </div>
      <div className="flex items-center justify-end">
        <Button
          type="submit"
          disabled={processing}
          className="w-full"
        >
          {processing ? 'Enviando...' : 'Enviar Link de Redefinição'}
        </Button>
      </div>
    </form>
  );
};
export default ForgotPasswordForm;
