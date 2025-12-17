import { renderHook, act } from '@testing-library/react';
import { useUniverseStore } from '@/stores/universeStore';

describe('Universe Store', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useUniverseStore());
    expect(result.current.universes).toEqual([]);
  });

  it('should add universe', () => {
    const { result } = renderHook(() => useUniverseStore());
    act(() => {
      result.current.addUniverse({ id: '1', name: 'Test Universe' });
    });
    expect(result.current.universes).toHaveLength(1);
  });

  it('should remove universe', () => {
    const { result } = renderHook(() => useUniverseStore());
    act(() => {
      result.current.addUniverse({ id: '1', name: 'Test' });
      result.current.removeUniverse('1');
    });
    expect(result.current.universes).toHaveLength(0);
  });
});
