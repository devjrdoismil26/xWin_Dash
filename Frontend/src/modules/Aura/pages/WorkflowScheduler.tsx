import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import auraService from '../services/auraService';
interface ScheduledJob {
  id: string;
  name: string;
  type: 'flow_trigger' | 'message_broadcast' | 'lead_followup';
  schedule: string;
  status: 'active' | 'paused' | 'completed';
  next_run: string;
  config: unknown; }
const WorkflowScheduler: React.FC<{ auth?: string }> = ({ auth    }) => {
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

    } ;

  const handleToggleStatus = async (jobId: string) => {
    try {
      setScheduledJobs(prev => (prev || []).map(job => 
        job.id === jobId 
          ? { ...job, status: job.status === 'active' ? 'paused' : 'active' }
          : job
      ));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (err) {
      setError('Erro ao alterar status da automação');

    } ;

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta automação?')) {
      return;
    }
    try {
      setScheduledJobs(prev => (prev || []).filter(job => job.id !== jobId));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (err) {
      setError('Erro ao excluir a automação');

    } ;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', className: 'bg-green-100 text-green-800' },
      paused: { label: 'Pausado', className: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Concluído', className: 'bg-blue-100 text-blue-800' },};

    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, className: 'bg-gray-100 text-gray-800'};

    return (
        <>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className} `}>
      </span>{config.label}
      </span>);};

  const getTypeIcon = (type: string) => {
    const icons = {
      flow_trigger: '🔄',
      message_broadcast: '📢',
      lead_followup: '👥',};

    return icons[type as keyof typeof icons] || '⚙️';};

  const formatSchedule = (schedule: string) => {
    // Simple cron expression formatter
    const scheduleMap: { [key: string]: string } = {
      '0 9 * * *': 'Diariamente às 9:00',
      '0 14 * * MON': 'Segundas-feiras às 14:00',
      '0 12 1 * *': '1º dia do mês às 12:00',};

    return scheduleMap[schedule] || schedule;};

  if (isLoading) { return (
        <>
      <AuthenticatedLayout user={auth?.user } />
      <Head title="Agendador de Workflows" / />
        <PageLayout title="Automações Programadas" />
          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><p className="text-gray-600">Carregando automações...</p></div></PageLayout>
      </AuthenticatedLayout>);

  }
  return (
        <>
      <AuthenticatedLayout user={ auth?.user } />
      <Head title="Agendador de Workflows" / />
      <PageLayout title="Automações Programadas" />
        {error && (
          <div className=" ">$2</div><p className="text-red-700">{error}</p>
      </div>
    </>
  )}
        <div className=" ">$2</div><div>
           
        </div><h2 className="text-lg font-semibold">Suas Automações</h2>
            <p className="text-gray-600">Gerencie automações e tarefas programadas</p></div><Button onClick={ () => setShowCreateModal(true)  }>
            Nova Automação
          </Button></div><div className="{ (scheduledJobs || []).map(job => (">$2</div>
            <Card key={job.id } />
              <Card.Content className="p-6" />
                <div className=" ">$2</div><div className=" ">$2</div><div className="text-2xl">{getTypeIcon(job.type)}</div>
                    <div>
           
        </div><h3 className="font-semibold">{job.name}</h3>
                      <p className="text-sm text-gray-600" />
                        {formatSchedule(job.schedule)} • Próxima execução: {new Date(job.next_run).toLocaleString('pt-BR')}
                      </p></div><div className="{getStatusBadge(job.status)}">$2</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={ () => handleToggleStatus(job.id)  }>
                      {job.status === 'active' ? 'Pausar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={ () => handleDeleteJob(job.id)  }>
                      Excluir
                    </Button>
                  </div>
                {/* Job configuration details */}
                <div className=" ">$2</div><h4 className="text-sm font-medium mb-2">Configuração:</h4>
                  <div className="{job.type === 'message_broadcast' && (">$2</div>
                      <>
                        <p><strong>Mensagem:</strong> {job.config.message}</p>
                        <p><strong>Contatos:</strong> {job.config.contacts?.length || 0} contatos</p>
      </>
    </>
  )}
                    {job.type === 'lead_followup' && (
                      <>
                        <p><strong>Dias de inatividade:</strong> {job.config.inactive_days}</p>
                        <p><strong>Mensagem:</strong> {job.config.message}</p>
      </>
    </>
  )}
                    {job.type === 'flow_trigger' && (
                      <>
                        <p><strong>Fluxo:</strong> {job.config.flow_id}</p>
                        <p><strong>Palavras-chave:</strong> {job.config.trigger_keywords?.join(', ')}</p>
      </>
    </>
  )}
                  </div>
              </Card.Content>
      </Card>
    </>
  ))}
        </div>
        { scheduledJobs.length === 0 && !isLoading && (
          <Card />
            <Card.Content className="p-8 text-center" />
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-lg font-semibold mb-2">Nenhuma automação configurada</h3>
              <p className="text-gray-600 mb-4" />
                Crie sua primeira automação para começar a otimizar seus processos
              </p>
              <Button onClick={ () => setShowCreateModal(true)  }>
                Criar Primeira Automação
              </Button>
            </Card.Content>
      </Card>
    </>
  )}
        {/* Simple create modal placeholder */}
        { showCreateModal && (
          <div className=" ">$2</div><div className=" ">$2</div><h3 className="text-lg font-semibold mb-4">Nova Automação</h3>
              <p className="text-gray-600 mb-4" />
                Funcionalidade de criação será implementada em breve.
              </p>
              <div className=" ">$2</div><Button 
                  variant="outline" 
                  onClick={ () => setShowCreateModal(false)  }>
                  Cancelar
                </Button>
                <Button onClick={ () => setShowCreateModal(false)  }>
                  Ok
                </Button></div></div>
        )}
      </PageLayout>
    </AuthenticatedLayout>);};

export default WorkflowScheduler;
