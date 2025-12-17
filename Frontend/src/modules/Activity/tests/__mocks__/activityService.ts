/**
 * Mock do ActivityService para testes
 */

export const mockActivityService = {
  getLogs: jest.fn().mockResolvedValue({
    success: true,
    data: [
      {
        id: '1',
        log_name: 'user.created',
        description: 'Usuário criado',
        causer_type: 'User',
        causer_id: 'user-1',
        subject_type: 'App\\Models\\User',
        subject_id: 'user-1',
        properties: { name: 'John Doe' },
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z'
      }
    ]
  }),
  
  getLogById: jest.fn().mockResolvedValue({
    success: true,
    data: {
      id: '1',
      log_name: 'user.created',
      description: 'Usuário criado',
      causer_type: 'User',
      causer_id: 'user-1',
      subject_type: 'App\\Models\\User',
      subject_id: 'user-1',
      properties: { name: 'John Doe' },
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z'
    } ),
  
  getLogStats: jest.fn().mockResolvedValue({
    success: true,
    data: {
      total_logs: 1,
      today_logs: 1,
      active_users: 1,
      error_logs: 0,
      api_calls: 5
    } ),
  
  exportLogs: jest.fn().mockResolvedValue({
    success: true,
    data: 'exported-data'
  }),
  
  clearOldLogs: jest.fn().mockResolvedValue({
    success: true,
    data: { deleted: 5 } ),
  
  searchLogs: jest.fn().mockResolvedValue({
    success: true,
    data: []
  }),
  
  getLogsByType: jest.fn().mockResolvedValue({
    success: true,
    data: []
  }),
  
  getLogsByUser: jest.fn().mockResolvedValue({
    success: true,
    data: []
  }),
  
  getLogsByDateRange: jest.fn().mockResolvedValue({
    success: true,
    data: []
  }),
  
  getActivityStats: jest.fn().mockResolvedValue({
    success: true,
    data: {} ),
  
  getUserActivityStats: jest.fn().mockResolvedValue({
    success: true,
    data: {} ),
  
  getSystemHealthStats: jest.fn().mockResolvedValue({
    success: true,
    data: {} ),
  
  getRealTimeLogs: jest.fn().mockResolvedValue({
    success: true,
    data: []
  }),
  
  subscribeToRealTimeUpdates: jest.fn().mockReturnValue({
    onmessage: jest.fn(),
    onerror: jest.fn(),
    close: jest.fn()
  }),
  
  formatTimestamp: jest.fn((timestamp: unknown) => new Date(timestamp).toLocaleString('pt-BR')),
  formatRelativeTime: jest.fn((timestamp: unknown) => 'há 1 hora'),
  formatLogDescription: jest.fn((log: unknown) => log.description),
  formatNumber: jest.fn((value: unknown) => value.toString()),
  formatPercentage: jest.fn((value: unknown) => `${value}%`),
  formatDuration: jest.fn((ms: unknown) => '1m 30s'),
  formatActivitySummary: jest.fn((stats: unknown) => 'Resumo das atividades'),
  formatHealthStatus: jest.fn((percentage: unknown) => ({ status: 'Bom', color: 'green' })),
  clearCache: jest.fn(),
  getCacheInfo: jest.fn().mockReturnValue({
    size: 0,
    keys: [],
    oldestEntry: undefined,
    newestEntry: undefined
  })};

export default mockActivityService;
