import React from 'react';
import { Head } from '@inertiajs/react';
import VerifyEmailMessage from './components/VerifyEmailMessage.tsx';
import GuestLayout from '@/layouts/GuestLayout';
interface VerifyEmailProps {
  status?: string;
}
const VerifyEmail: React.FC<VerifyEmailProps> = React.memo(function VerifyEmail({ status }) {
  return (
    <GuestLayout>
      <Head title="Verificar Email - XWIN Dashboard" />
      <VerifyEmailMessage status={status} />
    </GuestLayout>
  );
});
export default VerifyEmail;
