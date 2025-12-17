import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';

interface LoginProps {
  auth?: { user?: { id: string;
  name: string;
  email: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };};

}

const Login: React.FC<LoginProps> = ({ auth    }) => {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    post('/login');};

  return (
        <>
      <GuestLayout title="Entre na sua conta" />
      <Head title="Login" / />
      <form onSubmit={submit} className="space-y-6" />
        <div>
           
        </div><Input
            label="Email"
            type="email"
            value={ data.email }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value) }
            error={ errors.email }
            required /></div><div>
           
        </div><Input
            label="Senha"
            type="password"
            value={ data.password }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('password', e.target.value) }
            error={ errors.password }
            required /></div><div className=" ">$2</div><div className=" ">$2</div><input
              id="remember"
              name="remember"
              type="checkbox"
              checked={ data.remember }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('remember', e.target.checked) }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-900 dark:text-gray-300" />
              Lembrar de mim
            </label></div><div className=" ">$2</div><Link
              href="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400" />
              Esqueceu sua senha?
            </Link></div><div>
           
        </div><Button
            type="submit"
            disabled={ processing }
            className="w-full" />
            {processing ? 'Entrando...' : 'Entrar'}
          </Button></div><div className=" ">$2</div><Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400" />
            Não tem uma conta? Registre-se
          </Link></div></form>
    </GuestLayout>);};

export default Login;
