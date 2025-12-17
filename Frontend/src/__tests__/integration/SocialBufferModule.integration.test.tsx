import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { SocialBufferModule } from '@/modules/SocialBuffer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={ queryClient }>{children}</QueryClientProvider>);

describe('SocialBufferModule Integration', () => {
  it('should render social posts', async () => {
    render(<SocialBufferModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/posts/i)).toBeInTheDocument();

    });

  });

  it('should create post', async () => {
    render(<SocialBufferModule />, { wrapper });

    const button = await screen.findByRole('button', { name: /novo post/i });

    fireEvent.click(button);

    const textarea = screen.getByPlaceholderText(/conteúdo/i);

    fireEvent.change(textarea, { target: { value: 'Test post' } );

    const submitButton = screen.getByRole('button', { name: /publicar/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/post criado/i)).toBeInTheDocument();

    });

  });

  it('should schedule post', async () => {
    render(<SocialBufferModule />, { wrapper });

    const scheduleButton = await screen.findByRole('button', { name: /agendar/i });

    fireEvent.click(scheduleButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/data/i)).toBeInTheDocument();

    });

  });

});
