/**
 * Hook especializado para gerenciamento de templates de anúncios
 * Responsável por todas as operações relacionadas a templates
 */
import { create } from 'zustand';
import { adsTemplateService } from '../services';

interface AdsTemplatesState {
  templates: any[];
  loading: boolean;
  error: string | null;
}

interface AdsTemplatesActions {
  // Ações CRUD para templates
  fetchTemplates: (params?: any) => Promise<void>;
  createTemplate: (templateData: any) => Promise<any>;
  updateTemplate: (id: string | number, templateData: any) => Promise<any>;
  deleteTemplate: (id: string | number) => Promise<void>;
  
  // Ações específicas para templates
  getCampaignTemplates: () => Promise<any>;
  getCreativeTemplates: () => Promise<any>;
  getAccountTemplates: () => Promise<any>;
  
  // Ações para aplicação de templates
  applyCampaignTemplate: (templateId: string, campaignData: any) => Promise<any>;
  applyCreativeTemplate: (templateId: string, creativeData: any) => Promise<any>;
  applyAccountTemplate: (templateId: string, accountData: any) => Promise<any>;
  
  // Ações para otimização
  getOptimizationTemplates: () => Promise<any>;
  applyOptimizationTemplate: (templateId: string, entityId: string, entityType: string) => Promise<any>;
  
  // Ações para importação/exportação
  importTemplate: (templateFile: File) => Promise<any>;
  exportTemplate: (templateId: string, format: string) => Promise<any>;
  duplicateTemplate: (templateId: string, newName?: string) => Promise<any>;
  
  // Métodos utilitários
  getTemplateById: (id: string | number) => any;
  getTemplatesByType: (type: string) => any[];
  getTemplatesByPlatform: (platform: string) => any[];
  getPublicTemplates: () => any[];
  getPrivateTemplates: () => any[];
  
  // Ações de UI
  clearError: () => void;
}

type AdsTemplatesStore = AdsTemplatesState & AdsTemplatesActions;

const useAdsTemplates = create<AdsTemplatesStore>((set, get) => ({
  // Estado
  templates: [],
  loading: false,
  error: null,

  // Ações CRUD para templates
  fetchTemplates: async (params: any = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await adsTemplateService.getTemplates(params);
      if (response.success) {
        set({ templates: response.data || [], loading: false });
      } else {
        set({ error: response.error, loading: false });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createTemplate: async (templateData: any) => {
    set({ loading: true, error: null });
    try {
      const response = await adsTemplateService.createTemplate(templateData);
      if (response.success) {
        set(state => ({ 
          templates: [...state.templates, response.data], 
          loading: false 
        }));
        return response;
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateTemplate: async (id: string | number, templateData: any) => {
    set({ loading: true, error: null });
    try {
      const response = await adsTemplateService.updateTemplate(id, templateData);
      if (response.success) {
        set(state => ({
          templates: state.templates.map(template => 
            template.id === id ? response.data : template
          ),
          loading: false
        }));
        return response;
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

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
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações específicas para templates
  getCampaignTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adsTemplateService.getCampaignTemplates();
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getCreativeTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adsTemplateService.getCreativeTemplates();
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getAccountTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adsTemplateService.getAccountTemplates();
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações para aplicação de templates
  applyCampaignTemplate: async (templateId: string, campaignData: any) => {
    set({ loading: true, error: null });
    try {
      const response = await adsTemplateService.applyCampaignTemplate(templateId, campaignData);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  applyCreativeTemplate: async (templateId: string, creativeData: any) => {
    set({ loading: true, error: null });
    try {
      const response = await adsTemplateService.applyCreativeTemplate(templateId, creativeData);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  applyAccountTemplate: async (templateId: string, accountData: any) => {
    set({ loading: true, error: null });
    try {
      const response = await adsTemplateService.applyAccountTemplate(templateId, accountData);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações para otimização
  getOptimizationTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adsTemplateService.getOptimizationTemplates();
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  applyOptimizationTemplate: async (templateId: string, entityId: string, entityType: string) => {
    set({ loading: true, error: null });
    try {
      const response = await adsTemplateService.applyOptimizationTemplate(templateId, entityId, entityType);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações para importação/exportação
  importTemplate: async (templateFile: File) => {
    set({ loading: true, error: null });
    try {
      const response = await adsTemplateService.importTemplate(templateFile);
      if (response.success) {
        set(state => ({ 
          templates: [...state.templates, response.data], 
          loading: false 
        }));
        return response;
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  exportTemplate: async (templateId: string, format: string) => {
    set({ loading: true, error: null });
    try {
      const response = await adsTemplateService.exportTemplate(templateId, format);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  duplicateTemplate: async (templateId: string, newName?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await adsTemplateService.duplicateTemplate(templateId, newName);
      if (response.success) {
        set(state => ({ 
          templates: [...state.templates, response.data], 
          loading: false 
        }));
        return response;
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

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
