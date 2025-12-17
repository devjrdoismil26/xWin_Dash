import React from 'react';
import { Head } from '@inertiajs/react';
import ConfirmPasswordForm from './components/ConfirmPasswordForm';
import GuestLayout from '@/layouts/GuestLayout';
const ConfirmPassword: React.FC = React.memo(function ConfirmPassword() {
  return (
        <>
      <GuestLayout />
      <Head title="Confirmar Senha - XWIN Dashboard" / />
      <ConfirmPasswordForm / />
    </GuestLayout>);

});

export default ConfirmPassword;
