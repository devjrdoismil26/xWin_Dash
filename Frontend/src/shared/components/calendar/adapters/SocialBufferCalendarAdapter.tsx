/**
 * Adapter de Calend?rio - Social Buffer
 *
 * @description
 * Componente adapter que conecta o calend?rio universal com dados de posts sociais agendados.
 *
 * @module components/calendar/adapters/SocialBufferCalendarAdapter
 * @since 1.0.0
 */

import React, { useCallback, useEffect } from "react";
import { Share } from 'lucide-react';
import UniversalCalendar, {
  type CalendarEvent,
} from "@/shared/components/calendar/UniversalCalendar";
import { useCalendarState, useCalendarAPI, useCalendarExport,  } from '@/hooks/useCalendar';

/**
 * Interface de post social para transforma??o
 */
interface SocialPostData {
  id: string | number;
  content?: string;
  scheduled_for?: string;
  scheduled_at?: string;
  date?: string | number;
  status?: string;
  platform?: string;
  [key: string]: unknown; }

/**
 * Interface de props do adapter de social buffer
 */
export interface SocialBufferCalendarAdapterProps {
  onCreatePost???: (e: any) => void;
  onEditPost??: (e: any) => void;
  refreshTrigger?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente adapter de calend?rio para posts sociais
 */
const SocialBufferCalendarAdapter: React.FC<
  SocialBufferCalendarAdapterProps
> = ({ onCreatePost, onEditPost, refreshTrigger    }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();

  const {
    loading,
    fetchEvents,
    updateEvent: apiUpdateEvent,
    deleteEvent: apiDeleteEvent,
  } = useCalendarAPI("/api/social-buffer/schedules");

  const { exportToCSV } = useCalendarExport();

  /**
   * Transforma um post social em evento de calend?rio
   *
   * @private
   * @param {SocialPostData} post - Post a ser transformado
   * @returns {CalendarEvent} Evento de calend?rio transformado
   */
  const transformPostToEvent = useCallback(
    (post: SocialPostData): CalendarEvent => {
      const date =
        post?.scheduled_for || post?.scheduled_at || post?.date || Date.now();

      const content = String(post.content || "Post");

      return {
        id: post.id,
        title: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
        start: new Date(String(date)),
        end: new Date(String(date)),
        status: post.status as string | undefined,
        category: "post",
        platform: post.platform as string | undefined,
        resource: post as any,};

    },
    [],);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchEvents();

        const transformed = (data || []).map(transformPostToEvent);

        setEvents(transformed);

      } catch (error) {
        setEvents([]);

      } ;

    loadPosts();

  }, [fetchEvents, transformPostToEvent, setEvents, refreshTrigger]);

  const socialBufferConfig = {
    title: "Agendamento de Posts",
    icon: Share,
    allowCreate: true,
    allowEdit: true,
    allowDragDrop: true,
  } as const;

  /**
   * Handler para sele??o de evento
   *
   * @private
   * @param {CalendarEvent} event - Evento selecionado
   */
  const handleEventSelect = useCallback(
    (event: CalendarEvent) => {
      if (event.resource && onEditPost) {
        onEditPost(event.resource as SocialPostData);

      } ,
    [onEditPost],);

  /**
   * Handler para drag & drop de evento
   *
   * @private
   * @param {CalendarEvent} event - Evento movido
   * @param {Date} start - Nova data de in?cio
   * @param {Date} end - Nova data de fim
   */
  const handleEventDrop = useCallback(
    async (event: CalendarEvent, start: Date, end: Date) => {
      try {
        const resource = event.resource as SocialPostData;
        if (resource && "id" in resource) {
          await apiUpdateEvent(resource.id, { scheduled_for: start });

          moveEvent(event.id, start, end);

        } catch (error) {
      } ,
    [apiUpdateEvent, moveEvent],);

  /**
   * Handler para dele??o de evento
   *
   * @private
   * @param {CalendarEvent} event - Evento a ser deletado
   */
  const handleEventDelete = useCallback(
    async (event: CalendarEvent) => {
      try {
        const resource = event.resource as SocialPostData;
        if (resource && "id" in resource) {
          await apiDeleteEvent(resource.id);

          removeEvent(event.id);

        } catch (error) {
      } ,
    [apiDeleteEvent, removeEvent],);

  const handleCreate = useCallback(() => onCreatePost?.(), [onCreatePost]);

  const handleExport = useCallback(
    (list: CalendarEvent[]) => exportToCSV(list, "posts-sociais.csv"),
    [exportToCSV],);

  return (
            <UniversalCalendar
      events={ events }
      config={ socialBufferConfig }
      loading={ loading }
      onEventSelect={ handleEventSelect }
      onEventDrop={ handleEventDrop }
      onCreate={ handleCreate }
      onEdit={ handleEventSelect }
      onDelete={ handleEventDelete }
      onExport={ handleExport }
    / />);};

export default SocialBufferCalendarAdapter;
