import React from 'react';
import { Head } from '@inertiajs/react';
import LoginFormBeautiful from './components/LoginFormBeautiful';

interface LoginProps {
  canResetPassword?: boolean;
}

const Login: React.FC<LoginProps> = ({ canResetPassword = true }) => {
  return (
    <>
      <Head title="Login" />
      <LoginFormBeautiful />
    </>
  );
};

export default Login;