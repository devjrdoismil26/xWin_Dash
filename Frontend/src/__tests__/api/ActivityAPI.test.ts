import { describe, it, expect, vi, beforeEach } from 'vitest';
import { activityAPI } from '@/services/api/activity';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  } ));

describe('ActivityAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch activities', async () => {
    const mockActivities = [
      { id: '1', type: 'lead_created', description: 'New lead' }
    ];
    vi.mocked(api.get).mockResolvedValue({ data: mockActivities });

    const result = await activityAPI.getActivities();

    expect(result).toEqual(mockActivities);

    expect(api.get).toHaveBeenCalledWith('/activities');

  });

  it('should filter by type', async () => {
    const mockActivities = [{ id: '1', type: 'lead_created' }];
    vi.mocked(api.get).mockResolvedValue({ data: mockActivities });

    await activityAPI.getActivities({ type: 'lead_created' });

    expect(api.get).toHaveBeenCalledWith('/activities', {
      params: { type: 'lead_created' } );

  });

  it('should log activity', async () => {
    const activity = { type: 'user_login', description: 'User logged in'};

    vi.mocked(api.post).mockResolvedValue({ data: { id: '1', ...activity } );

    await activityAPI.logActivity(activity);

    expect(api.post).toHaveBeenCalledWith('/activities', activity);

  });

});
