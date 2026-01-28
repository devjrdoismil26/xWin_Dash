import React, { useCallback, useEffect } from 'react';
import { Workflow } from 'lucide-react';
import UniversalCalendar, { type CalendarEvent } from '@/components/calendar/UniversalCalendar.tsx';
import { useCalendarState, useCalendarAPI, useCalendarExport } from '@/hooks/useCalendar.tsx';

export interface WorkflowCalendarAdapterProps {
  onCreateWorkflow?: () => void;
  onEditWorkflow?: (workflow: any) => void;
  refreshTrigger?: number;
}

const WorkflowCalendarAdapter: React.FC<WorkflowCalendarAdapterProps> = ({ onCreateWorkflow, onEditWorkflow, refreshTrigger }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();
  const { loading, fetchEvents, updateEvent: apiUpdateEvent, deleteEvent: apiDeleteEvent } = useCalendarAPI('/api/aura/flows');
  const { exportToCSV } = useCalendarExport();

  const transformWorkflowToEvent = useCallback((flow: any): CalendarEvent => {
    const date = flow?.scheduled_for || flow?.scheduled_at || flow?.date || Date.now();
    return {
      id: flow.id,
      title: flow.name || 'Workflow',
      start: new Date(date),
      end: new Date(date),
      status: flow.status,
      category: 'workflow',
      resource: flow,
    };
  }, []);

  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        const data = await fetchEvents();
        const transformed = (data || []).map(transformWorkflowToEvent);
        setEvents(transformed);
      } catch (error) {
        console.error('Erro ao carregar workflows:', error);
        setEvents([]);
      }
    };
    loadWorkflows();
  }, [fetchEvents, transformWorkflowToEvent, setEvents, refreshTrigger]);

  const workflowConfig = {
    title: 'Calendário de Workflows',
    icon: Workflow,
    allowCreate: true,
    allowEdit: true,
    allowDragDrop: true,
  } as const;

  const handleEventSelect = useCallback((event: CalendarEvent) => onEditWorkflow?.(event.resource), [onEditWorkflow]);

  const handleEventDrop = useCallback(
    async (event: CalendarEvent, start: Date, end: Date) => {
      try {
        await apiUpdateEvent(event.resource.id, { scheduled_for: start });
        moveEvent(event.id, start, end);
      } catch (error) {
        console.error('Erro ao reagendar workflow:', error);
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
        console.error('Erro ao excluir workflow:', error);
      }
    },
    [apiDeleteEvent, removeEvent],
  );

  const handleCreateWorkflow = useCallback(() => onCreateWorkflow?.(), [onCreateWorkflow]);
  const handleExport = useCallback((list: CalendarEvent[]) => exportToCSV(list, 'workflows-agendados.csv'), [exportToCSV]);

  return (
    <UniversalCalendar
      events={events}
      config={workflowConfig}
      loading={loading}
      onEventSelect={handleEventSelect}
      onEventDrop={handleEventDrop}
      onCreate={handleCreateWorkflow}
      onEdit={handleEventSelect}
      onDelete={handleEventDelete}
      onExport={handleExport}
    />
  );
};

export default WorkflowCalendarAdapter;
