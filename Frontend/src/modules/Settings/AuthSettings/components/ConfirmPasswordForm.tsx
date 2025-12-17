import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import InputError from '@/shared/components/ui/InputError';
import InputLabel from '@/shared/components/ui/InputLabel';
const ConfirmPasswordForm = () => {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: '',
  });

  useEffect(() => {
    return () => {
      reset('password');};

  }, []);

  const submit = (e: unknown) => {
    e.preventDefault();

    post(route('password.confirm'));};

  return (
        <>
      <form onSubmit={submit} className="space-y-4" />
      <div>
           
        </div><InputLabel htmlFor="password" value="Senha" / />
        <Input
          id="password"
          type="password"
          name="password"
          value={ data.password }
          className="mt-1 block w-full"
          autoComplete="current-password"
          placeholder="Digite sua senha para confirmar"
          onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('password', e.target.value) }
          required />
        <InputError text={errors.password} className="mt-2" /></div><div className=" ">$2</div><Button
          type="submit"
          disabled={ processing }
          className="w-full" />
          {processing ? 'Confirmando...' : 'Confirmar Senha'}
        </Button></div></form>);};

export default ConfirmPasswordForm;
