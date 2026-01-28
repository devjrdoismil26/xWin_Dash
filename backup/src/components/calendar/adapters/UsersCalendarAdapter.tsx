import React, { useCallback, useEffect } from 'react';
import { User } from 'lucide-react';
import UniversalCalendar, { type CalendarEvent } from '@/components/calendar/UniversalCalendar.tsx';
import { useCalendarState, useCalendarAPI, useCalendarExport } from '@/hooks/useCalendar.tsx';

export interface UsersCalendarAdapterProps {
  onCreateTask?: () => void;
  onEditTask?: (task: any) => void;
  refreshTrigger?: number;
}

const UsersCalendarAdapter: React.FC<UsersCalendarAdapterProps> = ({ onCreateTask, onEditTask, refreshTrigger }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();
  const { loading, fetchEvents, updateEvent: apiUpdateEvent, deleteEvent: apiDeleteEvent } = useCalendarAPI(
    '/api/users/tasks',
  );
  const { exportToCSV } = useCalendarExport();

  const transformUserTaskToEvent = useCallback((task: any): CalendarEvent => {
    const date = task?.scheduled_for || task?.scheduled_at || task?.due_date || task?.date || Date.now();
    return {
      id: task.id,
      title: task.title || 'Tarefa',
      start: new Date(date),
      end: new Date(date),
      status: task.status,
      category: 'user-task',
      resource: task,
    };
  }, []);

  useEffect(() => {
    const loadUserTasks = async () => {
      try {
        const data = await fetchEvents();
        const transformed = (data || []).map(transformUserTaskToEvent);
        setEvents(transformed);
      } catch (error) {
        console.error('Erro ao carregar tarefas de usuários:', error);
        setEvents([]);
      }
    };
    loadUserTasks();
  }, [fetchEvents, transformUserTaskToEvent, setEvents, refreshTrigger]);

  const usersConfig = {
    title: 'Calendário de Tarefas',
    icon: User,
    allowCreate: true,
    allowEdit: true,
    allowDragDrop: true,
  } as const;

  const handleEventSelect = useCallback((event: CalendarEvent) => onEditTask?.(event.resource), [onEditTask]);

  const handleEventDrop = useCallback(
    async (event: CalendarEvent, start: Date, end: Date) => {
      try {
        await apiUpdateEvent(event.resource.id, { scheduled_for: start });
        moveEvent(event.id, start, end);
      } catch (error) {
        console.error('Erro ao reagendar tarefa:', error);
      }
    },
    [apiUpdateEvent, moveEvent],
  );

  const handleEventDelete = useCallback(
    async (event: CalendarEvent) => {
      try {
        await apiDeleteEvent(event.resource.id);
        removeEvent(event.id);
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
      }
    },
    [apiDeleteEvent, removeEvent],
  );

  const handleCreate = useCallback(() => onCreateTask?.(), [onCreateTask]);
  const handleExport = useCallback((list: CalendarEvent[]) => exportToCSV(list, 'tarefas-usuarios.csv'), [exportToCSV]);

  return (
    <UniversalCalendar
      events={events}
      config={usersConfig}
      loading={loading}
      onEventSelect={handleEventSelect}
      onEventDrop={handleEventDrop}
      onCreate={handleCreate}
      onEdit={handleEventSelect}
      onDelete={handleEventDelete}
      onExport={handleExport}
    />
  );
};

export default UsersCalendarAdapter;
