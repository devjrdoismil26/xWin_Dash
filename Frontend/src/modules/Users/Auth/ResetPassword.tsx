import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';

interface ResetPasswordProps {
  auth?: { user?: { id: string;
  name: string;
  email: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };};

  token: string;
  email: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ auth, token, email    }) => {
  const { data, setData, post, processing, errors } = useForm({
    token,
    email,
    password: '',
    password_confirmation: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    post('/reset-password');};

  return (
        <>
      <AuthenticatedLayout user={ auth?.user } />
      <Head title="Redefinir senha" / />
      <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900" />
              Redefinir senha
            </h2></div><Card />
            <Card.Content className="p-6" />
              <form onSubmit={submit} className="space-y-6" />
                <div>
           
        </div><Input
                    label="Email"
                    type="email"
                    value={ data.email }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value) }
                    error={ errors.email }
                    required
                    disabled /></div><div>
           
        </div><Input
                    label="Nova Senha"
                    type="password"
                    value={ data.password }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('password', e.target.value) }
                    error={ errors.password }
                    required /></div><div>
           
        </div><Input
                    label="Confirmar Nova Senha"
                    type="password"
                    value={ data.password_confirmation }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('password_confirmation', e.target.value) }
                    error={ errors.password_confirmation }
                    required /></div><div>
           
        </div><Button
                    type="submit"
                    disabled={ processing }
                    className="w-full" />
                    {processing ? 'Redefinindo...' : 'Redefinir senha'}
                  </Button></div><div className=" ">$2</div><Link
                    href="/login"
                    className="font-medium text-blue-600 hover:text-blue-500" />
                    Voltar ao login
                  </Link></div></form>
            </Card.Content></Card></div>
    </AuthenticatedLayout>);};

export default ResetPassword;