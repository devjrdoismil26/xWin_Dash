import { renderHook, waitFor } from '@testing-library/react';
import { useSocialPosts } from '@/modules/SocialBuffer/hooks/useSocialPosts';
import { vi } from 'vitest';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} )),
  } ));

describe('useSocialPosts', () => {
  it('should fetch social posts', async () => {
    const { result } = renderHook(() => useSocialPosts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);

    });

    expect(result.current.posts).toBeDefined();

  });

  it('should schedule post', async () => {
    const { result } = renderHook(() => useSocialPosts());

    await result.current.schedulePost({
      content: 'Test post',
      platform: 'facebook',
      scheduledAt: new Date()
  });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);

    });

  });

});
