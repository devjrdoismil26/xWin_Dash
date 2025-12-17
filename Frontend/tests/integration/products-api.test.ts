import { api } from '@/lib/api';

describe('Integration: Products API', () => {
  it('should fetch products', async () => {
    const response = await api.get('/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should create product', async () => {
    const product = { name: 'Test', price: 100, stock: 10 };
    const response = await api.post('/products', product);
    expect(response.status).toBe(201);
  });
});
