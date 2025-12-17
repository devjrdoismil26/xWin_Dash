import React from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Badge from '@/shared/components/ui/Badge';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import InputError from '@/shared/components/ui/InputError';
import InputLabel from '@/shared/components/ui/InputLabel';
interface ForgotPasswordFormProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const ForgotPasswordForm = ({ status }) => {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const submit = (e: unknown) => {
    e.preventDefault();

    post(route('password.email'));};

  return (
            <form onSubmit={submit} className="space-y-4" />
      {status && (
        <div className=" ">$2</div><Badge variant="success" className="w-full justify-center py-2" />
            {status}
          </Badge>
      </div>
    </>
  )}
      <div>
           
        </div><InputLabel htmlFor="email" value="Email" / />
        <Input
          id="email"
          type="email"
          name="email"
          value={ data.email }
          className="mt-1 block w-full"
          autoComplete="email"
          placeholder="seu@email.com"
          onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value) }
          required />
        <InputError text={errors.email} className="mt-2" /></div><div className=" ">$2</div><Button
          type="submit"
          disabled={ processing }
          className="w-full" />
          {processing ? 'Enviando...' : 'Enviar Link de Redefinição'}
        </Button></div></form>);};

export default ForgotPasswordForm;
