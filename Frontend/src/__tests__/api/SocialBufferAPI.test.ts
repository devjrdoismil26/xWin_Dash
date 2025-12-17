import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/api/client';
import { socialBufferAPI } from '@/api/social-buffer';

vi.mock('@/api/client');

describe('Social Buffer API', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch posts', async () => {
    const mockPosts = [
      { id: '1', content: 'Post 1', platform: 'instagram', status: 'scheduled' },
      { id: '2', content: 'Post 2', platform: 'facebook', status: 'published' },
    ];

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockPosts });

    const result = await socialBufferAPI.getPosts({ platform: 'instagram' });

    expect(result).toEqual(mockPosts);

  });

  it('should create post', async () => {
    const newPost = {
      content: 'New post',
      platform: 'instagram',
      scheduled_at: '2025-12-01T10:00:00Z',
      media_urls: ['https://example.com/image.jpg'],};

    const mockResponse = { id: '3', ...newPost, status: 'scheduled'};

    vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

    const result = await socialBufferAPI.createPost(newPost);

    expect(result).toEqual(mockResponse);

  });

  it('should publish post immediately', async () => {
    const mockResponse = { id: '1', status: 'published'};

    vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

    const result = await socialBufferAPI.publishPost('1');

    expect(apiClient.post).toHaveBeenCalledWith('/social-posts/1/publish');

    expect(result).toEqual(mockResponse);

  });

});
