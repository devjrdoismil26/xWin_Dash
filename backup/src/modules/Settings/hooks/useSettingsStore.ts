import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// =========================================
// INTERFACES
// =========================================

export interface SettingsStoreState {
  // Estado global
  activeCategory: string;
  loading: boolean;
  error: string | null;
  
  // Configurações gerais
  generalSettings: {
    data: any[];
    current: any | null;
    loading: boolean;
    error: string | null;
    filters: Record<string, any>;
    stats: {
      total: number;
      active: number;
      maintenanceMode: boolean;
      debugMode: boolean;
    };
  };
  
  // Configurações de autenticação
  authSettings: {
    data: any[];
    current: any | null;
    loading: boolean;
    error: string | null;
    filters: Record<string, any>;
    stats: {
      total: number;
      twoFactorEnabled: boolean;
      oauthEnabled: boolean;
      rateLimitingEnabled: boolean;
    };
  };
  
  // Configurações de usuário
  userSettings: {
    data: any[];
    current: any | null;
    loading: boolean;
    error: string | null;
    filters: Record<string, any>;
    stats: {
      total: number;
      activeUsers: number;
      pendingUsers: number;
    };
  };
  
  // Configurações de banco de dados
  databaseSettings: {
    data: any[];
    current: any | null;
    loading: boolean;
    error: string | null;
    filters: Record<string, any>;
    stats: {
      total: number;
      connected: boolean;
      lastBackup: string | null;
    };
  };
  
  // Configurações de email
  emailSettings: {
    data: any[];
    current: any | null;
    loading: boolean;
    error: string | null;
    filters: Record<string, any>;
    stats: {
      total: number;
      smtpConnected: boolean;
      lastTest: string | null;
    };
  };
  
  // Configurações de integração
  integrationSettings: {
    data: any[];
    current: any | null;
    loading: boolean;
    error: string | null;
    filters: Record<string, any>;
    stats: {
      total: number;
      activeIntegrations: number;
      webhooksEnabled: boolean;
    };
  };
  
  // Configurações de IA
  aiSettings: {
    data: any[];
    current: any | null;
    loading: boolean;
    error: string | null;
    filters: Record<string, any>;
    stats: {
      total: number;
      aiEnabled: boolean;
      lastTraining: string | null;
    };
  };
  
  // Configurações de API
  apiSettings: {
    data: any[];
    current: any | null;
    loading: boolean;
    error: string | null;
    filters: Record<string, any>;
    stats: {
      total: number;
      rateLimitingEnabled: boolean;
      totalRequests: number;
    };
  };
  
  // Cache
  cache: {
    [key: string]: {
      data: any;
      timestamp: number;
      ttl: number;
    };
  };
  
  // UI State
  ui: {
    sidebarOpen: boolean;
    advancedMode: boolean;
    theme: 'light' | 'dark' | 'auto';
    viewMode: 'grid' | 'list';
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

export interface SettingsStoreActions {
  // Ações globais
  setActiveCategory: (category: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Ações de configurações gerais
  setGeneralSettings: (data: any[]) => void;
  setGeneralSettingsCurrent: (current: any | null) => void;
  setGeneralSettingsLoading: (loading: boolean) => void;
  setGeneralSettingsError: (error: string | null) => void;
  setGeneralSettingsFilters: (filters: Record<string, any>) => void;
  setGeneralSettingsStats: (stats: any) => void;
  
  // Ações de configurações de autenticação
  setAuthSettings: (data: any[]) => void;
  setAuthSettingsCurrent: (current: any | null) => void;
  setAuthSettingsLoading: (loading: boolean) => void;
  setAuthSettingsError: (error: string | null) => void;
  setAuthSettingsFilters: (filters: Record<string, any>) => void;
  setAuthSettingsStats: (stats: any) => void;
  
  // Ações de configurações de usuário
  setUserSettings: (data: any[]) => void;
  setUserSettingsCurrent: (current: any | null) => void;
  setUserSettingsLoading: (loading: boolean) => void;
  setUserSettingsError: (error: string | null) => void;
  setUserSettingsFilters: (filters: Record<string, any>) => void;
  setUserSettingsStats: (stats: any) => void;
  
  // Ações de configurações de banco de dados
  setDatabaseSettings: (data: any[]) => void;
  setDatabaseSettingsCurrent: (current: any | null) => void;
  setDatabaseSettingsLoading: (loading: boolean) => void;
  setDatabaseSettingsError: (error: string | null) => void;
  setDatabaseSettingsFilters: (filters: Record<string, any>) => void;
  setDatabaseSettingsStats: (stats: any) => void;
  
  // Ações de configurações de email
  setEmailSettings: (data: any[]) => void;
  setEmailSettingsCurrent: (current: any | null) => void;
  setEmailSettingsLoading: (loading: boolean) => void;
  setEmailSettingsError: (error: string | null) => void;
  setEmailSettingsFilters: (filters: Record<string, any>) => void;
  setEmailSettingsStats: (stats: any) => void;
  
  // Ações de configurações de integração
  setIntegrationSettings: (data: any[]) => void;
  setIntegrationSettingsCurrent: (current: any | null) => void;
  setIntegrationSettingsLoading: (loading: boolean) => void;
  setIntegrationSettingsError: (error: string | null) => void;
  setIntegrationSettingsFilters: (filters: Record<string, any>) => void;
  setIntegrationSettingsStats: (stats: any) => void;
  
  // Ações de configurações de IA
  setAISettings: (data: any[]) => void;
  setAISettingsCurrent: (current: any | null) => void;
  setAISettingsLoading: (loading: boolean) => void;
  setAISettingsError: (error: string | null) => void;
  setAISettingsFilters: (filters: Record<string, any>) => void;
  setAISettingsStats: (stats: any) => void;
  
  // Ações de configurações de API
  setAPISettings: (data: any[]) => void;
  setAPISettingsCurrent: (current: any | null) => void;
  setAPISettingsLoading: (loading: boolean) => void;
  setAPISettingsError: (error: string | null) => void;
  setAPISettingsFilters: (filters: Record<string, any>) => void;
  setAPISettingsStats: (stats: any) => void;
  
  // Ações de cache
  setCache: (key: string, data: any, ttl?: number) => void;
  getCache: (key: string) => any | null;
  clearCache: (key?: string) => void;
  
  // Ações de UI
  setSidebarOpen: (open: boolean) => void;
  setAdvancedMode: (enabled: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  
  // Ações utilitárias
  resetStore: () => void;
  getStats: () => any;
}

export type SettingsStore = SettingsStoreState & SettingsStoreActions;

// =========================================
// ESTADO INICIAL
// =========================================

const initialState: SettingsStoreState = {
  activeCategory: 'general',
  loading: false,
  error: null,
  
  generalSettings: {
    data: [],
    current: null,
    loading: false,
    error: null,
    filters: {},
    stats: {
      total: 0,
      active: 0,
      maintenanceMode: false,
      debugMode: false
    }
  },
  
  authSettings: {
    data: [],
    current: null,
    loading: false,
    error: null,
    filters: {},
    stats: {
      total: 0,
      twoFactorEnabled: false,
      oauthEnabled: false,
      rateLimitingEnabled: false
    }
  },
  
  userSettings: {
    data: [],
    current: null,
    loading: false,
    error: null,
    filters: {},
    stats: {
      total: 0,
      activeUsers: 0,
      pendingUsers: 0
    }
  },
  
  databaseSettings: {
    data: [],
    current: null,
    loading: false,
    error: null,
    filters: {},
    stats: {
      total: 0,
      connected: false,
      lastBackup: null
    }
  },
  
  emailSettings: {
    data: [],
    current: null,
    loading: false,
    error: null,
    filters: {},
    stats: {
      total: 0,
      smtpConnected: false,
      lastTest: null
    }
  },
  
  integrationSettings: {
    data: [],
    current: null,
    loading: false,
    error: null,
    filters: {},
    stats: {
      total: 0,
      activeIntegrations: 0,
      webhooksEnabled: false
    }
  },
  
  aiSettings: {
    data: [],
    current: null,
    loading: false,
    error: null,
    filters: {},
    stats: {
      total: 0,
      aiEnabled: false,
      lastTraining: null
    }
  },
  
  apiSettings: {
    data: [],
    current: null,
    loading: false,
    error: null,
    filters: {},
    stats: {
      total: 0,
      rateLimitingEnabled: false,
      totalRequests: 0
    }
  },
  
  cache: {},
  
  ui: {
    sidebarOpen: true,
    advancedMode: false,
    theme: 'light',
    viewMode: 'grid',
    sortBy: 'name',
    sortOrder: 'asc'
  }
};

// =========================================
// STORE PRINCIPAL
// =========================================

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        
        // ===== AÇÕES GLOBAIS =====
        
        setActiveCategory: (category: string) => {
          set((state) => {
            state.activeCategory = category;
          });
        },
        
        setLoading: (loading: boolean) => {
          set((state) => {
            state.loading = loading;
          });
        },
        
        setError: (error: string | null) => {
          set((state) => {
            state.error = error;
          });
        },
        
        clearError: () => {
          set((state) => {
            state.error = null;
          });
        },
        
        // ===== AÇÕES DE CONFIGURAÇÕES GERAIS =====
        
        setGeneralSettings: (data: any[]) => {
          set((state) => {
            state.generalSettings.data = data;
          });
        },
        
        setGeneralSettingsCurrent: (current: any | null) => {
          set((state) => {
            state.generalSettings.current = current;
          });
        },
        
        setGeneralSettingsLoading: (loading: boolean) => {
          set((state) => {
            state.generalSettings.loading = loading;
          });
        },
        
        setGeneralSettingsError: (error: string | null) => {
          set((state) => {
            state.generalSettings.error = error;
          });
        },
        
        setGeneralSettingsFilters: (filters: Record<string, any>) => {
          set((state) => {
            state.generalSettings.filters = filters;
          });
        },
        
        setGeneralSettingsStats: (stats: any) => {
          set((state) => {
            state.generalSettings.stats = stats;
          });
        },
        
        // ===== AÇÕES DE CONFIGURAÇÕES DE AUTENTICAÇÃO =====
        
        setAuthSettings: (data: any[]) => {
          set((state) => {
            state.authSettings.data = data;
          });
        },
        
        setAuthSettingsCurrent: (current: any | null) => {
          set((state) => {
            state.authSettings.current = current;
          });
        },
        
        setAuthSettingsLoading: (loading: boolean) => {
          set((state) => {
            state.authSettings.loading = loading;
          });
        },
        
        setAuthSettingsError: (error: string | null) => {
          set((state) => {
            state.authSettings.error = error;
          });
        },
        
        setAuthSettingsFilters: (filters: Record<string, any>) => {
          set((state) => {
            state.authSettings.filters = filters;
          });
        },
        
        setAuthSettingsStats: (stats: any) => {
          set((state) => {
            state.authSettings.stats = stats;
          });
        },
        
        // ===== AÇÕES DE CONFIGURAÇÕES DE USUÁRIO =====
        
        setUserSettings: (data: any[]) => {
          set((state) => {
            state.userSettings.data = data;
          });
        },
        
        setUserSettingsCurrent: (current: any | null) => {
          set((state) => {
            state.userSettings.current = current;
          });
        },
        
        setUserSettingsLoading: (loading: boolean) => {
          set((state) => {
            state.userSettings.loading = loading;
          });
        },
        
        setUserSettingsError: (error: string | null) => {
          set((state) => {
            state.userSettings.error = error;
          });
        },
        
        setUserSettingsFilters: (filters: Record<string, any>) => {
          set((state) => {
            state.userSettings.filters = filters;
          });
        },
        
        setUserSettingsStats: (stats: any) => {
          set((state) => {
            state.userSettings.stats = stats;
          });
        },
        
        // ===== AÇÕES DE CONFIGURAÇÕES DE BANCO DE DADOS =====
        
        setDatabaseSettings: (data: any[]) => {
          set((state) => {
            state.databaseSettings.data = data;
          });
        },
        
        setDatabaseSettingsCurrent: (current: any | null) => {
          set((state) => {
            state.databaseSettings.current = current;
          });
        },
        
        setDatabaseSettingsLoading: (loading: boolean) => {
          set((state) => {
            state.databaseSettings.loading = loading;
          });
        },
        
        setDatabaseSettingsError: (error: string | null) => {
          set((state) => {
            state.databaseSettings.error = error;
          });
        },
        
        setDatabaseSettingsFilters: (filters: Record<string, any>) => {
          set((state) => {
            state.databaseSettings.filters = filters;
          });
        },
        
        setDatabaseSettingsStats: (stats: any) => {
          set((state) => {
            state.databaseSettings.stats = stats;
          });
        },
        
        // ===== AÇÕES DE CONFIGURAÇÕES DE EMAIL =====
        
        setEmailSettings: (data: any[]) => {
          set((state) => {
            state.emailSettings.data = data;
          });
        },
        
        setEmailSettingsCurrent: (current: any | null) => {
          set((state) => {
            state.emailSettings.current = current;
          });
        },
        
        setEmailSettingsLoading: (loading: boolean) => {
          set((state) => {
            state.emailSettings.loading = loading;
          });
        },
        
        setEmailSettingsError: (error: string | null) => {
          set((state) => {
            state.emailSettings.error = error;
          });
        },
        
        setEmailSettingsFilters: (filters: Record<string, any>) => {
          set((state) => {
            state.emailSettings.filters = filters;
          });
        },
        
        setEmailSettingsStats: (stats: any) => {
          set((state) => {
            state.emailSettings.stats = stats;
          });
        },
        
        // ===== AÇÕES DE CONFIGURAÇÕES DE INTEGRAÇÃO =====
        
        setIntegrationSettings: (data: any[]) => {
          set((state) => {
            state.integrationSettings.data = data;
          });
        },
        
        setIntegrationSettingsCurrent: (current: any | null) => {
          set((state) => {
            state.integrationSettings.current = current;
          });
        },
        
        setIntegrationSettingsLoading: (loading: boolean) => {
          set((state) => {
            state.integrationSettings.loading = loading;
          });
        },
        
        setIntegrationSettingsError: (error: string | null) => {
          set((state) => {
            state.integrationSettings.error = error;
          });
        },
        
        setIntegrationSettingsFilters: (filters: Record<string, any>) => {
          set((state) => {
            state.integrationSettings.filters = filters;
          });
        },
        
        setIntegrationSettingsStats: (stats: any) => {
          set((state) => {
            state.integrationSettings.stats = stats;
          });
        },
        
        // ===== AÇÕES DE CONFIGURAÇÕES DE IA =====
        
        setAISettings: (data: any[]) => {
          set((state) => {
            state.aiSettings.data = data;
          });
        },
        
        setAISettingsCurrent: (current: any | null) => {
          set((state) => {
            state.aiSettings.current = current;
          });
        },
        
        setAISettingsLoading: (loading: boolean) => {
          set((state) => {
            state.aiSettings.loading = loading;
          });
        },
        
        setAISettingsError: (error: string | null) => {
          set((state) => {
            state.aiSettings.error = error;
          });
        },
        
        setAISettingsFilters: (filters: Record<string, any>) => {
          set((state) => {
            state.aiSettings.filters = filters;
          });
        },
        
        setAISettingsStats: (stats: any) => {
          set((state) => {
            state.aiSettings.stats = stats;
          });
        },
        
        // ===== AÇÕES DE CONFIGURAÇÕES DE API =====
        
        setAPISettings: (data: any[]) => {
          set((state) => {
            state.apiSettings.data = data;
          });
        },
        
        setAPISettingsCurrent: (current: any | null) => {
          set((state) => {
            state.apiSettings.current = current;
          });
        },
        
        setAPISettingsLoading: (loading: boolean) => {
          set((state) => {
            state.apiSettings.loading = loading;
          });
        },
        
        setAPISettingsError: (error: string | null) => {
          set((state) => {
            state.apiSettings.error = error;
          });
        },
        
        setAPISettingsFilters: (filters: Record<string, any>) => {
          set((state) => {
            state.apiSettings.filters = filters;
          });
        },
        
        setAPISettingsStats: (stats: any) => {
          set((state) => {
            state.apiSettings.stats = stats;
          });
        },
        
        // ===== AÇÕES DE CACHE =====
        
        setCache: (key: string, data: any, ttl: number = 300000) => {
          set((state) => {
            state.cache[key] = {
              data,
              timestamp: Date.now(),
              ttl
            };
          });
        },
        
        getCache: (key: string) => {
          const state = get();
          const cached = state.cache[key];
          
          if (cached && Date.now() - cached.timestamp < cached.ttl) {
            return cached.data;
          }
          
          return null;
        },
        
        clearCache: (key?: string) => {
          set((state) => {
            if (key) {
              delete state.cache[key];
            } else {
              state.cache = {};
            }
          });
        },
        
        // ===== AÇÕES DE UI =====
        
        setSidebarOpen: (open: boolean) => {
          set((state) => {
            state.ui.sidebarOpen = open;
          });
        },
        
        setAdvancedMode: (enabled: boolean) => {
          set((state) => {
            state.ui.advancedMode = enabled;
          });
        },
        
        setTheme: (theme: 'light' | 'dark' | 'auto') => {
          set((state) => {
            state.ui.theme = theme;
          });
        },
        
        setViewMode: (mode: 'grid' | 'list') => {
          set((state) => {
            state.ui.viewMode = mode;
          });
        },
        
        setSortBy: (sortBy: string) => {
          set((state) => {
            state.ui.sortBy = sortBy;
          });
        },
        
        setSortOrder: (order: 'asc' | 'desc') => {
          set((state) => {
            state.ui.sortOrder = order;
          });
        },
        
        // ===== AÇÕES UTILITÁRIAS =====
        
        resetStore: () => {
          set(() => initialState);
        },
        
        getStats: () => {
          const state = get();
          return {
            totalSettings: Object.values(state).reduce((total, category) => {
              if (category && typeof category === 'object' && 'data' in category) {
                return total + (category.data?.length || 0);
              }
              return total;
            }, 0),
            activeCategory: state.activeCategory,
            loading: state.loading,
            error: state.error
          };
        }
      })),
      {
        name: 'settings-store',
        partialize: (state) => ({
          ui: state.ui,
          activeCategory: state.activeCategory
        })
      }
    ),
    {
      name: 'settings-store'
    }
  )
);

// =========================================
// SELECTORS OTIMIZADOS
// =========================================

export const useSettingsSelectors = {
  // Selectors globais
  useActiveCategory: () => useSettingsStore((state) => state.activeCategory),
  useLoading: () => useSettingsStore((state) => state.loading),
  useError: () => useSettingsStore((state) => state.error),
  
  // Selectors de configurações gerais
  useGeneralSettings: () => useSettingsStore((state) => state.generalSettings),
  useGeneralSettingsData: () => useSettingsStore((state) => state.generalSettings.data),
  useGeneralSettingsStats: () => useSettingsStore((state) => state.generalSettings.stats),
  
  // Selectors de configurações de autenticação
  useAuthSettings: () => useSettingsStore((state) => state.authSettings),
  useAuthSettingsData: () => useSettingsStore((state) => state.authSettings.data),
  useAuthSettingsStats: () => useSettingsStore((state) => state.authSettings.stats),
  
  // Selectors de UI
  useUI: () => useSettingsStore((state) => state.ui),
  useSidebarOpen: () => useSettingsStore((state) => state.ui.sidebarOpen),
  useAdvancedMode: () => useSettingsStore((state) => state.ui.advancedMode),
  useTheme: () => useSettingsStore((state) => state.ui.theme),
  useViewMode: () => useSettingsStore((state) => state.ui.viewMode),
  
  // Selectors de cache
  useCache: () => useSettingsStore((state) => state.cache),
  useCacheItem: (key: string) => useSettingsStore((state) => state.cache[key])
};

// =========================================
// EXPORTS
// =========================================

export default useSettingsStore;
