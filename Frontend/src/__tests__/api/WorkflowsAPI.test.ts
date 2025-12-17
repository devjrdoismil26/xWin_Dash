import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/api/client';
import { workflowsAPI } from '@/api/workflows';

vi.mock('@/api/client');

describe('Workflows API', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  describe('getWorkflows', () => {
    it('should fetch workflows with filters', async () => {
      const mockWorkflows = [
        { id: '1', name: 'Workflow 1', status: 'active', trigger_type: 'manual' },
        { id: '2', name: 'Workflow 2', status: 'draft', trigger_type: 'schedule' },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockWorkflows });

      const result = await workflowsAPI.getWorkflows({ status: 'active' });

      expect(apiClient.get).toHaveBeenCalledWith('/workflows', {
        params: { status: 'active' },
      });

      expect(result).toEqual(mockWorkflows);

    });

  });

  describe('createWorkflow', () => {
    it('should create a new workflow', async () => {
      const newWorkflow = {
        name: 'New Workflow',
        trigger_type: 'event',
        trigger_config: { event: 'lead.created' },
        project_id: 'project-1',};

      const mockResponse = { id: '3', ...newWorkflow, status: 'draft'};

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await workflowsAPI.createWorkflow(newWorkflow);

      expect(apiClient.post).toHaveBeenCalledWith('/workflows', newWorkflow);

      expect(result).toEqual(mockResponse);

    });

  });

  describe('executeWorkflow', () => {
    it('should execute a workflow', async () => {
      const inputData = { lead_id: 'lead-1'};

      const mockResponse = { execution_id: 'exec-1', status: 'running'};

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await workflowsAPI.executeWorkflow('1', inputData);

      expect(apiClient.post).toHaveBeenCalledWith('/workflows/1/execute', {
        input_data: inputData,
      });

      expect(result).toEqual(mockResponse);

    });

  });

  describe('getExecutions', () => {
    it('should fetch workflow executions', async () => {
      const mockExecutions = [
        { id: 'exec-1', status: 'completed', started_at: '2025-11-28T10:00:00Z' },
        { id: 'exec-2', status: 'running', started_at: '2025-11-28T11:00:00Z' },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockExecutions });

      const result = await workflowsAPI.getExecutions('1', { limit: 50 });

      expect(apiClient.get).toHaveBeenCalledWith('/workflows/1/executions', {
        params: { limit: 50 },
      });

      expect(result).toEqual(mockExecutions);

    });

  });

});
