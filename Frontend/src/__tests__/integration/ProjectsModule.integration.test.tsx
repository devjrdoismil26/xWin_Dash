import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ProjectsModule } from '@/modules/Projects';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={ queryClient }>{children}</QueryClientProvider>);

describe('ProjectsModule Integration', () => {
  it('should render projects list', async () => {
    render(<ProjectsModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/projetos/i)).toBeInTheDocument();

    });

  });

  it('should create project', async () => {
    render(<ProjectsModule />, { wrapper });

    const button = await screen.findByRole('button', { name: /novo projeto/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();

    });

  });

  it('should switch projects', async () => {
    render(<ProjectsModule />, { wrapper });

    const projectCard = await screen.findByTestId('project-card');

    fireEvent.click(projectCard);

    await waitFor(() => {
      expect(screen.getByText(/projeto selecionado/i)).toBeInTheDocument();

    });

  });

});
