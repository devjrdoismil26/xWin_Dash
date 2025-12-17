import React, { useEffect, useCallback, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import InputError from '@/shared/components/ui/InputError';
import InputLabel from '@/shared/components/ui/InputLabel';
interface ResetPasswordFormProps {
  token?: string;
  email?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const ResetPasswordForm = ({ token, email }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation');};

  }, []);

  const handleSubmit = useCallback((e: unknown) => {
    e.preventDefault();

    post(route('password.store'));

  }, [post]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);

  }, []);

  const togglePasswordConfirmationVisibility = useCallback(() => {
    setShowPasswordConfirmation(prev => !prev);

  }, []);

  return (
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h2 className="text-2xl font-bold text-gray-900 dark:text-white" />
            Redefinir Senha
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2" />
            Digite sua nova senha
          </p></div><form onSubmit={handleSubmit} className="space-y-4" />
          <div>
           
        </div><InputLabel htmlFor="email" value="Email" / />
            <div className=" ">$2</div><Input
                id="email"
                type="email"
                name="email"
                value={ data.email }
                className="mt-1 block w-full pl-10 bg-gray-50 dark:bg-gray-700"
                autoComplete="email"
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value) }
                readOnly />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /></div><InputError text={errors.email} className="mt-2" /></div><div>
           
        </div><InputLabel htmlFor="password" value="Nova senha" / />
            <div className=" ">$2</div><Input
                id="password"
                type={ showPassword ? 'text' : 'password' }
                name="password"
                value={ data.password }
                className="mt-1 block w-full pl-10 pr-10"
                autoComplete="new-password"
                placeholder="Sua nova senha"
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('password', e.target.value) }
                required
                autoFocus />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={ togglePasswordVisibility } />
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button></div><InputError text={errors.password} className="mt-2" /></div><div>
           
        </div><InputLabel htmlFor="password_confirmation" value="Confirmar nova senha" / />
            <div className=" ">$2</div><Input
                id="password_confirmation"
                type={ showPasswordConfirmation ? 'text' : 'password' }
                name="password_confirmation"
                value={ data.password_confirmation }
                className="mt-1 block w-full pl-10 pr-10"
                autoComplete="new-password"
                placeholder="Confirme sua nova senha"
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('password_confirmation', e.target.value) }
                required />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={ togglePasswordConfirmationVisibility } />
                {showPasswordConfirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button></div><InputError text={errors.password_confirmation} className="mt-2" /></div><div className=" ">$2</div><Button
              type="submit"
              className="w-full"
              disabled={ processing } />
              {processing ? 'Redefinindo...' : 'Redefinir senha'}
            </Button></div></form>
      </div>);};

export default ResetPasswordForm;
