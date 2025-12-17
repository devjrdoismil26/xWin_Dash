import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoginPage } from '@/modules/Auth/pages/LoginPage';
import { api } from '@/services/api';

jest.mock('@/services/api');

describe('Integration - Auth Complete Flow', () => {
  it('should complete login flow', async () => {
    api.post.mockResolvedValue({ data: { token: 'test-token', user: { id: '1', name: 'John' } } });
    
    const { getByLabelText, getByRole } = render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );
    
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        password: 'password',
      });
    });
  });

  it('should handle login error', async () => {
    api.post.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });
    
    const { getByLabelText, getByRole, getByText } = render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );
    
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
