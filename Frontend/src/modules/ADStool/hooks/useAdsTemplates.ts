/**
 * Hook especializado para gerenciamento de templates de anúncios
 * @module modules/ADStool/hooks/useAdsTemplates
 * @description
 * Hook Zustand especializado para gerenciamento completo de templates de anúncios,
 * fornecendo estado global e ações CRUD (criar, ler, atualizar, deletar),
 * operações específicas para templates de campanhas, criativos e contas,
 * aplicação de templates, gerenciamento de templates de otimização,
 * importação/exportação de templates, duplicação e métodos utilitários
 * para buscar templates por tipo, plataforma ou visibilidade.
 * @since 1.0.0
 */
import { create } from 'zustand';
import { adsTemplateService } from '../services';
import { AdsTemplate } from '../types/adsTemplateTypes';
import { getErrorMessage } from '@/utils/errorHelpers';

interface AdsTemplatesState {
  templates: AdsTemplate[];
  loading: boolean;
  error: string | null; }

interface AdsTemplatesActions {
  // Ações CRUD para templates
  fetchTemplates: (params?: Record<string, any>) => Promise<void>;
  createTemplate: (templateData: Record<string, any>) => Promise<{ success: boolean;
  data?: AdsTemplate;
  error?: string;
}>;
  updateTemplate: (id: string | number, templateData: Record<string, any>) => Promise<{ success: boolean; data?: AdsTemplate; error?: string }>;
  deleteTemplate: (id: string | number) => Promise<void>;
  
  // Ações específicas para templates
  getCampaignTemplates: () => Promise<{ success: boolean; data?: AdsTemplate[]; error?: string }>;
  getCreativeTemplates: () => Promise<{ success: boolean; data?: AdsTemplate[]; error?: string }>;
  getAccountTemplates: () => Promise<{ success: boolean; data?: AdsTemplate[]; error?: string }>;
  
  // Ações para aplicação de templates
  applyCampaignTemplate: (templateId: string, campaignData: Record<string, any>) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  applyCreativeTemplate: (templateId: string, creativeData: Record<string, any>) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  applyAccountTemplate: (templateId: string, accountData: Record<string, any>) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  
  // Ações para otimização
  getOptimizationTemplates: () => Promise<{ success: boolean; data?: AdsTemplate[]; error?: string }>;
  applyOptimizationTemplate: (templateId: string, entityId: string, entityType: string) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  
  // Ações para importação/exportação
  importTemplate: (templateFile: File) => Promise<{ success: boolean; data?: AdsTemplate; error?: string }>;
  exportTemplate: (templateId: string, format: string) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  duplicateTemplate: (templateId: string, newName?: string) => Promise<{ success: boolean; data?: AdsTemplate; error?: string }>;
  
  // Métodos utilitários
  getTemplateById: (id: string | number) => AdsTemplate | undefined;
  getTemplatesByType: (type: string) => AdsTemplate[];
  getTemplatesByPlatform: (platform: string) => AdsTemplate[];
  getPublicTemplates: () => AdsTemplate[];
  getPrivateTemplates: () => AdsTemplate[];
  
  // Ações de UI
  clearError??: (e: any) => void;
}

type AdsTemplatesStore = AdsTemplatesState & AdsTemplatesActions;

const useAdsTemplates = create<AdsTemplatesStore>((set: unknown, get: unknown) => ({
  // Estado
  templates: [],
  loading: false,
  error: null,

  // Ações CRUD para templates
  fetchTemplates: async (params: Record<string, any> = {}) => {
    set({ loading: true, error: null });

    try {
      const response = await adsTemplateService.getTemplates(params);

      if (response.success) {
        set({ templates: (response as any).data || [], loading: false });

      } else {
        set({ error: (response as any).error, loading: false });

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao buscar templates';
      set({ error: errorMessage, loading: false });

    } ,

  createTemplate: async (templateData: Record<string, any>) => {
    set({ loading: true, error: null });

    try {
      const response = await adsTemplateService.createTemplate(templateData);

      if (response.success) {
        set(state => ({ 
          templates: [...state.templates, (response as any).data], 
          loading: false 
        }));

        return response;
      } else {
        set({ error: (response as any).error, loading: false });

        throw new Error(response.error);

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao criar template';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  updateTemplate: async (id: string | number, templateData: Record<string, any>) => {
    set({ loading: true, error: null });

    try {
      const response = await adsTemplateService.updateTemplate(id, templateData);

      if (response.success) {
        set(state => ({
          templates: state.templates.map(template => 
            template.id === id ? (response as any).data : template
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
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao atualizar template';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  deleteTemplate: async (id: string | number) => {
    set({ loading: true, error: null });

    try {
      const response = await adsTemplateService.deleteTemplate(id);

      if (response.success) {
        set(state => ({
          templates: state.templates.filter(template => template.id !== id),
          loading: false
        }));

      } else {
        set({ error: (response as any).error, loading: false });

        throw new Error(response.error);

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao excluir template';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  // Ações específicas para templates
  getCampaignTemplates: async () => {
    set({ loading: true, error: null });

    try {
      const response = await adsTemplateService.getCampaignTemplates();

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao buscar templates de campanha';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  getCreativeTemplates: async () => {
    set({ loading: true, error: null });

    try {
      const response = await adsTemplateService.getCreativeTemplates();

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao buscar templates de criativos';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  getAccountTemplates: async () => {
    set({ loading: true, error: null });

    try {
      const response = await adsTemplateService.getAccountTemplates();

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao buscar templates de contas';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  // Ações para aplicação de templates
  applyCampaignTemplate: async (templateId: string, campaignData: Record<string, any>) => {
    set({ loading: true, error: null });

    try {
      const response = await adsTemplateService.applyCampaignTemplate(templateId, campaignData);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao aplicar template de campanha';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  applyCreativeTemplate: async (templateId: string, creativeData: Record<string, any>) => {
    set({ loading: true, error: null });

    try {
      const response = await adsTemplateService.applyCreativeTemplate(templateId, creativeData);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao aplicar template de criativo';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  applyAccountTemplate: async (templateId: string, accountData: Record<string, any>) => {
    set({ loading: true, error: null });

    try {
      const response = await adsTemplateService.applyAccountTemplate(templateId, accountData);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao aplicar template de conta';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  // Ações para otimização
  getOptimizationTemplates: async () => {
    set({ loading: true, error: null });

    try {
      const response = await adsTemplateService.getOptimizationTemplates();

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao buscar templates de otimização';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  applyOptimizationTemplate: async (templateId: string, entityId: string, entityType: string) => {
    set({ loading: true, error: null });

    try {
      const response = await adsTemplateService.applyOptimizationTemplate(templateId, entityId, entityType);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao aplicar template de otimização';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  // Ações para importação/exportação
  importTemplate: async (templateFile: File) => {
    set({ loading: true, error: null });

    try {
      const response = await adsTemplateService.importTemplate(templateFile);

      if (response.success) {
        set(state => ({ 
          templates: [...state.templates, (response as any).data], 
          loading: false 
        }));

        return response;
      } else {
        set({ error: (response as any).error, loading: false });

        throw new Error(response.error);

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao importar template';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  exportTemplate: async (templateId: string, format: string) => {
    set({ loading: true, error: null });

    try {
      const response = await adsTemplateService.exportTemplate(templateId, format);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao exportar template';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  duplicateTemplate: async (templateId: string, newName?: string) => {
    set({ loading: true, error: null });

    try {
      const response = await adsTemplateService.duplicateTemplate(templateId, newName);

      if (response.success) {
        set(state => ({ 
          templates: [...state.templates, (response as any).data], 
          loading: false 
        }));

        return response;
      } else {
        set({ error: (response as any).error, loading: false });

        throw new Error(response.error);

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao duplicar template';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  // Métodos utilitários
  getTemplateById: (id: string | number) => {
    const { templates } = get();

    return templates.find(template => template.id === id);

  },

  getTemplatesByType: (type: string) => {
    const { templates } = get();

    return templates.filter(template => template.type === type);

  },

  getTemplatesByPlatform: (platform: string) => {
    const { templates } = get();

    return templates.filter(template => template.platform === platform);

  },

  getPublicTemplates: () => {
    const { templates } = get();

    return templates.filter(template => template.is_public === true);

  },

  getPrivateTemplates: () => {
    const { templates } = get();

    return templates.filter(template => template.is_public === false);

  },

  // Ações de UI
  clearError: () => set({ error: null }),
}));

export default useAdsTemplates;
