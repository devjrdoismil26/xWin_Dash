import { api } from '@/lib/api';

describe('Security: Products Module', () => {
  it('should validate product data', async () => {
    const invalidProduct = { name: '', price: -100 };
    await expect(api.post('/products', invalidProduct)).rejects.toThrow();
  });

  it('should prevent unauthorized product deletion', async () => {
    const unauthorizedApi = api.create({ headers: {} });
    await expect(unauthorizedApi.delete('/products/1')).rejects.toThrow();
  });
});
