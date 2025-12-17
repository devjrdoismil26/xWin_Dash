import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { authAPI } from '@/api/auth';

vi.mock('@/api/auth');

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    localStorage.clear();

  });

  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();

    expect(result.current.isAuthenticated).toBe(false);

    expect(result.current.loading).toBe(false);

  });

  it('should login successfully', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',};

    const mockResponse = {
      token: 'mock-token',
      user: mockUser,};

    vi.mocked(authAPI.login).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('john@example.com', 'password');

    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);

      expect(result.current.isAuthenticated).toBe(true);

    });

    expect(localStorage.getItem('token')).toBe('mock-token');

  });

  it('should handle login error', async () => {
    vi.mocked(authAPI.login).mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      try {
        await result.current.login('wrong@example.com', 'wrong');

      } catch (error) {
        expect(error.message).toBe('Invalid credentials');

      } );

    expect(result.current.user).toBeNull();

    expect(result.current.isAuthenticated).toBe(false);

  });

  it('should logout successfully', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',};

    vi.mocked(authAPI.login).mockResolvedValue({
      token: 'mock-token',
      user: mockUser,
    });

    const { result } = renderHook(() => useAuth());

    // Login first
    await act(async () => {
      await result.current.login('john@example.com', 'password');

    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);

    });

    // Then logout
    await act(async () => {
      await result.current.logout();

    });

    expect(result.current.user).toBeNull();

    expect(result.current.isAuthenticated).toBe(false);

    expect(localStorage.getItem('token')).toBeNull();

  });

  it('should restore session from localStorage', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',};

    localStorage.setItem('token', 'existing-token');

    vi.mocked(authAPI.me).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);

      expect(result.current.isAuthenticated).toBe(true);

    });

  });

  it('should check user permissions', async () => {
    const mockUser = {
      id: '1',
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
      permissions: ['leads.create', 'leads.edit', 'products.view'],};

    vi.mocked(authAPI.login).mockResolvedValue({
      token: 'token',
      user: mockUser,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('admin@example.com', 'password');

    });

    await waitFor(() => {
      expect(result.current.hasPermission('leads.create')).toBe(true);

      expect(result.current.hasPermission('leads.delete')).toBe(false);

    });

  });

  it('should refresh token', async () => {
    const mockUser = { id: '1', name: 'User'};

    vi.mocked(authAPI.refreshToken).mockResolvedValue({
      token: 'new-token',
      user: mockUser,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.refreshToken();

    });

    expect(localStorage.getItem('token')).toBe('new-token');

  });

});
