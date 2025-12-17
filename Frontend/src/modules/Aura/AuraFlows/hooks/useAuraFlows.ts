/**
 * @module modules/Aura/AuraFlows/hooks/useAuraFlows
 * @description
 * Hook especializado para gerenciamento de fluxos do módulo Aura.
 * 
 * Gerencia:
 * - Fluxos de automação (CRUD, toggle status, execute)
 * - Execuções de fluxos
 * - Templates de fluxos
 * - Utilitários (getFlowsByStatus, getActiveFlows, getFlowStats, getExecutionStats)
 * 
 * @example
 * ```typescript
 * import { useAuraFlows } from './hooks/useAuraFlows';
 * 
 * const FlowsComponent = () => {
 *   const {
 *     flows,
 *     loading,
 *     fetchFlows,
 *     createFlow,
 *     executeFlow,
 *     getFlowStats
 *   } = useAuraFlows();

 * 
 *   const stats = getFlowStats();

 *   return <div>Total: {stats.total}, Ativos: {stats.active}</div>;
 *};

 * ```
 * 
 * @since 1.0.0
 */
import { useCallback, useState, useEffect } from 'react';
import { AuraFlow, FlowExecution, FlowTemplate, FlowStatus } from '../types';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { getErrorMessage } from '@/utils/errorHelpers';
import { notify } from '@/lib/utils';

export const useAuraFlows = () => {
  const { showSuccess, showError } = useAdvancedNotifications();

  const [flows, setFlows] = useState<AuraFlow[]>([]);

  const [executions, setExecutions] = useState<FlowExecution[]>([]);

  const [templates, setTemplates] = useState<FlowTemplate[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [selectedFlow, setSelectedFlow] = useState<AuraFlow | null>(null);

  // Carregar fluxos
  const fetchFlows = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      // Simular chamada de API
      const mockFlows: AuraFlow[] = [
        {
          id: '1',
          name: 'Boas-vindas',
          description: 'Fluxo de boas-vindas para novos usuários',
          status: 'active',
          trigger_type: 'message_received',
          trigger_config: { keyword: 'oi' },
          nodes: [],
          connections: [],
          variables: {},
          settings: {
            max_executions: 1000,
            timeout: 300,
            retry_attempts: 3,
            retry_delay: 5000,
            error_handling: 'stop',
            logging_enabled: true,
            notifications_enabled: true
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: 'user1',
          version: 1,
          is_template: false
        }
      ];
      
      setFlows(mockFlows);

      showSuccess('Fluxos carregados com sucesso!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao carregar fluxos';
      setError(errorMessage);

      showError('Erro', errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Criar fluxo
  const createFlow = useCallback(async (flowData: Partial<AuraFlow>) => {
    setLoading(true);

    setError(null);

    try {
      const newFlow: AuraFlow = {
        id: Date.now().toString(),
        name: flowData.name || 'Novo Fluxo',
        description: flowData.description || '',
        status: 'draft',
        trigger_type: flowData.trigger_type || 'message_received',
        trigger_config: flowData.trigger_config || {},
        nodes: flowData.nodes || [],
        connections: flowData.connections || [],
        variables: flowData.variables || {},
        settings: flowData.settings || {
          max_executions: 1000,
          timeout: 300,
          retry_attempts: 3,
          retry_delay: 5000,
          error_handling: 'stop',
          logging_enabled: true,
          notifications_enabled: true
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'current_user',
        version: 1,
        is_template: false};

      setFlows(prev => [newFlow, ...prev]);

      notify('success', 'Fluxo criado com sucesso!');

      return newFlow;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao criar fluxo';
      setError(errorMessage);

      showError('Erro', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Atualizar fluxo
  const updateFlow = useCallback(async (id: string, flowData: Partial<AuraFlow>) => {
    setLoading(true);

    setError(null);

    try {
      setFlows(prev => prev.map(flow => 
        flow.id === id 
          ? { ...flow, ...flowData, updated_at: new Date().toISOString() }
          : flow
      ));

      showSuccess('Fluxo atualizado com sucesso!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao atualizar fluxo';
      setError(errorMessage);

      showError('Erro', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Excluir fluxo
  const deleteFlow = useCallback(async (id: string) => {
    setLoading(true);

    setError(null);

    try {
      setFlows(prev => prev.filter(flow => flow.id !== id));

      showSuccess('Fluxo excluído com sucesso!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao excluir fluxo';
      setError(errorMessage);

      showError('Erro', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Ativar/Desativar fluxo
  const toggleFlowStatus = useCallback(async (id: string) => {
    try {
      const flow = flows.find(f => f.id === id);

      if (!flow) return;
      
      const newStatus: FlowStatus = flow.status === 'active' ? 'paused' : 'active';
      await updateFlow(id, { status: newStatus });

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao alterar status do fluxo';
      setError(errorMessage);

      showError('Erro', errorMessage);

    } , [flows, updateFlow]);

  // Executar fluxo
  const executeFlow = useCallback(async (id: string, inputData: Record<string, any> = {}) => {
    setLoading(true);

    setError(null);

    try {
      const execution: FlowExecution = {
        id: Date.now().toString(),
        flow_id: id,
        status: 'running',
        started_at: new Date().toISOString(),
        input_data: inputData,
        steps: [],
        context: {} ;

      setExecutions(prev => [execution, ...prev]);

      showSuccess('Fluxo executado com sucesso!');

      return execution;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao executar fluxo';
      setError(errorMessage);

      showError('Erro', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Carregar templates
  const fetchTemplates = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const mockTemplates: FlowTemplate[] = [
        {
          id: '1',
          name: 'Template de Boas-vindas',
          description: 'Template para fluxo de boas-vindas',
          category: 'marketing',
          tags: ['boas-vindas', 'marketing'],
          flow: flows[0] || {} as AuraFlow,
          usage_count: 10,
          rating: 4.5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: 'user1',
          is_public: true
        }
      ];
      
      setTemplates(mockTemplates);

      showSuccess('Templates carregados com sucesso!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao carregar templates';
      setError(errorMessage);

      showError('Erro', errorMessage);

    } finally {
      setLoading(false);

    } , [flows]);

  // Criar template
  const createTemplate = useCallback(async (templateData: Partial<FlowTemplate>) => {
    setLoading(true);

    setError(null);

    try {
      const newTemplate: FlowTemplate = {
        id: Date.now().toString(),
        name: templateData.name || 'Novo Template',
        description: templateData.description || '',
        category: templateData.category || 'general',
        tags: templateData.tags || [],
        flow: templateData.flow || {} as AuraFlow,
        usage_count: 0,
        rating: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'current_user',
        is_public: templateData.is_public || false};

      setTemplates(prev => [newTemplate, ...prev]);

      showSuccess('Template criado com sucesso!');

      return newTemplate;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao criar template';
      setError(errorMessage);

      showError('Erro', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Utilitários
  const getFlowsByStatus = useCallback((status: FlowStatus) => {
    return flows.filter(flow => flow.status === status);

  }, [flows]);

  const getActiveFlows = useCallback(() => {
    return flows.filter(flow => flow.status === 'active');

  }, [flows]);

  const getFlowById = useCallback((id: string) => {
    return flows.find(flow => flow.id === id);

  }, [flows]);

  const getTemplatesByCategory = useCallback((category: string) => {
    return templates.filter(template => template.category === category);

  }, [templates]);

  const getPublicTemplates = useCallback(() => {
    return templates.filter(template => template.is_public);

  }, [templates]);

  const getFlowStats = useCallback(() => {
    const total = flows.length;
    const active = flows.filter(f => f.status === 'active').length;
    const paused = flows.filter(f => f.status === 'paused').length;
    const draft = flows.filter(f => f.status === 'draft').length;
    
    return {
      total,
      active,
      paused,
      draft,
      activePercentage: total > 0 ? (active / total) * 100 : 0};

  }, [flows]);

  const getExecutionStats = useCallback(() => {
    const total = executions.length;
    const running = executions.filter(e => e.status === 'running').length;
    const completed = executions.filter(e => e.status === 'completed').length;
    const failed = executions.filter(e => e.status === 'failed').length;
    
    return {
      total,
      running,
      completed,
      failed,
      successRate: total > 0 ? (completed / total) * 100 : 0};

  }, [executions]);

  // Inicialização
  useEffect(() => {
    fetchFlows();

    fetchTemplates();

  }, [fetchFlows, fetchTemplates]);

  return {
    // Estado
    flows,
    executions,
    templates,
    selectedFlow,
    loading,
    error,
    
    // Ações
    fetchFlows,
    createFlow,
    updateFlow,
    deleteFlow,
    toggleFlowStatus,
    executeFlow,
    fetchTemplates,
    createTemplate,
    setSelectedFlow,
    
    // Utilitários
    getFlowsByStatus,
    getActiveFlows,
    getFlowById,
    getTemplatesByCategory,
    getPublicTemplates,
    getFlowStats,
    getExecutionStats,
    
    // Controle de erro
    clearError: () => setError(null)};
};
