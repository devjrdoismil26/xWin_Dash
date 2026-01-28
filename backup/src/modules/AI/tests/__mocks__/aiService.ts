/**
 * Mocks para o aiService
 */

export const mockAIService = {
  getServicesStatus: jest.fn().mockResolvedValue({
    success: true,
    data: {
      openai: { status: 'active', lastCheck: '2024-01-01T00:00:00Z' },
      dalle: { status: 'active', lastCheck: '2024-01-01T00:00:00Z' },
      claude: { status: 'inactive', lastCheck: '2024-01-01T00:00:00Z' }
    }
  }),

  generateText: jest.fn().mockResolvedValue({
    success: true,
    data: {
      id: '1',
      text: 'Generated text response',
      provider: 'openai',
      timestamp: '2024-01-01T00:00:00Z'
    }
  }),

  generateImage: jest.fn().mockResolvedValue({
    success: true,
    data: {
      id: '1',
      imageUrl: 'https://example.com/generated-image.jpg',
      provider: 'dalle',
      timestamp: '2024-01-01T00:00:00Z'
    }
  }),

  generateVideo: jest.fn().mockResolvedValue({
    success: true,
    data: {
      id: '1',
      videoUrl: 'https://example.com/generated-video.mp4',
      provider: 'runway',
      timestamp: '2024-01-01T00:00:00Z'
    }
  }),

  getProviders: jest.fn().mockResolvedValue({
    success: true,
    data: [
      { id: '1', name: 'OpenAI', status: 'active', type: 'text' },
      { id: '2', name: 'DALL-E', status: 'active', type: 'image' },
      { id: '3', name: 'Claude', status: 'inactive', type: 'text' }
    ]
  }),

  checkServiceStatus: jest.fn().mockResolvedValue({
    success: true,
    data: { status: 'active', lastCheck: '2024-01-01T00:00:00Z' }
  }),

  getAnalytics: jest.fn().mockResolvedValue({
    success: true,
    data: {
      totalGenerations: 100,
      totalCost: 50.00,
      averageTime: 2.5,
      successRate: 95.5
    }
  }),

  getRealTimeData: jest.fn().mockResolvedValue({
    success: true,
    data: {
      generationsPerMinute: 5,
      activeUsers: 10,
      currentLoad: 75
    }
  })
};

export default mockAIService;
