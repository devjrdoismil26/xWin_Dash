/**
 * Adapter de Calendário - Campanhas de Anúncios
 *
 * @description
 * Componente adapter que conecta o calendário universal com dados de campanhas de anúncios.
 *
 * @module components/calendar/adapters/AdsCalendarAdapter
 * @since 1.0.0
 */

import React, { useCallback, useEffect } from "react";
import { Megaphone } from 'lucide-react';
import UniversalCalendar, {
  type CalendarEvent,
} from "@/shared/components/calendar/UniversalCalendar";
import { useCalendarState, useCalendarAPI, useCalendarExport,  } from '@/hooks/useCalendar';

/**
 * Interface de campanha de anúncio para transformação
 */
interface AdCampaignData {
  id: string | number;
  name?: string;
  start_date?: string;
  end_date?: string;
  scheduled_for?: string;
  scheduled_at?: string;
  status?: string;
  platform?: string;
  [key: string]: unknown; }

/**
 * Interface de props do adapter de campanhas de anúncios
 */
export interface AdsCalendarAdapterProps {
  onCreateCampaign???: (e: any) => void;
  onEditCampaign??: (e: any) => void;
  refreshTrigger?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente adapter de calendário para campanhas de anúncios
 */
const AdsCalendarAdapter: React.FC<AdsCalendarAdapterProps> = ({ onCreateCampaign,
  onEditCampaign,
  refreshTrigger,
   }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();

  const {
    loading,
    fetchEvents,
    updateEvent: apiUpdateEvent,
    deleteEvent: apiDeleteEvent,
  } = useCalendarAPI("/api/ads/campaigns");

  const { exportToCSV } = useCalendarExport();

  /**
   * Transforma uma campanha de anúncio em evento de calendário
   *
   * @private
   * @param {AdCampaignData} campaign - Campanha a ser transformada
   * @returns {CalendarEvent} Evento de calendário transformado
   */
  const transformCampaignToEvent = useCallback(
    (campaign: AdCampaignData): CalendarEvent => {
      const start =
        campaign?.start_date ||
        campaign?.scheduled_for ||
        campaign?.scheduled_at ||
        Date.now();

      const end = campaign?.end_date || start;
      return {
        id: campaign.id,
        title: campaign.name || "Campanha",
        start: new Date(start),
        end: new Date(end),
        status: campaign.status,
        category: "ads",
        platform: campaign.platform,
        resource: campaign,};

    },
    [],);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const data = await fetchEvents();

        const transformed = (data || []).map(transformCampaignToEvent);

        setEvents(transformed);

      } catch (error) {
        setEvents([]);

      } ;

    loadCampaigns();

  }, [fetchEvents, transformCampaignToEvent, setEvents, refreshTrigger]);

  const adsConfig = {
    title: "Calendário de Anúncios",
    icon: Megaphone,
    allowCreate: true,
    allowEdit: true,
    allowDragDrop: true,
  } as const;

  /**
   * Handler para seleção de evento
   *
   * @private
   * @param {CalendarEvent} event - Evento selecionado
   */
  const handleEventSelect = useCallback(
    (event: CalendarEvent) => {
      if (event.resource && onEditCampaign) {
        onEditCampaign(event.resource as AdCampaignData);

      } ,
    [onEditCampaign],);

  /**
   * Handler para drag & drop de evento
   *
   * @private
   * @param {CalendarEvent} event - Evento movido
   * @param {Date} start - Nova data de início
   * @param {Date} end - Nova data de fim
   */
  const handleEventDrop = useCallback(
    async (event: CalendarEvent, start: Date, end: Date) => {
      try {
        const resource = event.resource as AdCampaignData;
        if (resource && "id" in resource) {
          await apiUpdateEvent(resource.id, {
            start_date: start,
            end_date: end,
          });

          moveEvent(event.id, start, end);

        } catch (error) {
      } ,
    [apiUpdateEvent, moveEvent],);

  /**
   * Handler para deleção de evento
   *
   * @private
   * @param {CalendarEvent} event - Evento a ser deletado
   */
  const handleEventDelete = useCallback(
    async (event: CalendarEvent) => {
      try {
        const resource = event.resource as AdCampaignData;
        if (resource && "id" in resource) {
          await apiDeleteEvent(resource.id);

          removeEvent(event.id);

        } catch (error) {
      } ,
    [apiDeleteEvent, removeEvent],);

  const handleCreate = useCallback(
    () => onCreateCampaign?.(),
    [onCreateCampaign],);

  const handleExport = useCallback(
    (list: CalendarEvent[]) => exportToCSV(list, "campanhas-ads.csv"),
    [exportToCSV],);

  return (
            <UniversalCalendar
      events={ events }
      config={ adsConfig }
      loading={ loading }
      onEventSelect={ handleEventSelect }
      onEventDrop={ handleEventDrop }
      onCreate={ handleCreate }
      onEdit={ handleEventSelect }
      onDelete={ handleEventDelete }
      onExport={ handleExport }
    / />);};

export default AdsCalendarAdapter;
