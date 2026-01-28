import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { schedulesService } from '../services/schedulesService';
import { SocialSchedule, SocialScheduleStatus } from '../types/socialTypes';
import type {
  ScheduleSearchParams,
  SchedulePaginatedResponse,
  CreateScheduleData,
  UpdateScheduleData,
  ScheduleStats,
  OptimalTimeSuggestion,
  CalendarEvent
} from '../services/schedulesService';

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
    totalPages: number;
  };
  
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
  selectSchedule: (schedule: SocialSchedule | null) => void;
  clearSelection: () => void;
  selectMultipleSchedules: (scheduleIds: string[]) => void;
  toggleScheduleSelection: (scheduleId: string) => void;
  clearMultipleSelection: () => void;
  
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
  getOptimalTimes: (postId: string, options?: any) => Promise<OptimalTimeSuggestion[]>;
  suggestOptimalTime: (postId: string) => Promise<string[]>;
  
  // Ações de calendário
  fetchCalendarEvents: (dateFrom: string, dateTo: string) => Promise<void>;
  createCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<CalendarEvent>;
  updateCalendarEvent: (id: string, event: Partial<CalendarEvent>) => Promise<CalendarEvent>;
  deleteCalendarEvent: (id: string) => Promise<void>;
  
  // Ações de estatísticas
  fetchSchedulesStats: () => Promise<void>;
  
  // Ações de filtros
  setFilters: (filters: Partial<ScheduleSearchParams>) => void;
  clearFilters: () => void;
  
  // Ações de paginação
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  
  // Ações de estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Ações de bulk
  setBulkAction: (action: string | null) => void;
  executeBulkAction: (action: string, scheduleIds: string[]) => Promise<void>;
}

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
  bulkAction: null
};

export const useSchedulesStore = create<SchedulesStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Ações de busca e listagem
        fetchSchedules: async (params?: ScheduleSearchParams) => {
          try {
            set({ loading: true, error: null });
            
            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params };
            
            const response: SchedulePaginatedResponse = await schedulesService.getSchedules(searchParams);
            
            set({
              schedules: response.data,
              pagination: {
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.total_pages
              },
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar agendamentos',
              loading: false
            });
          }
        },

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
          set((state) => ({
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
            
            set((state) => ({
              schedules: [newSchedule, ...state.schedules],
              loading: false
            }));
            
            return newSchedule;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao criar agendamento',
              loading: false
            });
            throw error;
          }
        },

        updateSchedule: async (id: string, scheduleData: UpdateScheduleData) => {
          try {
            set({ loading: true, error: null });
            
            const updatedSchedule = await schedulesService.updateSchedule(id, scheduleData);
            
            set((state) => ({
              schedules: state.schedules.map(schedule =>
                schedule.id === id ? updatedSchedule : schedule
              ),
              selectedSchedule: state.selectedSchedule?.id === id ? updatedSchedule : state.selectedSchedule,
              loading: false
            }));
            
            return updatedSchedule;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao atualizar agendamento',
              loading: false
            });
            throw error;
          }
        },

        deleteSchedule: async (id: string) => {
          try {
            set({ loading: true, error: null });
            
            await schedulesService.deleteSchedule(id);
            
            set((state) => ({
              schedules: state.schedules.filter(schedule => schedule.id !== id),
              selectedSchedule: state.selectedSchedule?.id === id ? null : state.selectedSchedule,
              selectedSchedules: state.selectedSchedules.filter(scheduleId => scheduleId !== id),
              loading: false
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao remover agendamento',
              loading: false
            });
            throw error;
          }
        },

        duplicateSchedule: async (id: string) => {
          try {
            set({ duplicating: true, error: null });
            
            const duplicatedSchedule = await schedulesService.duplicateSchedule(id);
            
            set((state) => ({
              schedules: [duplicatedSchedule, ...state.schedules],
              duplicating: false
            }));
            
            return duplicatedSchedule;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao duplicar agendamento',
              duplicating: false
            });
            throw error;
          }
        },

        // Ações de controle
        activateSchedule: async (id: string) => {
          try {
            set({ activating: true, error: null });
            
            const activatedSchedule = await schedulesService.activateSchedule(id);
            
            set((state) => ({
              schedules: state.schedules.map(schedule =>
                schedule.id === id ? activatedSchedule : schedule
              ),
              selectedSchedule: state.selectedSchedule?.id === id ? activatedSchedule : state.selectedSchedule,
              activating: false
            }));
            
            return activatedSchedule;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao ativar agendamento',
              activating: false
            });
            throw error;
          }
        },

        deactivateSchedule: async (id: string) => {
          try {
            set({ deactivating: true, error: null });
            
            const deactivatedSchedule = await schedulesService.deactivateSchedule(id);
            
            set((state) => ({
              schedules: state.schedules.map(schedule =>
                schedule.id === id ? deactivatedSchedule : schedule
              ),
              selectedSchedule: state.selectedSchedule?.id === id ? deactivatedSchedule : state.selectedSchedule,
              deactivating: false
            }));
            
            return deactivatedSchedule;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao desativar agendamento',
              deactivating: false
            });
            throw error;
          }
        },

        executeSchedule: async (id: string) => {
          try {
            set({ executing: true, error: null });
            
            const executedSchedule = await schedulesService.executeSchedule(id);
            
            set((state) => ({
              schedules: state.schedules.map(schedule =>
                schedule.id === id ? executedSchedule : schedule
              ),
              selectedSchedule: state.selectedSchedule?.id === id ? executedSchedule : state.selectedSchedule,
              executing: false
            }));
            
            return executedSchedule;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao executar agendamento',
              executing: false
            });
            throw error;
          }
        },

        // Ações de otimização
        getOptimalTimes: async (postId: string, options?: any) => {
          try {
            const optimalTimes = await schedulesService.getOptimalTimes(postId, options);
            set({ optimalTimes });
            return optimalTimes;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao obter horários otimizados'
            });
            throw error;
          }
        },

        suggestOptimalTime: async (postId: string) => {
          try {
            const times = await schedulesService.suggestOptimalTime(postId);
            return times;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao sugerir horário otimizado'
            });
            throw error;
          }
        },

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
              error: error instanceof Error ? error.message : 'Erro ao carregar eventos do calendário',
              loading: false
            });
          }
        },

        createCalendarEvent: async (event: Omit<CalendarEvent, 'id'>) => {
          try {
            const newEvent = await schedulesService.createCalendarEvent(event);
            
            set((state) => ({
              calendarEvents: [...state.calendarEvents, newEvent]
            }));
            
            return newEvent;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao criar evento do calendário'
            });
            throw error;
          }
        },

        updateCalendarEvent: async (id: string, event: Partial<CalendarEvent>) => {
          try {
            const updatedEvent = await schedulesService.updateCalendarEvent(id, event);
            
            set((state) => ({
              calendarEvents: state.calendarEvents.map(evt =>
                evt.id === id ? updatedEvent : evt
              )
            }));
            
            return updatedEvent;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao atualizar evento do calendário'
            });
            throw error;
          }
        },

        deleteCalendarEvent: async (id: string) => {
          try {
            await schedulesService.deleteCalendarEvent(id);
            
            set((state) => ({
              calendarEvents: state.calendarEvents.filter(evt => evt.id !== id)
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao remover evento do calendário'
            });
            throw error;
          }
        },

        // Ações de estatísticas
        fetchSchedulesStats: async () => {
          try {
            const stats = await schedulesService.getSchedulesStats();
            set({ schedulesStats: stats });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar estatísticas'
            });
          }
        },

        // Ações de filtros
        setFilters: (filters: Partial<ScheduleSearchParams>) => {
          set((state) => ({
            filters: { ...state.filters, ...filters },
            pagination: { ...state.pagination, page: 1 } // Reset para primeira página
          }));
        },

        clearFilters: () => {
          set({ filters: {}, pagination: { ...get().pagination, page: 1 } });
        },

        // Ações de paginação
        setPage: (page: number) => {
          set((state) => ({
            pagination: { ...state.pagination, page }
          }));
        },

        setLimit: (limit: number) => {
          set((state) => ({
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
              error: error instanceof Error ? error.message : 'Erro ao executar ação em lote',
              loading: false
            });
            throw error;
          }
        }
      }),
      {
        name: 'socialbuffer-schedules-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
          selectedSchedule: state.selectedSchedule
        })
      }
    ),
    {
      name: 'SocialBufferSchedulesStore'
    }
  )
);

export default useSchedulesStore;
