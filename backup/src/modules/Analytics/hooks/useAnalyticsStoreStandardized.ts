/**
 * Store principal do módulo Analytics
 * Gerenciamento de estado global com Zustand e TypeScript
 * Máximo: 300 linhas
 */
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AnalyticsService from '../services/analyticsService';
import { AnalyticsReport, AnalyticsFilters, AnalyticsDashboardData } from '../types';

interface AnalyticsState {
  // Dados principais
  reports: AnalyticsReport[];
  currentReport: AnalyticsReport | null;
  dashboardData: AnalyticsDashboardData | null;
  filters: AnalyticsFilters;
  
  // Estado da UI
  loading: boolean;
  error: string | null;
  currentView: string;
  
  // Paginação
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

interface AnalyticsActions {
  // Ações principais
  fetchReports: (filters?: AnalyticsFilters) => Promise<void>;
  fetchReportById: (id: string) => Promise<void>;
  createReport: (data: Partial<AnalyticsReport>) => Promise<AnalyticsReport>;
  updateReport: (id: string, data: Partial<AnalyticsReport>) => Promise<AnalyticsReport>;
  deleteReport: (id: string) => Promise<void>;
  
  // Ações em lote
  bulkUpdateReports: (ids: string[], updates: Partial<AnalyticsReport>) => Promise<void>;
  bulkDeleteReports: (ids: string[]) => Promise<void>;
  
  // Ações de filtros
  setFilters: (filters: AnalyticsFilters) => void;
  clearFilters: () => void;
  
  // Ações de UI
  setCurrentView: (view: string) => void;
  setCurrentReport: (report: AnalyticsReport | null) => void;
  clearError: () => void;
}

type AnalyticsStore = AnalyticsState & AnalyticsActions;

const initialState: AnalyticsState = {
  reports: [],
  currentReport: null,
  dashboardData: null,
  filters: {
    date_range: '30days',
    report_type: 'overview'
  },
  loading: false,
  error: null,
  currentView: 'dashboard',
  pagination: {
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1
  }
};

export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        
        fetchReports: async (filters: AnalyticsFilters = {}) => {
          set({ loading: true, error: null });
          try {
            const result = await AnalyticsService.getReports(filters);
            set({
              reports: result.data || [],
              pagination: result.pagination || initialState.pagination,
              loading: false
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar relatórios', 
              loading: false 
            });
          }
        },
        
        createReport: async (data: Partial<AnalyticsReport>) => {
          set({ loading: true, error: null });
          try {
            const result = await AnalyticsService.createReport(data);
            set(state => ({
              reports: [result.data, ...state.reports],
              loading: false
            }));
            return result.data;
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao criar relatório', 
              loading: false 
            });
            throw error;
          }
        },
        
        updateReport: async (id: string, data: Partial<AnalyticsReport>) => {
          set({ loading: true, error: null });
          try {
            const result = await AnalyticsService.updateReport(id, data);
            set(state => ({
              reports: state.reports.map(report => 
                report.id === id ? result.data : report
              ),
              loading: false
            }));
            return result.data;
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao atualizar relatório', 
              loading: false 
            });
            throw error;
          }
        },
        
        deleteReport: async (id: string) => {
          set({ loading: true, error: null });
          try {
            await AnalyticsService.deleteReport(id);
            set(state => ({
              reports: state.reports.filter(report => report.id !== id),
              loading: false
            }));
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao excluir relatório', 
              loading: false 
            });
            throw error;
          }
        },
        
        bulkUpdateReports: async (ids: string[], updates: Partial<AnalyticsReport>) => {
          set({ loading: true, error: null });
          try {
            await AnalyticsService.bulkUpdateReports(ids, updates);
            set(state => ({
              reports: state.reports.map(report => 
                ids.includes(report.id) ? { ...report, ...updates } : report
              ),
              loading: false
            }));
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao atualizar relatórios em lote', 
              loading: false 
            });
            throw error;
          }
        },
        
        bulkDeleteReports: async (ids: string[]) => {
          set({ loading: true, error: null });
          try {
            await AnalyticsService.bulkDeleteReports(ids);
            set(state => ({
              reports: state.reports.filter(report => !ids.includes(report.id)),
              loading: false
            }));
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao excluir relatórios em lote', 
              loading: false 
            });
            throw error;
          }
        },
        
        setFilters: (filters: AnalyticsFilters) => set({ filters }),
        clearFilters: () => set({ filters: initialState.filters }),
        setCurrentView: (view: string) => set({ currentView: view }),
        setCurrentReport: (report: AnalyticsReport | null) => set({ currentReport: report }),
        clearError: () => set({ error: null })
      })),
      {
        name: 'analytics-store',
        partialize: (state) => ({
          filters: state.filters,
          currentView: state.currentView
        })
      }
    ),
    {
      name: 'analytics-store'
    }
  )
);