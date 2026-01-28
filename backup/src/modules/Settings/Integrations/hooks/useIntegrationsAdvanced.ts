import { useState, useEffect, useCallback } from 'react';
import integrationsService from '../services/integrationsService';
import {
  Integration,
  IntegrationConfig,
  IntegrationTest,
  IntegrationLog,
  IntegrationAnalytics,
  IntegrationMarketplace,
  IntegrationResponse
} from '../services/integrationsService';

// ===== HOOK RETURN TYPES =====
export interface UseIntegrationsAvailableReturn {
  integrations: Integration[];
  loading: boolean;
  error: string | null;
  searchIntegrations: (query: string, filters?: any) => Promise<void>;
  getIntegrationDetails: (id: string) => Promise<Integration | null>;
  refetch: () => Promise<void>;
}

export interface UseIntegrationsInstalledReturn {
  integrations: Integration[];
  loading: boolean;
  error: string | null;
  installIntegration: (integrationId: string, config?: any) => Promise<void>;
  uninstallIntegration: (integrationId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export interface UseIntegrationStatusReturn {
  status: any;
  loading: boolean;
  error: string | null;
  updateStatus: (status: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export interface UseIntegrationConfigReturn {
  config: IntegrationConfig | null;
  loading: boolean;
  error: string | null;
  updateConfig: (config: any) => Promise<void>;
  refetch: () => Promise<void>;
}

export interface UseIntegrationTestsReturn {
  tests: IntegrationTest[];
  loading: boolean;
  error: string | null;
  runTest: (testType: string, testData?: any) => Promise<void>;
  refetch: () => Promise<void>;
}

export interface UseIntegrationLogsReturn {
  logs: IntegrationLog[];
  loading: boolean;
  error: string | null;
  clearLogs: () => Promise<void>;
  refetch: () => Promise<void>;
}

export interface UseIntegrationAnalyticsReturn {
  analytics: IntegrationAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseIntegrationsAnalyticsReturn {
  analytics: IntegrationAnalytics[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseIntegrationMarketplaceReturn {
  marketplace: IntegrationMarketplace | null;
  loading: boolean;
  error: string | null;
  searchMarketplace: (query: string, filters?: any) => Promise<void>;
  getFeaturedIntegrations: () => Promise<void>;
  getPopularIntegrations: () => Promise<void>;
  getRecentIntegrations: () => Promise<void>;
  refetch: () => Promise<void>;
}

export interface UseIntegrationSyncReturn {
  syncStatus: any;
  loading: boolean;
  error: string | null;
  syncIntegration: (force?: boolean) => Promise<void>;
  syncAllIntegrations: () => Promise<void>;
  refetch: () => Promise<void>;
}

export interface UseIntegrationWebhooksReturn {
  webhooks: any[];
  loading: boolean;
  error: string | null;
  createWebhook: (webhookData: any) => Promise<void>;
  updateWebhook: (webhookId: string, webhookData: any) => Promise<void>;
  deleteWebhook: (webhookId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

// ===== CUSTOM HOOKS =====
export const useIntegrationsAvailable = (params: any = {}): UseIntegrationsAvailableReturn => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIntegrations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await integrationsService.getAvailableIntegrations(params);
      if (response.success) {
        setIntegrations(response.data as Integration[]);
      } else {
        setError(response.error || 'Erro ao carregar integrações disponíveis');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const searchIntegrations = useCallback(async (query: string, filters: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await integrationsService.searchIntegrations(query, filters);
      if (response.success) {
        setIntegrations(response.data as Integration[]);
      } else {
        setError(response.error || 'Erro ao buscar integrações');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getIntegrationDetails = useCallback(async (id: string): Promise<Integration | null> => {
    try {
      const response = await integrationsService.getIntegrationDetails(id);
      if (response.success) {
        return response.data as Integration;
      } else {
        setError(response.error || 'Erro ao carregar detalhes da integração');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  return { 
    integrations, 
    loading, 
    error, 
    searchIntegrations, 
    getIntegrationDetails, 
    refetch: fetchIntegrations 
  };
};

export const useIntegrationsInstalled = (params: any = {}): UseIntegrationsInstalledReturn => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIntegrations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await integrationsService.getInstalledIntegrations(params);
      if (response.success) {
        setIntegrations(response.data as Integration[]);
      } else {
        setError(response.error || 'Erro ao carregar integrações instaladas');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const installIntegration = useCallback(async (integrationId: string, config: any = {}) => {
    try {
      const response = await integrationsService.installIntegration(integrationId, config);
      if (response.success) {
        await fetchIntegrations();
      } else {
        throw new Error(response.error || 'Erro ao instalar integração');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [fetchIntegrations]);

  const uninstallIntegration = useCallback(async (integrationId: string) => {
    try {
      const response = await integrationsService.uninstallIntegration(integrationId);
      if (response.success) {
        await fetchIntegrations();
      } else {
        throw new Error(response.error || 'Erro ao desinstalar integração');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [fetchIntegrations]);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  return { 
    integrations, 
    loading, 
    error, 
    installIntegration, 
    uninstallIntegration, 
    refetch: fetchIntegrations 
  };
};

export const useIntegrationStatus = (integrationId: string): UseIntegrationStatusReturn => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await integrationsService.getIntegrationStatus(integrationId);
      if (response.success) {
        setStatus(response.data);
      } else {
        setError(response.error || 'Erro ao carregar status da integração');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [integrationId]);

  const updateStatus = useCallback(async (newStatus: string) => {
    try {
      const response = await integrationsService.updateIntegrationStatus(integrationId, newStatus);
      if (response.success) {
        await fetchStatus();
      } else {
        throw new Error(response.error || 'Erro ao atualizar status da integração');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [integrationId, fetchStatus]);

  useEffect(() => {
    if (integrationId) {
      fetchStatus();
    }
  }, [fetchStatus]);

  return { status, loading, error, updateStatus, refetch: fetchStatus };
};

export const useIntegrationConfig = (integrationId: string): UseIntegrationConfigReturn => {
  const [config, setConfig] = useState<IntegrationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await integrationsService.getIntegrationConfig(integrationId);
      if (response.success) {
        setConfig(response.data as IntegrationConfig);
      } else {
        setError(response.error || 'Erro ao carregar configuração da integração');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [integrationId]);

  const updateConfig = useCallback(async (newConfig: any) => {
    try {
      const response = await integrationsService.updateIntegrationConfig(integrationId, newConfig);
      if (response.success) {
        await fetchConfig();
      } else {
        throw new Error(response.error || 'Erro ao atualizar configuração da integração');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [integrationId, fetchConfig]);

  useEffect(() => {
    if (integrationId) {
      fetchConfig();
    }
  }, [fetchConfig]);

  return { config, loading, error, updateConfig, refetch: fetchConfig };
};

export const useIntegrationTests = (integrationId: string, params: any = {}): UseIntegrationTestsReturn => {
  const [tests, setTests] = useState<IntegrationTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await integrationsService.getIntegrationTests(integrationId, params);
      if (response.success) {
        setTests(response.data as IntegrationTest[]);
      } else {
        setError(response.error || 'Erro ao carregar testes da integração');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [integrationId, params]);

  const runTest = useCallback(async (testType: string, testData: any = {}) => {
    try {
      const response = await integrationsService.runIntegrationTest(integrationId, testData);
      if (response.success) {
        await fetchTests();
      } else {
        throw new Error(response.error || 'Erro ao executar teste da integração');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [integrationId, fetchTests]);

  useEffect(() => {
    if (integrationId) {
      fetchTests();
    }
  }, [fetchTests]);

  return { tests, loading, error, runTest, refetch: fetchTests };
};

export const useIntegrationLogs = (integrationId: string, params: any = {}): UseIntegrationLogsReturn => {
  const [logs, setLogs] = useState<IntegrationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await integrationsService.getIntegrationLogs(integrationId, params);
      if (response.success) {
        setLogs(response.data as IntegrationLog[]);
      } else {
        setError(response.error || 'Erro ao carregar logs da integração');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [integrationId, params]);

  const clearLogs = useCallback(async () => {
    try {
      const response = await integrationsService.clearIntegrationLogs(integrationId);
      if (response.success) {
        await fetchLogs();
      } else {
        throw new Error(response.error || 'Erro ao limpar logs da integração');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [integrationId, fetchLogs]);

  useEffect(() => {
    if (integrationId) {
      fetchLogs();
    }
  }, [fetchLogs]);

  return { logs, loading, error, clearLogs, refetch: fetchLogs };
};

export const useIntegrationAnalytics = (integrationId: string, params: any = {}): UseIntegrationAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<IntegrationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await integrationsService.getIntegrationAnalytics(integrationId, params);
      if (response.success) {
        setAnalytics(response.data as IntegrationAnalytics);
      } else {
        setError(response.error || 'Erro ao carregar analytics da integração');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [integrationId, params]);

  useEffect(() => {
    if (integrationId) {
      fetchAnalytics();
    }
  }, [fetchAnalytics]);

  return { analytics, loading, error, refetch: fetchAnalytics };
};

export const useIntegrationsAnalytics = (params: any = {}): UseIntegrationsAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<IntegrationAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await integrationsService.getIntegrationsAnalytics(params);
      if (response.success) {
        setAnalytics(response.data as IntegrationAnalytics[]);
      } else {
        setError(response.error || 'Erro ao carregar analytics das integrações');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, loading, error, refetch: fetchAnalytics };
};

export const useIntegrationMarketplace = (params: any = {}): UseIntegrationMarketplaceReturn => {
  const [marketplace, setMarketplace] = useState<IntegrationMarketplace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketplace = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await integrationsService.getMarketplace(params);
      if (response.success) {
        setMarketplace(response.data as IntegrationMarketplace);
      } else {
        setError(response.error || 'Erro ao carregar marketplace');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const searchMarketplace = useCallback(async (query: string, filters: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await integrationsService.searchIntegrations(query, filters);
      if (response.success) {
        setMarketplace(prev => ({
          ...prev,
          searchResults: response.data as Integration[]
        } as IntegrationMarketplace));
      } else {
        setError(response.error || 'Erro ao buscar no marketplace');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getFeaturedIntegrations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await integrationsService.getFeaturedIntegrations();
      if (response.success) {
        setMarketplace(prev => ({
          ...prev,
          featured: response.data as Integration[]
        } as IntegrationMarketplace));
      } else {
        setError(response.error || 'Erro ao carregar integrações em destaque');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPopularIntegrations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await integrationsService.getPopularIntegrations();
      if (response.success) {
        setMarketplace(prev => ({
          ...prev,
          popular: response.data as Integration[]
        } as IntegrationMarketplace));
      } else {
        setError(response.error || 'Erro ao carregar integrações populares');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecentIntegrations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await integrationsService.getRecentIntegrations();
      if (response.success) {
        setMarketplace(prev => ({
          ...prev,
          recent: response.data as Integration[]
        } as IntegrationMarketplace));
      } else {
        setError(response.error || 'Erro ao carregar integrações recentes');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketplace();
  }, [fetchMarketplace]);

  return { 
    marketplace, 
    loading, 
    error, 
    searchMarketplace, 
    getFeaturedIntegrations, 
    getPopularIntegrations, 
    getRecentIntegrations, 
    refetch: fetchMarketplace 
  };
};

export const useIntegrationSync = (integrationId: string): UseIntegrationSyncReturn => {
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSyncStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await integrationsService.getSyncStatus(integrationId);
      if (response.success) {
        setSyncStatus(response.data);
      } else {
        setError(response.error || 'Erro ao carregar status de sincronização');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [integrationId]);

  const syncIntegration = useCallback(async (force: boolean = false) => {
    try {
      const response = await integrationsService.syncIntegration(integrationId, force);
      if (response.success) {
        await fetchSyncStatus();
      } else {
        throw new Error(response.error || 'Erro ao sincronizar integração');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [integrationId, fetchSyncStatus]);

  const syncAllIntegrations = useCallback(async () => {
    try {
      const response = await integrationsService.syncAllIntegrations();
      if (response.success) {
        await fetchSyncStatus();
      } else {
        throw new Error(response.error || 'Erro ao sincronizar todas as integrações');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [fetchSyncStatus]);

  useEffect(() => {
    if (integrationId) {
      fetchSyncStatus();
    }
  }, [fetchSyncStatus]);

  return { syncStatus, loading, error, syncIntegration, syncAllIntegrations, refetch: fetchSyncStatus };
};

export const useIntegrationWebhooks = (integrationId: string): UseIntegrationWebhooksReturn => {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWebhooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await integrationsService.getIntegrationWebhooks(integrationId);
      if (response.success) {
        setWebhooks(response.data);
      } else {
        setError(response.error || 'Erro ao carregar webhooks da integração');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [integrationId]);

  const createWebhook = useCallback(async (webhookData: any) => {
    try {
      const response = await integrationsService.createIntegrationWebhook(integrationId, webhookData);
      if (response.success) {
        await fetchWebhooks();
      } else {
        throw new Error(response.error || 'Erro ao criar webhook');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [integrationId, fetchWebhooks]);

  const updateWebhook = useCallback(async (webhookId: string, webhookData: any) => {
    try {
      const response = await integrationsService.updateIntegrationWebhook(integrationId, webhookId, webhookData);
      if (response.success) {
        await fetchWebhooks();
      } else {
        throw new Error(response.error || 'Erro ao atualizar webhook');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [integrationId, fetchWebhooks]);

  const deleteWebhook = useCallback(async (webhookId: string) => {
    try {
      const response = await integrationsService.deleteIntegrationWebhook(integrationId, webhookId);
      if (response.success) {
        await fetchWebhooks();
      } else {
        throw new Error(response.error || 'Erro ao excluir webhook');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [integrationId, fetchWebhooks]);

  useEffect(() => {
    if (integrationId) {
      fetchWebhooks();
    }
  }, [fetchWebhooks]);

  return { 
    webhooks, 
    loading, 
    error, 
    createWebhook, 
    updateWebhook, 
    deleteWebhook, 
    refetch: fetchWebhooks 
  };
};
