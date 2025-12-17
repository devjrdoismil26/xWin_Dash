import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkflowsModule } from '@/modules/Workflows';
import { workflowsAPI } from '@/api/workflows';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/api/workflows');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={ queryClient } />
      {children}
    </QueryClientProvider>);};

describe('Workflows Module Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should display workflows list', async () => {
    const mockWorkflows = [
      { id: '1', name: 'Lead Automation', status: 'active', execution_count: 100 },
      { id: '2', name: 'Email Follow-up', status: 'draft', execution_count: 0 },
    ];

    vi.mocked(workflowsAPI.getWorkflows).mockResolvedValue(mockWorkflows);

    render(<WorkflowsModule />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Lead Automation')).toBeInTheDocument();

      expect(screen.getByText('Email Follow-up')).toBeInTheDocument();

    });

  });

  it('should create new workflow', async () => {
    vi.mocked(workflowsAPI.getWorkflows).mockResolvedValue([]);

    vi.mocked(workflowsAPI.createWorkflow).mockResolvedValue({
      id: '3',
      name: 'New Workflow',
      status: 'draft',
      trigger_type: 'manual',
    });

    const user = userEvent.setup();

    render(<WorkflowsModule />, { wrapper: createWrapper() });

    const createButton = await screen.findByRole('button', { name: /create workflow/i });

    await user.click(createButton);

    await user.type(screen.getByLabelText(/name/i), 'New Workflow');

    const triggerSelect = screen.getByLabelText(/trigger type/i);

    await user.selectOptions(triggerSelect, 'manual');

    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.click(submitButton);

    await waitFor(() => {
      expect(workflowsAPI.createWorkflow).toHaveBeenCalled();

    });

  });

  it('should execute workflow', async () => {
    const mockWorkflows = [
      { id: '1', name: 'Workflow 1', status: 'active' },
    ];

    vi.mocked(workflowsAPI.getWorkflows).mockResolvedValue(mockWorkflows);

    vi.mocked(workflowsAPI.executeWorkflow).mockResolvedValue({
      execution_id: 'exec-1',
      status: 'running',
    });

    const user = userEvent.setup();

    render(<WorkflowsModule />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Workflow 1')).toBeInTheDocument();

    });

    const executeButton = screen.getByRole('button', { name: /execute/i });

    await user.click(executeButton);

    await waitFor(() => {
      expect(workflowsAPI.executeWorkflow).toHaveBeenCalledWith('1', expect.any(Object));

    });

  });

  it('should view execution history', async () => {
    const mockWorkflows = [
      { id: '1', name: 'Workflow 1' },
    ];

    const mockExecutions = [
      { id: 'exec-1', status: 'completed', started_at: '2025-11-28T10:00:00Z' },
      { id: 'exec-2', status: 'failed', started_at: '2025-11-28T11:00:00Z' },
    ];

    vi.mocked(workflowsAPI.getWorkflows).mockResolvedValue(mockWorkflows);

    vi.mocked(workflowsAPI.getExecutions).mockResolvedValue(mockExecutions);

    const user = userEvent.setup();

    render(<WorkflowsModule />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Workflow 1')).toBeInTheDocument();

    });

    const historyButton = screen.getByRole('button', { name: /history/i });

    await user.click(historyButton);

    await waitFor(() => {
      expect(screen.getByText(/completed/i)).toBeInTheDocument();

      expect(screen.getByText(/failed/i)).toBeInTheDocument();

    });

  });

  it('should filter workflows by status', async () => {
    const mockWorkflows = [
      { id: '1', status: 'active' },
      { id: '2', status: 'draft' },
    ];

    vi.mocked(workflowsAPI.getWorkflows).mockResolvedValue(mockWorkflows);

    const user = userEvent.setup();

    render(<WorkflowsModule />, { wrapper: createWrapper() });

    const filterSelect = await screen.findByLabelText(/status/i);

    await user.selectOptions(filterSelect, 'active');

    await waitFor(() => {
      expect(workflowsAPI.getWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'active' }));

    });

  });

});
