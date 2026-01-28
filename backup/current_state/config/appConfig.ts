/**
 * Configuração Global da Aplicação - xWin Dash
 *
 * @description
 * Arquivo de configuração centralizado que define todas as configurações
 * globais da aplicação, incluindo URLs de API, tema, performance, notificações,
 * IA, analytics e módulos.
 *
 * Funcionalidades principais:
 * - Configurações de API e WebSocket
 * - Configurações de tema e localização
 * - Configurações de performance
 * - Configurações de notificações
 * - Configurações de IA
 * - Configurações de analytics
 * - Configurações de módulos e features
 *
 * @module config/appConfig
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { APP_CONFIG } from '@/config/appConfig';
 *
 * // Usar configurações
 * const apiUrl = APP_CONFIG.api.baseURL;
 * const theme = APP_CONFIG.theme.defaultMode;
 * const isFeatureEnabled = APP_CONFIG.features.myFeature;
 * ```
 */

// Configuração Global da Aplicação xWin Dash
export const APP_CONFIG: unknown = {
  // Informações da Aplicação
  name: "xWin Dash",
  version: "2.1.0",
  description: "Plataforma de Negócios Inteligente",

  // URLs e Endpoints
  api: {
    baseURL: import.meta.env.VITE_API_URL || "/api",
    websocketURL: import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:6001",
    timeout: 30000,
    retryAttempts: 3,
  },

  // Configurações de Tema
  theme: {
    defaultMode: "light" as "light" | "dark" | "auto",
    defaultPrimaryColor: "blue",
    defaultAccentColor: "indigo",
    supportedLanguages: ["pt-BR", "en-US"],
    defaultLanguage: "pt-BR",
  },

  // Configurações de Performance
  performance: {
    enableVirtualization: true,
    lazyLoadingThreshold: 100,
    cacheMaxAge: 5 * 60 * 1000, // 5 minutos
    debounceDelay: 300,
    throttleDelay: 100,
  },

  // Configurações de Notificações
  notifications: {
    maxToasts: 3,
    defaultDuration: 4000,
    position: "top-right" as const,
    enableSound: true,
    enableDesktop: true,
  },

  // Configurações de IA
  ai: {
    defaultProvider: "openai",
    maxTokens: 4096,
    temperature: 0.7,
    enableStreaming: true,
    providers: [
      { id: "openai", name: "OpenAI", models: ["gpt-4", "gpt-3.5-turbo"] },
      {
        id: "anthropic",
        name: "Anthropic",
        models: ["claude-3-opus", "claude-3-sonnet"],
      },
      {
        id: "google",
        name: "Google",
        models: ["gemini-pro", "gemini-pro-vision"],
      },
    ],
  },

  // Configurações de Módulos
  modules: {
    adstool: {
      enabled: true,
      features: ["campaigns", "creatives", "accounts", "reports"],
      integrations: ["google-ads", "facebook-ads", "linkedin-ads"],
    },
    ai: {
      enabled: true,
      features: ["chat", "generation", "analysis", "history"],
      maxConversations: 100,
    },
    analytics: {
      enabled: true,
      features: ["reports", "dashboards", "exports"],
      refreshInterval: 60000, // 1 minuto
    },
    aura: {
      enabled: true,
      features: ["chats", "flows", "connections", "stats"],
      maxConnections: 10,
    },
    emailMarketing: {
      enabled: true,
      features: ["campaigns", "lists", "templates", "automation"],
      maxSubscribers: 50000,
    },
    mediaLibrary: {
      enabled: true,
      features: ["upload", "organize", "ai-tagging", "optimization"],
      maxFileSize: 50 * 1024 * 1024, // 50MB
      supportedFormats: ["jpg", "png", "gif", "pdf", "mp4", "mp3"],
    },
    products: {
      enabled: true,
      features: ["catalog", "landing-pages", "lead-capture"],
      maxProducts: 1000,
    },
    projects: {
      enabled: true,
      features: ["universe", "management", "collaboration"],
      maxProjects: 100,
    },
    socialBuffer: {
      enabled: true,
      features: ["posting", "scheduling", "analytics", "engagement"],
      platforms: ["facebook", "twitter", "instagram", "linkedin"],
    },
    users: {
      enabled: true,
      features: ["management", "roles", "permissions", "activity"],
      maxUsers: 500,
    },
    workflows: {
      enabled: true,
      features: ["builder", "automation", "triggers", "analytics"],
      maxWorkflows: 200,
    },
  },

  // Configurações de Segurança
  security: {
    sessionTimeout: 120, // minutos
    enableTwoFactor: true,
    passwordMinLength: 8,
    maxLoginAttempts: 5,
    lockoutDuration: 15, // minutos
  },

  // Configurações de Upload
  upload: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "audio/mp3",
      "audio/wav",
      "application/pdf",
      "text/csv",
      "application/json",
    ],
    chunkSize: 1024 * 1024, // 1MB chunks
    enableCompression: true,
  },

  // Configurações de Cache
  cache: {
    enabled: true,
    defaultTTL: 5 * 60 * 1000, // 5 minutos
    maxSize: 100, // número máximo de itens
    strategies: {
      api: "memory",
      media: "localStorage",
      user: "sessionStorage",
    },
  },

  // Configurações de Analytics
  analytics: {
    enableTracking: true,
    trackingId: import.meta.env.VITE_ANALYTICS_ID,
    events: {
      pageView: true,
      userInteraction: true,
      errors: true,
      performance: true,
    },
  },

  // Configurações de Desenvolvimento
  development: {
    enableDevTools: import.meta.env.DEV,
    showPerformanceMetrics: import.meta.env.DEV,
    enableHotReload: import.meta.env.DEV,
    debugMode: import.meta.env.VITE_DEBUG === "true",
  },

  // URLs Externas
  external: {
    documentation: "https://docs.xwindash.com",
    support: "https://support.xwindash.com",
    updates: "https://updates.xwindash.com",
    marketplace: "https://marketplace.xwindash.com",
  },

  // Configurações de Localização
  localization: {
    dateFormat: "DD/MM/YYYY",
    timeFormat: "HH:mm",
    currency: "BRL",
    currencySymbol: "R$",
    timezone: "America/Sao_Paulo",
    firstDayOfWeek: 1, // Segunda-feira
  },

  // Limites e Quotas
  limits: {
    api: {
      requestsPerMinute: 1000,
      requestsPerHour: 10000,
    },
    storage: {
      maxTotalSize: 10 * 1024 * 1024 * 1024, // 10GB
      maxFilesPerFolder: 1000,
    },
    features: {
      maxCampaigns: 500,
      maxWorkflows: 200,
      maxProjects: 100,
      maxUsers: 500,
    },
  },

  // Configurações de Backup
  backup: {
    enabled: true,
    frequency: "daily",
    retention: 30, // dias
    includeMedia: false,
    compression: true,
  },

  // Feature Flags
  features: {
    betaFeatures: import.meta.env.VITE_ENABLE_BETA === "true",
    experimentalUI: import.meta.env.VITE_EXPERIMENTAL_UI === "true",
    advancedAnalytics: true,
    aiAssistant: true,
    realTimeCollaboration: true,
    mobileApp: true,
    apiAccess: true,
    whiteLabel: false,
  },};

// Configurações específicas por ambiente
export const getEnvironmentConfig = () => {
  const env = (import.meta.env.MODE || "development") as "development" | "staging" | "production";

  const envConfigs: Record<"development" | "staging" | "production", Partial<typeof APP_CONFIG>> = {
    development: {
      api: { baseURL: "http://localhost:8000/api" },
      performance: { enableVirtualization: false },
      development: { enableDevTools: true, debugMode: true },
    },
    staging: {
      api: { baseURL: "https://staging-api.xwindash.com" },
      development: { enableDevTools: false, debugMode: false },
    },
    production: {
      api: { baseURL: "https://api.xwindash.com" },
      development: { enableDevTools: false, debugMode: false },
      analytics: { enableTracking: true },
    },};

  return { ...APP_CONFIG, ...envConfigs[env]};
};

// Função para validar configuração
export const validateConfig = (config: typeof APP_CONFIG) => {
  const required = ["name", "version", "api.baseURL"];
  const missing = required.filter((key: unknown) => {
    const keys = key.split(".");

    let value = config;
    for (const k of keys) {
      value = value[k];
      if (!value) return true;
    }
    return false;
  });

  if (missing.length > 0) {
    throw new Error(
      `Configuração inválida. Campos obrigatórios ausentes: ${missing.join(", ")}`,);

  } ;

// Função para obter configuração de módulo
export const getModuleConfig = (moduleName: string) => {
  return APP_CONFIG.modules[moduleName] || { enabled: false, features: []};
};

// Função para verificar se feature está habilitada
export const isFeatureEnabled = (featureName: string) => {
  return APP_CONFIG.features[featureName] === true;
};

// Configuração final
export const config = getEnvironmentConfig();

validateConfig(config);

export default config;
