import { renderHook, act } from '@testing-library/react';
import { useSocialBufferStore } from '@/stores/socialBufferStore';

describe('SocialBuffer Store', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSocialBufferStore());
    expect(result.current.posts).toEqual([]);
  });

  it('should add post', () => {
    const { result } = renderHook(() => useSocialBufferStore());
    act(() => {
      result.current.addPost({ id: '1', content: 'Test post', scheduledAt: new Date() });
    });
    expect(result.current.posts).toHaveLength(1);
  });

  it('should update post', () => {
    const { result } = renderHook(() => useSocialBufferStore());
    act(() => {
      result.current.addPost({ id: '1', content: 'Original', scheduledAt: new Date() });
      result.current.updatePost('1', { content: 'Updated' });
    });
    expect(result.current.posts[0].content).toBe('Updated');
  });
});
