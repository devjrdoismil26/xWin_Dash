import { renderHook, waitFor } from '@testing-library/react';
import { useMedia } from '@/modules/Media/hooks/useMedia';
import { vi } from 'vitest';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} )),
  } ));

describe('useMedia', () => {
  it('should fetch media files', async () => {
    const { result } = renderHook(() => useMedia());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);

    });

    expect(result.current.files).toBeDefined();

  });

  it('should upload file', async () => {
    const { result } = renderHook(() => useMedia());

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

    await result.current.uploadFile(file);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);

    });

  });

  it('should delete file', async () => {
    const { result } = renderHook(() => useMedia());

    await result.current.deleteFile('1');

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);

    });

  });

});
