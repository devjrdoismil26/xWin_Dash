import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AuraModule } from '@/modules/Aura';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={ queryClient }>{children}</QueryClientProvider>);

describe('AuraModule Integration', () => {
  it('should render conversations list', async () => {
    render(<AuraModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/conversas/i)).toBeInTheDocument();

    });

  });

  it('should send message', async () => {
    render(<AuraModule />, { wrapper });

    const input = await screen.findByPlaceholderText(/digite sua mensagem/i);

    fireEvent.change(input, { target: { value: 'Test message' } );

    const sendButton = screen.getByRole('button', { name: /enviar/i });

    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(input).toHaveValue('');

    });

  });

  it('should display message history', async () => {
    render(<AuraModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('message-list')).toBeInTheDocument();

    });

  });

});
