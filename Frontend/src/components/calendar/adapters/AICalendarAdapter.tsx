import React, { useEffect, useCallback } from 'react';
import { Brain } from 'lucide-react';
import UniversalCalendar, { CalendarEvent } from '@/components/calendar/UniversalCalendar.tsx';
import { useCalendarState, useCalendarAPI, useCalendarExport } from '@/hooks/useCalendar.tsx';

export interface AICalendarAdapterProps {
  onCreateJob?: () => void;
  onEditJob?: (aiJob: any) => void;
  refreshTrigger?: number;
}

const AICalendarAdapter: React.FC<AICalendarAdapterProps> = ({ onCreateJob, onEditJob, refreshTrigger }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();
  const { loading, fetchEvents, updateEvent: apiUpdateEvent, deleteEvent: apiDeleteEvent } = useCalendarAPI('/api/ai/jobs');
  const { exportToCSV } = useCalendarExport();

  const transformJobToEvent = useCallback((job: any): CalendarEvent => ({
    id: job.id,
    title: job.title,
    start: new Date(job.start_time),
    end: new Date(job.end_time),
    status: job.status,
    category: 'ai',
    resource: job,
  }), []);

  useEffect(() => {
    const loadAIJobs = async () => {
      try {
        const data = await fetchEvents();
        const transformedEvents = (data || []).map(transformJobToEvent);
        setEvents(transformedEvents);
      } catch (error) {
        console.error('Erro ao carregar jobs de IA : ', error);
        setEvents([]);
      }
    };

    loadAIJobs();
  }, [fetchEvents, transformJobToEvent, setEvents, refreshTrigger]);

  const aiConfig = {
    title: 'Calendário de Processamento IA',
    icon: Brain,
    allowCreate: true,
    allowEdit: true,
    allowDragDrop: true,
  } as const;

  const handleEventSelect = useCallback((event: CalendarEvent) => onEditJob?.(event.resource), [onEditJob]);

  const handleEventDrop = useCallback(
    async (event: CalendarEvent, start: Date, end: Date) => {
      try {
        await apiUpdateEvent(event.resource.id, { start_time: start, end_time: end });
        moveEvent(event.id, start, end);
      } catch (error) {
        console.error('Erro ao reagendar job: ', error);
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
        console.error('Erro ao excluir job: ', error);
      }
    },
    [apiDeleteEvent, removeEvent],
  );

  const handleCreateJob = useCallback(() => onCreateJob?.(), [onCreateJob]);

  const handleExport = useCallback((events: CalendarEvent[]) => exportToCSV(events, 'jobs-ia.csv'), [exportToCSV]);

  return (
    <UniversalCalendar
      events={events}
      config={aiConfig}
      loading={loading}
      onEventSelect={handleEventSelect}
      onEventDrop={handleEventDrop}
      onCreate={handleCreateJob}
      onEdit={handleEventSelect}
      onDelete={handleEventDelete}
      onExport={handleExport}
    />
  );
};

export default AICalendarAdapter;
