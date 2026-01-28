import React from 'react';
import { Head } from '@inertiajs/react';
import ResetPasswordForm from './components/ResetPasswordForm.tsx';
import GuestLayout from '@/layouts/GuestLayout';
interface ResetPasswordProps {
  token: string;
  email: string;
}
const ResetPassword: React.FC<ResetPasswordProps> = React.memo(function ResetPassword({ token, email }) {
  return (
    <GuestLayout>
      <Head title="Redefinir Senha - XWIN Dashboard" />
      <ResetPasswordForm token={token} email={email} />
    </GuestLayout>
  );
});
export default ResetPassword;
