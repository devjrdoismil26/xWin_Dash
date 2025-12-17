import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MediaModule } from '@/modules/Media';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={ queryClient }>{children}</QueryClientProvider>);

describe('MediaModule Integration', () => {
  it('should render media library', async () => {
    render(<MediaModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/biblioteca de mídia/i)).toBeInTheDocument();

    });

  });

  it('should upload file', async () => {
    render(<MediaModule />, { wrapper });

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

    const input = screen.getByLabelText(/upload/i);

    fireEvent.change(input, { target: { files: [file] } );

    await waitFor(() => {
      expect(screen.getByText(/enviando/i)).toBeInTheDocument();

    });

  });

  it('should filter by type', async () => {
    render(<MediaModule />, { wrapper });

    const filterButton = await screen.findByRole('button', { name: /imagens/i });

    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByTestId('media-grid')).toBeInTheDocument();

    });

  });

});
