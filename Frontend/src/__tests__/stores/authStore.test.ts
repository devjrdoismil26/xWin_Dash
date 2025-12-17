import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });

  });

  it('should login user', () => {
    const { result } = renderHook(() => useAuthStore());

    const mockUser = { id: '1', name: 'Test User', email: 'test@test.com'};

    act(() => {
      result.current.login(mockUser, 'token123');

    });

    expect(result.current.user).toEqual(mockUser);

    expect(result.current.token).toBe('token123');

    expect(result.current.isAuthenticated).toBe(true);

  });

  it('should logout user', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.login({ id: '1', name: 'Test' }, 'token');

      result.current.logout();

    });

    expect(result.current.user).toBeNull();

    expect(result.current.token).toBeNull();

    expect(result.current.isAuthenticated).toBe(false);

  });

  it('should update user', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.login({ id: '1', name: 'Old Name' }, 'token');

      result.current.updateUser({ name: 'New Name' });

    });

    expect(result.current.user?.name).toBe('New Name');

  });

});
