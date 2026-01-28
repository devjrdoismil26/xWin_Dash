import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ConfirmPasswordProps {
  auth?: { user?: { id: string; name: string; email: string; }; };
}

const ConfirmPassword: React.FC<ConfirmPasswordProps> = ({ auth }) => {
  const { data, setData, post, processing, errors } = useForm({
    password: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/user/confirm-password');
  };

  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Confirmar senha" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Confirmar senha
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Por favor, confirme sua senha antes de continuar
            </p>
          </div>
          <Card>
            <Card.Content className="p-6">
              <form onSubmit={submit} className="space-y-6">
                <div>
                  <Input
                    label="Senha atual"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    required
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={processing}
                    className="w-full"
                  >
                    {processing ? 'Confirmando...' : 'Confirmar'}
                  </Button>
                </div>

                <div className="text-center">
                  <Link
                    href="/dashboard"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Voltar ao dashboard
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

export default ConfirmPassword;