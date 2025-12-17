import React from 'react';
/**
 * Hook useCalendar - Gerenciamento de Calendário
 *
 * @description
 * Hooks para gerenciamento completo de calendário, incluindo estado de eventos,
 * operações CRUD via API, e integração com componentes de calendário.
 * Fornece hooks useCalendarState e useCalendarAPI para gerenciar eventos.
 *
 * Funcionalidades principais:
 * - Estado de eventos do calendário
 * - Operações CRUD via API (fetch, create, update, delete)
 * - Movimentação de eventos (drag & drop)
 * - Remoção de eventos
 * - Tratamento de erros
 * - Estados de loading
 * - Integração com Toast para feedback
 *
 * @module hooks/useCalendar
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { useCalendarState, useCalendarAPI } from '@/hooks/useCalendar';
 *
 * // Estado de eventos
 * const { events, setEvents, moveEvent, removeEvent } = useCalendarState();

 *
 * // Operações API
 * const { fetchEvents, createEvent, loading } = useCalendarAPI('/api/events');

 * ```
 */

import { useCallback, useState } from 'react';
import moment from "moment";

import { toast } from 'sonner';
import type {
  CalendarEvent,
  UniversalCalendarConfig,
} from "@/shared/components/calendar/UniversalCalendar";
import { apiClient } from '@/services';

/**
 * Hook useCalendarState - Estado de Eventos do Calendário
 *
 * @description
 * Hook para gerenciar o estado local de eventos do calendário, incluindo
 * movimentação e remoção de eventos.
 *
 * @hook
 * @returns {Object} Objeto com events, setEvents, moveEvent e removeEvent
 * @property {CalendarEvent[]} events - Lista de eventos
 * @property {React.Dispatch<React.SetStateAction<CalendarEvent[]>>} setEvents - Função para atualizar eventos
 * @property {(eventId: CalendarEvent['id'], start: Date, end: Date) => void} moveEvent - Função para mover evento
 * @property {(eventId: CalendarEvent['id']) => void} removeEvent - Função para remover evento
 *
 * @example
 * ```tsx
 * const { events, moveEvent, removeEvent } = useCalendarState();

 *
 * // Mover evento
 * moveEvent('event-1', new Date(), new Date());

 *
 * // Remover evento
 * removeEvent('event-1');

 * ```
 */
export function useCalendarState() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const moveEvent = useCallback(
    (eventId: CalendarEvent["id"], start: Date, end: Date) => {
      setEvents((prev: unknown) =>
        (prev || []).map((e: unknown) => (e.id === eventId ? { ...e, start, end } : e)),);

    },
    [],);

  const removeEvent = useCallback((eventId: CalendarEvent["id"]) => {
    setEvents((prev: unknown) => (prev || []).filter((e: unknown) => e.id !== eventId));

  }, []);

  return { events, setEvents, moveEvent, removeEvent } as const;
}

/**
 * Hook para operações de API de calendário
 *
 * @description
 * Hook que fornece funções para realizar operações CRUD de eventos de
 * calendário via API, com tratamento de erros e estados de loading.
 *
 * @param {string} endpoint - Endpoint da API para eventos
 * @returns {Object} Objeto com loading, error, fetchEvents, createEvent, updateEvent e deleteEvent
 * @property {boolean} loading - Estado de carregamento
 * @property {string | null} error - Mensagem de erro, se houver
 * @property {() => Promise<CalendarEvent[]>} fetchEvents - Função para buscar eventos
 * @property {(eventData: unknown) => Promise<CalendarEvent>} createEvent - Função para criar evento
 * @property {(eventId: string | number, eventData: unknown) => Promise<CalendarEvent>} updateEvent - Função para atualizar evento
 * @property {(eventId: string | number) => Promise<void>} deleteEvent - Função para excluir evento
 *
 * @example
 * ```tsx
 * const { fetchEvents, createEvent, loading, error } = useCalendarAPI('/api/events');

 *
 * useEffect(() => {
 *   fetchEvents();

 * }, []);

 * ```
 */
export function useCalendarAPI(endpoint: string) {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const response = await apiClient.get(endpoint) as { data?: string[]};

      return (response as any).data ?? [];
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar eventos";
      setError(message);

      toast.error(message);

      return [] as unknown[];
    } finally {
      setLoading(false);

    } , [endpoint]);

  const createEvent = useCallback(
    async (eventData: unknown) => {
      setLoading(true);

      setError(null);

      try {
        const response = await apiClient.post(endpoint, eventData) as { data?: string};

        toast.success("Evento criado com sucesso!");

        return (response as any).data as any;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Erro ao criar evento";
        setError(message);

        toast.error(message);

        throw err;
      } finally {
        setLoading(false);

      } ,
    [endpoint],);

  const updateEvent = useCallback(
    async (eventId: string | number, eventData: unknown) => {
      setLoading(true);

      setError(null);

      try {
        const response = await apiClient.put(
          `${endpoint}/${eventId}`,
          eventData,
        ) as { data?: string};

        toast.success("Evento atualizado com sucesso!");

        return (response as any).data as any;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Erro ao atualizar evento";
        setError(message);

        toast.error(message);

        throw err;
      } finally {
        setLoading(false);

      } ,
    [endpoint],);

  const deleteEvent = useCallback(
    async (eventId: string | number) => {
      setLoading(true);

      setError(null);

      try {
        await apiClient.delete(`${endpoint}/${eventId}`);

        toast.success("Evento excluído com sucesso!");

      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Erro ao excluir evento";
        setError(message);

        toast.error(message);

        throw err;
      } finally {
        setLoading(false);

      } ,
    [endpoint],);

  return {
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  } as const;
}

export function useCalendarExport() {
  const exportToCSV = useCallback(
    (events: CalendarEvent[], filename: string = "calendar-events.csv") => {
      const headers = [
        "ID",
        "Título",
        "Data Início",
        "Data Fim",
        "Tipo",
        "Status",
        "Plataforma",
      ];
      const rows = (events || []).map((event: unknown) => [
        event.id,
        `"${event.title}"`,
        moment(event.start).format("YYYY-MM-DD HH:mm:ss"),
        moment(event.end).format("YYYY-MM-DD HH:mm:ss"),
        event.category || "",
        event.status || "",
        event.platform || "",
      ]);

      const csvContent = [headers, ...rows].map((r: unknown) => r.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);

      link.download = filename;
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      toast.success("Calendário exportado com sucesso!");

    },
    [],);

  const exportToICS = useCallback(
    (events: CalendarEvent[], filename: string = "calendar-events.ics") => {
      const icsLines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//xWin Dash//Calendar//EN",
        ...events.flatMap((event: unknown) => [
          "BEGIN:VEVENT",
          `UID:${event.id}@xwindash.com`,
          `DTSTART:${moment(event.start).utc().format("YYYYMMDDTHHmmss")}Z`,
          `DTEND:${moment(event.end).utc().format("YYYYMMDDTHHmmss")}Z`,
          `SUMMARY:${event.title}`,
          `DESCRIPTION:${(event.category || "").replaceAll(",", " ")} - ${(event.status || "").replaceAll(",", " ")}`,
          "END:VEVENT",
        ]),
        "END:VCALENDAR",
      ].join("\r\n");

      const blob = new Blob([icsLines], {
        type: "text/calendar;charset=utf-8",
      });

      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);

      link.download = filename;
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      toast.success("Calendário exportado para ICS com sucesso!");

    },
    [],);

  return { exportToCSV, exportToICS } as const;
}

/**
 * Configuração padrão do calendário
 *
 * @description
 * Configuração padrão usada pelo componente UniversalCalendar quando
 * nenhuma configuração customizada é fornecida.
 *
 * @constant {UniversalCalendarConfig}
 *
 * @example
 * ```tsx
 * import { defaultCalendarConfig } from '@/hooks/useCalendar';
 *
 * <UniversalCalendar config={defaultCalendarConfig} / />
 * ```
 */
export const defaultCalendarConfig: UniversalCalendarConfig = {
  title: "Calendário",
  defaultView: "month",
  allowCreate: true,
  allowEdit: true,
  allowDragDrop: true,
  showLegend: false,};
