import React, { useCallback, useEffect } from 'react';
import { Users } from 'lucide-react';
import UniversalCalendar, { type CalendarEvent } from '@/components/calendar/UniversalCalendar.tsx';
import { useCalendarState, useCalendarAPI, useCalendarExport } from '@/hooks/useCalendar.tsx';

export interface LeadsCalendarAdapterProps {
  onCreateActivity?: () => void;
  onEditActivity?: (activity: any) => void;
  refreshTrigger?: number;
}

const LeadsCalendarAdapter: React.FC<LeadsCalendarAdapterProps> = ({ onCreateActivity, onEditActivity, refreshTrigger }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();
  const { loading, fetchEvents, updateEvent: apiUpdateEvent, deleteEvent: apiDeleteEvent } = useCalendarAPI(
    '/api/leads/activities',
  );
  const { exportToCSV } = useCalendarExport();

  const transformLeadActivityToEvent = useCallback((activity: any): CalendarEvent => {
    const date = activity?.scheduled_for || activity?.scheduled_at || activity?.date || Date.now();
    return {
      id: activity.id,
      title: activity.title || activity.type || 'Atividade',
      start: new Date(date),
      end: new Date(date),
      status: activity.status,
      category: 'lead',
      resource: activity,
    };
  }, []);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await fetchEvents();
        const transformed = (data || []).map(transformLeadActivityToEvent);
        setEvents(transformed);
      } catch (error) {
        console.error('Erro ao carregar atividades de leads:', error);
        setEvents([]);
      }
    };
    loadActivities();
  }, [fetchEvents, transformLeadActivityToEvent, setEvents, refreshTrigger]);

  const leadsConfig = {
    title: 'Calendário de Atividades - Leads',
    icon: Users,
    allowCreate: true,
    allowEdit: true,
    allowDragDrop: true,
  } as const;

  const handleEventSelect = useCallback((event: CalendarEvent) => onEditActivity?.(event.resource), [onEditActivity]);

  const handleEventDrop = useCallback(
    async (event: CalendarEvent, start: Date, end: Date) => {
      try {
        await apiUpdateEvent(event.resource.id, { scheduled_for: start });
        moveEvent(event.id, start, end);
      } catch (error) {
        console.error('Erro ao reagendar atividade:', error);
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
        console.error('Erro ao excluir atividade:', error);
      }
    },
    [apiDeleteEvent, removeEvent],
  );

  const handleCreate = useCallback(() => onCreateActivity?.(), [onCreateActivity]);
  const handleExport = useCallback((list: CalendarEvent[]) => exportToCSV(list, 'atividades-leads.csv'), [exportToCSV]);

  return (
    <UniversalCalendar
      events={events}
      config={leadsConfig}
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

export default LeadsCalendarAdapter;
