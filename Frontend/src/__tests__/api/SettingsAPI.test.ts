import { describe, it, expect, vi, beforeEach } from 'vitest';
import { settingsAPI } from '@/services/api/settings';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
  } ));

describe('SettingsAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch settings', async () => {
    const mockSettings = { theme: 'dark', language: 'pt-BR'};

    vi.mocked(api.get).mockResolvedValue({ data: mockSettings });

    const result = await settingsAPI.getSettings();

    expect(result).toEqual(mockSettings);

  });

  it('should update settings', async () => {
    const updates = { theme: 'light'};

    vi.mocked(api.put).mockResolvedValue({ data: updates });

    await settingsAPI.updateSettings(updates);

    expect(api.put).toHaveBeenCalledWith('/settings', updates);

  });

  it('should get integrations', async () => {
    const mockIntegrations = [{ name: 'Google', connected: true }];
    vi.mocked(api.get).mockResolvedValue({ data: mockIntegrations });

    const result = await settingsAPI.getIntegrations();

    expect(result).toEqual(mockIntegrations);

  });

});
