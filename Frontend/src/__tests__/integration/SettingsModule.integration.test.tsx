import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { SettingsModule } from '@/modules/Settings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={ queryClient }>{children}</QueryClientProvider>);

describe('SettingsModule Integration', () => {
  it('should render settings tabs', async () => {
    render(<SettingsModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/geral/i)).toBeInTheDocument();

      expect(screen.getByText(/integrações/i)).toBeInTheDocument();

    });

  });

  it('should save general settings', async () => {
    render(<SettingsModule />, { wrapper });

    const saveButton = await screen.findByRole('button', { name: /salvar/i });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/salvo com sucesso/i)).toBeInTheDocument();

    });

  });

  it('should manage integrations', async () => {
    render(<SettingsModule />, { wrapper });

    const integrationsTab = screen.getByText(/integrações/i);

    fireEvent.click(integrationsTab);

    await waitFor(() => {
      expect(screen.getByText(/google/i)).toBeInTheDocument();

    });

  });

});
