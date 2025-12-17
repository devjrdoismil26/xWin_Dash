/**
 * Store principal do módulo ADStool
 * @module modules/ADStool/hooks/useADStoolStoreStandardized
 * @description
 * Store de estado global do módulo ADStool usando Zustand com persistência e Immer,
 * gerenciando dados principais (contas, campanhas, criativos, analytics), filtros,
 * estado da UI, paginação e ações para buscar dados, definir filtros e gerenciar UI.
 * @since 1.0.0
 */
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import adsService from '../services/adsService';
import { AdsAccount, AdsCampaign, AdsCreative, AdsFilters } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';
import { ADStoolService } from '@/services/ADStoolService';

interface ADStoolState {
  // Dados principais
  accounts: AdsAccount[];
  campaigns: AdsCampaign[];
  creatives: AdsCreative[];
  analytics: Record<string, any> | null;
  filters: AdsFilters;
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

interface ADStoolActions {
  // Ações principais
  fetchAccounts: (filters?: AdsFilters) => Promise<void>;
  fetchCampaigns: (filters?: AdsFilters) => Promise<void>;
  fetchCreatives: (filters?: AdsFilters) => Promise<void>;
  fetchAnalytics: (filters?: AdsFilters) => Promise<void>;
  // Ações de filtros
  setFilters?: (e: any) => void;
  clearFilters??: (e: any) => void;
  // Ações de UI
  setCurrentView?: (e: any) => void;
  clearError??: (e: any) => void; }

type ADStoolStore = ADStoolState & ADStoolActions;

const initialState: ADStoolState = {
  accounts: [],
  campaigns: [],
  creatives: [],
  analytics: null,
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

export const useADStoolStore = create<ADStoolStore>()(
  devtools(
    persist(
      immer((set: unknown, get: unknown) => ({
        ...initialState,
        
        fetchAccounts: async (filters: AdsFilters = {}) => {
          set({ loading: true, error: null });

          try {
            const result = await ADStoolService.getAccounts(filters);

            set({
              accounts: result.data || [],
              pagination: result.pagination || initialState.pagination,
              loading: false
            });

          } catch (error: unknown) {
            const errorMessage = error instanceof Error
              ? getErrorMessage(error)
              : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
            set({ 
              error: errorMessage || 'Erro ao carregar contas', 
              loading: false 
            });

          } ,
        
        fetchCampaigns: async (filters: AdsFilters = {}) => {
          set({ loading: true, error: null });

          try {
            const result = await ADStoolService.getCampaigns(filters);

            set({
              campaigns: result.data || [],
              pagination: result.pagination || initialState.pagination,
              loading: false
            });

          } catch (error: unknown) {
            const errorMessage = error instanceof Error
              ? getErrorMessage(error)
              : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
            set({ 
              error: getErrorMessage(error) || 'Erro ao carregar campanhas', 
              loading: false 
            });

          } ,
        
        fetchCreatives: async (filters: AdsFilters = {}) => {
          set({ loading: true, error: null });

          try {
            const result = await ADStoolService.getCreatives(filters);

            set({
              creatives: result.data || [],
              pagination: result.pagination || initialState.pagination,
              loading: false
            });

          } catch (error: unknown) {
            const errorMessage = error instanceof Error
              ? getErrorMessage(error)
              : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
            set({ 
              error: getErrorMessage(error) || 'Erro ao carregar criativos', 
              loading: false 
            });

          } ,
        
        fetchAnalytics: async (filters: AdsFilters = {}) => {
          set({ loading: true, error: null });

          try {
            const result = await ADStoolService.getAnalytics(filters);

            set({
              analytics: result.data || null,
              loading: false
            });

          } catch (error: unknown) {
            const errorMessage = error instanceof Error
              ? getErrorMessage(error)
              : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
            set({ 
              error: getErrorMessage(error) || 'Erro ao carregar analytics', 
              loading: false 
            });

          } ,
        
        setFilters: (filters: AdsFilters) => set({ filters }),
        clearFilters: () => set({ filters: {} ),
        setCurrentView: (view: string) => set({ currentView: view }),
        clearError: () => set({ error: null })
  })),
      {
        name: 'adstool-store',
        partialize: (state: unknown) => ({
          filters: state.filters,
          currentView: state.currentView
        })
  }
    ),
    {
      name: 'adstool-store'
    }
  ));
