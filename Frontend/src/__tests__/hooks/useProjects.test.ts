import { renderHook, waitFor } from '@testing-library/react';
import { useProjects } from '@/modules/Projects/hooks/useProjects';
import { vi } from 'vitest';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} )),
  } ));

describe('useProjects', () => {
  it('should fetch projects', async () => {
    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);

    });

    expect(result.current.projects).toBeDefined();

  });

  it('should handle create project', async () => {
    const { result } = renderHook(() => useProjects());

    await result.current.createProject({ name: 'New Project', slug: 'new' });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);

    });

  });

  it('should handle errors', async () => {
    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.error).toBeNull();

    });

  });

});
