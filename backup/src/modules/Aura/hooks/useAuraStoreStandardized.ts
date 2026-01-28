/**
 * Store principal do módulo Aura
 * Gerenciamento de estado global com Zustand e TypeScript
 * Máximo: 300 linhas
 */
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AuraService from '../services/auraService';
import { AuraConnection, AuraFlow, AuraChat, AuraFilters } from '../types';

interface AuraState {
  // Dados principais
  connections: AuraConnection[];
  flows: AuraFlow[];
  chats: AuraChat[];
  filters: AuraFilters;
  
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

interface AuraActions {
  // Ações principais
  fetchConnections: (filters?: AuraFilters) => Promise<void>;
  fetchFlows: (filters?: AuraFilters) => Promise<void>;
  fetchChats: (filters?: AuraFilters) => Promise<void>;
  
  // Ações de filtros
  setFilters: (filters: AuraFilters) => void;
  clearFilters: () => void;
  
  // Ações de UI
  setCurrentView: (view: string) => void;
  clearError: () => void;
}

type AuraStore = AuraState & AuraActions;

const initialState: AuraState = {
  connections: [],
  flows: [],
  chats: [],
  filters: {},
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

export const useAuraStore = create<AuraStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        
        fetchConnections: async (filters: AuraFilters = {}) => {
          set({ loading: true, error: null });
          try {
            const result = await AuraService.getConnections(filters);
            set({
              connections: result.data || [],
              pagination: result.pagination || initialState.pagination,
              loading: false
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar conexões', 
              loading: false 
            });
          }
        },
        
        fetchFlows: async (filters: AuraFilters = {}) => {
          set({ loading: true, error: null });
          try {
            const result = await AuraService.getFlows(filters);
            set({
              flows: result.data || [],
              pagination: result.pagination || initialState.pagination,
              loading: false
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar fluxos', 
              loading: false 
            });
          }
        },
        
        fetchChats: async (filters: AuraFilters = {}) => {
          set({ loading: true, error: null });
          try {
            const result = await AuraService.getChats(filters);
            set({
              chats: result.data || [],
              pagination: result.pagination || initialState.pagination,
              loading: false
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar chats', 
              loading: false 
            });
          }
        },
        
        setFilters: (filters: AuraFilters) => set({ filters }),
        clearFilters: () => set({ filters: {} }),
        setCurrentView: (view: string) => set({ currentView: view }),
        clearError: () => set({ error: null })
      })),
      {
        name: 'aura-store',
        partialize: (state) => ({
          filters: state.filters,
          currentView: state.currentView
        })
      }
    ),
    {
      name: 'aura-store'
    }
  )
);