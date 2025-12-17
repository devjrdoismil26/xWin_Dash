import { renderHook, act } from '@testing-library/react';
import { useNotifications } from '@/hooks/useNotifications';

describe('useNotifications', () => {
  it('should add notification', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({ message: 'Test', type: 'success' });

    });

    expect(result.current.notifications).toHaveLength(1);

    expect(result.current.notifications[0].message).toBe('Test');

  });

  it('should remove notification', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({ id: '1', message: 'Test' });

      result.current.removeNotification('1');

    });

    expect(result.current.notifications).toHaveLength(0);

  });

  it('should clear all notifications', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({ message: 'Test 1' });

      result.current.addNotification({ message: 'Test 2' });

      result.current.clearAll();

    });

    expect(result.current.notifications).toHaveLength(0);

  });

});
