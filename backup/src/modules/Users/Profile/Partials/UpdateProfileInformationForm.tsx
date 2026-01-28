import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputError from '@/components/ui/InputError';
import InputLabel from '@/components/ui/InputLabel';
interface UpdateProfileInformationFormProps {
  mustVerifyEmail: boolean;
  status?: string;
  className?: string;
}
const UpdateProfileInformationForm: React.FC<UpdateProfileInformationFormProps> = ({ 
  mustVerifyEmail, 
  status, 
  className = '' 
}) => {
  const user = usePage().props.auth.user;
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    name: user.name,
    email: user.email,
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route('profile.update'), {
      onSuccess: () => {
        toast.success('Perfil atualizado com sucesso!');
      },
      onError: () => {
        toast.error('Erro ao atualizar perfil.');
      },
    });
  };
  return (
    <section className={className}>
      <Card>
        <div className="p-6">
          <header className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Informações do Perfil
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Atualize as informações do perfil e endereço de e-mail da sua conta.
            </p>
          </header>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <InputLabel htmlFor="name" value="Nome" />
              <Input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
                autoFocus
                autoComplete="name"
              />
              <InputError text={errors.name} className="mt-2" />
            </div>
            <div>
              <InputLabel htmlFor="email" value="Email" />
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
                autoComplete="username"
              />
              <InputError text={errors.email} className="mt-2" />
              {mustVerifyEmail && user.email_verified_at === null && (
                <div>
                  <p className="text-sm mt-2 text-gray-800">
                    Seu endereço de email não foi verificado.
                    <Link
                      href={route('verification.send')}
                      method="post"
                      as="button"
                      className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Clique aqui para reenviar o email de verificação.
                    </Link>
                  </p>
                  {status === 'verification-link-sent' && (
                    <div className="mt-2 font-medium text-sm text-green-600">
                      Um novo link de verificação foi enviado para seu endereço de email.
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button 
                type="submit" 
                disabled={processing} 
                loading={processing} 
                variant="primary"
              >
                Salvar
              </Button>
              {recentlySuccessful && (
                <p className="text-sm text-gray-600">Salvo.</p>
              )}
            </div>
          </form>
        </div>
      </Card>
    </section>
  );
};
export default UpdateProfileInformationForm;
