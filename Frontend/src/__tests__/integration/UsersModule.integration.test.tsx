import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { UsersModule } from '@/modules/Users';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={ queryClient }>{children}</QueryClientProvider>);

describe('UsersModule Integration', () => {
  it('should render users list', async () => {
    render(<UsersModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/usuários/i)).toBeInTheDocument();

    });

  });

  it('should invite user', async () => {
    render(<UsersModule />, { wrapper });

    const button = await screen.findByRole('button', { name: /convidar/i });

    fireEvent.click(button);

    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(emailInput, { target: { value: 'new@user.com' } );

    const submitButton = screen.getByRole('button', { name: /enviar convite/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/convite enviado/i)).toBeInTheDocument();

    });

  });

  it('should manage user roles', async () => {
    render(<UsersModule />, { wrapper });

    const roleButton = await screen.findByTestId('user-role-button');

    fireEvent.click(roleButton);

    await waitFor(() => {
      expect(screen.getByText(/admin/i)).toBeInTheDocument();

    });

  });

});
