import React, { useEffect, useCallback } from 'react';
import { BarChart } from 'lucide-react';
import UniversalCalendar, { CalendarEvent } from '@/components/calendar/UniversalCalendar.tsx';
import { useCalendarState, useCalendarAPI, useCalendarExport } from '@/hooks/useCalendar.tsx';

export interface AnalyticsCalendarAdapterProps {
  onCreateReport?: () => void;
  onEditReport?: (report: any) => void;
  refreshTrigger?: number;
}

const AnalyticsCalendarAdapter: React.FC<AnalyticsCalendarAdapterProps> = ({ onCreateReport, onEditReport, refreshTrigger }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();
  const { loading, fetchEvents, updateEvent: apiUpdateEvent, deleteEvent: apiDeleteEvent } = useCalendarAPI('/api/analytics/reports');
  const { exportToCSV } = useCalendarExport();

  const transformReportToEvent = useCallback((report: any): CalendarEvent => ({
    id: report.id,
    title: report.title,
    start: new Date(report.scheduled_for),
    end: new Date(report.scheduled_for),
    status: report.status,
    category: 'analytics',
    resource: report,
  }), []);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchEvents();
        const transformedEvents = (data || []).map(transformReportToEvent);
        setEvents(transformedEvents);
      } catch (error) {
        console.error('Erro ao carregar relatórios : ', error);
        setEvents([]);
      }
    };

    loadReports();
  }, [fetchEvents, transformReportToEvent, setEvents, refreshTrigger]);

  const analyticsConfig = { title: 'Calendário de Relatórios', icon: BarChart, allowCreate: true, allowEdit: true, allowDragDrop: true } as const;

  const handleEventSelect = useCallback((event: CalendarEvent) => onEditReport?.(event.resource), [onEditReport]);

  const handleEventDrop = useCallback(
    async (event: CalendarEvent, start: Date, end: Date) => {
      try {
        await apiUpdateEvent(event.resource.id, { scheduled_for: start });
        moveEvent(event.id, start, end);
      } catch (error) {
        console.error('Erro ao reagendar relatório: ', error);
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
        console.error('Erro ao excluir relatório: ', error);
      }
    },
    [apiDeleteEvent, removeEvent],
  );

  const handleCreateReport = useCallback(() => onCreateReport?.(), [onCreateReport]);

  const handleExport = useCallback((events: CalendarEvent[]) => exportToCSV(events, 'relatorios-analytics.csv'), [exportToCSV]);

  return (
    <UniversalCalendar
      events={events}
      config={analyticsConfig}
      loading={loading}
      onEventSelect={handleEventSelect}
      onEventDrop={handleEventDrop}
      onCreate={handleCreateReport}
      onEdit={handleEventSelect}
      onDelete={handleEventDelete}
      onExport={handleExport}
    />
  );
};

export default AnalyticsCalendarAdapter;
