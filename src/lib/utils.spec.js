import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cn, getImageUrl } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('p-4', 'bg-red-500')).toBe('p-4 bg-red-500');
    });

    it('should handle conditional classes', () => {
      expect(cn('p-4', true && 'bg-red-500', false && 'hidden')).toBe('p-4 bg-red-500');
    });

    it('should resolve tailwind conflicts', () => {
      // tailwind-merge should keep the last one
      expect(cn('p-4 p-8')).toBe('p-8');
    });
  });

  describe('getImageUrl', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      vi.resetModules();
      process.env = { ...originalEnv };
    });

    it('should return null if path is missing', () => {
      expect(getImageUrl(null)).toBeNull();
      expect(getImageUrl('')).toBeNull();
    });

    it('should return the path as-is if it starts with http', () => {
      const url = 'https://example.com/image.png';
      expect(getImageUrl(url)).toBe(url);
    });

    it('should return the path as-is if it is a data URL', () => {
      const url = 'data:image/png;base64,xxx';
      expect(getImageUrl(url)).toBe(url);
    });

    it('should return the path as-is if it is a blob URL', () => {
      const url = 'blob:http://localhost:3000/xxx';
      expect(getImageUrl(url)).toBe(url);
    });

    it('should prepend backend URL for relative paths', () => {
      process.env.NEXT_PUBLIC_BACKEND_URL = 'http://api.test';
      expect(getImageUrl('photo.jpg')).toBe('http://api.test/photo.jpg');
      expect(getImageUrl('/photo.jpg')).toBe('http://api.test/photo.jpg');
    });

    it('should use default backend URL if env is missing', () => {
      delete process.env.NEXT_PUBLIC_BACKEND_URL;
      expect(getImageUrl('photo.jpg')).toBe('http://localhost:3001/photo.jpg');
    });

    it('should handle backend URL with trailing slash correctly', () => {
      process.env.NEXT_PUBLIC_BACKEND_URL = 'http://api.test/';
      expect(getImageUrl('photo.jpg')).toBe('http://api.test/photo.jpg');
    });
  });
});
