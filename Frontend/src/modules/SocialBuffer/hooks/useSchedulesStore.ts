/**
 * Hook useSchedulesStore - Store de Agendamentos
 *
 * @description
 * Store Zustand para gerenciamento de estado de agendamentos do SocialBuffer.
 * Gerencia CRUD, ativação/desativação, execução, duplicação, calendário e seleção múltipla.
 *
 * @module modules/SocialBuffer/hooks/useSchedulesStore
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { schedulesService } from '../services/schedulesService';
import { SocialSchedule, SocialScheduleStatus } from '../types/socialTypes';
import { getErrorMessage } from '@/utils/errorHelpers';
import type {
  ScheduleSearchParams,
  SchedulePaginatedResponse,
  CreateScheduleData,
  UpdateScheduleData,
  ScheduleStats,
  OptimalTimeSuggestion,
  CalendarEvent
} from '../services/schedulesService';

/**
 * Estado de agendamentos
 *
 * @interface SchedulesState
 * @property {SocialSchedule[]} schedules - Lista de agendamentos
 * @property {SocialSchedule | null} selectedSchedule - Agendamento selecionado
 * @property {ScheduleStats | null} schedulesStats - Estatísticas de agendamentos
 * @property {Object} pagination - Dados de paginação
 * @property {ScheduleSearchParams} filters - Filtros de busca
 * @property {boolean} loading - Se está carregando
 * @property {string | null} error - Mensagem de erro
 * @property {boolean} activating - Se está ativando
 * @property {boolean} deactivating - Se está desativando
 * @property {boolean} executing - Se está executando
 * @property {boolean} duplicating - Se está duplicando
 * @property {CalendarEvent[]} calendarEvents - Eventos do calendário
 * @property {OptimalTimeSuggestion[]} optimalTimes - Horários ideais sugeridos
 * @property {string[]} selectedSchedules - IDs de agendamentos selecionados
 * @property {string | null} bulkAction - Ação em massa em andamento
 */
interface SchedulesState {
  // Estado dos agendamentos
  schedules: SocialSchedule[];
  selectedSchedule: SocialSchedule | null;
  schedulesStats: ScheduleStats | null;
  // Estado de paginação
  pagination: {
    page: number;
  limit: number;
  total: number;
  totalPages: number; };

  // Estado de filtros
  filters: ScheduleSearchParams;
  
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  
  // Estado de operações
  activating: boolean;
  deactivating: boolean;
  executing: boolean;
  duplicating: boolean;
  
  // Estado de calendário
  calendarEvents: CalendarEvent[];
  optimalTimes: OptimalTimeSuggestion[];
  
  // Estado de seleção múltipla
  selectedSchedules: string[];
  bulkAction: string | null;
}

interface SchedulesActions {
  // Ações de busca e listagem
  fetchSchedules: (params?: ScheduleSearchParams) => Promise<void>;
  refreshSchedules: () => Promise<void>;
  searchSchedules: (query: string) => Promise<void>;
  // Ações de seleção
  selectSchedule?: (e: any) => void;
  clearSelection??: (e: any) => void;
  selectMultipleSchedules?: (e: any) => void;
  toggleScheduleSelection?: (e: any) => void;
  clearMultipleSelection??: (e: any) => void;
  // Ações de CRUD
  createSchedule: (scheduleData: CreateScheduleData) => Promise<SocialSchedule>;
  updateSchedule: (id: string, scheduleData: UpdateScheduleData) => Promise<SocialSchedule>;
  deleteSchedule: (id: string) => Promise<void>;
  duplicateSchedule: (id: string) => Promise<SocialSchedule>;
  // Ações de controle
  activateSchedule: (id: string) => Promise<SocialSchedule>;
  deactivateSchedule: (id: string) => Promise<SocialSchedule>;
  executeSchedule: (id: string) => Promise<SocialSchedule>;
  // Ações de otimização
  getOptimalTimes: (postId: string, options?: string) => Promise<OptimalTimeSuggestion[]>;
  suggestOptimalTime: (postId: string) => Promise<string[]>;
  // Ações de calendário
  fetchCalendarEvents: (dateFrom: string, dateTo: string) => Promise<void>;
  createCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<CalendarEvent>;
  updateCalendarEvent: (id: string, event: Partial<CalendarEvent>) => Promise<CalendarEvent>;
  deleteCalendarEvent: (id: string) => Promise<void>;
  // Ações de estatísticas
  fetchSchedulesStats: () => Promise<void>;
  // Ações de filtros
  setFilters?: (e: any) => void;
  clearFilters??: (e: any) => void;
  // Ações de paginação
  setPage?: (e: any) => void;
  setLimit?: (e: any) => void;
  // Ações de estado
  setLoading?: (e: any) => void;
  setError?: (e: any) => void;
  clearError??: (e: any) => void;
  // Ações de bulk
  setBulkAction?: (e: any) => void;
  executeBulkAction: (action: string, scheduleIds: string[]) => Promise<void>; }

type SchedulesStore = SchedulesState & SchedulesActions;

const initialState: SchedulesState = {
  schedules: [],
  selectedSchedule: null,
  schedulesStats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  filters: {},
  loading: false,
  error: null,
  activating: false,
  deactivating: false,
  executing: false,
  duplicating: false,
  calendarEvents: [],
  optimalTimes: [],
  selectedSchedules: [],
  bulkAction: null};

export const useSchedulesStore = create<SchedulesStore>()(
  devtools(
    persist(
      (set: unknown, get: unknown) => ({
        ...initialState,

        // Ações de busca e listagem
        fetchSchedules: async (params?: ScheduleSearchParams) => {
          try {
            set({ loading: true, error: null });

            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params};

            const response: SchedulePaginatedResponse = await schedulesService.getSchedules(searchParams);

            set({
              schedules: (response as any).data,
              pagination: {
                page: (response as any).page,
                limit: (response as any).limit,
                total: (response as any).total,
                totalPages: (response as any).total_pages
              },
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,

        refreshSchedules: async () => {
          const { fetchSchedules, filters, pagination } = get();

          await fetchSchedules({
            ...filters,
            page: pagination.page,
            limit: pagination.limit
          });

        },

        searchSchedules: async (query: string) => {
          const { fetchSchedules } = get();

          await fetchSchedules({ search: query });

        },

        // Ações de seleção
        selectSchedule: (schedule: SocialSchedule | null) => {
          set({ selectedSchedule: schedule });

        },

        clearSelection: () => {
          set({ selectedSchedule: null });

        },

        selectMultipleSchedules: (scheduleIds: string[]) => {
          set({ selectedSchedules: scheduleIds });

        },

        toggleScheduleSelection: (scheduleId: string) => {
          set((state: unknown) => ({
            selectedSchedules: state.selectedSchedules.includes(scheduleId)
              ? state.selectedSchedules.filter(id => id !== scheduleId)
              : [...state.selectedSchedules, scheduleId]
          }));

        },

        clearMultipleSelection: () => {
          set({ selectedSchedules: [] });

        },

        // Ações de CRUD
        createSchedule: async (scheduleData: CreateScheduleData) => {
          try {
            set({ loading: true, error: null });

            const newSchedule = await schedulesService.createSchedule(scheduleData);

            set((state: unknown) => ({
              schedules: [newSchedule, ...state.schedules],
              loading: false
            }));

            return newSchedule;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

            throw error;
          } ,

        updateSchedule: async (id: string, scheduleData: UpdateScheduleData) => {
          try {
            set({ loading: true, error: null });

            const updatedSchedule = await schedulesService.updateSchedule(id, scheduleData);

            set((state: unknown) => ({
              schedules: state.schedules.map(schedule =>
                schedule.id === id ? updatedSchedule : schedule
              ),
              selectedSchedule: state.selectedSchedule?.id === id ? updatedSchedule : state.selectedSchedule,
              loading: false
            }));

            return updatedSchedule;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

            throw error;
          } ,

        deleteSchedule: async (id: string) => {
          try {
            set({ loading: true, error: null });

            await schedulesService.deleteSchedule(id);

            set((state: unknown) => ({
              schedules: state.schedules.filter(schedule => schedule.id !== id),
              selectedSchedule: state.selectedSchedule?.id === id ? null : state.selectedSchedule,
              selectedSchedules: state.selectedSchedules.filter(scheduleId => scheduleId !== id),
              loading: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

            throw error;
          } ,

        duplicateSchedule: async (id: string) => {
          try {
            set({ duplicating: true, error: null });

            const duplicatedSchedule = await schedulesService.duplicateSchedule(id);

            set((state: unknown) => ({
              schedules: [duplicatedSchedule, ...state.schedules],
              duplicating: false
            }));

            return duplicatedSchedule;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              duplicating: false
            });

            throw error;
          } ,

        // Ações de controle
        activateSchedule: async (id: string) => {
          try {
            set({ activating: true, error: null });

            const activatedSchedule = await schedulesService.activateSchedule(id);

            set((state: unknown) => ({
              schedules: state.schedules.map(schedule =>
                schedule.id === id ? activatedSchedule : schedule
              ),
              selectedSchedule: state.selectedSchedule?.id === id ? activatedSchedule : state.selectedSchedule,
              activating: false
            }));

            return activatedSchedule;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              activating: false
            });

            throw error;
          } ,

        deactivateSchedule: async (id: string) => {
          try {
            set({ deactivating: true, error: null });

            const deactivatedSchedule = await schedulesService.deactivateSchedule(id);

            set((state: unknown) => ({
              schedules: state.schedules.map(schedule =>
                schedule.id === id ? deactivatedSchedule : schedule
              ),
              selectedSchedule: state.selectedSchedule?.id === id ? deactivatedSchedule : state.selectedSchedule,
              deactivating: false
            }));

            return deactivatedSchedule;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              deactivating: false
            });

            throw error;
          } ,

        executeSchedule: async (id: string) => {
          try {
            set({ executing: true, error: null });

            const executedSchedule = await schedulesService.executeSchedule(id);

            set((state: unknown) => ({
              schedules: state.schedules.map(schedule =>
                schedule.id === id ? executedSchedule : schedule
              ),
              selectedSchedule: state.selectedSchedule?.id === id ? executedSchedule : state.selectedSchedule,
              executing: false
            }));

            return executedSchedule;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              executing: false
            });

            throw error;
          } ,

        // Ações de otimização
        getOptimalTimes: async (postId: string, options?: string) => {
          try {
            const optimalTimes = await schedulesService.getOptimalTimes(postId, options);

            set({ optimalTimes });

            return optimalTimes;
          } catch (error) {
            set({
              error: getErrorMessage(error)
  });

            throw error;
          } ,

        suggestOptimalTime: async (postId: string) => {
          try {
            const times = await schedulesService.suggestOptimalTime(postId);

            return times;
          } catch (error) {
            set({
              error: getErrorMessage(error)
  });

            throw error;
          } ,

        // Ações de calendário
        fetchCalendarEvents: async (dateFrom: string, dateTo: string) => {
          try {
            set({ loading: true, error: null });

            const events = await schedulesService.getCalendarEvents(dateFrom, dateTo);

            set({
              calendarEvents: events,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,

        createCalendarEvent: async (event: Omit<CalendarEvent, 'id'>) => {
          try {
            const newEvent = await schedulesService.createCalendarEvent(event);

            set((state: unknown) => ({
              calendarEvents: [...state.calendarEvents, newEvent]
            }));

            return newEvent;
          } catch (error) {
            set({
              error: getErrorMessage(error)
  });

            throw error;
          } ,

        updateCalendarEvent: async (id: string, event: Partial<CalendarEvent>) => {
          try {
            const updatedEvent = await schedulesService.updateCalendarEvent(id, event);

            set((state: unknown) => ({
              calendarEvents: state.calendarEvents.map(evt =>
                evt.id === id ? updatedEvent : evt
              )
  }));

            return updatedEvent;
          } catch (error) {
            set({
              error: getErrorMessage(error)
  });

            throw error;
          } ,

        deleteCalendarEvent: async (id: string) => {
          try {
            await schedulesService.deleteCalendarEvent(id);

            set((state: unknown) => ({
              calendarEvents: state.calendarEvents.filter(evt => evt.id !== id)
  }));

          } catch (error) {
            set({
              error: getErrorMessage(error)
  });

            throw error;
          } ,

        // Ações de estatísticas
        fetchSchedulesStats: async () => {
          try {
            const stats = await schedulesService.getSchedulesStats();

            set({ schedulesStats: stats });

          } catch (error) {
            set({
              error: getErrorMessage(error)
  });

          } ,

        // Ações de filtros
        setFilters: (filters: Partial<ScheduleSearchParams>) => {
          set((state: unknown) => ({
            filters: { ...state.filters, ...filters },
            pagination: { ...state.pagination, page: 1 } // Reset para primeira página
          }));

        },

        clearFilters: () => {
          set({ filters: {}, pagination: { ...get().pagination, page: 1 } );

        },

        // Ações de paginação
        setPage: (page: number) => {
          set((state: unknown) => ({
            pagination: { ...state.pagination, page } ));

        },

        setLimit: (limit: number) => {
          set((state: unknown) => ({
            pagination: { ...state.pagination, limit, page: 1 } // Reset para primeira página
          }));

        },

        // Ações de estado
        setLoading: (loading: boolean) => {
          set({ loading });

        },

        setError: (error: string | null) => {
          set({ error });

        },

        clearError: () => {
          set({ error: null });

        },

        // Ações de bulk
        setBulkAction: (action: string | null) => {
          set({ bulkAction: action });

        },

        executeBulkAction: async (action: string, scheduleIds: string[]) => {
          try {
            set({ loading: true, error: null });

            switch (action) {
              case 'activate':
                await Promise.all(scheduleIds.map(id => schedulesService.activateSchedule(id)));

                break;
              case 'deactivate':
                await Promise.all(scheduleIds.map(id => schedulesService.deactivateSchedule(id)));

                break;
              case 'delete':
                await Promise.all(scheduleIds.map(id => schedulesService.deleteSchedule(id)));

                break;
              case 'duplicate':
                await Promise.all(scheduleIds.map(id => schedulesService.duplicateSchedule(id)));

                break;
              default:
                throw new Error('Ação em lote não suportada');

            }
            
            // Atualizar lista de agendamentos
            const { refreshSchedules } = get();

            await refreshSchedules();

            set({ loading: false, selectedSchedules: [] });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

            throw error;
          } }),
      {
        name: 'socialbuffer-schedules-store',
        partialize: (state: unknown) => ({
          filters: state.filters,
          pagination: state.pagination,
          selectedSchedule: state.selectedSchedule
        })
  }
    ),
    {
      name: 'SocialBufferSchedulesStore'
    }
  ));

export default useSchedulesStore;
