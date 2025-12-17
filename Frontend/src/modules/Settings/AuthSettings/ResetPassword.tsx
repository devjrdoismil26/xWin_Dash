import React from 'react';
import { Head } from '@inertiajs/react';
import ResetPasswordForm from './components/ResetPasswordForm';
import GuestLayout from '@/layouts/GuestLayout';
interface ResetPasswordProps {
  token: string;
  email: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const ResetPassword: React.FC<ResetPasswordProps> = React.memo(function ResetPassword({ token, email }) {
  return (
        <>
      <GuestLayout />
      <Head title="Redefinir Senha - XWIN Dashboard" / />
      <ResetPasswordForm token={token} email={email} / />
    </GuestLayout>);

});

export default ResetPassword;
