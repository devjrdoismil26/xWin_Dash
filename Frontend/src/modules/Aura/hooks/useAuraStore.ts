/**
 * @module modules/Aura/hooks/useAuraStoreStandardized
 * @description
 * Store padronizado do módulo Aura usando Zustand com TypeScript.
 * 
 * Versão simplificada e padronizada do store que fornece:
 * - Estado de dados (connections, flows, chats)
 * - Estados de UI (loading, error, currentView, pagination)
 * - Filtros e paginação
 * - Ações principais (fetchConnections, fetchFlows, fetchChats)
 * - Persistência com Zustand persist middleware
 * - Immer middleware para atualizações imutáveis
 * 
 * @example
 * ```typescript
 * import { useAuraStoreStandardized } from './hooks/useAuraStoreStandardized';
 * 
 * const MyComponent = () => {
 *   const { connections, loading, fetchConnections, setFilters } = useAuraStoreStandardized();

 * 
 *   useEffect(() => {
 *     fetchConnections({ status: 'active' });

 *   }, []);

 * 
 *   return <div>...</div>;
 *};

 * ```
 * 
 * @since 1.0.0
 */
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AuraService from '../services/auraService';
import { AuraConnection, AuraFlow, AuraChat, AuraFilters } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';

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
  last_page: number; };

}

interface AuraActions {
  // Ações principais
  fetchConnections: (filters?: AuraFilters) => Promise<void>;
  fetchFlows: (filters?: AuraFilters) => Promise<void>;
  fetchChats: (filters?: AuraFilters) => Promise<void>;
  // Ações de filtros
  setFilters?: (e: any) => void;
  clearFilters??: (e: any) => void;
  // Ações de UI
  setCurrentView?: (e: any) => void;
  clearError??: (e: any) => void; }

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
  } ;

export const useAuraStore = create<AuraStore>()(
  devtools(
    persist(
      immer((set: unknown, get: unknown) => ({
        ...initialState,
        
        fetchConnections: async (filters: AuraFilters = {}) => {
          set({ loading: true, error: null });

          try {
            const result = await AuraService.getConnections(filters) as { data?: string[]; pagination?: string};

            set({
              connections: (result.data || []) as unknown[],
              pagination: (result.pagination || initialState.pagination) as typeof initialState.pagination,
              loading: false
            });

          } catch (error: unknown) {
            const errorMessage = error instanceof Error
              ? getErrorMessage(error)
              : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao carregar conexões';
            set({ 
              error: errorMessage, 
              loading: false 
            });

          } ,
        
        fetchFlows: async (filters: AuraFilters = {}) => {
          set({ loading: true, error: null });

          try {
            const result = await AuraService.getFlows(filters) as { data?: string[]; pagination?: string};

            set({
              flows: (result.data || []) as unknown[],
              pagination: (result.pagination || initialState.pagination) as typeof initialState.pagination,
              loading: false
            });

          } catch (error: unknown) {
            const errorMessage = error instanceof Error
              ? getErrorMessage(error)
              : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao carregar fluxos';
            set({ 
              error: errorMessage, 
              loading: false 
            });

          } ,
        
        fetchChats: async (filters: AuraFilters = {}) => {
          set({ loading: true, error: null });

          try {
            const result = await AuraService.getChats(filters) as { data?: string[]; pagination?: string};

            set({
              chats: (result.data || []) as unknown[],
              pagination: (result.pagination || initialState.pagination) as typeof initialState.pagination,
              loading: false
            });

          } catch (error: unknown) {
            const errorMessage = error instanceof Error
              ? getErrorMessage(error)
              : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao carregar chats';
            set({ 
              error: errorMessage, 
              loading: false 
            });

          } ,
        
        setFilters: (filters: AuraFilters) => set({ filters }),
        clearFilters: () => set({ filters: {} ),
        setCurrentView: (view: string) => set({ currentView: view }),
        clearError: () => set({ error: null })
  })),
      {
        name: 'aura-store',
        partialize: (state: unknown) => ({
          filters: state.filters,
          currentView: state.currentView
        })
  }
    ),
    {
      name: 'aura-store'
    }
  ));

export default MyComponent;
