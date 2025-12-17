import { performance } from 'perf_hooks';
import { api } from '@/lib/api';

describe('Performance: API Response Time', () => {
  it('should respond in under 200ms', async () => {
    const start = performance.now();
    await api.get('/products');
    const end = performance.now();
    expect(end - start).toBeLessThan(200);
  });
});
