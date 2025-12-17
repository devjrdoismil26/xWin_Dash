import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mediaAPI } from '@/services/api/media';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  } ));

describe('MediaAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch media files', async () => {
    const mockFiles = [{ id: '1', filename: 'image.jpg', type: 'image' }];
    vi.mocked(api.get).mockResolvedValue({ data: mockFiles });

    const result = await mediaAPI.getFiles();

    expect(result).toEqual(mockFiles);

  });

  it('should upload file', async () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

    const formData = new FormData();

    formData.append('file', file);

    vi.mocked(api.post).mockResolvedValue({ data: { id: '1', filename: 'test.jpg' } );

    const result = await mediaAPI.uploadFile(formData);

    expect(result.filename).toBe('test.jpg');

  });

  it('should delete file', async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: { success: true } );

    await mediaAPI.deleteFile('1');

    expect(api.delete).toHaveBeenCalledWith('/media/1');

  });

});
