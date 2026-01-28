import React from 'react';
import { Head } from '@inertiajs/react';
import ForgotPasswordForm from './components/ForgotPasswordForm.tsx';
import GuestLayout from '@/layouts/GuestLayout';
interface ForgotPasswordProps {
  status?: string;
}
/**
 * Forgot Password page component
 *
 * @param props
 * @param props.status - Status message for password reset
 */
const ForgotPassword: React.FC<ForgotPasswordProps> = React.memo(function ForgotPassword({ status }) {
  return (
    <GuestLayout>
      <Head title="Esqueci a Senha" />
      <div className="mb-4 text-sm text-gray-600">
        Esqueceu sua senha? Sem problemas. Apenas nos informe seu endereço de e-mail
        e enviaremos um link de redefinição de senha que permitirá que você escolha uma nova.
      </div>
      <ForgotPasswordForm status={status} />
    </GuestLayout>
  );
});
export default ForgotPassword;
