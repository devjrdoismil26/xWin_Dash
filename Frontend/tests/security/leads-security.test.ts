import { api } from '@/lib/api';

describe('Security: Leads Module', () => {
  it('should validate lead data', async () => {
    const invalidLead = { email: 'invalid' };
    await expect(api.post('/leads', invalidLead)).rejects.toThrow();
  });
});
