import React, { useCallback, useEffect } from 'react';
import { Megaphone } from 'lucide-react';
import UniversalCalendar, { type CalendarEvent } from '@/components/calendar/UniversalCalendar.tsx';
import { useCalendarState, useCalendarAPI, useCalendarExport } from '@/hooks/useCalendar.tsx';

export interface AdsCalendarAdapterProps {
  onCreateCampaign?: () => void;
  onEditCampaign?: (campaign: any) => void;
  refreshTrigger?: number;
}

const AdsCalendarAdapter: React.FC<AdsCalendarAdapterProps> = ({ onCreateCampaign, onEditCampaign, refreshTrigger }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();
  const { loading, fetchEvents, updateEvent: apiUpdateEvent, deleteEvent: apiDeleteEvent } = useCalendarAPI(
    '/api/ads/campaigns',
  );
  const { exportToCSV } = useCalendarExport();

  const transformCampaignToEvent = useCallback((campaign: any): CalendarEvent => {
    const start = campaign?.start_date || campaign?.scheduled_for || campaign?.scheduled_at || Date.now();
    const end = campaign?.end_date || start;
    return {
      id: campaign.id,
      title: campaign.name || 'Campanha',
      start: new Date(start),
      end: new Date(end),
      status: campaign.status,
      category: 'ads',
      platform: campaign.platform,
      resource: campaign,
    };
  }, []);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const data = await fetchEvents();
        const transformed = (data || []).map(transformCampaignToEvent);
        setEvents(transformed);
      } catch (error) {
        console.error('Erro ao carregar campanhas de anúncios:', error);
        setEvents([]);
      }
    };
    loadCampaigns();
  }, [fetchEvents, transformCampaignToEvent, setEvents, refreshTrigger]);

  const adsConfig = {
    title: 'Calendário de Anúncios',
    icon: Megaphone,
    allowCreate: true,
    allowEdit: true,
    allowDragDrop: true,
  } as const;

  const handleEventSelect = useCallback((event: CalendarEvent) => onEditCampaign?.(event.resource), [onEditCampaign]);

  const handleEventDrop = useCallback(
    async (event: CalendarEvent, start: Date, end: Date) => {
      try {
        await apiUpdateEvent(event.resource.id, { start_date: start, end_date: end });
        moveEvent(event.id, start, end);
      } catch (error) {
        console.error('Erro ao reagendar campanha:', error);
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
        console.error('Erro ao excluir campanha:', error);
      }
    },
    [apiDeleteEvent, removeEvent],
  );

  const handleCreate = useCallback(() => onCreateCampaign?.(), [onCreateCampaign]);
  const handleExport = useCallback((list: CalendarEvent[]) => exportToCSV(list, 'campanhas-ads.csv'), [exportToCSV]);

  return (
    <UniversalCalendar
      events={events}
      config={adsConfig}
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

export default AdsCalendarAdapter;
