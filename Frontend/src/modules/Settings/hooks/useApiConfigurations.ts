import { useState, useEffect } from 'react';
import { apiClient } from '@/services';
import useToast from '@/shared/components/ui/useToast';

interface ApiConfiguration {
  id: string;
  name: string;
  provider: string;
  credentials: Record<string, any>;
  status: 'connected' | 'disconnected' | 'error';
  last_tested?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown; }

interface UseApiConfigurationsReturn {
  configurations: Record<string, ApiConfiguration>;
  isLoading: boolean;
  error: string | null;
  updateConfiguration: (id: string, credentials: Record<string, any>) => Promise<void>;
  testConnection: (id: string) => Promise<{ success: boolean;
  message: string
  [key: string]: unknown; }>;
  deleteConfiguration: (id: string) => Promise<void>;
  refreshConfigurations: () => Promise<void>;
}

export const useApiConfigurations = (): UseApiConfigurationsReturn => {
  const [configurations, setConfigurations] = useState<Record<string, ApiConfiguration>>({});

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchConfigurations = async () => {
    try {
      setIsLoading(true);

      setError(null);

      const data = await apiClient.get<ApiConfiguration[]>('/api-configurations');

      const configsObject: Record<string, ApiConfiguration> = {};

      if (Array.isArray(data)) {
        (data as any).forEach((config: ApiConfiguration) => {
          configsObject[config.id] = config;
        });

      }
      
      setConfigurations(configsObject);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch API configurations';
      setError(errorMessage);

      console.error('Error fetching API configurations:', err);

    } finally {
      setIsLoading(false);

    } ;

  const updateConfiguration = async (id: string, credentials: Record<string, any>) => {
    try {
      setIsLoading(true);

      setError(null);

      const updatedConfig = await apiClient.put<ApiConfiguration>(`/api-configurations/${id}`, {
        credentials,
        status: 'disconnected'
      });

      setConfigurations(prev => ({
        ...prev,
        [id]: updatedConfig,
      }));

      toast({
        title: "Configuração atualizada",
        description: `Configuração da API ${id} foi atualizada com sucesso.`,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update API configuration';
      setError(errorMessage);

      toast({
        title: "Erro",
        description: `Não foi possível atualizar a configuração: ${errorMessage}`,
        variant: "destructive",
      });

      throw err;
    } finally {
      setIsLoading(false);

    } ;

  const testConnection = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);

      setError(null);

      const result = await apiClient.post<{ success: boolean; message: string }>(`/api-configurations/${id}/test`);

      setConfigurations(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          status: result.success ? 'connected' : 'error',
          last_tested: new Date().toISOString(),
        },
      }));

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to test connection';
      setError(errorMessage);

      setConfigurations(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          status: 'error',
          last_tested: new Date().toISOString(),
        },
      }));

      return {
        success: false,
        message: errorMessage,};

    } finally {
      setIsLoading(false);

    } ;

  const deleteConfiguration = async (id: string) => {
    try {
      setIsLoading(true);

      setError(null);

      await apiClient.delete(`/api-configurations/${id}`);

      setConfigurations(prev => {
        const newConfigs = { ...prev};

        delete newConfigs[id];
        return newConfigs;
      });

      toast({
        title: "Configuração removida",
        description: `Configuração da API ${id} foi removida com sucesso.`,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete API configuration';
      setError(errorMessage);

      toast({
        title: "Erro",
        description: `Não foi possível remover a configuração: ${errorMessage}`,
        variant: "destructive",
      });

      throw err;
    } finally {
      setIsLoading(false);

    } ;

  const refreshConfigurations = async () => {
    await fetchConfigurations();};

  useEffect(() => {
    fetchConfigurations();

  }, []);

  return {
    configurations,
    isLoading,
    error,
    updateConfiguration,
    testConnection,
    deleteConfiguration,
    refreshConfigurations,};
};
