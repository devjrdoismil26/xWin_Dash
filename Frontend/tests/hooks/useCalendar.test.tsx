import { renderHook, act } from '@testing-library/react';
import { useCalendar } from '@/hooks/useCalendar';

describe('useCalendar Hook', () => {
  it('should initialize with current month', () => {
    const { result } = renderHook(() => useCalendar());
    expect(result.current.currentMonth).toBeDefined();
  });

  it('should navigate to next month', () => {
    const { result } = renderHook(() => useCalendar());
    const initialMonth = result.current.currentMonth;
    act(() => {
      result.current.nextMonth();
    });
    expect(result.current.currentMonth).not.toBe(initialMonth);
  });

  it('should navigate to previous month', () => {
    const { result } = renderHook(() => useCalendar());
    act(() => {
      result.current.previousMonth();
    });
    expect(result.current.currentMonth).toBeDefined();
  });
});
