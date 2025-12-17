import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DashboardModule } from '@/modules/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={ queryClient }>{children}</QueryClientProvider>);

describe('DashboardModule Integration', () => {
  it('should render dashboard', async () => {
    render(<DashboardModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();

    });

  });

  it('should display metrics', async () => {
    render(<DashboardModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/leads/i)).toBeInTheDocument();

      expect(screen.getByText(/receita/i)).toBeInTheDocument();

    });

  });

  it('should render widgets', async () => {
    render(<DashboardModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-widgets')).toBeInTheDocument();

    });

  });

});
