import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';

interface ForgotPasswordProps {
  auth?: { user?: { id: string;
  name: string;
  email: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };};

}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ auth    }) => {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    post('/forgot-password');};

  return (
        <>
      <AuthenticatedLayout user={ auth?.user } />
      <Head title="Esqueci minha senha" / />
      <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900" />
              Esqueci minha senha
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600" />
              Digite seu email e enviaremos um link para redefinir sua senha
            </p></div><Card />
            <Card.Content className="p-6" />
              <form onSubmit={submit} className="space-y-6" />
                <div>
           
        </div><Input
                    label="Email"
                    type="email"
                    value={ data.email }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value) }
                    error={ errors.email }
                    required /></div><div>
           
        </div><Button
                    type="submit"
                    disabled={ processing }
                    className="w-full" />
                    {processing ? 'Enviando...' : 'Enviar link de redefinição'}
                  </Button></div><div className=" ">$2</div><Link
                    href="/login"
                    className="font-medium text-blue-600 hover:text-blue-500" />
                    Voltar ao login
                  </Link></div></form>
            </Card.Content></Card></div>
    </AuthenticatedLayout>);};

export default ForgotPassword;