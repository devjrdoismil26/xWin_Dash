import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ResetPasswordProps {
  auth?: { user?: { id: string; name: string; email: string; }; };
  token: string;
  email: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ auth, token, email }) => {
  const { data, setData, post, processing, errors } = useForm({
    token,
    email,
    password: '',
    password_confirmation: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/reset-password');
  };

  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Redefinir senha" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Redefinir senha
            </h2>
          </div>
          <Card>
            <Card.Content className="p-6">
              <form onSubmit={submit} className="space-y-6">
                <div>
                  <Input
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    required
                    disabled
                  />
                </div>

                <div>
                  <Input
                    label="Nova Senha"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    required
                  />
                </div>

                <div>
                  <Input
                    label="Confirmar Nova Senha"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={errors.password_confirmation}
                    required
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={processing}
                    className="w-full"
                  >
                    {processing ? 'Redefinindo...' : 'Redefinir senha'}
                  </Button>
                </div>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Voltar ao login
                  </Link>
                </div>
              </form>
            </Card.Content>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ResetPassword;