/**
 * Store do módulo Universe usando Zustand com TypeScript
 * Gerenciamento de estado global para o módulo Universe
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getErrorMessage } from '@/utils/errorHelpers';
import universeService from '../services/universeService';
import { UniverseProject, UniverseBlock, UniverseTemplate, UniverseAnalytics, UniverseConfig, UniverseSnapshot, AISuggestion, PaginationMeta } from '../types/universe';

// Interface para o estado do store
interface UniverseState {
  // Estado
  instances: UniverseProject[];
  templates: UniverseTemplate[];
  snapshots: UniverseSnapshot[];
  analytics: UniverseAnalytics | null;
  config: UniverseConfig | null;
  currentInstance: UniverseProject | null;
  selectedBlocks: UniverseBlock[];
  canvasData: Record<string, any> | null;
  aiSuggestions: AISuggestion[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta; }

// Interface para as ações do store
interface UniverseActions {
  // Ações de instâncias
  fetchInstances: (filters?: Record<string, any>) => Promise<void>;
  fetchInstanceById: (instanceId: string) => Promise<UniverseProject>;
  createInstance: (instanceData: Partial<UniverseProject>) => Promise<UniverseProject>;
  updateInstance: (instanceId: string, instanceData: Partial<UniverseProject>) => Promise<UniverseProject>;
  deleteInstance: (instanceId: string) => Promise<void>;
  // Ações de templates
  fetchTemplates: (filters?: Record<string, any>) => Promise<void>;
  useTemplate: (templateId: string, templateData: Record<string, any>) => Promise<Record<string, any>>;
  // Ações de IA
  getAISuggestions: (suggestionData: Record<string, any>) => Promise<Record<string, any>>;
  personalizeTemplate: (templateId: string, personalizationData: Record<string, any>) => Promise<Record<string, any>>;
  // Ações de canvas
  setCanvasData?: (e: any) => void;
  setSelectedBlocks?: (e: any) => void;
  // Ações de interface
  clearError??: (e: any) => void;
  // Métodos de teste de integração
  testConnection: () => Promise<{ success: boolean;
  message: string;
  data?: Record<string, any>;
}>;
  testInstancesManagement: () => Promise<{ success: boolean; message: string; data?: Record<string, any> }>;
  testTemplatesSystem: () => Promise<{ success: boolean; message: string; data?: Record<string, any> }>;
  testAIIntegration: () => Promise<{ success: boolean; message: string; data?: Record<string, any> }>;

  // Métodos utilitários
  getTotalInstances: () => number;
  getActiveInstances: () => UniverseProject[];
  getInactiveInstances: () => UniverseProject[];
  getTotalTemplates: () => number;
  getTemplatesByCategory: (category: string) => UniverseTemplate[];
  getRecentInstances: (limit?: number) => UniverseProject[];
}

// Tipo combinado para o store
type UniverseStore = UniverseState & UniverseActions;

// Estado inicial
const initialState: UniverseState = {
  instances: [],
  templates: [],
  snapshots: [],
  analytics: null,
  config: null,
  currentInstance: null,
  selectedBlocks: [],
  canvasData: null,
  aiSuggestions: [],
  loading: false,
  error: null,
  pagination: {
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1
  },};

// Store principal
const useUniverseStore = create<UniverseStore>()(
  devtools(
    (set: unknown, get: unknown) => ({
      ...initialState,

      // Ações de instâncias
      fetchInstances: async (filters: Record<string, any> = {}) => {
        set({ loading: true, error: null });

        try {
          const response = await universeService.getInstances(filters);

          set({ 
            instances: (response as any).data || response,
            pagination: (response as any).pagination || get().pagination,
            loading: false 
          });

        } catch (error: unknown) {
          set({ error: getErrorMessage(error), loading: false });

        } ,

      fetchInstanceById: async (instanceId: string) => {
        set({ loading: true, error: null });

        try {
          const response = await universeService.getInstanceById(instanceId);

          set({ currentInstance: response, loading: false });

          return response;
        } catch (error: unknown) {
          set({ error: getErrorMessage(error), loading: false });

          throw error;
        } ,

      createInstance: async (instanceData: Partial<UniverseProject>) => {
        set({ loading: true, error: null });

        try {
          const response = await universeService.createInstance(instanceData);

          const { instances } = get();

          set({ 
            instances: [response, ...instances],
            loading: false 
          });

          return response;
        } catch (error: unknown) {
          set({ error: getErrorMessage(error), loading: false });

          throw error;
        } ,

      updateInstance: async (instanceId: string, instanceData: Partial<UniverseProject>) => {
        set({ loading: true, error: null });

        try {
          const response = await universeService.updateInstance(instanceId, instanceData);

          const { instances } = get();

          const updatedInstances = instances.map(item => 
            item.id === instanceId ? { ...item, ...response } : item);

          set({ instances: updatedInstances, loading: false });

          return response;
        } catch (error: unknown) {
          set({ error: getErrorMessage(error), loading: false });

          throw error;
        } ,

      deleteInstance: async (instanceId: string) => {
        set({ loading: true, error: null });

        try {
          await universeService.deleteInstance(instanceId);

          const { instances } = get();

          const filteredInstances = instances.filter(item => item.id !== instanceId);

          set({ instances: filteredInstances, loading: false });

        } catch (error: unknown) {
          set({ error: getErrorMessage(error), loading: false });

          throw error;
        } ,

      // Ações de templates
      fetchTemplates: async (filters: Record<string, any> = {}) => {
        set({ loading: true, error: null });

        try {
          const response = await universeService.getTemplates(filters);

          set({ 
            templates: (response as any).data || response,
            loading: false 
          });

        } catch (error: unknown) {
          set({ error: getErrorMessage(error), loading: false });

        } ,

      useTemplate: async (templateId: string, templateData: unknown) => {
        set({ loading: true, error: null });

        try {
          const response = await universeService.useTemplate(templateId, templateData);

          set({ loading: false });

          return response;
        } catch (error: unknown) {
          set({ error: getErrorMessage(error), loading: false });

          throw error;
        } ,

      // Ações de IA
      getAISuggestions: async (suggestionData: unknown) => {
        set({ loading: true, error: null });

        try {
          const response = await universeService.getAISuggestions(suggestionData);

          set({ 
            aiSuggestions: (response as any).suggestions || [],
            loading: false 
          });

          return response;
        } catch (error: unknown) {
          set({ error: getErrorMessage(error), loading: false });

          throw error;
        } ,

      personalizeTemplate: async (templateId: string, personalizationData: unknown) => {
        set({ loading: true, error: null });

        try {
          const response = await universeService.personalizeTemplate(templateId, personalizationData);

          set({ loading: false });

          return response;
        } catch (error: unknown) {
          set({ error: getErrorMessage(error), loading: false });

          throw error;
        } ,

      // Ações de canvas
      setCanvasData: (data: unknown) => set({ canvasData: data }),
      setSelectedBlocks: (blocks: UniverseBlock[]) => set({ selectedBlocks: blocks }),

      // Ações de interface
      clearError: () => set({ error: null }),

      // Métodos de teste de integração
      testConnection: async () => {
        set({ loading: true, error: null });

        try {
          const response = await universeService.getDashboardData();

          set({ loading: false });

          return {
            success: true,
            message: 'Conexão com Universe estabelecida',
            data: response};

        } catch (error: unknown) {
          set({ error: getErrorMessage(error), loading: false });

          return { success: false, message: getErrorMessage(error)};

        } ,

      testInstancesManagement: async () => {
        set({ loading: true, error: null });

        try {
          const response = await universeService.getInstances({ per_page: 5 });

          set({ loading: false });

          return {
            success: true,
            message: 'Gerenciamento de instâncias funcionando',
            data: response};

        } catch (error: unknown) {
          set({ error: getErrorMessage(error), loading: false });

          return { success: false, message: getErrorMessage(error)};

        } ,

      testTemplatesSystem: async () => {
        set({ loading: true, error: null });

        try {
          const response = await universeService.getTemplates({ per_page: 5 });

          set({ loading: false });

          return {
            success: true,
            message: 'Sistema de templates funcionando',
            data: response};

        } catch (error: unknown) {
          set({ error: getErrorMessage(error), loading: false });

          return { success: false, message: getErrorMessage(error)};

        } ,

      testAIIntegration: async () => {
        set({ loading: true, error: null });

        try {
          const response = await universeService.getAISuggestions({ query: 'test' });

          set({ loading: false });

          return {
            success: true,
            message: 'Integração com IA funcionando',
            data: response};

        } catch (error: unknown) {
          set({ error: getErrorMessage(error), loading: false });

          return { success: false, message: getErrorMessage(error)};

        } ,

      // Métodos utilitários
      getTotalInstances: () => {
        const { instances } = get();

        return instances.length;
      },

      getActiveInstances: () => {
        const { instances } = get();

        return instances.filter(instance => instance.status === 'active');

      },

      getInactiveInstances: () => {
        const { instances } = get();

        return instances.filter(instance => instance.status === 'inactive');

      },

      getTotalTemplates: () => {
        const { templates } = get();

        return templates.length;
      },

      getTemplatesByCategory: (category: string) => {
        const { templates } = get();

        return templates.filter(template => template.category === category);

      },

      getRecentInstances: (limit: number = 5) => {
        const { instances } = get();

        return instances
          .sort((a: unknown, b: unknown) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);

      } ),
    {
      name: 'universe-store'
    }
  ));

export default useUniverseStore;
