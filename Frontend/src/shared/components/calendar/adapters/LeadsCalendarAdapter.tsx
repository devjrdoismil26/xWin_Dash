/**
 * Adapter de Calendário - Atividades de Leads
 *
 * @description
 * Componente adapter que conecta o calendário universal com dados de atividades de leads.
 *
 * @module components/calendar/adapters/LeadsCalendarAdapter
 * @since 1.0.0
 */

import React, { useCallback, useEffect } from "react";
import { Users } from 'lucide-react';
import UniversalCalendar, {
  type CalendarEvent,
} from "@/shared/components/calendar/UniversalCalendar";
import { useCalendarState, useCalendarAPI, useCalendarExport,  } from '@/hooks/useCalendar';

/**
 * Interface de atividade de lead para transformação
 */
interface LeadActivityData {
  id: string | number;
  title?: string;
  scheduled_for?: string;
  scheduled_at?: string;
  due_date?: string;
  date?: string | number;
  status?: string;
  [key: string]: unknown; }

/**
 * Interface de props do adapter de atividades de leads
 */
export interface LeadsCalendarAdapterProps {
  onCreateActivity???: (e: any) => void;
  onEditActivity??: (e: any) => void;
  refreshTrigger?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente adapter de calendário para atividades de leads
 */
const LeadsCalendarAdapter: React.FC<LeadsCalendarAdapterProps> = ({ onCreateActivity,
  onEditActivity,
  refreshTrigger,
   }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();

  const {
    loading,
    fetchEvents,
    updateEvent: apiUpdateEvent,
    deleteEvent: apiDeleteEvent,
  } = useCalendarAPI("/api/leads/activities");

  const { exportToCSV } = useCalendarExport();

  /**
   * Transforma uma atividade de lead em evento de calendário
   *
   * @private
   * @param {LeadActivityData} activity - Atividade a ser transformada
   * @returns {CalendarEvent} Evento de calendário transformado
   */
  const transformLeadActivityToEvent = useCallback(
    (activity: LeadActivityData): CalendarEvent => {
      const date =
        activity?.scheduled_for ||
        activity?.scheduled_at ||
        activity?.date ||
        Date.now();

      const activityType = activity.type as string | undefined;
      return {
        id: activity.id,
        title: String(activity.title || activityType || "Atividade"),
        start: new Date(String(date)),
        end: new Date(String(date)),
        status: activity.status as string | undefined,
        category: "lead",
        resource: activity as any,};

    },
    [],);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await fetchEvents();

        const transformed = (data || []).map(transformLeadActivityToEvent);

        setEvents(transformed);

      } catch (error) {
        setEvents([]);

      } ;

    loadActivities();

  }, [fetchEvents, transformLeadActivityToEvent, setEvents, refreshTrigger]);

  const leadsConfig = {
    title: "Calendário de Atividades - Leads",
    icon: Users,
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
      if (event.resource && onEditActivity) {
        onEditActivity(event.resource as LeadActivityData);

      } ,
    [onEditActivity],);

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
        const resource = event.resource as LeadActivityData;
        if (resource && "id" in resource) {
          await apiUpdateEvent(resource.id, { scheduled_for: start });

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
        const resource = event.resource as LeadActivityData;
        if (resource && "id" in resource) {
          await apiDeleteEvent(resource.id);

          removeEvent(event.id);

        } catch (error) {
      } ,
    [apiDeleteEvent, removeEvent],);

  const handleCreate = useCallback(
    () => onCreateActivity?.(),
    [onCreateActivity],);

  const handleExport = useCallback(
    (list: CalendarEvent[]) => exportToCSV(list, "atividades-leads.csv"),
    [exportToCSV],);

  return (
            <UniversalCalendar
      events={ events }
      config={ leadsConfig }
      loading={ loading }
      onEventSelect={ handleEventSelect }
      onEventDrop={ handleEventDrop }
      onCreate={ handleCreate }
      onEdit={ handleEventSelect }
      onDelete={ handleEventDelete }
      onExport={ handleExport }
    / />);};

export default LeadsCalendarAdapter;
