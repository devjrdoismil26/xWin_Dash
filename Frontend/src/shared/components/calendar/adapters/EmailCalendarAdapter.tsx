/**
 * Adapter de Calendário - Campanhas de Email
 *
 * @description
 * Componente adapter que conecta o calendário universal com dados de campanhas de email.
 *
 * @module components/calendar/adapters/EmailCalendarAdapter
 * @since 1.0.0
 */

import React, { useCallback, useEffect } from "react";
import { Mail } from 'lucide-react';
import UniversalCalendar, {
  type CalendarEvent,
} from "@/shared/components/calendar/UniversalCalendar";
import { useCalendarState, useCalendarAPI, useCalendarExport,  } from '@/hooks/useCalendar';

/**
 * Interface de campanha de email para transformação
 */
interface EmailCampaignData {
  id: string | number;
  subject?: string;
  scheduled_at?: string;
  scheduled_for?: string;
  date?: string | number;
  status?: string;
  [key: string]: unknown; }

/**
 * Interface de props do adapter de campanhas de email
 */
export interface EmailCalendarAdapterProps {
  onCreateEmail???: (e: any) => void;
  onEditEmail??: (e: any) => void;
  refreshTrigger?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente adapter de calendário para campanhas de email
 */
const EmailCalendarAdapter: React.FC<EmailCalendarAdapterProps> = ({ onCreateEmail,
  onEditEmail,
  refreshTrigger,
   }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();

  const {
    loading,
    fetchEvents,
    updateEvent: apiUpdateEvent,
    deleteEvent: apiDeleteEvent,
  } = useCalendarAPI("/api/email-marketing/campaigns");

  const { exportToCSV } = useCalendarExport();

  /**
   * Transforma uma campanha de email em evento de calendário
   *
   * @private
   * @param {EmailCampaignData} email - Campanha de email a ser transformada
   * @returns {CalendarEvent} Evento de calendário transformado
   */
  const transformEmailToEvent = useCallback(
    (email: EmailCampaignData): CalendarEvent => {
      const date =
        email?.scheduled_at ||
        email?.scheduled_for ||
        email?.date ||
        Date.now();

      return {
        id: email.id,
        title: String(email.subject || "Campanha de Email"),
        start: new Date(String(date)),
        end: new Date(String(date)),
        status: email.status as string | undefined,
        category: "email",
        resource: email as any,};

    },
    [],);

  useEffect(() => {
    const loadEmails = async () => {
      try {
        const data = await fetchEvents();

        const transformed = (data || []).map(transformEmailToEvent);

        setEvents(transformed);

      } catch (error) {
        setEvents([]);

      } ;

    loadEmails();

  }, [fetchEvents, transformEmailToEvent, setEvents, refreshTrigger]);

  const emailConfig = {
    title: "Calendário de Emails",
    icon: Mail,
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
      if (event.resource && onEditEmail) {
        onEditEmail(event.resource as EmailCampaignData);

      } ,
    [onEditEmail],);

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
        const resource = event.resource as EmailCampaignData;
        if (resource && "id" in resource) {
          await apiUpdateEvent(resource.id, { scheduled_at: start });

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
        const resource = event.resource as EmailCampaignData;
        if (resource && "id" in resource) {
          await apiDeleteEvent(resource.id);

          removeEvent(event.id);

        } catch (error) {
      } ,
    [apiDeleteEvent, removeEvent],);

  const handleCreate = useCallback(() => onCreateEmail?.(), [onCreateEmail]);

  const handleExport = useCallback(
    (list: CalendarEvent[]) => exportToCSV(list, "campanhas-email.csv"),
    [exportToCSV],);

  return (
            <UniversalCalendar
      events={ events }
      config={ emailConfig }
      loading={ loading }
      onEventSelect={ handleEventSelect }
      onEventDrop={ handleEventDrop }
      onCreate={ handleCreate }
      onEdit={ handleEventSelect }
      onDelete={ handleEventDelete }
      onExport={ handleExport }
    / />);};

export default EmailCalendarAdapter;
