import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWorkflowsValidated } from '../useWorkflowsValidated';
import * as validatedApiClient from '@/services/http/validatedApiClient';

vi.mock('@/services/http/validatedApiClient');

describe('useWorkflowsValidated', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch workflows successfully', async () => {
    const mockWorkflows = [
      { id: 1, name: 'Workflow 1', status: 'active', trigger: 'manual', nodes: [], edges: [] }
    ];

    vi.spyOn(validatedApiClient.validatedApiClient, 'get').mockResolvedValue(mockWorkflows);

    const { result } = renderHook(() => useWorkflowsValidated());

    await waitFor(() => {
      result.current.fetchWorkflows();

    });

    await waitFor(() => {
      expect(result.current.workflows).toEqual(mockWorkflows);

    });

  });

  it('should execute workflow successfully', async () => {
    const mockResult = { success: true, output: 'done'};

    vi.spyOn(validatedApiClient.validatedApiClient, 'post').mockResolvedValue(mockResult);

    const { result } = renderHook(() => useWorkflowsValidated());

    await waitFor(async () => {
      const output = await result.current.executeWorkflow(1, { input: 'test' });

      expect(output).toEqual(mockResult);

    });

  });

});
