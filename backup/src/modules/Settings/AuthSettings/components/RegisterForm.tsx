import React, { useEffect, useCallback, useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import InputError from '@/components/ui/InputError';
import InputLabel from '@/components/ui/InputLabel';
const RegisterForm = () => {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation');
    };
  }, []);
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    post(route('register'));
  }, [post]);
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);
  const togglePasswordConfirmationVisibility = useCallback(() => {
    setShowPasswordConfirmation(prev => !prev);
  }, []);
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Criar nova conta
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Junte-se ao xWin Dashboard
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <InputLabel htmlFor="name" value="Nome completo" />
            <div className="relative">
              <Input
                id="name"
                type="text"
                name="name"
                value={data.name}
                className="mt-1 block w-full pl-10"
                autoComplete="name"
                placeholder="Seu nome completo"
                onChange={(e) => setData('name', e.target.value)}
                required
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <InputError text={errors.name} className="mt-2" />
          </div>
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
                autoComplete="new-password"
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
          <div>
            <InputLabel htmlFor="password_confirmation" value="Confirmar senha" />
            <div className="relative">
              <Input
                id="password_confirmation"
                type={showPasswordConfirmation ? 'text' : 'password'}
                name="password_confirmation"
                value={data.password_confirmation}
                className="mt-1 block w-full pl-10 pr-10"
                autoComplete="new-password"
                placeholder="Confirme sua senha"
                onChange={(e) => setData('password_confirmation', e.target.value)}
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={togglePasswordConfirmationVisibility}
              >
                {showPasswordConfirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <InputError text={errors.password_confirmation} className="mt-2" />
          </div>
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={processing}
            >
              {processing ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?{' '}
            <Link
              href={route('login')}
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
            >
              Faça login aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default RegisterForm;
