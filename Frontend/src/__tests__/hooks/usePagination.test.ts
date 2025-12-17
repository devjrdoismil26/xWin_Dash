import { renderHook, act } from '@testing-library/react';
import { usePagination } from '@/hooks/usePagination';

describe('usePagination', () => {
  it('should initialize with default page', () => {
    const { result } = renderHook(() => usePagination({ total: 100 }));

    expect(result.current.currentPage).toBe(1);

    expect(result.current.totalPages).toBe(10);

  });

  it('should go to next page', () => {
    const { result } = renderHook(() => usePagination({ total: 100 }));

    act(() => {
      result.current.nextPage();

    });

    expect(result.current.currentPage).toBe(2);

  });

  it('should go to previous page', () => {
    const { result } = renderHook(() => usePagination({ total: 100 }));

    act(() => {
      result.current.goToPage(3);

      result.current.previousPage();

    });

    expect(result.current.currentPage).toBe(2);

  });

  it('should not go beyond limits', () => {
    const { result } = renderHook(() => usePagination({ total: 100 }));

    act(() => {
      result.current.previousPage();

    });

    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.goToPage(10);

      result.current.nextPage();

    });

    expect(result.current.currentPage).toBe(10);

  });

});
