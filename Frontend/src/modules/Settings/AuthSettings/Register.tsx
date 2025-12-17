import React from 'react';
import { Head } from '@inertiajs/react';
import RegisterForm from './components/RegisterForm';
import GuestLayout from '@/layouts/GuestLayout';
const Register: React.FC = React.memo(function Register() {
  return (
        <>
      <GuestLayout />
      <Head title="Registrar - XWIN Dashboard" / />
      <RegisterForm / />
    </GuestLayout>);

});

export default Register;
