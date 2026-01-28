import { apiClient } from '@/services';
import {
  Workflow,
  WorkflowCanvasData,
  WorkflowCanvasNode,
  WorkflowCanvasEdge
} from '../types/workflowTypes';

// Cache para NodeRed
const nodeRedCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutos (NodeRed muda frequentemente)

// Interface para status do NodeRed
export interface NodeRedStatus {
  is_connected: boolean;
  is_running: boolean;
  version: string;
  uptime: number;
  memory_usage: number;
  cpu_usage: number;
  active_flows: number;
  last_restart?: string;
  error_count: number;
  warning_count: number;
}

// Interface para configuração do NodeRed
export interface NodeRedConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  api_key?: string;
  timeout: number;
  retry_attempts: number;
  auto_reconnect: boolean;
}

// Interface para fluxo do NodeRed
export interface NodeRedFlow {
  id: string;
  label: string;
  nodes: any[];
  configs: any[];
  subflows: any[];
  disabled: boolean;
  info: string;
  env: any[];
  module: string;
  version: string;
  created_at: string;
  updated_at: string;
}

// Interface para sincronização
export interface SyncResult {
  success: boolean;
  synced_flows: number;
  failed_flows: number;
  errors: string[];
  warnings: string[];
  duration: number;
}

// Interface para estatísticas do NodeRed
export interface NodeRedStats {
  total_flows: number;
  active_flows: number;
  disabled_flows: number;
  total_nodes: number;
  total_connections: number;
  error_nodes: number;
  warning_nodes: number;
  memory_usage: number;
  cpu_usage: number;
  uptime: number;
}

/**
 * Service para integração com NodeRed
 * Responsável por conexão, sincronização e monitoramento
 */
class WorkflowNodeRedService {
  private baseUrl = '/api/nodered';
  private config: NodeRedConfig | null = null;
  private connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error' = 'disconnected';

  /**
   * Conecta ao NodeRed
   */
  async connectNodeRed(config: NodeRedConfig): Promise<boolean> {
    try {
      this.connectionStatus = 'connecting';
      this.config = config;

      const response = await apiClient.post(`${this.baseUrl}/connect`, config);
      
      if (response.data.success) {
        this.connectionStatus = 'connected';
        this.clearNodeRedCache();
        return true;
      } else {
        this.connectionStatus = 'error';
        throw new Error(response.data.message || 'Falha na conexão');
      }
    } catch (error) {
      this.connectionStatus = 'error';
      console.error('Erro ao conectar ao NodeRed:', error);
      throw new Error('Falha ao conectar ao NodeRed');
    }
  }

  /**
   * Desconecta do NodeRed
   */
  async disconnectNodeRed(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/disconnect`);
      this.connectionStatus = 'disconnected';
      this.config = null;
      this.clearNodeRedCache();
    } catch (error) {
      console.error('Erro ao desconectar do NodeRed:', error);
      throw new Error('Falha ao desconectar do NodeRed');
    }
  }

  /**
   * Obtém status do NodeRed
   */
  async getNodeRedStatus(): Promise<NodeRedStatus> {
    try {
      const cacheKey = 'nodered_status';
      const cached = nodeRedCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/status`);
      
      // Cache do resultado
      nodeRedCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter status do NodeRed:', error);
      throw new Error('Falha ao obter status do NodeRed');
    }
  }

  /**
   * Sincroniza workflows com NodeRed
   */
  async syncWorkflows(workflows: Workflow[]): Promise<SyncResult> {
    try {
      const startTime = Date.now();
      
      const response = await apiClient.post(`${this.baseUrl}/sync`, { workflows });
      
      const result: SyncResult = {
        success: response.data.success,
        synced_flows: response.data.synced_flows || 0,
        failed_flows: response.data.failed_flows || 0,
        errors: response.data.errors || [],
        warnings: response.data.warnings || [],
        duration: Date.now() - startTime
      };

      // Limpar cache relacionado
      this.clearNodeRedCache();
      
      return result;
    } catch (error) {
      console.error('Erro ao sincronizar workflows:', error);
      throw new Error('Falha ao sincronizar workflows');
    }
  }

  /**
   * Sincroniza um workflow específico
   */
  async syncWorkflow(workflow: Workflow): Promise<SyncResult> {
    return this.syncWorkflows([workflow]);
  }

  /**
   * Obtém fluxos do NodeRed
   */
  async getNodeRedFlows(): Promise<NodeRedFlow[]> {
    try {
      const cacheKey = 'nodered_flows';
      const cached = nodeRedCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/flows`);
      
      // Cache do resultado
      nodeRedCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter fluxos do NodeRed:', error);
      throw new Error('Falha ao obter fluxos do NodeRed');
    }
  }

  /**
   * Obtém um fluxo específico do NodeRed
   */
  async getNodeRedFlow(flowId: string): Promise<NodeRedFlow> {
    try {
      const cacheKey = `nodered_flow_${flowId}`;
      const cached = nodeRedCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/flows/${flowId}`);
      
      // Cache do resultado
      nodeRedCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao obter fluxo ${flowId} do NodeRed:`, error);
      throw new Error('Falha ao obter fluxo do NodeRed');
    }
  }

  /**
   * Cria fluxo no NodeRed
   */
  async createNodeRedFlow(flowData: any): Promise<NodeRedFlow> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/flows`, flowData);
      
      // Limpar cache relacionado
      this.clearNodeRedCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar fluxo no NodeRed:', error);
      throw new Error('Falha ao criar fluxo no NodeRed');
    }
  }

  /**
   * Atualiza fluxo no NodeRed
   */
  async updateNodeRedFlow(flowId: string, flowData: any): Promise<NodeRedFlow> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/flows/${flowId}`, flowData);
      
      // Limpar cache relacionado
      this.clearNodeRedCache();
      nodeRedCache.delete(`nodered_flow_${flowId}`);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar fluxo ${flowId} no NodeRed:`, error);
      throw new Error('Falha ao atualizar fluxo no NodeRed');
    }
  }

  /**
   * Remove fluxo do NodeRed
   */
  async deleteNodeRedFlow(flowId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/flows/${flowId}`);
      
      // Limpar cache relacionado
      this.clearNodeRedCache();
      nodeRedCache.delete(`nodered_flow_${flowId}`);
    } catch (error) {
      console.error(`Erro ao remover fluxo ${flowId} do NodeRed:`, error);
      throw new Error('Falha ao remover fluxo do NodeRed');
    }
  }

  /**
   * Ativa/desativa fluxo no NodeRed
   */
  async toggleNodeRedFlow(flowId: string): Promise<NodeRedFlow> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/flows/${flowId}/toggle`);
      
      // Limpar cache relacionado
      this.clearNodeRedCache();
      nodeRedCache.delete(`nodered_flow_${flowId}`);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao alterar status do fluxo ${flowId}:`, error);
      throw new Error('Falha ao alterar status do fluxo');
    }
  }

  /**
   * Obtém estatísticas do NodeRed
   */
  async getNodeRedStats(): Promise<NodeRedStats> {
    try {
      const cacheKey = 'nodered_stats';
      const cached = nodeRedCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/stats`);
      
      // Cache do resultado
      nodeRedCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas do NodeRed:', error);
      throw new Error('Falha ao obter estatísticas do NodeRed');
    }
  }

  /**
   * Obtém logs do NodeRed
   */
  async getNodeRedLogs(limit: number = 100): Promise<any[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/logs`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter logs do NodeRed:', error);
      throw new Error('Falha ao obter logs do NodeRed');
    }
  }

  /**
   * Reinicia NodeRed
   */
  async restartNodeRed(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/restart`);
      
      // Limpar cache
      this.clearNodeRedCache();
      this.connectionStatus = 'disconnected';
    } catch (error) {
      console.error('Erro ao reiniciar NodeRed:', error);
      throw new Error('Falha ao reiniciar NodeRed');
    }
  }

  /**
   * Para NodeRed
   */
  async stopNodeRed(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/stop`);
      
      // Limpar cache
      this.clearNodeRedCache();
      this.connectionStatus = 'disconnected';
    } catch (error) {
      console.error('Erro ao parar NodeRed:', error);
      throw new Error('Falha ao parar NodeRed');
    }
  }

  /**
   * Inicia NodeRed
   */
  async startNodeRed(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/start`);
      
      // Limpar cache
      this.clearNodeRedCache();
    } catch (error) {
      console.error('Erro ao iniciar NodeRed:', error);
      throw new Error('Falha ao iniciar NodeRed');
    }
  }

  /**
   * Converte workflow para formato NodeRed
   */
  convertWorkflowToNodeRed(workflow: Workflow): any {
    try {
      const flowData = {
        id: `workflow_${workflow.id}`,
        label: workflow.name,
        nodes: [],
        configs: [],
        subflows: [],
        disabled: !workflow.is_active,
        info: workflow.description || '',
        env: [],
        module: 'xwin-dash',
        version: '1.0.0'
      };

      // Converter canvas data para nós do NodeRed
      if (workflow.canvas_data) {
        flowData.nodes = this.convertCanvasNodesToNodeRed(workflow.canvas_data.nodes || []);
      }

      return flowData;
    } catch (error) {
      console.error('Erro ao converter workflow para NodeRed:', error);
      throw new Error('Falha ao converter workflow para NodeRed');
    }
  }

  /**
   * Converte nós do canvas para formato NodeRed
   */
  private convertCanvasNodesToNodeRed(nodes: WorkflowCanvasNode[]): any[] {
    return nodes.map(node => ({
      id: node.id,
      type: node.type,
      x: node.position?.x || 0,
      y: node.position?.y || 0,
      name: node.data?.name || node.id,
      info: node.data?.description || '',
      disabled: node.data?.disabled || false,
      ...node.data?.config
    }));
  }

  /**
   * Converte arestas do canvas para conexões NodeRed
   */
  private convertCanvasEdgesToNodeRed(edges: WorkflowCanvasEdge[]): any[] {
    return edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle
    }));
  }

  /**
   * Verifica se está conectado ao NodeRed
   */
  isConnected(): boolean {
    return this.connectionStatus === 'connected';
  }

  /**
   * Obtém status da conexão
   */
  getConnectionStatus(): string {
    return this.connectionStatus;
  }

  /**
   * Obtém configuração atual
   */
  getConfig(): NodeRedConfig | null {
    return this.config;
  }

  /**
   * Limpa cache do NodeRed
   */
  private clearNodeRedCache(): void {
    nodeRedCache.clear();
  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of nodeRedCache.keys()) {
        if (key.includes(pattern)) {
          nodeRedCache.delete(key);
        }
      }
    } else {
      nodeRedCache.clear();
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: nodeRedCache.size,
      keys: Array.from(nodeRedCache.keys())
    };
  }
}

// Instância singleton
export const workflowNodeRedService = new WorkflowNodeRedService();
export default workflowNodeRedService;
