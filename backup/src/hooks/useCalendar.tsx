import { useCallback, useState } from 'react';

import { toast } from 'sonner';
import type { CalendarEvent, UniversalCalendarConfig } from '@/components/calendar/UniversalCalendar.tsx';
import { apiClient } from '@/services';

export function useCalendarState() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const moveEvent = useCallback((eventId: CalendarEvent['id'], start: Date, end: Date) => {
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, start, end } : e)));
  }, []);

  const removeEvent = useCallback((eventId: CalendarEvent['id']) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  }, []);

  return { events, setEvents, moveEvent, removeEvent } as const;
}

export function useCalendarAPI(endpoint: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(endpoint);
      return response.data ?? [];
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar eventos';
      setError(message);
      toast.error(message);
      return [] as any[];
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const createEvent = useCallback(
    async (eventData: any) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post(endpoint, eventData);
        toast.success('Evento criado com sucesso!');
        return response.data;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro ao criar evento';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  const updateEvent = useCallback(
    async (eventId: string | number, eventData: any) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.put(`${endpoint}/${eventId}`, eventData);
        toast.success('Evento atualizado com sucesso!');
        return response.data;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro ao atualizar evento';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  const deleteEvent = useCallback(
    async (eventId: string | number) => {
      setLoading(true);
      setError(null);
      try {
        await apiClient.delete(`${endpoint}/${eventId}`);
        toast.success('Evento excluído com sucesso!');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro ao excluir evento';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  return { loading, error, fetchEvents, createEvent, updateEvent, deleteEvent } as const;
}

export function useCalendarExport() {
  const exportToCSV = useCallback((events: CalendarEvent[], filename: string = 'calendar-events.csv') => {
    const headers = ['ID', 'Título', 'Data Início', 'Data Fim', 'Tipo', 'Status', 'Plataforma'];
    const rows = events.map((event) => [
      event.id,
      `"${event.title}"`,
      moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
      moment(event.end).format('YYYY-MM-DD HH:mm:ss'),
      event.category || '',
      event.status || '',
      event.platform || '',
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Calendário exportado com sucesso!');
  }, []);

  const exportToICS = useCallback((events: CalendarEvent[], filename: string = 'calendar-events.ics') => {
    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//xWin Dash//Calendar//EN',
      ...events.flatMap((event) => [
        'BEGIN:VEVENT',
        `UID:${event.id}@xwindash.com`,
        `DTSTART:${moment(event.start).utc().format('YYYYMMDDTHHmmss')}Z`,
        `DTEND:${moment(event.end).utc().format('YYYYMMDDTHHmmss')}Z`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${(event.category || '').replaceAll(',', ' ')} - ${(event.status || '').replaceAll(',', ' ')}`,
        'END:VEVENT',
      ]),
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsLines], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Calendário exportado para ICS com sucesso!');
  }, []);

  return { exportToCSV, exportToICS } as const;
}

export const defaultCalendarConfig: UniversalCalendarConfig = {
  title: 'Calendário',
  defaultView: 'month',
  allowCreate: true,
  allowEdit: true,
  allowDragDrop: true,
  showLegend: false,
};
