import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface VerifyEmailProps {
  auth?: { user?: { id: string; name: string; email: string; }; };
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ auth }) => {
  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Verificar email" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verificar email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Verifique sua caixa de entrada para o link de verificação
            </p>
          </div>
          <Card>
            <Card.Content className="p-6 text-center">
              <div className="space-y-4">
                <p className="text-gray-600">
                  Enviamos um link de verificação para seu email. 
                  Clique no link para verificar sua conta.
                </p>
                
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/login">Voltar ao login</Link>
                  </Button>
                  
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/register">Criar nova conta</Link>
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default VerifyEmail;