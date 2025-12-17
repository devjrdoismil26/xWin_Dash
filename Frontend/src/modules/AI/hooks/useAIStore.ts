/**
 * Store principal do módulo AI
 * Gerenciamento de estado global com Zustand e TypeScript
 */
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import aiService from '../services/aiService';
import { AIServicesStatus, AIGeneration, AIChatHistory, AIAnalysisHistory, AIProvider, AIGenerationType, AIChatSession, AIHistoryItem } from '../types';

interface AIState {
  // Estado dos serviços
  servicesStatus: AIServicesStatus | null;
  servicesLoading: boolean;
  // Gerações
  textGenerations: AIGeneration[];
  imageGenerations: AIGeneration[];
  videoGenerations: AIGeneration[];
  // Histórico
  chatHistory: AIChatHistory[];
  analysisHistory: AIAnalysisHistory[];
  // UI State
  currentView: string;
  loading: boolean;
  error: string | null;
  // Cache
  providers: AIProvider[];
  lastUpdate: string | null; }

interface AIActions {
  // Ações para serviços
  fetchServicesStatus: () => Promise<void>;
  checkServiceStatus: (serviceName: string) => Promise<boolean>;
  isServiceAvailable: (serviceName: string) => boolean;
  // Ações para geração de texto
  generateText: (prompt: string, options?: Partial<AIGeneration>) => Promise<AIGeneration>;
  addTextGeneration?: (e: any) => void;
  updateTextGeneration?: (e: any) => void;
  deleteTextGeneration?: (e: any) => void;
  // Ações para geração de imagem
  generateImage: (prompt: string, options?: Partial<AIGeneration>) => Promise<AIGeneration>;
  addImageGeneration?: (e: any) => void;
  updateImageGeneration?: (e: any) => void;
  deleteImageGeneration?: (e: any) => void;
  // Ações para geração de vídeo
  generateVideo: (prompt: string, options?: Partial<AIGeneration>) => Promise<AIGeneration>;
  addVideoGeneration?: (e: any) => void;
  updateVideoGeneration?: (e: any) => void;
  deleteVideoGeneration?: (e: any) => void;
  // Ações para chat
  addChatMessage?: (e: any) => void;
  updateChatMessage?: (e: any) => void;
  deleteChatMessage?: (e: any) => void;
  clearChatHistory??: (e: any) => void;
  // Ações para análise
  addAnalysis?: (e: any) => void;
  updateAnalysis?: (e: any) => void;
  deleteAnalysis?: (e: any) => void;
  clearAnalysisHistory??: (e: any) => void;
  // Ações de UI
  setCurrentView?: (e: any) => void;
  setLoading?: (e: any) => void;
  setError?: (e: any) => void;
  clearError??: (e: any) => void;
  // Ações de cache
  clearCache??: (e: any) => void;
  updateLastUpdate??: (e: any) => void; }

type AIStore = AIState & AIActions;

const useAIStore = create<AIStore>()(
  devtools(
    persist(
      immer((set: unknown, get: unknown) => ({
        // Estado inicial
        servicesStatus: null,
        servicesLoading: false,
        textGenerations: [],
        imageGenerations: [],
        videoGenerations: [],
        chatHistory: [],
        analysisHistory: [],
        currentView: 'dashboard',
        loading: false,
        error: null,
        providers: [],
        lastUpdate: null,

        // Ações para serviços
        fetchServicesStatus: async () => {
          set((state: unknown) => {
            state.servicesLoading = true;
            state.error = null;
          });

          try {
            const status = await aiService.getServicesStatus();

            set((state: unknown) => {
              state.servicesStatus = status.data;
              state.servicesLoading = false;
              state.lastUpdate = new Date().toISOString();

            });

          } catch (error: unknown) {
            set((state: unknown) => {
              state.error = 'Erro ao carregar status dos serviços';
              state.servicesLoading = false;
            });

          } ,

        checkServiceStatus: async (serviceName: string) => {
          try {
            const response = await aiService.checkServiceStatus(serviceName);

            return (response as any).data.status === 'active';
          } catch (error) {
            return false;
          } ,

        isServiceAvailable: (serviceName: string) => {
          const { servicesStatus } = get();

          return servicesStatus?.[serviceName]?.status === 'active' || false;
        },

        // Ações para geração de texto
        generateText: async (prompt: string, options: Partial<AIGeneration> = {}) => {
          set((state: unknown) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const result = await aiService.generateText(prompt, options);

            const generation: AIGeneration = {
              id: result.data.id,
              type: 'text',
              prompt,
              result: result.data.text,
              provider: result.data.provider,
              timestamp: new Date().toISOString(),
              options,
              status: 'completed'};

            set((state: unknown) => {
              state.textGenerations.push(generation);

              state.loading = false;
            });

            return generation;
          } catch (error: unknown) {
            set((state: unknown) => {
              state.error = 'Erro ao gerar texto';
              state.loading = false;
            });

            throw error;
          } ,

        addTextGeneration: (generation: AIGeneration) => {
          set((state: unknown) => {
            state.textGenerations.push(generation);

          });

        },

        updateTextGeneration: (id: string, updates: Partial<AIGeneration>) => {
          set((state: unknown) => {
            const index = state.textGenerations.findIndex(g => g.id === id);

            if (index !== -1) {
              Object.assign(state.textGenerations[index], updates);

            } );

        },

        deleteTextGeneration: (id: string) => {
          set((state: unknown) => {
            state.textGenerations = state.textGenerations.filter(g => g.id !== id);

          });

        },

        // Ações para geração de imagem
        generateImage: async (prompt: string, options: Partial<AIGeneration> = {}) => {
          set((state: unknown) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const result = await aiService.generateImage(prompt, options);

            const generation: AIGeneration = {
              id: result.data.id,
              type: 'image',
              prompt,
              result: result.data.imageUrl,
              provider: result.data.provider,
              timestamp: new Date().toISOString(),
              options,
              status: 'completed'};

            set((state: unknown) => {
              state.imageGenerations.push(generation);

              state.loading = false;
            });

            return generation;
          } catch (error: unknown) {
            set((state: unknown) => {
              state.error = 'Erro ao gerar imagem';
              state.loading = false;
            });

            throw error;
          } ,

        addImageGeneration: (generation: AIGeneration) => {
          set((state: unknown) => {
            state.imageGenerations.push(generation);

          });

        },

        updateImageGeneration: (id: string, updates: Partial<AIGeneration>) => {
          set((state: unknown) => {
            const index = state.imageGenerations.findIndex(g => g.id === id);

            if (index !== -1) {
              Object.assign(state.imageGenerations[index], updates);

            } );

        },

        deleteImageGeneration: (id: string) => {
          set((state: unknown) => {
            state.imageGenerations = state.imageGenerations.filter(g => g.id !== id);

          });

        },

        // Ações para geração de vídeo
        generateVideo: async (prompt: string, options: Partial<AIGeneration> = {}) => {
          set((state: unknown) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const result = await aiService.generateVideo(prompt, options);

            const generation: AIGeneration = {
              id: result.data.id,
              type: 'video',
              prompt,
              result: result.data.videoUrl,
              provider: result.data.provider,
              timestamp: new Date().toISOString(),
              options,
              status: 'completed'};

            set((state: unknown) => {
              state.videoGenerations.push(generation);

              state.loading = false;
            });

            return generation;
          } catch (error: unknown) {
            set((state: unknown) => {
              state.error = 'Erro ao gerar vídeo';
              state.loading = false;
            });

            throw error;
          } ,

        addVideoGeneration: (generation: AIGeneration) => {
          set((state: unknown) => {
            state.videoGenerations.push(generation);

          });

        },

        updateVideoGeneration: (id: string, updates: Partial<AIGeneration>) => {
          set((state: unknown) => {
            const index = state.videoGenerations.findIndex(g => g.id === id);

            if (index !== -1) {
              Object.assign(state.videoGenerations[index], updates);

            } );

        },

        deleteVideoGeneration: (id: string) => {
          set((state: unknown) => {
            state.videoGenerations = state.videoGenerations.filter(g => g.id !== id);

          });

        },

        // Ações para chat
        addChatMessage: (message: AIChatHistory) => {
          set((state: unknown) => {
            state.chatHistory.push(message);

          });

        },

        updateChatMessage: (id: string, updates: Partial<AIChatHistory>) => {
          set((state: unknown) => {
            const index = state.chatHistory.findIndex(m => m.id === id);

            if (index !== -1) {
              Object.assign(state.chatHistory[index], updates);

            } );

        },

        deleteChatMessage: (id: string) => {
          set((state: unknown) => {
            state.chatHistory = state.chatHistory.filter(m => m.id !== id);

          });

        },

        clearChatHistory: () => {
          set((state: unknown) => {
            state.chatHistory = [];
          });

        },

        // Ações para análise
        addAnalysis: (analysis: AIAnalysisHistory) => {
          set((state: unknown) => {
            state.analysisHistory.push(analysis);

          });

        },

        updateAnalysis: (id: string, updates: Partial<AIAnalysisHistory>) => {
          set((state: unknown) => {
            const index = state.analysisHistory.findIndex(a => a.id === id);

            if (index !== -1) {
              Object.assign(state.analysisHistory[index], updates);

            } );

        },

        deleteAnalysis: (id: string) => {
          set((state: unknown) => {
            state.analysisHistory = state.analysisHistory.filter(a => a.id !== id);

          });

        },

        clearAnalysisHistory: () => {
          set((state: unknown) => {
            state.analysisHistory = [];
          });

        },

        // Ações para providers
        loadProviders: async () => {
          try {
            const response = await aiService.getProviders();

            set((state: unknown) => {
              state.providers = (response as any).data;
            });

          } catch (error: unknown) {
            set((state: unknown) => {
              state.error = 'Erro ao carregar providers';
            });

          } ,

        addProvider: (provider: AIProvider) => {
          set((state: unknown) => {
            state.providers.push(provider);

          });

        },

        updateProvider: (id: string, updates: Partial<AIProvider>) => {
          set((state: unknown) => {
            const index = state.providers.findIndex(p => p.id === id);

            if (index !== -1) {
              Object.assign(state.providers[index], updates);

            } );

        },

        deleteProvider: (id: string) => {
          set((state: unknown) => {
            state.providers = state.providers.filter(p => p.id !== id);

          });

        },

        // Ações de UI
        setCurrentView: (view: string) => {
          set((state: unknown) => {
            state.currentView = view;
          });

        },

        setLoading: (loading: boolean) => {
          set((state: unknown) => {
            state.loading = loading;
          });

        },

        setError: (error: string | null) => {
          set((state: unknown) => {
            state.error = error;
          });

        },

        clearError: () => {
          set((state: unknown) => {
            state.error = null;
          });

        },

        // Ações de cache
        clearCache: () => {
          set((state: unknown) => {
            state.textGenerations = [];
            state.imageGenerations = [];
            state.videoGenerations = [];
            state.chatHistory = [];
            state.analysisHistory = [];
            state.lastUpdate = null;
          });

        },

        updateLastUpdate: () => {
          set((state: unknown) => {
            state.lastUpdate = new Date().toISOString();

          });

        },
      })),
      {
        name: 'ai-store',
        partialize: (state: unknown) => ({
          textGenerations: state.textGenerations,
          imageGenerations: state.imageGenerations,
          videoGenerations: state.videoGenerations,
          chatHistory: state.chatHistory,
          analysisHistory: state.analysisHistory,
          providers: state.providers,
          lastUpdate: state.lastUpdate,
          currentView: state.currentView
        })
  }
    ),
    {
      name: 'ai-store'
    }
  ));

export { useAIStore };

// Export individual selectors for convenience
export const useAIServicesStatus = () => useAIStore((state) => state.servicesStatus);

export const useAIProviders = () => useAIStore((state) => state.providers);

export const useAIGenerations = () => useAIStore((state) => ({
  text: state.textGenerations,
  image: state.imageGenerations,
  video: state.videoGenerations
}));

export const useAIConfig = () => useAIStore((state) => state.config);

export default useAIStore;
