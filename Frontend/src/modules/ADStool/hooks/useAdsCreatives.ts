/**
 * Hook especializado para gerenciamento de criativos de anúncios
 * @module modules/ADStool/hooks/useAdsCreatives
 * @description
 * Hook Zustand especializado para gerenciamento completo de criativos de anúncios,
 * fornecendo estado global e ações CRUD (criar, ler, atualizar, deletar),
 * operações específicas de duplicação, aprovação/rejeição, pausa/resume,
 * upload/delete de mídia, gerenciamento de biblioteca de mídia, criação e
 * resultados de testes A/B, e métodos utilitários para buscar criativos por
 * campanha, status ou ID.
 * @since 1.0.0
 */
import { create } from 'zustand';
import { adsCreativeService } from '../services';
import { AdsCreative } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';

interface AdsCreativesState {
  creatives: AdsCreative[];
  loading: boolean;
  error: string | null; }

interface AdsCreativesActions {
  // Ações CRUD para criativos
  fetchCreatives: (params?: Record<string, any>) => Promise<void>;
  createCreative: (creativeData: Partial<AdsCreative>) => Promise<{ success: boolean;
  data?: AdsCreative;
  error?: string;
}>;
  updateCreative: (id: string | number, creativeData: Partial<AdsCreative>) => Promise<{ success: boolean; data?: AdsCreative; error?: string }>;
  deleteCreative: (id: string | number) => Promise<void>;
  
  // Ações específicas para criativos
  duplicateCreative: (id: string | number, newName?: string) => Promise<{ success: boolean; data?: AdsCreative; error?: string }>;
  approveCreative: (id: string | number) => Promise<{ success: boolean; data?: AdsCreative; error?: string }>;
  rejectCreative: (id: string | number, reason?: string) => Promise<{ success: boolean; data?: AdsCreative; error?: string }>;
  pauseCreative: (id: string | number) => Promise<{ success: boolean; data?: AdsCreative; error?: string }>;
  resumeCreative: (id: string | number) => Promise<{ success: boolean; data?: AdsCreative; error?: string }>;
  
  // Ações para mídia
  uploadMedia: (file: File, type: string) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  deleteMedia: (mediaId: string) => Promise<{ success: boolean; error?: string }>;
  getMediaLibrary: () => Promise<{ success: boolean; data?: Record<string, any>[]; error?: string }>;
  
  // Ações para A/B testing
  createABTest: (creativeIds: string[], testName: string) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  getABTestResults: (testId: string) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  
  // Métodos utilitários
  getCreativesByCampaign: (campaignId: string | number) => AdsCreative[];
  getCreativesByStatus: (status: string) => AdsCreative[];
  getCreativeById: (id: string | number) => AdsCreative | undefined;
  getActiveCreatives: () => AdsCreative[];
  getPausedCreatives: () => AdsCreative[];
  
  // Ações de UI
  clearError??: (e: any) => void;
}

type AdsCreativesStore = AdsCreativesState & AdsCreativesActions;

const useAdsCreatives = create<AdsCreativesStore>((set: unknown, get: unknown) => ({
  // Estado
  creatives: [],
  loading: false,
  error: null,

  // Ações CRUD para criativos
  fetchCreatives: async (params: Record<string, any> = {}) => {
    set({ loading: true, error: null });

    try {
      const response = await adsCreativeService.getCreatives(params);

      if (response.success) {
        set({ creatives: (response as any).data || [], loading: false });

      } else {
        set({ error: (response as any).error, loading: false });

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

    } ,

  createCreative: async (creativeData: Partial<AdsCreative>) => {
    set({ loading: true, error: null });

    try {
      const response = await adsCreativeService.createCreative(creativeData);

      if (response.success) {
        set(state => ({ 
          creatives: [...state.creatives, (response as any).data], 
          loading: false 
        }));

        return response;
      } else {
        set({ error: (response as any).error, loading: false });

        throw new Error(response.error);

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  updateCreative: async (id: string | number, creativeData: Partial<AdsCreative>) => {
    set({ loading: true, error: null });

    try {
      const response = await adsCreativeService.updateCreative(id, creativeData);

      if (response.success) {
        set(state => ({
          creatives: state.creatives.map(creative => 
            creative.id === id ? (response as any).data : creative
          ),
          loading: false
        }));

        return response;
      } else {
        set({ error: (response as any).error, loading: false });

        throw new Error(response.error);

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  deleteCreative: async (id: string | number) => {
    set({ loading: true, error: null });

    try {
      const response = await adsCreativeService.deleteCreative(id);

      if (response.success) {
        set(state => ({
          creatives: state.creatives.filter(creative => creative.id !== id),
          loading: false
        }));

      } else {
        set({ error: (response as any).error, loading: false });

        throw new Error(response.error);

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  // Ações específicas para criativos
  duplicateCreative: async (id: string | number, newName?: string) => {
    set({ loading: true, error: null });

    try {
      const response = await adsCreativeService.duplicateCreative(id, newName);

      if (response.success) {
        set(state => ({ 
          creatives: [...state.creatives, (response as any).data], 
          loading: false 
        }));

        return response;
      } else {
        set({ error: (response as any).error, loading: false });

        throw new Error(response.error);

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  approveCreative: async (id: string | number) => {
    set({ loading: true, error: null });

    try {
      const response = await adsCreativeService.approveCreative(id);

      if (response.success) {
        set(state => ({
          creatives: state.creatives.map(creative => 
            creative.id === id ? { ...creative, status: 'approved' } : creative
          ),
          loading: false
        }));

        return response;
      } else {
        set({ error: (response as any).error, loading: false });

        throw new Error(response.error);

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  rejectCreative: async (id: string | number, reason?: string) => {
    set({ loading: true, error: null });

    try {
      const response = await adsCreativeService.rejectCreative(id, reason);

      if (response.success) {
        set(state => ({
          creatives: state.creatives.map(creative => 
            creative.id === id ? { ...creative, status: 'rejected' } : creative
          ),
          loading: false
        }));

        return response;
      } else {
        set({ error: (response as any).error, loading: false });

        throw new Error(response.error);

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  pauseCreative: async (id: string | number) => {
    set({ loading: true, error: null });

    try {
      const response = await adsCreativeService.pauseCreative(id);

      if (response.success) {
        set(state => ({
          creatives: state.creatives.map(creative => 
            creative.id === id ? { ...creative, status: 'paused' } : creative
          ),
          loading: false
        }));

        return response;
      } else {
        set({ error: (response as any).error, loading: false });

        throw new Error(response.error);

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  resumeCreative: async (id: string | number) => {
    set({ loading: true, error: null });

    try {
      const response = await adsCreativeService.resumeCreative(id);

      if (response.success) {
        set(state => ({
          creatives: state.creatives.map(creative => 
            creative.id === id ? { ...creative, status: 'active' } : creative
          ),
          loading: false
        }));

        return response;
      } else {
        set({ error: (response as any).error, loading: false });

        throw new Error(response.error);

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  // Ações para mídia
  uploadMedia: async (file: File, type: string) => {
    set({ loading: true, error: null });

    try {
      const response = await adsCreativeService.uploadMedia(file, type);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  deleteMedia: async (mediaId: string) => {
    set({ loading: true, error: null });

    try {
      const response = await adsCreativeService.deleteMedia(mediaId);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  getMediaLibrary: async () => {
    set({ loading: true, error: null });

    try {
      const response = await adsCreativeService.getMediaLibrary();

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  // Ações para A/B testing
  createABTest: async (creativeIds: string[], testName: string) => {
    set({ loading: true, error: null });

    try {
      const response = await adsCreativeService.createABTest(creativeIds, testName);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  getABTestResults: async (testId: string) => {
    set({ loading: true, error: null });

    try {
      const response = await adsCreativeService.getABTestResults(testId);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  // Métodos utilitários
  getCreativesByCampaign: (campaignId: string | number) => {
    const { creatives } = get();

    return creatives.filter(creative => creative.campaign_id === campaignId);

  },

  getCreativesByStatus: (status: string) => {
    const { creatives } = get();

    return creatives.filter(creative => creative.status === status);

  },

  getCreativeById: (id: string | number) => {
    const { creatives } = get();

    return creatives.find(creative => creative.id === id);

  },

  getActiveCreatives: () => {
    const { creatives } = get();

    return creatives.filter(creative => creative.status === 'active');

  },

  getPausedCreatives: () => {
    const { creatives } = get();

    return creatives.filter(creative => creative.status === 'paused');

  },

  // Ações de UI
  clearError: () => set({ error: null }),
}));

export default useAdsCreatives;
