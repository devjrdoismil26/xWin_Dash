import { describe, it, expect, vi, beforeEach } from 'vitest';
import { integrationsAPI } from '@/services/api/integrations';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  } ));

describe('IntegrationsAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch integrations', async () => {
    const mockIntegrations = [
      { id: '1', name: 'Google', connected: true }
    ];
    vi.mocked(api.get).mockResolvedValue({ data: mockIntegrations });

    const result = await integrationsAPI.getIntegrations();

    expect(result).toEqual(mockIntegrations);

  });

  it('should connect integration', async () => {
    const credentials = { apiKey: 'key123'};

    vi.mocked(api.post).mockResolvedValue({ data: { success: true } );

    await integrationsAPI.connect('google', credentials);

    expect(api.post).toHaveBeenCalledWith('/integrations/google/connect', credentials);

  });

  it('should disconnect integration', async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: { success: true } );

    await integrationsAPI.disconnect('google');

    expect(api.delete).toHaveBeenCalledWith('/integrations/google');

  });

});
