// =========================================
// SOCIAL SCHEDULES MANAGER COMPONENT
// =========================================

import React, { useState, useCallback, useMemo } from 'react';
import { Card, Button, LoadingSpinner } from '@/components/ui';
import { PageTransition } from '@/components/ui/AdvancedAnimations';
import { useSocialBufferStore } from '../../hooks';
import { useSocialBufferUI } from '../../hooks/useSocialBufferUI';
import { 
  SocialBufferLoadingSkeleton, 
  SocialBufferErrorState, 
  SocialBufferEmptyState,
  SocialBufferSuccessState 
} from '../ui';

interface Schedule {
  id: string;
  content: string;
  platforms: string[];
  scheduledTime: Date;
  status: 'pending' | 'published' | 'failed';
  createdAt: Date;
}

interface SocialSchedulesManagerProps {
  className?: string;
  onScheduleCreated?: (schedule: Schedule) => void;
  onScheduleUpdated?: (schedule: Schedule) => void;
  onScheduleDeleted?: (scheduleId: string) => void;
}

const SocialSchedulesManager: React.FC<SocialSchedulesManagerProps> = ({
  className = '',
  onScheduleCreated,
  onScheduleUpdated,
  onScheduleDeleted
}) => {
  const { 
    schedules, 
    loading, 
    error, 
    createSchedule, 
    updateSchedule, 
    deleteSchedule,
    publishSchedule 
  } = useSocialBufferStore();
  
  const { 
    debouncedSearch, 
    memoizedFilter, 
    handleSearchChange,
    handleFilterChange 
  } = useSocialBufferUI();

  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  // ===== HANDLERS =====

  const handleCreateSchedule = useCallback(async (scheduleData: Partial<Schedule>) => {
    try {
      const newSchedule = await createSchedule(scheduleData);
      onScheduleCreated?.(newSchedule);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
    }
  }, [createSchedule, onScheduleCreated]);

  const handleUpdateSchedule = useCallback(async (scheduleId: string, updates: Partial<Schedule>) => {
    try {
      const updatedSchedule = await updateSchedule(scheduleId, updates);
      onScheduleUpdated?.(updatedSchedule);
      setEditingSchedule(null);
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
    }
  }, [updateSchedule, onScheduleUpdated]);

  const handleDeleteSchedule = useCallback(async (scheduleId: string) => {
    try {
      await deleteSchedule(scheduleId);
      onScheduleDeleted?.(scheduleId);
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
    }
  }, [deleteSchedule, onScheduleDeleted]);

  const handlePublishSchedule = useCallback(async (scheduleId: string) => {
    try {
      await publishSchedule(scheduleId);
    } catch (error) {
      console.error('Erro ao publicar agendamento:', error);
    }
  }, [publishSchedule]);

  const handleBulkAction = useCallback(async (action: 'delete' | 'publish') => {
    try {
      if (action === 'delete') {
        await Promise.all(selectedSchedules.map(id => deleteSchedule(id)));
      } else if (action === 'publish') {
        await Promise.all(selectedSchedules.map(id => publishSchedule(id)));
      }
      setSelectedSchedules([]);
    } catch (error) {
      console.error(`Erro na ação em lote ${action}:`, error);
    }
  }, [selectedSchedules, deleteSchedule, publishSchedule]);

  // ===== MEMOIZED VALUES =====

  const filteredSchedules = useMemo(() => {
    return memoizedFilter(schedules, debouncedSearch, ['content', 'platforms']);
  }, [schedules, memoizedFilter, debouncedSearch]);

  const scheduleStats = useMemo(() => {
    return {
      total: schedules.length,
      pending: schedules.filter(s => s.status === 'pending').length,
      published: schedules.filter(s => s.status === 'published').length,
      failed: schedules.filter(s => s.status === 'failed').length
    };
  }, [schedules]);

  // ===== RENDER STATES =====

  if (loading) {
    return <SocialBufferLoadingSkeleton type="schedules" />;
  }

  if (error) {
    return (
      <SocialBufferErrorState 
        error={error}
        onRetry={() => window.location.reload()}
        title="Erro ao carregar agendamentos"
      />
    );
  }

  if (schedules.length === 0) {
    return (
      <SocialBufferEmptyState
        title="Nenhum agendamento encontrado"
        description="Crie seu primeiro agendamento para começar a gerenciar suas publicações"
        actionText="Criar Agendamento"
        onAction={() => setShowCreateModal(true)}
      />
    );
  }

  return (
    <PageTransition>
      <div className={`social-schedules-manager ${className}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gerenciador de Agendamentos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie suas publicações agendadas
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Novo Agendamento
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">{scheduleStats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{scheduleStats.pending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pendentes</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">{scheduleStats.published}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Publicados</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-red-600">{scheduleStats.failed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Falharam</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar agendamentos..."
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <select
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Todos os status</option>
                <option value="pending">Pendentes</option>
                <option value="published">Publicados</option>
                <option value="failed">Falharam</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Bulk Actions */}
        {selectedSchedules.length > 0 && (
          <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 dark:text-blue-300">
                {selectedSchedules.length} agendamento(s) selecionado(s)
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleBulkAction('publish')}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  Publicar
                </Button>
                <Button
                  onClick={() => handleBulkAction('delete')}
                  className="bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  Deletar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Schedules List */}
        <div className="space-y-4">
          {filteredSchedules.map((schedule) => (
            <Card key={schedule.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedSchedules.includes(schedule.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSchedules(prev => [...prev, schedule.id]);
                        } else {
                          setSelectedSchedules(prev => prev.filter(id => id !== schedule.id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      schedule.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      schedule.status === 'published' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {schedule.status === 'pending' ? 'Pendente' :
                       schedule.status === 'published' ? 'Publicado' : 'Falhou'}
                    </span>
                  </div>
                  
                  <p className="text-gray-900 dark:text-white mb-2">
                    {schedule.content}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Plataformas: {schedule.platforms.join(', ')}</span>
                    <span>Agendado para: {schedule.scheduledTime.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  {schedule.status === 'pending' && (
                    <Button
                      onClick={() => handlePublishSchedule(schedule.id)}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      Publicar
                    </Button>
                  )}
                  <Button
                    onClick={() => setEditingSchedule(schedule)}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="bg-red-600 hover:bg-red-700"
                    size="sm"
                  >
                    Deletar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default SocialSchedulesManager;
