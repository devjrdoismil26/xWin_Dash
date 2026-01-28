import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface EmailVerifiedProps {
  auth?: { user?: { id: string; name: string; email: string; }; };
}

const EmailVerified: React.FC<EmailVerifiedProps> = ({ auth }) => {
  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Email verificado" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Email verificado com sucesso!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Seu email foi verificado e sua conta está ativa.
            </p>
          </div>
          <Card>
            <Card.Content className="p-6 text-center">
              <div className="space-y-4">
                <div className="text-green-600 text-6xl">✓</div>
                <p className="text-gray-600">
                  Parabéns! Seu email foi verificado com sucesso. 
                  Agora você pode usar todas as funcionalidades da plataforma.
                </p>
                
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/dashboard">Ir para o Dashboard</Link>
                  </Button>
                  
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/profile">Ver Perfil</Link>
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

export default EmailVerified;