import React from 'react';
import { Head } from '@inertiajs/react';
import LoginFormBeautiful from './components/LoginFormBeautiful';

interface LoginProps {
  canResetPassword?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const Login: React.FC<LoginProps> = ({ canResetPassword = true    }) => {
  return (
            <>
      <Head title="Login" / />
      <LoginFormBeautiful / />
    </>);};

export default Login;
