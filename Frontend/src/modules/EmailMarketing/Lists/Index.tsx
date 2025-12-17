import React, { useEffect, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { getErrorMessage } from '@/utils/errorHelpers';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import Button from '@/shared/components/ui/Button';
import ConfirmationModal from '@/shared/components/ui/ConfirmationModal';
import { apiClient } from '@/services';
type EmailList = {
  id: number | string;
  name: string;
  description?: string;
  subscribers_count?: number;
  project?: { name?: string } | null;
  created_at?: string;};

const EmailMarketingListsIndex: React.FC = () => {
  const [lists, setLists] = useState<EmailList[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);

  const [lastPage, setLastPage] = useState<number>(1);

  const [filters, setFilters] = useState<{ search: string; project_id: string; sort: string; direction: 'asc' | 'desc' }>(
    { search: '', project_id: '', sort: 'created_at', direction: 'desc' });

  const [listToDelete, setListToDelete] = useState<EmailList | null>(null);

  const [processing, setProcessing] = useState<boolean>(false);

  const fetchLists = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const { data } = await apiClient.get('/api/email-marketing/lists', {
        params: { page, search: filters.search || undefined, project_id: filters.project_id || undefined, sort: filters.sort, direction: filters.direction },
      });

      setLists(data?.data || data?.items || []);

      setLastPage(data?.last_page || data?.meta?.last_page || 1);

    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } };

      setError(errorObj?.response?.data?.message || getErrorMessage(err));

    } finally {
      setLoading(false);

    } , [page, filters]);

  useEffect(() => {
    fetchLists();

  }, [fetchLists]);

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev: unknown) => ({ ...prev, [field]: value }));

    setPage(1);};

  const handleSort = (column: string) => {
    setFilters((prev: unknown) => ({
      ...prev,
      sort: column,
      direction: prev.sort === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));};

  const handleDelete = async () => {
    if (!listToDelete) return;
    setProcessing(true);

    try {
      await apiClient.delete(`/api/email-marketing/lists/${listToDelete.id}`);

      setListToDelete(null);

      fetchLists();

    } catch (err) {
      // ignore toast here to keep minimal surface
    } finally {
      setProcessing(false);

    } ;

  return (
        <>
      <AuthenticatedLayout />
      <Head title="Listas de E-mail" / />
      <PageLayout />
        <Card />
          <Card.Header />
            <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="search">Buscar</InputLabel>
                  <Input id="search" value={filters.search} onChange={(e: unknown) => handleFilterChange('search', e.target.value)} placeholder="Buscar por nome..." /></div><div>
           
        </div><InputLabel htmlFor="project">Projeto</InputLabel>
                  <Select id="project" value={filters.project_id} onChange={ (e: unknown) => handleFilterChange('project_id', e.target.value)  }>
                    <option value="">Todos</option></Select></div>
              <div className=" ">$2</div><Button onClick={() => fetchLists()} variant="outline">Atualizar</Button></div></Card.Header>
          <Card.Content />
            {loading ? (
              <div className="py-10 text-center text-sm text-gray-500">Carregando...</div>
            ) : error ? (
              <div className="py-10 text-center text-sm text-red-600">{error}</div>
            ) : lists.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-500">Nenhuma lista encontrada.</div>
            ) : (
              <div className=" ">$2</div><table className="w-full text-sm" />
                  <thead />
                    <tr className="border-b" />
                      <th className="text-left p-3 cursor-pointer" onClick={ () => handleSort('name') }>Nome</th>
                      <th className="text-left p-3">Descrição</th>
                      <th className="text-left p-3 cursor-pointer" onClick={ () => handleSort('subscribers_count') }>Inscritos</th>
                      <th className="text-left p-3">Projeto</th>
                      <th className="text-left p-3 cursor-pointer" onClick={ () => handleSort('created_at') }>Criado em</th>
                      <th className="text-right p-3">Ações</th></tr></thead>
                  <tbody />
                    {(lists || []).map((item: unknown) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50" />
                        <td className="p-3 font-medium text-gray-900">{item.name}</td>
                        <td className="p-3 text-gray-700">{item.description || '—'}</td>
                        <td className="p-3">{item.subscribers_count ?? 0}</td>
                        <td className="p-3">{item.project?.name || 'N/A'}</td>
                        <td className="p-3">{item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '-'}</td>
                        <td className="p-3 text-right" />
                          <Button variant="destructive" size="sm" onClick={ () => setListToDelete(item) }>Excluir</Button></td></tr>
                    ))}
                  </tbody></table></div>
            )}
            {lastPage > 1 && (
              <div className=" ">$2</div><Button variant="outline" size="sm" disabled={page <= 1} onClick={ () => setPage((p: unknown) => Math.max(1, p - 1)) }>Anterior</Button>
                <div className="px-2 py-1 text-sm">Página {page} de {lastPage}</div>
                <Button variant="outline" size="sm" disabled={page >= lastPage} onClick={ () => setPage((p: unknown) => Math.min(lastPage, p + 1)) }>Próxima</Button>
      </div>
    </>
  )}
          </Card.Content></Card></PageLayout>
      <ConfirmationModal
        open={ !!listToDelete }
        onClose={ () => setListToDelete(null) }
        onConfirm={ handleDelete }
        processing={ processing }
        title="Confirmar exclusão"
        text={`Tem certeza que deseja excluir a lista "${listToDelete?.name || ''}"?`}
        confirmText="Excluir"
        cancelText="Cancelar" />
    </AuthenticatedLayout>);};

export default EmailMarketingListsIndex;
