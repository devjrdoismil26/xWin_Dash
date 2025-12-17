import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';

interface LoginFormSimpleProps {
  canResetPassword?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const LoginFormSimple = ({ canResetPassword }: LoginFormSimpleProps) => {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post('/login');};

  return (
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h2 className="text-2xl font-bold text-gray-900" />
            Entrar na sua conta
          </h2>
          <p className="text-gray-600 mt-2" />
            Acesse o xWin Dashboard
          </p></div><form onSubmit={handleSubmit} className="space-y-4" />
          <div>
           
        </div><label htmlFor="email" className="block text-sm font-medium text-gray-700" />
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={ data.email }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              autoComplete="email"
              placeholder="seu@email.com"
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value) }
              required />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          <div>
           
        </div><label htmlFor="password" className="block text-sm font-medium text-gray-700" />
              Senha
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={ data.password }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              autoComplete="current-password"
              placeholder="Sua senha"
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('password', e.target.value) }
              required />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          
          <div className=" ">$2</div><label className="flex items-center" />
              <input
                type="checkbox"
                name="remember"
                checked={ data.remember }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('remember', e.target.checked) }
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              <span className="Lembrar-me">$2</span>
              </span>
            </label>
            {canResetPassword && (
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500" />
                Esqueceu a senha?
              </Link>
            )}
          </div>
          
          <div className=" ">$2</div><button
              type="submit"
              disabled={ processing }
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" />
              {processing ? 'Entrando...' : 'Entrar'}
            </button></div></form>
        
        <div className=" ">$2</div><p className="text-sm text-gray-600" />
            Não tem uma conta?{' '}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-500 font-medium" />
              Registre-se aqui
            </Link></p></div>
    </div>);};

export default LoginFormSimple;
