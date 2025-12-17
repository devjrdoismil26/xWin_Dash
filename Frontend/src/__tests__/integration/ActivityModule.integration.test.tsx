import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ActivityModule } from '@/modules/Activity';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={ queryClient }>{children}</QueryClientProvider>);

describe('ActivityModule Integration', () => {
  it('should render activity list', async () => {
    render(<ActivityModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/atividades/i)).toBeInTheDocument();

    });

  });

  it('should filter activities by type', async () => {
    render(<ActivityModule />, { wrapper });

    const filterButton = await screen.findByRole('button', { name: /filtrar/i });

    expect(filterButton).toBeInTheDocument();

  });

  it('should display activity timeline', async () => {
    render(<ActivityModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('activity-timeline')).toBeInTheDocument();

    });

  });

});
