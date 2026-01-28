import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import Input from '@/components/ui/Input';
import InputError from '@/components/ui/InputError';
import InputLabel from '@/components/ui/InputLabel';
interface DeleteUserFormProps {
  className?: string;
}
const DeleteUserForm: React.FC<DeleteUserFormProps> = ({ className = '' }) => {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);
  const { data, setData, delete: destroy, processing, reset, errors } = useForm({
    password: '',
  });
  const confirmUserDeletion = (): void => {
    setConfirmingUserDeletion(true);
  };
  const deleteUser = (e: React.FormEvent): void => {
    e.preventDefault();
    destroy(route('profile.destroy'), {
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
        toast.success('Conta excluída com sucesso.');
      },
      onError: () => {
        passwordInput.current?.focus();
        toast.error('Erro ao excluir conta. Verifique sua senha.');
      },
      onFinish: () => reset(),
    });
  };
  const closeModal = (): void => {
    setConfirmingUserDeletion(false);
    reset();
  };
  return (
    <section className={`space-y-6 ${className}`}>
      <Card>
        <div className="p-6">
          <header className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Excluir Conta
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Uma vez que sua conta for excluída, todos os seus recursos e dados serão permanentemente excluídos.
              Antes de excluir sua conta, faça o download de quaisquer dados ou informações que deseja manter.
            </p>
          </header>
          <Button 
            variant="destructive" 
            onClick={confirmUserDeletion}
          >
            Excluir Conta
          </Button>
        </div>
      </Card>
      <ConfirmationModal
        show={confirmingUserDeletion}
        onClose={closeModal}
        title="Tem certeza que deseja excluir sua conta?"
        text="Uma vez que sua conta for excluída, todos os seus recursos e dados serão permanentemente excluídos. Digite sua senha para confirmar que deseja excluir permanentemente sua conta."
        confirmText="Excluir Conta"
        confirmVariant="destructive"
      >
        <form onSubmit={deleteUser} className="p-6">
          <div className="mb-6">
            <InputLabel 
              htmlFor="password" 
              value="Senha" 
              className="sr-only" 
            />
            <Input
              id="password"
              type="password"
              name="password"
              ref={passwordInput}
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              placeholder="Digite sua senha para confirmar"
              autoComplete="current-password"
            />
            <InputError text={errors.password} className="mt-2" />
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={closeModal}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              loading={processing}
              disabled={processing}
            >
              Excluir Conta
            </Button>
          </div>
        </form>
      </ConfirmationModal>
    </section>
  );
};
export default DeleteUserForm;
