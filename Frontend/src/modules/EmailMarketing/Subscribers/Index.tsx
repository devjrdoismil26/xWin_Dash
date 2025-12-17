import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Modal from '@/shared/components/ui/Modal';
import ConfirmationModal from '@/shared/components/ui/ConfirmationModal';
interface SubscriberItem {
  id: number | string;
  name?: string;
  email: string;
  status?: string;
  created_at?: string; }
const EmailMarketingSubscribersIndex: React.FC = () => {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);

  const [loading, setLoading] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberItem | null>(null);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setSubscribers([]);

      setLoading(false);

    }, 200);

  }, []);

  return (
        <>
      <AuthenticatedLayout />
      <Head title="Inscritos" / />
      <PageLayout />
        <div className=" ">$2</div><div className=" ">$2</div><h1 className="text-2xl font-bold text-gray-900">Inscritos</h1>
            <Button onClick={ () => setIsFormModalOpen(true) }>Novo</Button></div><Card />
            <Card.Content />
              {loading ? (
                <div className="py-8 text-center text-sm text-gray-500">Carregando...</div>
              ) : subscribers.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">Nenhum inscrito encontrado.</div>
              ) : (
                <div className=" ">$2</div><table className="min-w-full text-sm" />
                    <thead />
                      <tr className="text-left border-b" />
                        <th className="py-2 px-3">Email</th>
                        <th className="py-2 px-3">Nome</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">Criado em</th>
                        <th className="py-2 px-3 text-right">Ações</th></tr></thead>
                    <tbody />
                      {(subscribers || []).map((item: unknown) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50" />
                          <td className="py-2 px-3">{item.email}</td>
                          <td className="py-2 px-3">{item.name || 'N/A'}</td>
                          <td className="py-2 px-3">{item.status || '-'}</td>
                          <td className="py-2 px-3">{item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '-'}</td>
                          <td className="py-2 px-3" />
                            <div className=" ">$2</div><Button variant="outline" size="sm" onClick={ () => setSelectedSubscriber(item) }>Editar</Button>
                              <Button variant="destructive" size="sm" onClick={ () => setIsConfirmDeleteModalOpen(true) }>Excluir</Button></div></td>
      </tr>
    </>
  ))}
                    </tbody></table></div>
              )}
            </Card.Content></Card><Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={ selectedSubscriber ? 'Editar Inscrito' : 'Adicionar Novo Inscrito'  }>
            <div className="p-2 text-sm text-gray-600">Formulário em construção</div></Modal><ConfirmationModal
            isOpen={ isConfirmDeleteModalOpen }
            onClose={ () => setIsConfirmDeleteModalOpen(false) }
            onConfirm={ () => setIsConfirmDeleteModalOpen(false) }
            title="Excluir Inscrito"
            text="Tem certeza que deseja excluir este inscrito?" /></div></PageLayout>
    </AuthenticatedLayout>);};

export default EmailMarketingSubscribersIndex;
