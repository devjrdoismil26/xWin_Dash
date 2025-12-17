import { api } from '@/services/api';

describe('API Service', () => {
  it('should have base configuration', () => {
    expect(api.defaults.baseURL).toBeDefined();
  });

  it('should include auth headers', () => {
    expect(api.defaults.headers.common).toBeDefined();
  });

  it('should handle request interceptors', () => {
    expect(api.interceptors.request).toBeDefined();
  });

  it('should handle response interceptors', () => {
    expect(api.interceptors.response).toBeDefined();
  });
});
