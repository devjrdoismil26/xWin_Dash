import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import auraService from '../services/auraService';
interface ScheduledJob {
  id: string;
  name: string;
  type: 'flow_trigger' | 'message_broadcast' | 'lead_followup';
  schedule: string;
  status: 'active' | 'paused' | 'completed';
  next_run: string;
  config: any;
}
const WorkflowScheduler: React.FC<{ auth?: any }> = ({ auth }) => {
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  useEffect(() => {
    loadScheduledJobs();
  }, []);
  const loadScheduledJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call - replace with actual service call
      const mockJobs: ScheduledJob[] = [
        {
          id: '1',
          name: 'Mensagem de Bom Dia',
          type: 'message_broadcast',
          schedule: '0 9 * * *', // 9:00 AM daily
          status: 'active',
          next_run: '2024-01-15 09:00:00',
          config: {
            message: 'Bom dia! Como podemos ajudar você hoje?',
            contacts: ['555-1234', '555-5678'],
          },
        },
        {
          id: '2',
          name: 'Follow-up de Leads Inativos',
          type: 'lead_followup',
          schedule: '0 14 * * MON', // 2:00 PM every Monday
          status: 'active',
          next_run: '2024-01-15 14:00:00',
          config: {
            inactive_days: 7,
            message: 'Olá! Notamos que você não interage conosco há alguns dias. Precisa de ajuda?',
          },
        },
        {
          id: '3',
          name: 'Ativar Fluxo de Promoção',
          type: 'flow_trigger',
          schedule: '0 12 1 * *', // First day of month at noon
          status: 'paused',
          next_run: '2024-02-01 12:00:00',
          config: {
            flow_id: 'flow_123',
            trigger_keywords: ['promoção', 'desconto'],
          },
        },
      ];
      setTimeout(() => {
        setScheduledJobs(mockJobs);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Erro ao carregar as automações programadas');
      setIsLoading(false);
    }
  };
  const handleToggleStatus = async (jobId: string) => {
    try {
      setScheduledJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: job.status === 'active' ? 'paused' : 'active' }
          : job
      ));
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError('Erro ao alterar status da automação');
    }
  };
  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta automação?')) {
      return;
    }
    try {
      setScheduledJobs(prev => prev.filter(job => job.id !== jobId));
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError('Erro ao excluir a automação');
    }
  };
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', className: 'bg-green-100 text-green-800' },
      paused: { label: 'Pausado', className: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Concluído', className: 'bg-blue-100 text-blue-800' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, className: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };
  const getTypeIcon = (type: string) => {
    const icons = {
      flow_trigger: '🔄',
      message_broadcast: '📢',
      lead_followup: '👥',
    };
    return icons[type as keyof typeof icons] || '⚙️';
  };
  const formatSchedule = (schedule: string) => {
    // Simple cron expression formatter
    const scheduleMap: { [key: string]: string } = {
      '0 9 * * *': 'Diariamente às 9:00',
      '0 14 * * MON': 'Segundas-feiras às 14:00',
      '0 12 1 * *': '1º dia do mês às 12:00',
    };
    return scheduleMap[schedule] || schedule;
  };
  if (isLoading) {
    return (
      <AuthenticatedLayout user={auth?.user}>
        <Head title="Agendador de Workflows" />
        <PageLayout title="Automações Programadas">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando automações...</p>
            </div>
          </div>
        </PageLayout>
      </AuthenticatedLayout>
    );
  }
  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Agendador de Workflows" />
      <PageLayout title="Automações Programadas">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Suas Automações</h2>
            <p className="text-gray-600">Gerencie automações e tarefas programadas</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            Nova Automação
          </Button>
        </div>
        <div className="grid gap-4">
          {scheduledJobs.map(job => (
            <Card key={job.id}>
              <Card.Content className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getTypeIcon(job.type)}</div>
                    <div>
                      <h3 className="font-semibold">{job.name}</h3>
                      <p className="text-sm text-gray-600">
                        {formatSchedule(job.schedule)} • Próxima execução: {new Date(job.next_run).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(job.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(job.id)}
                    >
                      {job.status === 'active' ? 'Pausar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
                {/* Job configuration details */}
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Configuração:</h4>
                  <div className="text-sm text-gray-600">
                    {job.type === 'message_broadcast' && (
                      <>
                        <p><strong>Mensagem:</strong> {job.config.message}</p>
                        <p><strong>Contatos:</strong> {job.config.contacts?.length || 0} contatos</p>
                      </>
                    )}
                    {job.type === 'lead_followup' && (
                      <>
                        <p><strong>Dias de inatividade:</strong> {job.config.inactive_days}</p>
                        <p><strong>Mensagem:</strong> {job.config.message}</p>
                      </>
                    )}
                    {job.type === 'flow_trigger' && (
                      <>
                        <p><strong>Fluxo:</strong> {job.config.flow_id}</p>
                        <p><strong>Palavras-chave:</strong> {job.config.trigger_keywords?.join(', ')}</p>
                      </>
                    )}
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
        {scheduledJobs.length === 0 && !isLoading && (
          <Card>
            <Card.Content className="p-8 text-center">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-lg font-semibold mb-2">Nenhuma automação configurada</h3>
              <p className="text-gray-600 mb-4">
                Crie sua primeira automação para começar a otimizar seus processos
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                Criar Primeira Automação
              </Button>
            </Card.Content>
          </Card>
        )}
        {/* Simple create modal placeholder */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Nova Automação</h3>
              <p className="text-gray-600 mb-4">
                Funcionalidade de criação será implementada em breve.
              </p>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={() => setShowCreateModal(false)}>
                  Ok
                </Button>
              </div>
            </div>
          </div>
        )}
      </PageLayout>
    </AuthenticatedLayout>
  );
};
export default WorkflowScheduler;
