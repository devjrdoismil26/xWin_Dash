import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { EmailMarketingModule } from '@/modules/EmailMarketing';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={ queryClient }>{children}</QueryClientProvider>);

describe('EmailMarketingModule Integration', () => {
  it('should render campaigns list', async () => {
    render(<EmailMarketingModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/campanhas/i)).toBeInTheDocument();

    });

  });

  it('should create campaign', async () => {
    render(<EmailMarketingModule />, { wrapper });

    const button = await screen.findByRole('button', { name: /nova campanha/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByLabelText(/assunto/i)).toBeInTheDocument();

    });

  });

  it('should display campaign metrics', async () => {
    render(<EmailMarketingModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/taxa de abertura/i)).toBeInTheDocument();

      expect(screen.getByText(/cliques/i)).toBeInTheDocument();

    });

  });

});
