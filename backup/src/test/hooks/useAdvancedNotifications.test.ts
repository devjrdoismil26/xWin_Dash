import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock setTimeout and clearTimeout
vi.useFakeTimers();

describe('useAdvancedNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('initializes with empty notifications', () => {
    const { result } = renderHook(() => useAdvancedNotifications());

    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
  });

  it('adds notification successfully', () => {
    const { result } = renderHook(() => useAdvancedNotifications());

    act(() => {
      result.current.addNotification({
        id: '1',
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'info',
        timestamp: new Date().toISOString(),
      });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].title).toBe('Test Notification');
    expect(result.current.unreadCount).toBe(1);
  });

  it('adds notification with auto-dismiss', () => {
    const { result } = renderHook(() => useAdvancedNotifications());

    act(() => {
      result.current.addNotification({
        id: '1',
        title: 'Auto Dismiss',
        message: 'This will auto dismiss',
        type: 'success',
        autoDismiss: true,
        dismissAfter: 5000,
      });
    });

    expect(result.current.notifications).toHaveLength(1);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('removes notification by id', () => {
    const { result } = renderHook(() => useAdvancedNotifications());

    act(() => {
      result.current.addNotification({
        id: '1',
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'info',
      });
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      result.current.removeNotification('1');
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('marks notification as read', () => {
    const { result } = renderHook(() => useAdvancedNotifications());

    act(() => {
      result.current.addNotification({
        id: '1',
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'info',
      });
    });

    expect(result.current.unreadCount).toBe(1);

    act(() => {
      result.current.markAsRead('1');
    });

    expect(result.current.unreadCount).toBe(0);
    expect(result.current.notifications[0].read).toBe(true);
  });

  it('marks all notifications as read', () => {
    const { result } = renderHook(() => useAdvancedNotifications());

    act(() => {
      result.current.addNotification({
        id: '1',
        title: 'Test Notification 1',
        message: 'This is a test notification',
        type: 'info',
      });
      result.current.addNotification({
        id: '2',
        title: 'Test Notification 2',
        message: 'This is another test notification',
        type: 'warning',
      });
    });

    expect(result.current.unreadCount).toBe(2);

    act(() => {
      result.current.markAllAsRead();
    });

    expect(result.current.unreadCount).toBe(0);
    expect(result.current.notifications.every(n => n.read)).toBe(true);
  });

  it('clears all notifications', () => {
    const { result } = renderHook(() => useAdvancedNotifications());

    act(() => {
      result.current.addNotification({
        id: '1',
        title: 'Test Notification 1',
        message: 'This is a test notification',
        type: 'info',
      });
      result.current.addNotification({
        id: '2',
        title: 'Test Notification 2',
        message: 'This is another test notification',
        type: 'warning',
      });
    });

    expect(result.current.notifications).toHaveLength(2);

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.notifications).toHaveLength(0);
    expect(result.current.unreadCount).toBe(0);
  });

  it('filters notifications by type', () => {
    const { result } = renderHook(() => useAdvancedNotifications());

    act(() => {
      result.current.addNotification({
        id: '1',
        title: 'Info Notification',
        message: 'This is an info notification',
        type: 'info',
      });
      result.current.addNotification({
        id: '2',
        title: 'Error Notification',
        message: 'This is an error notification',
        type: 'error',
      });
      result.current.addNotification({
        id: '3',
        title: 'Success Notification',
        message: 'This is a success notification',
        type: 'success',
      });
    });

    const infoNotifications = result.current.getNotificationsByType('info');
    const errorNotifications = result.current.getNotificationsByType('error');

    expect(infoNotifications).toHaveLength(1);
    expect(infoNotifications[0].type).toBe('info');
    expect(errorNotifications).toHaveLength(1);
    expect(errorNotifications[0].type).toBe('error');
  });

  it('persists notifications to localStorage', () => {
    const { result } = renderHook(() => useAdvancedNotifications());

    act(() => {
      result.current.addNotification({
        id: '1',
        title: 'Persistent Notification',
        message: 'This notification should persist',
        type: 'info',
        persistent: true,
      });
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'notifications',
      expect.stringContaining('Persistent Notification')
    );
  });

  it('loads notifications from localStorage on init', () => {
    const savedNotifications = JSON.stringify([
      {
        id: '1',
        title: 'Saved Notification',
        message: 'This notification was saved',
        type: 'info',
        timestamp: new Date().toISOString(),
        read: false,
      }
    ]);

    localStorageMock.getItem.mockReturnValue(savedNotifications);

    const { result } = renderHook(() => useAdvancedNotifications());

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].title).toBe('Saved Notification');
  });

  it('handles notification actions', () => {
    const mockAction = vi.fn();
    const { result } = renderHook(() => useAdvancedNotifications());

    act(() => {
      result.current.addNotification({
        id: '1',
        title: 'Action Notification',
        message: 'This notification has an action',
        type: 'info',
        actions: [
          {
            label: 'View Details',
            action: mockAction,
          }
        ],
      });
    });

    act(() => {
      result.current.executeNotificationAction('1', 0);
    });

    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('handles notification priority', () => {
    const { result } = renderHook(() => useAdvancedNotifications());

    act(() => {
      result.current.addNotification({
        id: '1',
        title: 'Low Priority',
        message: 'This is a low priority notification',
        type: 'info',
        priority: 'low',
      });
      result.current.addNotification({
        id: '2',
        title: 'High Priority',
        message: 'This is a high priority notification',
        type: 'error',
        priority: 'high',
      });
    });

    // High priority notifications should appear first
    expect(result.current.notifications[0].priority).toBe('high');
    expect(result.current.notifications[1].priority).toBe('low');
  });

  it('handles notification grouping', () => {
    const { result } = renderHook(() => useAdvancedNotifications());

    act(() => {
      result.current.addNotification({
        id: '1',
        title: 'Grouped Notification 1',
        message: 'This is a grouped notification',
        type: 'info',
        group: 'updates',
      });
      result.current.addNotification({
        id: '2',
        title: 'Grouped Notification 2',
        message: 'This is another grouped notification',
        type: 'info',
        group: 'updates',
      });
    });

    const groupedNotifications = result.current.getNotificationsByGroup('updates');
    expect(groupedNotifications).toHaveLength(2);
    expect(groupedNotifications.every(n => n.group === 'updates')).toBe(true);
  });

  it('limits maximum number of notifications', () => {
    const { result } = renderHook(() => useAdvancedNotifications({ maxNotifications: 2 }));

    act(() => {
      result.current.addNotification({
        id: '1',
        title: 'Notification 1',
        message: 'First notification',
        type: 'info',
      });
      result.current.addNotification({
        id: '2',
        title: 'Notification 2',
        message: 'Second notification',
        type: 'info',
      });
      result.current.addNotification({
        id: '3',
        title: 'Notification 3',
        message: 'Third notification',
        type: 'info',
      });
    });

    expect(result.current.notifications).toHaveLength(2);
    // The oldest notification should be removed
    expect(result.current.notifications.find(n => n.id === '1')).toBeUndefined();
  });

  it('handles notification sound', () => {
    const { result } = renderHook(() => useAdvancedNotifications());

    // Mock Audio
    const mockPlay = vi.fn();
    global.Audio = vi.fn().mockImplementation(() => ({
      play: mockPlay,
    }));

    act(() => {
      result.current.addNotification({
        id: '1',
        title: 'Sound Notification',
        message: 'This notification has sound',
        type: 'info',
        sound: true,
      });
    });

    expect(mockPlay).toHaveBeenCalled();
  });
});
