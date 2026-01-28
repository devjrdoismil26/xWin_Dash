/**
 * Store principal do módulo Leads
 * Gerenciamento de estado global com Zustand e TypeScript
 * Máximo: 300 linhas
 */
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import LeadsService from '../services/leadsService';
import { Lead, LeadFilters } from '../types';

interface LeadsState {
  // Dados principais
  leads: Lead[];
  currentLead: Lead | null;
  filters: LeadFilters;
  
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

interface LeadsActions {
  // Ações principais
  fetchLeads: (filters?: LeadFilters) => Promise<void>;
  fetchLeadById: (id: string) => Promise<void>;
  createLead: (data: Partial<Lead>) => Promise<Lead>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<Lead>;
  deleteLead: (id: string) => Promise<void>;
  
  // Ações em lote
  bulkUpdateLeads: (ids: string[], updates: Partial<Lead>) => Promise<void>;
  bulkDeleteLeads: (ids: string[]) => Promise<void>;
  
  // Ações de filtros
  setFilters: (filters: LeadFilters) => void;
  clearFilters: () => void;
  
  // Ações de UI
  setCurrentView: (view: string) => void;
  setCurrentLead: (lead: Lead | null) => void;
  clearError: () => void;
}

type LeadsStore = LeadsState & LeadsActions;

const initialState: LeadsState = {
  leads: [],
  currentLead: null,
  filters: {},
  loading: false,
  error: null,
  currentView: 'list',
  pagination: {
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1
  }
};

export const useLeadsStore = create<LeadsStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        
        fetchLeads: async (filters: LeadFilters = {}) => {
          set({ loading: true, error: null });
          try {
            const result = await LeadsService.getLeads(filters);
            set({
              leads: result.data || [],
              pagination: result.pagination || initialState.pagination,
              loading: false
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar leads', 
              loading: false 
            });
          }
        },
        
        createLead: async (data: Partial<Lead>) => {
          set({ loading: true, error: null });
          try {
            const result = await LeadsService.createLead(data);
            set(state => ({
              leads: [result.data, ...state.leads],
              loading: false
            }));
            return result.data;
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao criar lead', 
              loading: false 
            });
            throw error;
          }
        },
        
        updateLead: async (id: string, data: Partial<Lead>) => {
          set({ loading: true, error: null });
          try {
            const result = await LeadsService.updateLead(id, data);
            set(state => ({
              leads: state.leads.map(lead => 
                lead.id === id ? result.data : lead
              ),
              loading: false
            }));
            return result.data;
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao atualizar lead', 
              loading: false 
            });
            throw error;
          }
        },
        
        deleteLead: async (id: string) => {
          set({ loading: true, error: null });
          try {
            await LeadsService.deleteLead(id);
            set(state => ({
              leads: state.leads.filter(lead => lead.id !== id),
              loading: false
            }));
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao excluir lead', 
              loading: false 
            });
            throw error;
          }
        },
        
        bulkUpdateLeads: async (ids: string[], updates: Partial<Lead>) => {
          set({ loading: true, error: null });
          try {
            await LeadsService.bulkUpdateLeads(ids, updates);
            set(state => ({
              leads: state.leads.map(lead => 
                ids.includes(lead.id) ? { ...lead, ...updates } : lead
              ),
              loading: false
            }));
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao atualizar leads em lote', 
              loading: false 
            });
            throw error;
          }
        },
        
        bulkDeleteLeads: async (ids: string[]) => {
          set({ loading: true, error: null });
          try {
            await LeadsService.bulkDeleteLeads(ids);
            set(state => ({
              leads: state.leads.filter(lead => !ids.includes(lead.id)),
              loading: false
            }));
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao excluir leads em lote', 
              loading: false 
            });
            throw error;
          }
        },
        
        setFilters: (filters: LeadFilters) => set({ filters }),
        clearFilters: () => set({ filters: {} }),
        setCurrentView: (view: string) => set({ currentView: view }),
        setCurrentLead: (lead: Lead | null) => set({ currentLead: lead }),
        clearError: () => set({ error: null })
      })),
      {
        name: 'leads-store',
        partialize: (state) => ({
          filters: state.filters,
          currentView: state.currentView
        })
      }
    ),
    {
      name: 'leads-store'
    }
  )
);