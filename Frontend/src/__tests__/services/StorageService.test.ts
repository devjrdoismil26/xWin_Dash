import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '@/services/storageService';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();

    sessionStorage.clear();

  });

  describe('localStorage', () => {
    it('should set and get item', () => {
      storageService.set('key', 'value');

      expect(storageService.get('key')).toBe('value');

    });

    it('should set and get object', () => {
      const obj = { name: 'Test', id: 1};

      storageService.set('obj', obj);

      expect(storageService.get('obj')).toEqual(obj);

    });

    it('should remove item', () => {
      storageService.set('key', 'value');

      storageService.remove('key');

      expect(storageService.get('key')).toBeNull();

    });

    it('should clear all items', () => {
      storageService.set('key1', 'value1');

      storageService.set('key2', 'value2');

      storageService.clear();

      expect(storageService.get('key1')).toBeNull();

      expect(storageService.get('key2')).toBeNull();

    });

  });

  describe('sessionStorage', () => {
    it('should use session storage', () => {
      storageService.setSession('key', 'value');

      expect(storageService.getSession('key')).toBe('value');

    });

    it('should remove session item', () => {
      storageService.setSession('key', 'value');

      storageService.removeSession('key');

      expect(storageService.getSession('key')).toBeNull();

    });

  });

  describe('token management', () => {
    it('should set and get auth token', () => {
      storageService.setToken('test-token');

      expect(storageService.getToken()).toBe('test-token');

    });

    it('should remove token', () => {
      storageService.setToken('test-token');

      storageService.removeToken();

      expect(storageService.getToken()).toBeNull();

    });

  });

});
