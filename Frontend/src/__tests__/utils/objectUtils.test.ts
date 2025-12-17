import { deepClone, deepMerge, pick, omit } from '@/lib/utils/objectUtils';

describe('objectUtils', () => {
  describe('deepClone', () => {
    it('should clone object deeply', () => {
      const obj = { a: 1, b: { c: 2 } ;

      const cloned = deepClone(obj);

      cloned.b.c = 3;
      expect(obj.b.c).toBe(2);

    });

    it('should clone arrays', () => {
      const arr = [1, [2, 3]];
      const cloned = deepClone(arr);

      cloned[1][0] = 4;
      expect(arr[1][0]).toBe(2);

    });

  });

  describe('deepMerge', () => {
    it('should merge objects deeply', () => {
      const obj1 = { a: 1, b: { c: 2 } ;

      const obj2 = { b: { d: 3 }, e: 4};

      const result = deepMerge(obj1, obj2);

      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });

    });

  });

  describe('pick', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3};

      const result = pick(obj, ['a', 'c']);

      expect(result).toEqual({ a: 1, c: 3 });

    });

  });

  describe('omit', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3};

      const result = omit(obj, ['b']);

      expect(result).toEqual({ a: 1, c: 3 });

    });

  });

});
