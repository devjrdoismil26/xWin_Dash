import { api } from '@/lib/api';

describe('Security: Projects Module', () => {
  it('should validate project ownership', async () => {
    await expect(api.delete('/projects/999')).rejects.toThrow();
  });
});
