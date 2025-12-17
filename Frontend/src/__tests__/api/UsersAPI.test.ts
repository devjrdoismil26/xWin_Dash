import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usersAPI } from '@/services/api/users';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  } ));

describe('UsersAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch users', async () => {
    const mockUsers = [{ id: '1', name: 'User 1', email: 'user1@test.com' }];
    vi.mocked(api.get).mockResolvedValue({ data: mockUsers });

    const result = await usersAPI.getUsers();

    expect(result).toEqual(mockUsers);

  });

  it('should get user by id', async () => {
    const mockUser = { id: '1', name: 'User 1'};

    vi.mocked(api.get).mockResolvedValue({ data: mockUser });

    const result = await usersAPI.getUser('1');

    expect(result).toEqual(mockUser);

    expect(api.get).toHaveBeenCalledWith('/users/1');

  });

  it('should update user profile', async () => {
    const updates = { name: 'Updated Name'};

    vi.mocked(api.put).mockResolvedValue({ data: { id: '1', ...updates } );

    await usersAPI.updateProfile('1', updates);

    expect(api.put).toHaveBeenCalledWith('/users/1', updates);

  });

});
