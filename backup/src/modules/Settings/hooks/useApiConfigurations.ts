import { useState, useEffect } from 'react';
import useToast from '@/components/ui/useToast';

interface ApiConfiguration {
  id: string;
  name: string;
  provider: string;
  credentials: Record<string, any>;
  status: 'connected' | 'disconnected' | 'error';
  last_tested?: string;
  created_at?: string;
  updated_at?: string;
}

interface UseApiConfigurationsReturn {
  configurations: Record<string, ApiConfiguration>;
  isLoading: boolean;
  error: string | null;
  updateConfiguration: (id: string, credentials: Record<string, any>) => Promise<void>;
  testConnection: (id: string) => Promise<{ success: boolean; message: string }>;
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
      
      const response = await fetch('/api/api-configurations');
      if (!response.ok) {
        throw new Error('Failed to fetch API configurations');
      }
      
      const data = await response.json();
      
      // Convert array to object with id as key
      const configsObject: Record<string, ApiConfiguration> = {};
      if (Array.isArray(data)) {
        data.forEach((config: ApiConfiguration) => {
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
    }
  };

  const updateConfiguration = async (id: string, credentials: Record<string, any>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/api-configurations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          credentials,
          status: 'disconnected', // Reset status when updating
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update API configuration');
      }
      
      const updatedConfig = await response.json();
      
      // Update local state
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
    }
  };

  const testConnection = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/api-configurations/${id}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Update configuration status based on test result
        setConfigurations(prev => ({
          ...prev,
          [id]: {
            ...prev[id],
            status: result.success ? 'connected' : 'error',
            last_tested: new Date().toISOString(),
          },
        }));
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to test connection';
      setError(errorMessage);
      
      // Update status to error
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
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConfiguration = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/api-configurations/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete API configuration');
      }
      
      // Remove from local state
      setConfigurations(prev => {
        const newConfigs = { ...prev };
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
    }
  };

  const refreshConfigurations = async () => {
    await fetchConfigurations();
  };

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
    refreshConfigurations,
  };
};
