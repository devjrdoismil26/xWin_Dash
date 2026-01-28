import { useState, useEffect, useCallback, useMemo } from 'react';

export interface UniverseInstance {
  id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'suspended';
  configuration?: Record<string, any>;
  user_id: number;
  template_id?: number;
  project_id?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UniverseSnapshot {
  id: number;
  name: string;
  description?: string;
  instance_id: number;
  data: Record<string, any>;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface UniverseTemplate {
  id: number;
  name: string;
  description?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  configuration: Record<string, any>;
  is_public: boolean;
  author_id: number;
  rating: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface UniverseStats {
  total_instances: number;
  active_instances: number;
  total_templates: number;
  total_snapshots: number;
  recent_activity: number;
  ai_suggestions: number;
  automations_running: number;
  success_rate: number;
}

export const useUniverse = () => {
  const [instances, setInstances] = useState<UniverseInstance[]>([]);
  const [snapshots, setSnapshots] = useState<UniverseSnapshot[]>([]);
  const [templates, setTemplates] = useState<UniverseTemplate[]>([]);
  const [stats, setStats] = useState<UniverseStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInstance, setSelectedInstance] = useState<UniverseInstance | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchInstances = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/v1/universe', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setInstances(result.data || []);
      } else {
        throw new Error(result.message || 'Erro ao carregar instâncias do Universe');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar instâncias do Universe:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSnapshots = useCallback(async (instanceId?: number) => {
    try {
      const params = new URLSearchParams();
      if (instanceId) params.append('instance_id', instanceId.toString());
      
      const response = await fetch(`/api/v1/universe/snapshots?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSnapshots(result.data || []);
      }
    } catch (err) {
      console.error('Erro ao buscar snapshots:', err);
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/universe/templates', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setTemplates(result.data || []);
      }
    } catch (err) {
      console.error('Erro ao buscar templates:', err);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/universe/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
    }
  }, []);

  const createInstance = useCallback(async (data: Partial<UniverseInstance>) => {
    try {
      const response = await fetch('/api/v1/universe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchInstances();
        return result.data;
      } else {
        throw new Error(result.message || 'Erro ao criar instância');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    }
  }, [fetchInstances]);

  const updateInstance = useCallback(async (id: number, data: Partial<UniverseInstance>) => {
    try {
      const response = await fetch(`/api/v1/universe/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setInstances(prev => prev.map(instance => 
          instance.id === id ? { ...instance, ...result.data } : instance
        ));
        return result.data;
      } else {
        throw new Error(result.message || 'Erro ao atualizar instância');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteInstance = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/v1/universe/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setInstances(prev => prev.filter(instance => instance.id !== id));
        if (selectedInstance?.id === id) {
          setSelectedInstance(null);
        }
        return true;
      } else {
        throw new Error(result.message || 'Erro ao excluir instância');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    }
  }, [selectedInstance]);

  const createSnapshot = useCallback(async (data: Partial<UniverseSnapshot>) => {
    try {
      const response = await fetch('/api/v1/universe/snapshots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchSnapshots();
        return result.data;
      } else {
        throw new Error(result.message || 'Erro ao criar snapshot');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    }
  }, [fetchSnapshots]);

  const deleteSnapshot = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/v1/universe/snapshots/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSnapshots(prev => prev.filter(snapshot => snapshot.id !== id));
        return true;
      } else {
        throw new Error(result.message || 'Erro ao excluir snapshot');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const startInstance = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/v1/universe/${id}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setInstances(prev => prev.map(instance => 
          instance.id === id ? { ...instance, status: 'active' } : instance
        ));
        setIsRunning(true);
        return true;
      } else {
        throw new Error(result.message || 'Erro ao iniciar instância');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const stopInstance = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/v1/universe/${id}/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setInstances(prev => prev.map(instance => 
          instance.id === id ? { ...instance, status: 'inactive' } : instance
        ));
        setIsRunning(false);
        return true;
      } else {
        throw new Error(result.message || 'Erro ao parar instância');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const saveInstance = useCallback(async (id: number) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/v1/universe/${id}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return true;
      } else {
        throw new Error(result.message || 'Erro ao salvar instância');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const getInstanceById = useCallback((id: number): UniverseInstance | undefined => {
    return instances.find(instance => instance.id === id);
  }, [instances]);

  const getActiveInstances = useCallback((): UniverseInstance[] => {
    return instances.filter(instance => instance.status === 'active');
  }, [instances]);

  const getInstanceStats = useCallback((instance: UniverseInstance) => {
    return {
      uptime: instance.status === 'active' ? '00:00:00' : '00:00:00',
      cpuUsage: Math.floor(Math.random() * 100),
      memoryUsage: Math.floor(Math.random() * 1000),
      lastActivity: instance.updated_at,
    };
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchInstances(),
      fetchTemplates(),
      fetchStats(),
    ]);
  }, [fetchInstances, fetchTemplates, fetchStats]);

  useEffect(() => {
    fetchInstances();
    fetchTemplates();
    fetchStats();
  }, [fetchInstances, fetchTemplates, fetchStats]);

  return {
    // State
    instances,
    snapshots,
    templates,
    stats,
    loading,
    error,
    selectedInstance,
    isRunning,
    isSaving,
    
    // Actions
    fetchInstances,
    fetchSnapshots,
    fetchTemplates,
    fetchStats,
    createInstance,
    updateInstance,
    deleteInstance,
    createSnapshot,
    deleteSnapshot,
    startInstance,
    stopInstance,
    saveInstance,
    refreshData,
    
    // UI Actions
    setSelectedInstance,
    
    // Utilities
    getInstanceById,
    getActiveInstances,
    getInstanceStats,
  };
};
