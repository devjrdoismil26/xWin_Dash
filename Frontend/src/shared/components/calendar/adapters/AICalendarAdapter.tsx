/**
 * Adapter de Calendário - AI Jobs
 *
 * @description
 * Componente adapter que conecta o calendário universal com dados de jobs de IA.
 *
 * @module components/calendar/adapters/AICalendarAdapter
 * @since 1.0.0
 */

import React, { useEffect, useCallback } from "react";
import { Brain } from 'lucide-react';
import UniversalCalendar, {
  CalendarEvent,
} from "@/shared/components/calendar/UniversalCalendar";
import { useCalendarState, useCalendarAPI, useCalendarExport,  } from '@/hooks/useCalendar';

/**
 * Interface de job de IA para transformação
 */
interface AIJobData {
  id: string | number;
  title?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  [key: string]: unknown; }

/**
 * Interface de props do adapter de AI jobs
 */
export interface AICalendarAdapterProps {
  onCreateJob???: (e: any) => void;
  onEditJob??: (e: any) => void;
  refreshTrigger?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente adapter de calendário para jobs de IA
 */
const AICalendarAdapter: React.FC<AICalendarAdapterProps> = ({ onCreateJob,
  onEditJob,
  refreshTrigger,
   }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();

  const {
    loading,
    fetchEvents,
    updateEvent: apiUpdateEvent,
    deleteEvent: apiDeleteEvent,
  } = useCalendarAPI("/api/ai/jobs");

  const { exportToCSV } = useCalendarExport();

  /**
   * Transforma um job de IA em evento de calendário
   *
   * @private
   * @param {AIJobData} job - Job de IA a ser transformado
   * @returns {CalendarEvent} Evento de calendário transformado
   */
  const transformJobToEvent = useCallback(
    (job: AIJobData): CalendarEvent => ({
      id: job.id,
      title: job.title,
      start: new Date(job.start_time),
      end: new Date(job.end_time),
      status: job.status,
      category: "ai",
      resource: job,
    }),
    [],);

  useEffect(() => {
    const loadAIJobs = async () => {
      try {
        const data = await fetchEvents();

        const transformedEvents = (data || []).map(transformJobToEvent);

        setEvents(transformedEvents);

      } catch (error) {
        setEvents([]);

      } ;

    loadAIJobs();

  }, [fetchEvents, transformJobToEvent, setEvents, refreshTrigger]);

  const aiConfig = {
    title: "Calendário de Processamento IA",
    icon: Brain,
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
      if (event.resource && onEditJob) {
        onEditJob(event.resource as AIJobData);

      } ,
    [onEditJob],);

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
        const resource = event.resource as AIJobData;
        if (resource && "id" in resource) {
          await apiUpdateEvent(resource.id, {
            start_time: start,
            end_time: end,
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
        const resource = event.resource as AIJobData;
        if (resource && "id" in resource) {
          await apiDeleteEvent(resource.id);

          removeEvent(event.id);

        } catch (error) {
      } ,
    [apiDeleteEvent, removeEvent],);

  const handleCreateJob = useCallback(() => onCreateJob?.(), [onCreateJob]);

  const handleExport = useCallback(
    (events: CalendarEvent[]) => exportToCSV(events, "jobs-ia.csv"),
    [exportToCSV],);

  return (
            <UniversalCalendar
      events={ events }
      config={ aiConfig }
      loading={ loading }
      onEventSelect={ handleEventSelect }
      onEventDrop={ handleEventDrop }
      onCreate={ handleCreateJob }
      onEdit={ handleEventSelect }
      onDelete={ handleEventDelete }
      onExport={ handleExport }
    / />);};

export default AICalendarAdapter;
