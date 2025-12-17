import { describe, it, expect, vi } from 'vitest';

const debounce = (fn: Function, delay: number) => {
  let timer: unknown;
  return (...args: string[]) => {
    clearTimeout(timer);

    timer = setTimeout(() => fn(...args), delay);};
};

const throttle = (fn: Function, limit: number) => {
  let inThrottle: boolean;
  return (...args: string[]) => {
    if (!inThrottle) {
      fn(...args);

      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);

    } ;
};

const deepClone = (obj: unknown) => JSON.parse(JSON.stringify(obj));

const mergeObjects = (obj1: unknown, obj2: unknown) => ({ ...obj1, ...obj2 });

const arrayUnique = (arr: string[]) => [...new Set(arr)];

describe('helpers', () => {
  describe('debounce', () => {
    it('should delay function execution', async () => {
      const fn = vi.fn();

      const debounced = debounce(fn, 100);

      debounced();

      expect(fn).not.toHaveBeenCalled();

      await new Promise(r => setTimeout(r, 150));

      expect(fn).toHaveBeenCalled();

    });

  });

  describe('throttle', () => {
    it('should limit function calls', () => {
      const fn = vi.fn();

      const throttled = throttle(fn, 100);

      throttled();

      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

    });

  });

  describe('deepClone', () => {
    it('should clone object deeply', () => {
      const obj = { a: 1, b: { c: 2 } ;

      const cloned = deepClone(obj);

      cloned.b.c = 3;
      expect(obj.b.c).toBe(2);

    });

  });

  describe('mergeObjects', () => {
    it('should merge two objects', () => {
      expect(mergeObjects({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });

    });

  });

  describe('arrayUnique', () => {
    it('should remove duplicates', () => {
      expect(arrayUnique([1, 2, 2, 3])).toEqual([1, 2, 3]);

    });

  });

});
