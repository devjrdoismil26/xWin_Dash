/**
 * Adapter de Calendário - Analytics
 *
 * @description
 * Componente adapter que conecta o calendário universal com dados de relatórios
 * de analytics. Fornece transformação de dados, gerenciamento de eventos e
 * callbacks para criar, editar, deletar e exportar relatórios.
 *
 * Funcionalidades principais:
 * - Transformação de relatórios para eventos de calendário
 * - Gerenciamento de eventos (CRUD)
 * - Suporte a drag & drop para reagendar
 * - Exportação para CSV
 * - Callbacks para ações customizadas
 *
 * @module components/calendar/adapters/AnalyticsCalendarAdapter
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * <AnalyticsCalendarAdapter
 *   onCreateReport={ () => openCreateModal() }
 *   onEditReport={ (report: unknown) => openEditModal(report) }
 *   refreshTrigger={ refreshCount }
 * />
 * ```
 */

import React, { useEffect, useCallback } from "react";
import { BarChart } from 'lucide-react';
import UniversalCalendar, {
  CalendarEvent,
} from "@/shared/components/calendar/UniversalCalendar";
import { useCalendarState, useCalendarAPI, useCalendarExport,  } from '@/hooks/useCalendar';

/**
 * Interface de relatório de analytics
 *
 * @description
 * Estrutura básica de um relatório de analytics para transformação em evento.
 */
interface AnalyticsReport {
  id: string | number;
  title: string;
  scheduled_for: string;
  status?: string;
  [key: string]: unknown; }

/**
 * Interface de props do adapter de analytics
 *
 * @description
 * Props do componente adapter de calendário para analytics.
 *
 * @example
 * ```tsx
 * const props: AnalyticsCalendarAdapterProps = {
 *   onCreateReport: () => openModal(),
 *   onEditReport: (report: unknown) => editReport(report),
 *   refreshTrigger: 1
 *};

 * ```
 */
export interface AnalyticsCalendarAdapterProps {
  onCreateReport???: (e: any) => void;
  onEditReport??: (e: any) => void;
  refreshTrigger?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente adapter de calendário para analytics
 *
 * @description
 * Componente que adapta o calendário universal para exibir e gerenciar
 * relatórios de analytics. Transforma relatórios em eventos de calendário
 * e fornece callbacks para ações CRUD.
 *
 * @param {AnalyticsCalendarAdapterProps} props - Props do adapter
 * @param {Function} [props.onCreateReport] - Callback para criar novo relatório
 * @param {Function} [props.onEditReport] - Callback para editar relatório
 * @param {number} [props.refreshTrigger] - Trigger para recarregar dados
 * @returns {JSX.Element} Componente de calendário renderizado
 *
 * @example
 * ```tsx
 * <AnalyticsCalendarAdapter
 *   onCreateReport={ () => openCreateModal() }
 *   onEditReport={ (report: unknown) => openEditModal(report) }
 * />
 * ```
 */
const AnalyticsCalendarAdapter: React.FC<AnalyticsCalendarAdapterProps> = ({ onCreateReport,
  onEditReport,
  refreshTrigger,
   }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();

  const {
    loading,
    fetchEvents,
    updateEvent: apiUpdateEvent,
    deleteEvent: apiDeleteEvent,
  } = useCalendarAPI("/api/analytics/reports");

  const { exportToCSV } = useCalendarExport();

  /**
   * Transforma um relatório de analytics em evento de calendário
   *
   * @description
   * Converte um objeto de relatório para o formato CalendarEvent esperado
   * pelo componente de calendário.
   *
   * @private
   * @param {AnalyticsReport} report - Relatório de analytics a ser transformado
   * @returns {CalendarEvent} Evento de calendário transformado
   */
  const transformReportToEvent = useCallback(
    (report: AnalyticsReport): CalendarEvent => ({
      id: report.id,
      title: String(report.title || "Sem título"),
      start: new Date(String(report.scheduled_for || new Date())),
      end: new Date(String(report.scheduled_for || new Date())),
      status: report.status as string | undefined,
      category: "analytics",
      resource: report as any,
    }),
    [],);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchEvents();

        const transformedEvents = (data || []).map(transformReportToEvent);

        setEvents(transformedEvents);

      } catch (error) {
        setEvents([]);

      } ;

    loadReports();

  }, [fetchEvents, transformReportToEvent, setEvents, refreshTrigger]);

  const analyticsConfig = {
    title: "Calendário de Relatórios",
    icon: BarChart,
    allowCreate: true,
    allowEdit: true,
    allowDragDrop: true,
  } as const;

  /**
   * Handler para seleção de evento
   *
   * @description
   * Quando um evento é selecionado, chama o callback onEditReport com o recurso.
   *
   * @private
   * @param {CalendarEvent} event - Evento selecionado
   */
  const handleEventSelect = useCallback(
    (event: CalendarEvent) => {
      if (event.resource && onEditReport) {
        onEditReport(event.resource as AnalyticsReport);

      } ,
    [onEditReport],);

  /**
   * Handler para drag & drop de evento
   *
   * @description
   * Quando um evento é movido (drag & drop), atualiza a data agendada do relatório.
   *
   * @private
   * @param {CalendarEvent} event - Evento movido
   * @param {Date} start - Nova data de início
   * @param {Date} end - Nova data de fim
   */
  const handleEventDrop = useCallback(
    async (event: CalendarEvent, start: Date, end: Date) => {
      try {
        const resource = event.resource as AnalyticsReport;
        if (resource && "id" in resource) {
          await apiUpdateEvent(resource.id, { scheduled_for: start });

          moveEvent(event.id, start, end);

        } catch (error) {
      } ,
    [apiUpdateEvent, moveEvent],);

  /**
   * Handler para deleção de evento
   *
   * @description
   * Quando um evento é deletado, remove o relatório da API e do estado local.
   *
   * @private
   * @param {CalendarEvent} event - Evento a ser deletado
   */
  const handleEventDelete = useCallback(
    async (event: CalendarEvent) => {
      try {
        const resource = event.resource as AnalyticsReport;
        if (resource && "id" in resource) {
          await apiDeleteEvent(resource.id);

          removeEvent(event.id);

        } catch (error) {
      } ,
    [apiDeleteEvent, removeEvent],);

  const handleCreateReport = useCallback(
    () => onCreateReport?.(),
    [onCreateReport],);

  const handleExport = useCallback(
    (events: CalendarEvent[]) =>
      exportToCSV(events, "relatorios-analytics.csv"),
    [exportToCSV],);

  return (
            <UniversalCalendar
      events={ events }
      config={ analyticsConfig }
      loading={ loading }
      onEventSelect={ handleEventSelect }
      onEventDrop={ handleEventDrop }
      onCreate={ handleCreateReport }
      onEdit={ handleEventSelect }
      onDelete={ handleEventDelete }
      onExport={ handleExport }
    / />);};

export default AnalyticsCalendarAdapter;
