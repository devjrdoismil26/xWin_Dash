import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ADSToolModule } from '@/modules/ADStool';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={ queryClient }>{children}</QueryClientProvider>);

describe('ADSToolModule Integration', () => {
  it('should render campaigns list', async () => {
    render(<ADSToolModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/campanhas/i)).toBeInTheDocument();

    });

  });

  it('should open create campaign modal', async () => {
    render(<ADSToolModule />, { wrapper });

    const createButton = await screen.findByRole('button', { name: /criar campanha/i });

    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();

    });

  });

  it('should display campaign metrics', async () => {
    render(<ADSToolModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/impressões/i)).toBeInTheDocument();

      expect(screen.getByText(/cliques/i)).toBeInTheDocument();

    });

  });

});
