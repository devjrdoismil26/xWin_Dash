import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface PageNotFoundProps {
  auth?: { user?: { id: string; name: string; email: string; }; };
}

const PageNotFound: React.FC<PageNotFoundProps> = ({ auth }) => {
  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Página não encontrada" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-9xl font-bold text-gray-300">404</h1>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Página não encontrada
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              A página que você está procurando não existe.
            </p>
          </div>
          
          <Card>
            <Card.Content className="p-6 text-center">
              <div className="space-y-4">
                <p className="text-gray-600">
                  Você pode voltar ao dashboard ou tentar uma das opções abaixo.
                </p>
                
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/dashboard">Voltar ao Dashboard</Link>
                  </Button>
                  
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/">Página Inicial</Link>
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

export default PageNotFound;