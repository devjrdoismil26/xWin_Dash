import React, { useCallback, useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import AdAccountTable from './components/AdAccountTable';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Button from '@/shared/components/ui/Button';
import ConfirmationModal from '@/shared/components/ui/ConfirmationModal';
import PageLayout from '@/layouts/PageLayout';
import { apiClient } from '@/services';
import { AdsAccount } from '../types';
const AccountsIndex: React.FC = () => {
  const [adAccounts, setAdAccounts] = useState<AdsAccount[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [toDelete, setToDelete] = useState<AdsAccount | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);

    setError(null);

    try {
      const response = await apiClient.get(route('api.adstool.accounts.index')) as { data?: AdsAccount[]};

      setAdAccounts(response.data || []);

    } catch (_err) {
      setError('Falha ao carregar contas de anúncio.');

    } finally {
      setIsLoading(false);

    } , []);

  useEffect(() => {
    fetchAccounts();

  }, [fetchAccounts]);

  const confirmDelete = useCallback(async () => {
    if (!toDelete) return;
    setIsDeleting(true);

    try {
      await apiClient.delete(route('api.adstool.accounts.destroy', { account: toDelete.id }));

      toast.success('Conta de anúncio excluída com sucesso!');

      setToDelete(null);

      fetchAccounts();

    } catch (_err) {
      toast.error('Falha ao excluir a conta de anúncio. Tente novamente.');

    } finally {
      setIsDeleting(false);

    } , [toDelete, fetchAccounts]);

  const handleCreate = () => router.visit(route('adstool.accounts.create'));

  const handleEdit = (account: AdsAccount) => router.visit(route('adstool.accounts.edit', { account: account.id }));

  const renderContent = () => { if (isLoading) return <LoadingSpinner text="Carregando contas..." />;
    if (error) return <ErrorState message={error } />;
    if (!adAccounts.length) return <EmptyState title="Nenhuma conta encontrada" />;
    return (
              <AdAccountTable
        adAccounts={ adAccounts }
        onEdit={ handleEdit }
        onDelete={ (account: AdsAccount) => setToDelete(account) }
        onViewDetails={(account: AdsAccount) => router.visit(route('adstool.accounts.show', { account: account.id }))} />);};

  return (
        <>
      <AuthenticatedLayout />
      <Head title="Gerenciar Contas de Anúncio" / />
      <PageLayout
        actions={ <Button onClick={handleCreate } />
            Nova Conta
          </Button>
  }
  >
        {renderContent()}
        <ConfirmationModal
          isOpen={ !!toDelete }
          onClose={ () => setToDelete(null) }
          onConfirm={ confirmDelete }
          loading={ isDeleting }
          title="Excluir Conta"
          text={toDelete ? `Excluir a conta ${toDelete.name}?` : ''}
          type="danger" /></PageLayout></AuthenticatedLayout>);};

export default AccountsIndex;
