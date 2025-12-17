import { groupBy, sortBy, unique, chunk } from '@/lib/utils/arrayUtils';

describe('arrayUtils', () => {
  describe('groupBy', () => {
    it('should group array by key', () => {
      const data = [
        { type: 'A', value: 1 },
        { type: 'B', value: 2 },
        { type: 'A', value: 3 },
      ];
      
      const result = groupBy(data, 'type');

      expect(result.A).toHaveLength(2);

      expect(result.B).toHaveLength(1);

    });

  });

  describe('sortBy', () => {
    it('should sort array by key', () => {
      const data = [
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 },
      ];
      
      const result = sortBy(data, 'name');

      expect(result[0].name).toBe('Alice');

      expect(result[2].name).toBe('Charlie');

    });

    it('should sort descending', () => {
      const data = [{ age: 25 }, { age: 35 }, { age: 30 }];
      
      const result = sortBy(data, 'age', 'desc');

      expect(result[0].age).toBe(35);

    });

  });

  describe('unique', () => {
    it('should remove duplicates', () => {
      const data = [1, 2, 2, 3, 3, 3, 4];
      
      const result = unique(data);

      expect(result).toEqual([1, 2, 3, 4]);

    });

    it('should remove duplicate objects by key', () => {
      const data = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 1, name: 'C' },
      ];
      
      const result = unique(data, 'id');

      expect(result).toHaveLength(2);

    });

  });

  describe('chunk', () => {
    it('should split array into chunks', () => {
      const data = [1, 2, 3, 4, 5, 6, 7];
      
      const result = chunk(data, 3);

      expect(result).toHaveLength(3);

      expect(result[0]).toEqual([1, 2, 3]);

      expect(result[2]).toEqual([7]);

    });

  });

});
