import React, { useCallback, useEffect } from 'react';
import { Mail } from 'lucide-react';
import UniversalCalendar, { type CalendarEvent } from '@/components/calendar/UniversalCalendar.tsx';
import { useCalendarState, useCalendarAPI, useCalendarExport } from '@/hooks/useCalendar.tsx';

export interface EmailCalendarAdapterProps {
  onCreateEmail?: () => void;
  onEditEmail?: (email: any) => void;
  refreshTrigger?: number;
}

const EmailCalendarAdapter: React.FC<EmailCalendarAdapterProps> = ({ onCreateEmail, onEditEmail, refreshTrigger }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();
  const { loading, fetchEvents, updateEvent: apiUpdateEvent, deleteEvent: apiDeleteEvent } = useCalendarAPI(
    '/api/email-marketing/campaigns',
  );
  const { exportToCSV } = useCalendarExport();

  const transformEmailToEvent = useCallback(
    (email: any): CalendarEvent => {
      const date = email?.scheduled_at || email?.scheduled_for || email?.date || Date.now();
      return {
        id: email.id,
        title: email.subject || 'Campanha de Email',
        start: new Date(date),
        end: new Date(date),
        status: email.status,
        category: 'email',
        resource: email,
      };
    },
    [],
  );

  useEffect(() => {
    const loadEmails = async () => {
      try {
        const data = await fetchEvents();
        const transformed = (data || []).map(transformEmailToEvent);
        setEvents(transformed);
      } catch (error) {
        console.error('Erro ao carregar campanhas de email:', error);
        setEvents([]);
      }
    };
    loadEmails();
  }, [fetchEvents, transformEmailToEvent, setEvents, refreshTrigger]);

  const emailConfig = {
    title: 'Calendário de Emails',
    icon: Mail,
    allowCreate: true,
    allowEdit: true,
    allowDragDrop: true,
  } as const;

  const handleEventSelect = useCallback((event: CalendarEvent) => onEditEmail?.(event.resource), [onEditEmail]);

  const handleEventDrop = useCallback(
    async (event: CalendarEvent, start: Date, end: Date) => {
      try {
        await apiUpdateEvent(event.resource.id, { scheduled_at: start });
        moveEvent(event.id, start, end);
      } catch (error) {
        console.error('Erro ao reagendar email:', error);
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
        console.error('Erro ao excluir email:', error);
      }
    },
    [apiDeleteEvent, removeEvent],
  );

  const handleCreate = useCallback(() => onCreateEmail?.(), [onCreateEmail]);
  const handleExport = useCallback((list: CalendarEvent[]) => exportToCSV(list, 'campanhas-email.csv'), [exportToCSV]);

  return (
    <UniversalCalendar
      events={events}
      config={emailConfig}
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

export default EmailCalendarAdapter;
