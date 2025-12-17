import React from 'react';
import { Head } from '@inertiajs/react';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import GuestLayout from '@/layouts/GuestLayout';
interface ForgotPasswordProps {
  status?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
/**
 * Forgot Password page component
 *
 * @param props
 * @param props.status - Status message for password reset
 */
const ForgotPassword: React.FC<ForgotPasswordProps> = React.memo(function ForgotPassword({ status }) {
  return (
        <>
      <GuestLayout />
      <Head title="Esqueci a Senha" / />
      <div className="Esqueceu sua senha? Sem problemas. Apenas nos informe seu endereço de e-mail">$2</div>
        e enviaremos um link de redefinição de senha que permitirá que você escolha uma nova.
      </div>
      <ForgotPasswordForm status={status} / />
    </GuestLayout>);

});

export default ForgotPassword;
