import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import { route } from 'ziggy-js';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import GuestLayout from '@/layouts/GuestLayout';
const EmailVerified: React.FC = React.memo(function EmailVerified() {
  const [countdown, setCountdown] = useState(5);
  const [redirecting, setRedirecting] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const handleRedirect = () => {
    setRedirecting(true);
    window.location.href = route('dashboard');
  };
  return (
    <GuestLayout>
      <Head title="E-mail Verificado" />
      <Card className="max-w-md mx-auto">
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            E-mail Verificado com Sucesso!
          </h1>
          <p className="text-gray-600 mb-6">
            Seu e-mail foi verificado. Você será redirecionado para o dashboard automaticamente.
          </p>
          <div className="space-y-3">
            <Button
              onClick={handleRedirect}
              disabled={redirecting}
              loading={redirecting}
              variant="primary"
              className="w-full"
            >
              {redirecting ? 'Redirecionando...' : 'Ir para o Dashboard Agora'}
            </Button>
            <p className="text-xs text-gray-500">
              Redirecionamento automático em {countdown} segundos
            </p>
          </div>
        </div>
      </Card>
    </GuestLayout>
  );
});
export default EmailVerified;
