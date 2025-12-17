import { formatFileSize, getFileExtension, isImageFile, isVideoFile } from '@/lib/utils/fileUtils';

describe('fileUtils', () => {
  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');

      expect(formatFileSize(1048576)).toBe('1 MB');

      expect(formatFileSize(1073741824)).toBe('1 GB');

    });

    it('should handle zero', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');

    });

  });

  describe('getFileExtension', () => {
    it('should extract extension', () => {
      expect(getFileExtension('file.jpg')).toBe('jpg');

      expect(getFileExtension('document.pdf')).toBe('pdf');

      expect(getFileExtension('archive.tar.gz')).toBe('gz');

    });

    it('should handle no extension', () => {
      expect(getFileExtension('file')).toBe('');

    });

  });

  describe('isImageFile', () => {
    it('should identify image files', () => {
      expect(isImageFile('photo.jpg')).toBe(true);

      expect(isImageFile('image.png')).toBe(true);

      expect(isImageFile('graphic.svg')).toBe(true);

    });

    it('should reject non-image files', () => {
      expect(isImageFile('document.pdf')).toBe(false);

      expect(isImageFile('video.mp4')).toBe(false);

    });

  });

  describe('isVideoFile', () => {
    it('should identify video files', () => {
      expect(isVideoFile('movie.mp4')).toBe(true);

      expect(isVideoFile('clip.avi')).toBe(true);

    });

    it('should reject non-video files', () => {
      expect(isVideoFile('image.jpg')).toBe(false);

    });

  });

});
