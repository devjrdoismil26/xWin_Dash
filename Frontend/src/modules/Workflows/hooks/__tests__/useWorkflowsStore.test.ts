import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWorkflowsStore } from '../useWorkflowsStore';

describe('useWorkflowsStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useWorkflowsStore());

    act(() => result.current.reset());

  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useWorkflowsStore());

    expect(result.current.workflows).toEqual([]);

    expect(result.current.loading).toBe(false);

  });

  it('should set workflows', () => {
    const { result } = renderHook(() => useWorkflowsStore());

    const workflows = [{ id: 1, name: 'Test Workflow', status: 'active' }];
    act(() => result.current.setWorkflows(workflows));

    expect(result.current.workflows).toEqual(workflows);

  });

  it('should add workflow', () => {
    const { result } = renderHook(() => useWorkflowsStore());

    const workflow = { id: 1, name: 'New Workflow', status: 'draft'};

    act(() => result.current.addWorkflow(workflow));

    expect(result.current.workflows).toHaveLength(1);

  });

  it('should update workflow', () => {
    const { result } = renderHook(() => useWorkflowsStore());

    act(() => {
      result.current.setWorkflows([{ id: 1, name: 'Old', status: 'draft' }]);

      result.current.updateWorkflow(1, { name: 'Updated' });

    });

    expect(result.current.workflows[0].name).toBe('Updated');

  });

  it('should delete workflow', () => {
    const { result } = renderHook(() => useWorkflowsStore());

    act(() => {
      result.current.setWorkflows([{ id: 1, name: 'W1' }, { id: 2, name: 'W2' }]);

      result.current.deleteWorkflow(1);

    });

    expect(result.current.workflows).toHaveLength(1);

  });

  it('should filter by status', () => {
    const { result } = renderHook(() => useWorkflowsStore());

    act(() => {
      result.current.setWorkflows([
        { id: 1, status: 'active' },
        { id: 2, status: 'draft' }
      ]);

      result.current.setFilter({ status: 'active' });

    });

    expect(result.current.filteredWorkflows).toHaveLength(1);

  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useWorkflowsStore());

    act(() => result.current.setLoading(true));

    expect(result.current.loading).toBe(true);

  });

  it('should set error', () => {
    const { result } = renderHook(() => useWorkflowsStore());

    act(() => result.current.setError('Error'));

    expect(result.current.error).toBe('Error');

  });

});
