import { api } from '@/lib/api';

describe('Security: SQL Injection', () => {
  it('should prevent SQL injection in queries', async () => {
    const maliciousInput = "1' OR '1'='1";
    const response = await api.get(`/products?id=${maliciousInput}`);
    expect(response.data).not.toContain('OR');
  });
});
