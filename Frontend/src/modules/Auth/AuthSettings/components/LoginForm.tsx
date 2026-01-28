import React, { useEffect, useCallback, useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import InputError from '@/components/ui/InputError';
import InputLabel from '@/components/ui/InputLabel';
const LoginForm = ({ canResetPassword }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    return () => {
      reset('password');
    };
  }, []);
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    post(route('login'));
  }, [post]);
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Entrar na sua conta
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Acesse o xWin Dashboard
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <InputLabel htmlFor="email" value="Email" />
            <div className="relative">
              <Input
                id="email"
                type="email"
                name="email"
                value={data.email}
                className="mt-1 block w-full pl-10"
                autoComplete="email"
                placeholder="seu@email.com"
                onChange={(e) => setData('email', e.target.value)}
                required
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <InputError text={errors.email} className="mt-2" />
          </div>
          <div>
            <InputLabel htmlFor="password" value="Senha" />
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={data.password}
                className="mt-1 block w-full pl-10 pr-10"
                autoComplete="current-password"
                placeholder="Sua senha"
                onChange={(e) => setData('password', e.target.value)}
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <InputError text={errors.password} className="mt-2" />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <Checkbox
                name="remember"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Lembrar-me
              </span>
            </label>
            {canResetPassword && (
              <Link
                href={route('password.request')}
                className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Esqueceu a senha?
              </Link>
            )}
          </div>
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={processing}
            >
              {processing ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Não tem uma conta?{' '}
            <Link
              href={route('register')}
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
            >
              Registre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
