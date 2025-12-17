/**
 * Adapter de Calendário - Tarefas de Usuários
 *
 * @description
 * Componente adapter que conecta o calendário universal com dados de tarefas de usuários.
 *
 * @module components/calendar/adapters/UsersCalendarAdapter
 * @since 1.0.0
 */

import React, { useCallback, useEffect } from "react";
import { User } from 'lucide-react';
import UniversalCalendar, {
  type CalendarEvent,
} from "@/shared/components/calendar/UniversalCalendar";
import { useCalendarState, useCalendarAPI, useCalendarExport,  } from '@/hooks/useCalendar';

/**
 * Interface de tarefa de usuário para transformação
 */
interface UserTaskData {
  id: string | number;
  title?: string;
  scheduled_for?: string;
  scheduled_at?: string;
  due_date?: string;
  date?: string | number;
  status?: string;
  [key: string]: unknown; }

/**
 * Interface de props do adapter de tarefas de usuários
 */
export interface UsersCalendarAdapterProps {
  onCreateTask???: (e: any) => void;
  onEditTask??: (e: any) => void;
  refreshTrigger?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente adapter de calendário para tarefas de usuários
 */
const UsersCalendarAdapter: React.FC<UsersCalendarAdapterProps> = ({ onCreateTask,
  onEditTask,
  refreshTrigger,
   }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();

  const {
    loading,
    fetchEvents,
    updateEvent: apiUpdateEvent,
    deleteEvent: apiDeleteEvent,
  } = useCalendarAPI("/api/users/tasks");

  const { exportToCSV } = useCalendarExport();

  /**
   * Transforma uma tarefa de usuário em evento de calendário
   *
   * @private
   * @param {UserTaskData} task - Tarefa a ser transformada
   * @returns {CalendarEvent} Evento de calendário transformado
   */
  const transformUserTaskToEvent = useCallback(
    (task: UserTaskData): CalendarEvent => {
      const date =
        task?.scheduled_for ||
        task?.scheduled_at ||
        task?.due_date ||
        task?.date ||
        Date.now();

      return {
        id: task.id,
        title: String(task.title || "Tarefa"),
        start: new Date(String(date)),
        end: new Date(String(date)),
        status: task.status as string | undefined,
        category: "user-task",
        resource: task as any,};

    },
    [],);

  useEffect(() => {
    const loadUserTasks = async () => {
      try {
        const data = await fetchEvents();

        const transformed = (data || []).map(transformUserTaskToEvent);

        setEvents(transformed);

      } catch (error) {
        setEvents([]);

      } ;

    loadUserTasks();

  }, [fetchEvents, transformUserTaskToEvent, setEvents, refreshTrigger]);

  const usersConfig = {
    title: "Calendário de Tarefas",
    icon: User,
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
      if (event.resource && onEditTask) {
        onEditTask(event.resource as UserTaskData);

      } ,
    [onEditTask],);

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
        const resource = event.resource as UserTaskData;
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
        const resource = event.resource as UserTaskData;
        if (resource && "id" in resource) {
          await apiDeleteEvent(resource.id);

          removeEvent(event.id);

        } catch (error) {
      } ,
    [apiDeleteEvent, removeEvent],);

  const handleCreate = useCallback(() => onCreateTask?.(), [onCreateTask]);

  const handleExport = useCallback(
    (list: CalendarEvent[]) => exportToCSV(list, "tarefas-usuarios.csv"),
    [exportToCSV],);

  return (
            <UniversalCalendar
      events={ events }
      config={ usersConfig }
      loading={ loading }
      onEventSelect={ handleEventSelect }
      onEventDrop={ handleEventDrop }
      onCreate={ handleCreate }
      onEdit={ handleEventSelect }
      onDelete={ handleEventDelete }
      onExport={ handleExport }
    / />);};

export default UsersCalendarAdapter;
