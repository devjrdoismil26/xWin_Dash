import { describe, it, expect, vi, beforeEach } from 'vitest';
import { auraAPI } from '@/services/api/aura';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  } ));

describe('AuraAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch messages', async () => {
    const mockMessages = [{ id: '1', content: 'Hello', direction: 'inbound' }];
    vi.mocked(api.get).mockResolvedValue({ data: mockMessages });

    const result = await auraAPI.getMessages();

    expect(result).toEqual(mockMessages);

    expect(api.get).toHaveBeenCalledWith('/aura/messages');

  });

  it('should send message', async () => {
    const message = { to: '5511999999999', content: 'Test'};

    vi.mocked(api.post).mockResolvedValue({ data: { id: '1', ...message } );

    const result = await auraAPI.sendMessage(message);

    expect(result.content).toBe('Test');

    expect(api.post).toHaveBeenCalledWith('/aura/messages', message);

  });

  it('should get conversation', async () => {
    const mockConversation = { id: '1', messages: []};

    vi.mocked(api.get).mockResolvedValue({ data: mockConversation });

    const result = await auraAPI.getConversation('1');

    expect(result).toEqual(mockConversation);

  });

});
