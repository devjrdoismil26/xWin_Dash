import React, { useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputError from '@/shared/components/ui/InputError';
import InputLabel from '@/shared/components/ui/InputLabel';
interface UpdatePasswordFormProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({ className = ''    }) => {
  const passwordInput = useRef<HTMLInputElement>(null);

  const currentPasswordInput = useRef<HTMLInputElement>(null);

  const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const updatePassword = (e: React.FormEvent): void => {
    e.preventDefault();

    put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => {
        reset();

        toast.success('Senha atualizada com sucesso!');

      },
      onError: (errors: unknown) => {
        if (errors.password) {
          reset('password', 'password_confirmation');

          passwordInput.current?.focus();

        }
        if (errors.current_password) {
          reset('current_password');

          currentPasswordInput.current?.focus();

        }
        toast.error('Erro ao atualizar senha. Verifique os dados informados.');

      },
    });};

  return (
        <>
      <section className={className } />
      <Card />
        <div className=" ">$2</div><header className="mb-6" />
            <h2 className="text-lg font-medium text-gray-900" />
              Atualizar Senha
            </h2>
            <p className="mt-1 text-sm text-gray-600" />
              Certifique-se de que sua conta esteja usando uma senha longa e aleatória para permanecer segura.
            </p></header><form onSubmit={updatePassword} className="space-y-6" />
            <div>
           
        </div><InputLabel htmlFor="current_password" value="Senha Atual" / />
              <Input
                id="current_password"
                ref={ currentPasswordInput }
                type="password"
                value={ data.current_password }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('current_password', e.target.value) }
                autoComplete="current-password"
                placeholder="Sua senha atual" />
              <InputError text={errors.current_password} className="mt-2" /></div><div>
           
        </div><InputLabel htmlFor="password" value="Nova Senha" / />
              <Input
                id="password"
                ref={ passwordInput }
                type="password"
                value={ data.password }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('password', e.target.value) }
                autoComplete="new-password"
                placeholder="Nova senha" />
              <InputError text={errors.password} className="mt-2" /></div><div>
           
        </div><InputLabel htmlFor="password_confirmation" value="Confirmar Senha" / />
              <Input
                id="password_confirmation"
                type="password"
                value={ data.password_confirmation }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('password_confirmation', e.target.value) }
                autoComplete="new-password"
                placeholder="Confirme a nova senha" />
              <InputError text={errors.password_confirmation} className="mt-2" /></div><div className=" ">$2</div><Button 
                type="submit" 
                disabled={ processing }
                loading={ processing }
                variant="primary" />
                Salvar
              </Button>
              {recentlySuccessful && (
                <p className="text-sm text-gray-600">Senha atualizada.</p>
              )}
            </div></form></div></Card></section>);};

export default UpdatePasswordForm;
