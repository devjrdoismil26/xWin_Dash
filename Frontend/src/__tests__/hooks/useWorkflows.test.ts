import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useWorkflows } from '@/hooks/useWorkflows';
import { workflowsAPI } from '@/api/workflows';

vi.mock('@/api/workflows');

describe('useWorkflows Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch workflows on mount', async () => {
    const mockWorkflows = [
      { id: '1', name: 'Workflow 1', status: 'active' },
      { id: '2', name: 'Workflow 2', status: 'draft' },
    ];

    vi.mocked(workflowsAPI.getWorkflows).mockResolvedValue(mockWorkflows);

    const { result } = renderHook(() => useWorkflows());

    await waitFor(() => {
      expect(result.current.workflows).toEqual(mockWorkflows);

    });

  });

  it('should execute workflow', async () => {
    vi.mocked(workflowsAPI.getWorkflows).mockResolvedValue([]);

    vi.mocked(workflowsAPI.executeWorkflow).mockResolvedValue({
      execution_id: 'exec-1',
      status: 'running',
    });

    const { result } = renderHook(() => useWorkflows());

    await act(async () => {
      await result.current.executeWorkflow('1', { lead_id: 'lead-1' });

    });

    expect(workflowsAPI.executeWorkflow).toHaveBeenCalledWith('1', {
      lead_id: 'lead-1',
    });

  });

  it('should fetch executions', async () => {
    const mockExecutions = [
      { id: 'exec-1', status: 'completed' },
      { id: 'exec-2', status: 'running' },
    ];

    vi.mocked(workflowsAPI.getWorkflows).mockResolvedValue([]);

    vi.mocked(workflowsAPI.getExecutions).mockResolvedValue(mockExecutions);

    const { result } = renderHook(() => useWorkflows());

    await act(async () => {
      await result.current.fetchExecutions('1');

    });

    await waitFor(() => {
      expect(result.current.executions).toEqual(mockExecutions);

    });

  });

  it('should filter by status', async () => {
    const mockWorkflows = [
      { id: '1', status: 'active' },
      { id: '2', status: 'draft' },
    ];

    vi.mocked(workflowsAPI.getWorkflows).mockResolvedValue(mockWorkflows);

    const { result } = renderHook(() => useWorkflows({ status: 'active' }));

    await waitFor(() => {
      expect(workflowsAPI.getWorkflows).toHaveBeenCalledWith({ status: 'active' });

    });

  });

});
