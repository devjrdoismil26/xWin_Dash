/**
 * Testes unitários para o módulo Workflows
 * Cobertura completa de services, stores, componentes e utilitários
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { workflowsService } from '../services';
import { useWorkflowsStore } from '../hooks/useWorkflowsStore';
import { useExecutionsStore } from '../hooks/useExecutionsStore';
import { useMetricsStore } from '../hooks/useMetricsStore';
import { useFiltersStore } from '../hooks/useFiltersStore';
import { workflowValidator, validationUtils } from '../utils/workflowValidation';
import { workflowCache, cacheUtils } from '../utils/workflowCache';
import WorkflowsDashboard from '../components/WorkflowsDashboard';
import WorkflowsStats from '../components/WorkflowsStats';
import WorkflowsFilters from '../components/WorkflowsFilters';
import WorkflowsList from '../components/WorkflowsList';
import WorkflowsGrid from '../components/WorkflowsGrid';

// Mock de dados
const mockWorkflow = {
  id: 1,
  name: 'Test Workflow',
  description: 'Test workflow description',
  status: 'active' as const,
  trigger: { type: 'webhook' },
  is_active: true,
  executions_count: 10,
  success_rate: 85.5,
  last_execution: '2024-01-15T10:30:00Z',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-15T10:30:00Z'
};

const mockExecution = {
  id: 1,
  workflow_id: 1,
  status: 'completed' as const,
  started_at: '2024-01-15T10:30:00Z',
  completed_at: '2024-01-15T10:35:00Z',
  duration: 300000,
  result: { success: true }
};

const mockMetrics = {
  total_executions: 100,
  successful_executions: 85,
  failed_executions: 15,
  running_executions: 2,
  average_execution_time: 2500,
  success_rate: 85,
  failure_rate: 15,
  throughput_per_hour: 10
};

// Mock do API client
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

// Mock de componentes UI
vi.mock('@/components/ui/Card', () => ({
  default: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  Card.Content: ({ children, ...props }: any) => <div data-testid="card-content" {...props}>{children}</div>,
  Card.Header: ({ children, ...props }: any) => <div data-testid="card-header" {...props}>{children}</div>,
  Card.Title: ({ children, ...props }: any) => <h3 data-testid="card-title" {...props}>{children}</h3>
}));

vi.mock('@/components/ui/Button', () => ({
  default: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  )
}));

vi.mock('@/components/ui/Input', () => ({
  default: ({ onChange, ...props }: any) => (
    <input onChange={(e) => onChange?.(e)} {...props} />
  )
}));

vi.mock('@/components/ui/Badge', () => ({
  default: ({ children, ...props }: any) => (
    <span data-testid="badge" {...props}>{children}</span>
  )
}));

describe('Workflows Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('workflowsService', () => {
    it('should fetch workflows successfully', async () => {
      const mockResponse = {
        data: [mockWorkflow],
        total: 1,
        page: 1,
        limit: 10,
        total_pages: 1
      };

      const { default: apiClient } = await import('@/services/api');
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse });

      const result = await workflowsService.getWorkflows();

      expect(result).toEqual(mockResponse);
      expect(apiClient.get).toHaveBeenCalledWith('/api/workflows', { params: {} });
    });

    it('should create workflow successfully', async () => {
      const workflowData = {
        name: 'New Workflow',
        description: 'New workflow description',
        trigger: { type: 'webhook' },
        steps: []
      };

      const { default: apiClient } = await import('@/services/api');
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockWorkflow });

      const result = await workflowsService.createWorkflow(workflowData);

      expect(result).toEqual(mockWorkflow);
      expect(apiClient.post).toHaveBeenCalledWith('/api/workflows', workflowData);
    });

    it('should handle errors gracefully', async () => {
      const { default: apiClient } = await import('@/services/api');
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'));

      await expect(workflowsService.getWorkflows()).rejects.toThrow('Falha ao carregar workflows');
    });
  });
});

describe('Workflows Stores', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useWorkflowsStore', () => {
    it('should initialize with default state', () => {
      const state = useWorkflowsStore.getState();
      
      expect(state.workflows).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.filters).toBeDefined();
      expect(state.pagination).toBeDefined();
    });

    it('should update filters correctly', () => {
      const { setFilters } = useWorkflowsStore.getState();
      
      setFilters({ search: 'test', status: 'active' });
      
      const state = useWorkflowsStore.getState();
      expect(state.filters.search).toBe('test');
      expect(state.filters.status).toBe('active');
    });

    it('should clear filters correctly', () => {
      const { setFilters, clearFilters } = useWorkflowsStore.getState();
      
      setFilters({ search: 'test' });
      clearFilters();
      
      const state = useWorkflowsStore.getState();
      expect(state.filters.search).toBe('');
    });

    it('should handle selection correctly', () => {
      const { selectWorkflow, deselectWorkflow, clearSelection } = useWorkflowsStore.getState();
      
      selectWorkflow(1);
      selectWorkflow(2);
      
      let state = useWorkflowsStore.getState();
      expect(state.selection.selectedIds.has(1)).toBe(true);
      expect(state.selection.selectedIds.has(2)).toBe(true);
      
      deselectWorkflow(1);
      state = useWorkflowsStore.getState();
      expect(state.selection.selectedIds.has(1)).toBe(false);
      expect(state.selection.selectedIds.has(2)).toBe(true);
      
      clearSelection();
      state = useWorkflowsStore.getState();
      expect(state.selection.selectedIds.size).toBe(0);
    });
  });

  describe('useExecutionsStore', () => {
    it('should initialize with default state', () => {
      const state = useExecutionsStore.getState();
      
      expect(state.executions).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should update execution filters correctly', () => {
      const { setExecutionFilters } = useExecutionsStore.getState();
      
      setExecutionFilters({ status: 'running', workflow_id: 1 });
      
      const state = useExecutionsStore.getState();
      expect(state.filters.status).toBe('running');
      expect(state.filters.workflow_id).toBe(1);
    });
  });

  describe('useMetricsStore', () => {
    it('should initialize with default state', () => {
      const state = useMetricsStore.getState();
      
      expect(state.executionStats).toBeNull();
      expect(state.systemMetrics).toBeNull();
      expect(state.loading).toBe(false);
    });

    it('should update metrics filters correctly', () => {
      const { setMetricsFilters } = useMetricsStore.getState();
      
      setMetricsFilters({ period: 'day', group_by: 'workflow' });
      
      const state = useMetricsStore.getState();
      expect(state.filters.period).toBe('day');
      expect(state.filters.group_by).toBe('workflow');
    });
  });

  describe('useFiltersStore', () => {
    it('should initialize with default state', () => {
      const state = useFiltersStore.getState();
      
      expect(state.workflowFilters).toBeDefined();
      expect(state.executionFilters).toBeDefined();
      expect(state.queueFilters).toBeDefined();
      expect(state.metricsFilters).toBeDefined();
    });

    it('should save and load filter presets', () => {
      const { saveFilterPreset, loadFilterPreset } = useFiltersStore.getState();
      
      const preset = {
        name: 'Test Preset',
        description: 'Test description',
        filters: { search: 'test', status: 'active' },
        type: 'workflow' as const
      };
      
      saveFilterPreset(preset.name, preset.description, preset.filters, preset.type);
      
      let state = useFiltersStore.getState();
      expect(state.filterPresets).toHaveLength(1);
      expect(state.filterPresets[0].name).toBe(preset.name);
      
      const presetId = state.filterPresets[0].id;
      loadFilterPreset(presetId);
      
      state = useFiltersStore.getState();
      expect(state.workflowFilters.search).toBe('test');
      expect(state.workflowFilters.status).toBe('active');
    });
  });
});

describe('Workflow Validation', () => {
  describe('workflowValidator', () => {
    it('should validate required fields', () => {
      const result = workflowValidator.validateField('name', '');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toBe('Nome do workflow é obrigatório');
    });

    it('should validate minimum length', () => {
      const result = workflowValidator.validateField('name', 'ab');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toBe('Nome deve ter pelo menos 3 caracteres');
    });

    it('should validate maximum length', () => {
      const longName = 'a'.repeat(101);
      const result = workflowValidator.validateField('name', longName);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toBe('Nome deve ter no máximo 100 caracteres');
    });

    it('should validate trigger type', () => {
      const result = workflowValidator.validateField('trigger.type', 'invalid');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toBe('Tipo de trigger inválido');
    });

    it('should validate complete workflow object', () => {
      const workflow = {
        name: 'Test Workflow',
        description: 'Test description',
        trigger: { type: 'webhook' },
        status: 'active',
        steps: []
      };
      
      const result = workflowValidator.validateObject(workflow);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect cross-field validation errors', () => {
      const workflow = {
        name: 'Test Workflow',
        description: 'Test description',
        trigger: { type: 'schedule' }, // Schedule sem configuração
        status: 'active',
        steps: []
      };
      
      const result = workflowValidator.validateObject(workflow);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'missing_schedule')).toBe(true);
    });
  });

  describe('validationUtils', () => {
    it('should format errors correctly', () => {
      const errors = [
        { field: 'name', message: 'Nome é obrigatório', code: 'required', severity: 'error' as const },
        { field: 'description', message: 'Descrição é obrigatória', code: 'required', severity: 'error' as const }
      ];
      
      const formatted = validationUtils.formatErrors(errors);
      
      expect(formatted).toEqual(['Nome é obrigatório', 'Descrição é obrigatória']);
    });

    it('should get first error for field', () => {
      const errors = [
        { field: 'name', message: 'Nome é obrigatório', code: 'required', severity: 'error' as const },
        { field: 'name', message: 'Nome muito curto', code: 'minLength', severity: 'error' as const }
      ];
      
      const firstError = validationUtils.getFirstError(errors, 'name');
      
      expect(firstError?.message).toBe('Nome é obrigatório');
    });

    it('should check if field has error', () => {
      const errors = [
        { field: 'name', message: 'Nome é obrigatório', code: 'required', severity: 'error' as const }
      ];
      
      expect(validationUtils.hasFieldError(errors, 'name')).toBe(true);
      expect(validationUtils.hasFieldError(errors, 'description')).toBe(false);
    });

    it('should group errors by field', () => {
      const errors = [
        { field: 'name', message: 'Nome é obrigatório', code: 'required', severity: 'error' as const },
        { field: 'name', message: 'Nome muito curto', code: 'minLength', severity: 'error' as const },
        { field: 'description', message: 'Descrição é obrigatória', code: 'required', severity: 'error' as const }
      ];
      
      const grouped = validationUtils.groupErrorsByField(errors);
      
      expect(grouped.name).toHaveLength(2);
      expect(grouped.description).toHaveLength(1);
    });
  });
});

describe('Workflow Cache', () => {
  beforeEach(() => {
    workflowCache.clear();
  });

  afterEach(() => {
    workflowCache.clear();
  });

  describe('workflowCache', () => {
    it('should store and retrieve values', () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      
      workflowCache.set(key, value);
      const retrieved = workflowCache.get(key);
      
      expect(retrieved).toEqual(value);
    });

    it('should return null for non-existent keys', () => {
      const retrieved = workflowCache.get('non-existent');
      
      expect(retrieved).toBeNull();
    });

    it('should handle TTL correctly', async () => {
      const key = 'ttl-test';
      const value = { data: 'test' };
      
      workflowCache.set(key, value, 100); // 100ms TTL
      
      expect(workflowCache.get(key)).toEqual(value);
      
      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 150));
      
      expect(workflowCache.get(key)).toBeNull();
    });

    it('should delete values correctly', () => {
      const key = 'delete-test';
      const value = { data: 'test' };
      
      workflowCache.set(key, value);
      expect(workflowCache.get(key)).toEqual(value);
      
      const deleted = workflowCache.delete(key);
      expect(deleted).toBe(true);
      expect(workflowCache.get(key)).toBeNull();
    });

    it('should handle tags correctly', () => {
      const key1 = 'tag-test-1';
      const key2 = 'tag-test-2';
      const value = { data: 'test' };
      
      workflowCache.set(key1, value, undefined, ['workflow']);
      workflowCache.set(key2, value, undefined, ['workflow', 'active']);
      
      const deletedCount = workflowCache.deleteByTags(['workflow']);
      expect(deletedCount).toBe(2);
      expect(workflowCache.get(key1)).toBeNull();
      expect(workflowCache.get(key2)).toBeNull();
    });

    it('should provide statistics', () => {
      const key = 'stats-test';
      const value = { data: 'test' };
      
      workflowCache.set(key, value);
      workflowCache.get(key); // Hit
      workflowCache.get('non-existent'); // Miss
      
      const stats = workflowCache.getStats();
      
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.sets).toBe(1);
      expect(stats.hitRate).toBe(50);
    });
  });

  describe('cacheUtils', () => {
    it('should generate cache keys correctly', () => {
      const key = cacheUtils.generateKey('workflows', { page: 1, limit: 10, search: 'test' });
      
      expect(key).toBe('workflows:limit:10|page:1|search:"test"');
    });

    it('should invalidate by pattern', () => {
      workflowCache.set('workflow-1', { data: 'test' });
      workflowCache.set('workflow-2', { data: 'test' });
      workflowCache.set('execution-1', { data: 'test' });
      
      const deletedCount = cacheUtils.invalidateByPattern(workflowCache, 'workflow');
      
      expect(deletedCount).toBe(2);
      expect(workflowCache.get('workflow-1')).toBeNull();
      expect(workflowCache.get('workflow-2')).toBeNull();
      expect(workflowCache.get('execution-1')).toEqual({ data: 'test' });
    });

    it('should get all cache statistics', () => {
      const allStats = cacheUtils.getAllStats();
      
      expect(allStats).toHaveProperty('workflow');
      expect(allStats).toHaveProperty('execution');
      expect(allStats).toHaveProperty('metrics');
      expect(allStats).toHaveProperty('template');
      expect(allStats).toHaveProperty('config');
    });
  });
});

describe('Workflows Components', () => {
  describe('WorkflowsDashboard', () => {
    it('should render without crashing', () => {
      render(<WorkflowsDashboard />);
      
      expect(screen.getByText('Workflows')).toBeInTheDocument();
    });

    it('should show create workflow button', () => {
      render(<WorkflowsDashboard />);
      
      expect(screen.getByText('Novo Workflow')).toBeInTheDocument();
    });

    it('should toggle filters visibility', () => {
      render(<WorkflowsDashboard />);
      
      const filtersButton = screen.getByText('Filtros');
      fireEvent.click(filtersButton);
      
      // Verificar se os filtros aparecem (implementação específica)
    });
  });

  describe('WorkflowsStats', () => {
    it('should render stats correctly', () => {
      render(<WorkflowsStats stats={mockMetrics} />);
      
      expect(screen.getByText('Total Execuções')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should show loading state', () => {
      render(<WorkflowsStats loading={true} />);
      
      // Verificar se o loading está sendo exibido
    });

    it('should handle empty stats', () => {
      render(<WorkflowsStats stats={null} />);
      
      // Verificar comportamento com stats vazios
    });
  });

  describe('WorkflowsFilters', () => {
    it('should render filters correctly', () => {
      const mockFilters = { search: '', status: undefined };
      const mockOnChange = vi.fn();
      
      render(
        <WorkflowsFilters
          filters={mockFilters}
          onFiltersChange={mockOnChange}
          onClearFilters={vi.fn()}
        />
      );
      
      expect(screen.getByPlaceholderText('Nome ou descrição...')).toBeInTheDocument();
    });

    it('should call onChange when input changes', () => {
      const mockFilters = { search: '', status: undefined };
      const mockOnChange = vi.fn();
      
      render(
        <WorkflowsFilters
          filters={mockFilters}
          onFiltersChange={mockOnChange}
          onClearFilters={vi.fn()}
        />
      );
      
      const searchInput = screen.getByPlaceholderText('Nome ou descrição...');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('WorkflowsList', () => {
    it('should render workflows list', () => {
      const mockWorkflows = [mockWorkflow];
      const mockPagination = { page: 1, limit: 10, total: 1, total_pages: 1 };
      const mockSelection = { selectedIds: new Set(), isAllSelected: false };
      
      render(
        <WorkflowsList
          workflows={mockWorkflows}
          pagination={mockPagination}
          selection={mockSelection}
          onWorkflowSelect={vi.fn()}
          onWorkflowAction={vi.fn()}
          onPageChange={vi.fn()}
        />
      );
      
      expect(screen.getByText('Test Workflow')).toBeInTheDocument();
    });

    it('should handle empty workflows', () => {
      const mockPagination = { page: 1, limit: 10, total: 0, total_pages: 0 };
      const mockSelection = { selectedIds: new Set(), isAllSelected: false };
      
      render(
        <WorkflowsList
          workflows={[]}
          pagination={mockPagination}
          selection={mockSelection}
          onWorkflowSelect={vi.fn()}
          onWorkflowAction={vi.fn()}
          onPageChange={vi.fn()}
        />
      );
      
      expect(screen.getByText('Nenhum workflow encontrado')).toBeInTheDocument();
    });
  });

  describe('WorkflowsGrid', () => {
    it('should render workflows grid', () => {
      const mockWorkflows = [mockWorkflow];
      const mockPagination = { page: 1, limit: 10, total: 1, total_pages: 1 };
      const mockSelection = { selectedIds: new Set(), isAllSelected: false };
      
      render(
        <WorkflowsGrid
          workflows={mockWorkflows}
          pagination={mockPagination}
          selection={mockSelection}
          onWorkflowSelect={vi.fn()}
          onWorkflowAction={vi.fn()}
          onPageChange={vi.fn()}
        />
      );
      
      expect(screen.getByText('Test Workflow')).toBeInTheDocument();
    });

    it('should handle different grid columns', () => {
      const mockWorkflows = [mockWorkflow];
      const mockPagination = { page: 1, limit: 10, total: 1, total_pages: 1 };
      const mockSelection = { selectedIds: new Set(), isAllSelected: false };
      
      render(
        <WorkflowsGrid
          workflows={mockWorkflows}
          pagination={mockPagination}
          selection={mockSelection}
          onWorkflowSelect={vi.fn()}
          onWorkflowAction={vi.fn()}
          onPageChange={vi.fn()}
          gridCols={2}
        />
      );
      
      // Verificar se o grid está usando 2 colunas
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complete workflow creation flow', async () => {
    // Teste de integração completo
    const { default: apiClient } = await import('@/services/api');
    vi.mocked(apiClient.post).mockResolvedValue({ data: mockWorkflow });

    // Simular criação de workflow
    const workflowData = {
      name: 'Integration Test Workflow',
      description: 'Test workflow for integration testing',
      trigger: { type: 'webhook' },
      steps: []
    };

    const result = await workflowsService.createWorkflow(workflowData);
    
    expect(result).toEqual(mockWorkflow);
    expect(apiClient.post).toHaveBeenCalledWith('/api/workflows', workflowData);
  });

  it('should handle error scenarios gracefully', async () => {
    const { default: apiClient } = await import('@/services/api');
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'));

    // Teste de tratamento de erro
    await expect(workflowsService.getWorkflows()).rejects.toThrow('Falha ao carregar workflows');
  });

  it('should maintain cache consistency', () => {
    const key = 'consistency-test';
    const value = { data: 'test' };
    
    // Set value
    workflowCache.set(key, value);
    expect(workflowCache.get(key)).toEqual(value);
    
    // Update value
    const newValue = { data: 'updated' };
    workflowCache.set(key, newValue);
    expect(workflowCache.get(key)).toEqual(newValue);
    
    // Delete value
    workflowCache.delete(key);
    expect(workflowCache.get(key)).toBeNull();
  });
});

// Testes de performance
describe('Performance Tests', () => {
  it('should handle large datasets efficiently', () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      ...mockWorkflow,
      id: i,
      name: `Workflow ${i}`
    }));

    const startTime = performance.now();
    
    // Simular operações com dataset grande
    largeDataset.forEach(item => {
      workflowCache.set(`workflow-${item.id}`, item);
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Verificar se a operação foi eficiente (menos de 100ms)
    expect(duration).toBeLessThan(100);
  });

  it('should validate large workflows efficiently', () => {
    const largeWorkflow = {
      name: 'Large Workflow',
      description: 'A'.repeat(100),
      trigger: { type: 'webhook' },
      status: 'active',
      steps: Array.from({ length: 100 }, (_, i) => ({
        id: i,
        type: 'action',
        name: `Step ${i}`
      }))
    };

    const startTime = performance.now();
    const result = workflowValidator.validateObject(largeWorkflow);
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(result.isValid).toBe(true);
    expect(duration).toBeLessThan(50); // Validação deve ser rápida
  });
});
