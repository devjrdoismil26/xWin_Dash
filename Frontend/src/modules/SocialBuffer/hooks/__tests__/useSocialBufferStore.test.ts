import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSocialBufferStore } from '../useSocialBufferStore';

describe('useSocialBufferStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useSocialBufferStore());

    act(() => result.current.reset());

  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSocialBufferStore());

    expect(result.current.posts).toEqual([]);

    expect(result.current.loading).toBe(false);

  });

  it('should set posts', () => {
    const { result } = renderHook(() => useSocialBufferStore());

    const posts = [{ id: 1, content: 'Test post', status: 'scheduled' }];
    act(() => result.current.setPosts(posts));

    expect(result.current.posts).toEqual(posts);

  });

  it('should add post', () => {
    const { result } = renderHook(() => useSocialBufferStore());

    const post = { id: 1, content: 'New post', status: 'draft'};

    act(() => result.current.addPost(post));

    expect(result.current.posts).toHaveLength(1);

  });

  it('should update post', () => {
    const { result } = renderHook(() => useSocialBufferStore());

    act(() => {
      result.current.setPosts([{ id: 1, content: 'Old', status: 'draft' }]);

      result.current.updatePost(1, { content: 'Updated' });

    });

    expect(result.current.posts[0].content).toBe('Updated');

  });

  it('should delete post', () => {
    const { result } = renderHook(() => useSocialBufferStore());

    act(() => {
      result.current.setPosts([{ id: 1, content: 'P1' }, { id: 2, content: 'P2' }]);

      result.current.deletePost(1);

    });

    expect(result.current.posts).toHaveLength(1);

  });

  it('should filter by status', () => {
    const { result } = renderHook(() => useSocialBufferStore());

    act(() => {
      result.current.setPosts([
        { id: 1, status: 'published' },
        { id: 2, status: 'draft' }
      ]);

      result.current.setFilter({ status: 'published' });

    });

    expect(result.current.filteredPosts).toHaveLength(1);

  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useSocialBufferStore());

    act(() => result.current.setLoading(true));

    expect(result.current.loading).toBe(true);

  });

  it('should set error', () => {
    const { result } = renderHook(() => useSocialBufferStore());

    act(() => result.current.setError('Error'));

    expect(result.current.error).toBe('Error');

  });

});
