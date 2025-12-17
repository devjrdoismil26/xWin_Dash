import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeadsModule } from '@/modules/Leads';
import { leadsAPI } from '@/api/leads';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/api/leads');

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

describe('Leads Module Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should display leads list', async () => {
    const mockLeads = [
      { id: '1', name: 'Lead 1', email: 'lead1@test.com', status: 'new', score: 50 },
      { id: '2', name: 'Lead 2', email: 'lead2@test.com', status: 'qualified', score: 80 },
    ];

    vi.mocked(leadsAPI.getLeads).mockResolvedValue(mockLeads);

    render(<LeadsModule />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Lead 1')).toBeInTheDocument();

      expect(screen.getByText('Lead 2')).toBeInTheDocument();

    });

  });

  it('should create a new lead', async () => {
    vi.mocked(leadsAPI.getLeads).mockResolvedValue([]);

    vi.mocked(leadsAPI.createLead).mockResolvedValue({
      id: '3',
      name: 'New Lead',
      email: 'new@test.com',
      status: 'new',
      score: 0,
    });

    const user = userEvent.setup();

    render(<LeadsModule />, { wrapper: createWrapper() });

    const createButton = await screen.findByRole('button', { name: /create lead/i });

    await user.click(createButton);

    await user.type(screen.getByLabelText(/name/i), 'New Lead');

    await user.type(screen.getByLabelText(/email/i), 'new@test.com');

    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.click(submitButton);

    await waitFor(() => {
      expect(leadsAPI.createLead).toHaveBeenCalledWith({
        name: 'New Lead',
        email: 'new@test.com',
      });

    });

  });

  it('should filter leads by status', async () => {
    const mockLeads = [
      { id: '1', name: 'Lead 1', status: 'new' },
      { id: '2', name: 'Lead 2', status: 'qualified' },
    ];

    vi.mocked(leadsAPI.getLeads).mockResolvedValue(mockLeads);

    const user = userEvent.setup();

    render(<LeadsModule />, { wrapper: createWrapper() });

    const filterSelect = await screen.findByLabelText(/status/i);

    await user.selectOptions(filterSelect, 'qualified');

    await waitFor(() => {
      expect(leadsAPI.getLeads).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'qualified' }));

    });

  });

  it('should assign lead to user', async () => {
    const mockLeads = [
      { id: '1', name: 'Lead 1', assigned_to: null },
    ];

    vi.mocked(leadsAPI.getLeads).mockResolvedValue(mockLeads);

    vi.mocked(leadsAPI.assignLead).mockResolvedValue({
      id: '1',
      name: 'Lead 1',
      assigned_to: 'user-1',
    });

    const user = userEvent.setup();

    render(<LeadsModule />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Lead 1')).toBeInTheDocument();

    });

    const assignButton = screen.getByRole('button', { name: /assign/i });

    await user.click(assignButton);

    const userSelect = screen.getByLabelText(/assign to/i);

    await user.selectOptions(userSelect, 'user-1');

    const confirmButton = screen.getByRole('button', { name: /confirm/i });

    await user.click(confirmButton);

    await waitFor(() => {
      expect(leadsAPI.assignLead).toHaveBeenCalledWith('1', 'user-1');

    });

  });

  it('should delete a lead', async () => {
    const mockLeads = [
      { id: '1', name: 'Lead 1' },
    ];

    vi.mocked(leadsAPI.getLeads).mockResolvedValue(mockLeads);

    vi.mocked(leadsAPI.deleteLead).mockResolvedValue();

    const user = userEvent.setup();

    render(<LeadsModule />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Lead 1')).toBeInTheDocument();

    });

    const deleteButton = screen.getByRole('button', { name: /delete/i });

    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /confirm delete/i });

    await user.click(confirmButton);

    await waitFor(() => {
      expect(leadsAPI.deleteLead).toHaveBeenCalledWith('1');

    });

  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(leadsAPI.getLeads).mockRejectedValue(new Error('Network error'));

    render(<LeadsModule />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/error loading leads/i)).toBeInTheDocument();

    });

  });

  it('should paginate leads', async () => {
    const mockLeads = Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Lead ${i + 1}`,
      email: `lead${i + 1}@test.com`,
    }));

    vi.mocked(leadsAPI.getLeads).mockResolvedValue(mockLeads);

    const user = userEvent.setup();

    render(<LeadsModule />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Lead 1')).toBeInTheDocument();

    });

    const nextButton = screen.getByRole('button', { name: /next/i });

    await user.click(nextButton);

    await waitFor(() => {
      expect(leadsAPI.getLeads).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 }));

    });

  });

});
