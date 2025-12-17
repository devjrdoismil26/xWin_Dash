/**
 * Adapter de Calendário - Workflows
 *
 * @description
 * Componente adapter que conecta o calendário universal com dados de workflows.
 * Fornece transformação de dados, gerenciamento de eventos e callbacks para
 * criar, editar, deletar e exportar workflows.
 *
 * @module components/calendar/adapters/WorkflowCalendarAdapter
 * @since 1.0.0
 */

import React, { useCallback, useEffect } from "react";
import { Workflow } from 'lucide-react';
import UniversalCalendar, {
  type CalendarEvent,
} from "@/shared/components/calendar/UniversalCalendar";
import { useCalendarState, useCalendarAPI, useCalendarExport,  } from '@/hooks/useCalendar';

/**
 * Interface de workflow para transformação
 *
 * @description
 * Estrutura básica de um workflow para transformação em evento.
 */
interface WorkflowData {
  id: string | number;
  name?: string;
  scheduled_for?: string;
  scheduled_at?: string;
  date?: string | number;
  status?: string;
  [key: string]: unknown; }

/**
 * Interface de props do adapter de workflows
 *
 * @example
 * ```tsx
 * const props: WorkflowCalendarAdapterProps = {
 *   onCreateWorkflow: () => openModal(),
 *   onEditWorkflow: (workflow: unknown) => editWorkflow(workflow),
 *   refreshTrigger: 1
 *};

 * ```
 */
export interface WorkflowCalendarAdapterProps {
  onCreateWorkflow???: (e: any) => void;
  onEditWorkflow??: (e: any) => void;
  refreshTrigger?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente adapter de calendário para workflows
 *
 * @param {WorkflowCalendarAdapterProps} props - Props do adapter
 * @returns {JSX.Element} Componente de calendário renderizado
 */
const WorkflowCalendarAdapter: React.FC<WorkflowCalendarAdapterProps> = ({ onCreateWorkflow,
  onEditWorkflow,
  refreshTrigger,
   }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();

  const {
    loading,
    fetchEvents,
    updateEvent: apiUpdateEvent,
    deleteEvent: apiDeleteEvent,
  } = useCalendarAPI("/api/aura/flows");

  const { exportToCSV } = useCalendarExport();

  /**
   * Transforma um workflow em evento de calendário
   *
   * @private
   * @param {WorkflowData} flow - Workflow a ser transformado
   * @returns {CalendarEvent} Evento de calendário transformado
   */
  const transformWorkflowToEvent = useCallback(
    (flow: WorkflowData): CalendarEvent => {
      const date =
        flow?.scheduled_for || flow?.scheduled_at || flow?.date || Date.now();

      return {
        id: flow.id,
        title: String(flow.name || "Workflow"),
        start: new Date(String(date)),
        end: new Date(String(date)),
        status: flow.status as string | undefined,
        category: "workflow",
        resource: flow as any,};

    },
    [],);

  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        const data = await fetchEvents();

        const transformed = (data || []).map(transformWorkflowToEvent);

        setEvents(transformed);

      } catch (error) {
        setEvents([]);

      } ;

    loadWorkflows();

  }, [fetchEvents, transformWorkflowToEvent, setEvents, refreshTrigger]);

  const workflowConfig = {
    title: "Calendário de Workflows",
    icon: Workflow,
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
      if (event.resource && onEditWorkflow) {
        onEditWorkflow(event.resource as WorkflowData);

      } ,
    [onEditWorkflow],);

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
        const resource = event.resource as WorkflowData;
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
        const resource = event.resource as WorkflowData;
        if (resource && "id" in resource) {
          await apiDeleteEvent(resource.id);

          removeEvent(event.id);

        } catch (error) {
      } ,
    [apiDeleteEvent, removeEvent],);

  const handleCreateWorkflow = useCallback(
    () => onCreateWorkflow?.(),
    [onCreateWorkflow],);

  const handleExport = useCallback(
    (list: CalendarEvent[]) => exportToCSV(list, "workflows-agendados.csv"),
    [exportToCSV],);

  return (
            <UniversalCalendar
      events={ events }
      config={ workflowConfig }
      loading={ loading }
      onEventSelect={ handleEventSelect }
      onEventDrop={ handleEventDrop }
      onCreate={ handleCreateWorkflow }
      onEdit={ handleEventSelect }
      onDelete={ handleEventDelete }
      onExport={ handleExport }
    / />);};

export default WorkflowCalendarAdapter;
