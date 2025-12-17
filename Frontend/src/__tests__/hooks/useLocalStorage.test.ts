import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();

  });

  it('should set and get value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));

    expect(result.current[0]).toBe('default');

    act(() => {
      result.current[1]('new value');

    });

    expect(result.current[0]).toBe('new value');

    expect(localStorage.getItem('key')).toBe(JSON.stringify('new value'));

  });

  it('should use initial value if key not exists', () => {
    const { result } = renderHook(() => useLocalStorage('newKey', 'initial'));

    expect(result.current[0]).toBe('initial');

  });

  it('should handle objects', () => {
    const { result } = renderHook(() => 
      useLocalStorage('objKey', { name: 'Test' }));

    act(() => {
      result.current[1]({ name: 'Updated' });

    });

    expect(result.current[0]).toEqual({ name: 'Updated' });

  });

});
