/**
 * Mock do auraCoreService para testes
 */

export const mockAuraCoreService = {
  // Estatísticas
  getStats: jest.fn().mockResolvedValue({
    success: true,
    data: {
      id: '1',
      total_connections: 10,
      active_flows: 5,
      messages_sent: 1000,
      response_time: 2000,
      uptime: 99.5,
      last_updated: '2023-01-01T00:00:00Z',
      metrics: [
        {
          id: '1',
          name: 'Conexões Ativas',
          type: 'total_connections',
          value: 10,
          previous_value: 8,
          change_percentage: 25,
          trend: 'up',
          unit: 'number',
          timestamp: '2023-01-01T00:00:00Z'
        }
      ]
    }
  }),

  updateStats: jest.fn().mockResolvedValue({
    success: true,
    data: {
      id: '1',
      total_connections: 10,
      active_flows: 5,
      messages_sent: 1000,
      response_time: 2000,
      uptime: 99.5,
      last_updated: '2023-01-01T00:00:00Z',
      metrics: []
    }
  }),

  // Módulos
  getModules: jest.fn().mockResolvedValue({
    success: true,
    data: [
      {
        id: '1',
        type: 'connections',
        title: 'Conexões WhatsApp',
        description: 'Gerencie suas conexões WhatsApp',
        icon: 'whatsapp',
        color: 'green',
        status: 'active',
        count: 5,
        last_activity: '2023-01-01T00:00:00Z',
        route: '/connections'
      },
      {
        id: '2',
        type: 'flows',
        title: 'Fluxos de Automação',
        description: 'Crie e gerencie fluxos de automação',
        icon: 'workflow',
        color: 'purple',
        status: 'active',
        count: 12,
        last_activity: '2023-01-01T00:00:00Z',
        route: '/flows'
      }
    ]
  }),

  updateModule: jest.fn().mockResolvedValue({
    success: true,
    data: {
      id: '1',
      type: 'connections',
      title: 'Conexões WhatsApp',
      description: 'Gerencie suas conexões WhatsApp',
      icon: 'whatsapp',
      color: 'green',
      status: 'active',
      count: 5,
      last_activity: '2023-01-01T00:00:00Z',
      route: '/connections'
    }
  }),

  // Ações rápidas
  getQuickActions: jest.fn().mockResolvedValue({
    success: true,
    data: [
      {
        id: '1',
        type: 'create_connection',
        title: 'Nova Conexão',
        description: 'Criar nova conexão WhatsApp',
        icon: 'plus',
        color: 'green',
        action: jest.fn(),
        enabled: true
      },
      {
        id: '2',
        type: 'create_flow',
        title: 'Novo Fluxo',
        description: 'Criar novo fluxo de automação',
        icon: 'workflow',
        color: 'purple',
        action: jest.fn(),
        enabled: true
      }
    ]
  }),

  executeQuickAction: jest.fn().mockResolvedValue({
    success: true,
    data: { action: 'executed' }
  }),

  // Notificações
  getNotifications: jest.fn().mockResolvedValue({
    success: true,
    data: [
      {
        id: '1',
        type: 'success',
        title: 'Conexão Estabelecida',
        message: 'Nova conexão WhatsApp foi estabelecida com sucesso',
        timestamp: '2023-01-01T00:00:00Z',
        read: false
      },
      {
        id: '2',
        type: 'info',
        title: 'Fluxo Ativado',
        message: 'Fluxo de boas-vindas foi ativado',
        timestamp: '2023-01-01T00:00:00Z',
        read: true
      }
    ]
  }),

  markNotificationAsRead: jest.fn().mockResolvedValue({
    success: true,
    data: { id: '1', read: true }
  }),

  clearNotifications: jest.fn().mockResolvedValue({
    success: true,
    data: { cleared: true }
  }),

  // Dashboard
  getDashboardData: jest.fn().mockResolvedValue({
    success: true,
    data: {
      id: '1',
      stats: {
        id: '1',
        total_connections: 10,
        active_flows: 5,
        messages_sent: 1000,
        response_time: 2000,
        uptime: 99.5,
        last_updated: '2023-01-01T00:00:00Z',
        metrics: []
      },
      modules: [
        {
          id: '1',
          type: 'connections',
          title: 'Conexões WhatsApp',
          description: 'Gerencie suas conexões WhatsApp',
          icon: 'whatsapp',
          color: 'green',
          status: 'active',
          count: 5,
          route: '/connections'
        }
      ],
      quick_actions: [
        {
          id: '1',
          type: 'create_connection',
          title: 'Nova Conexão',
          description: 'Criar nova conexão WhatsApp',
          icon: 'plus',
          color: 'green',
          action: jest.fn(),
          enabled: true
        }
      ],
      notifications: [
        {
          id: '1',
          type: 'success',
          title: 'Conexão Estabelecida',
          message: 'Nova conexão WhatsApp foi estabelecida com sucesso',
          timestamp: '2023-01-01T00:00:00Z',
          read: false
        }
      ],
      last_updated: '2023-01-01T00:00:00Z'
    }
  }),

  refreshDashboard: jest.fn().mockResolvedValue({
    success: true,
    data: {
      id: '1',
      stats: {
        id: '1',
        total_connections: 10,
        active_flows: 5,
        messages_sent: 1000,
        response_time: 2000,
        uptime: 99.5,
        last_updated: '2023-01-01T00:00:00Z',
        metrics: []
      },
      modules: [],
      quick_actions: [],
      notifications: [],
      last_updated: '2023-01-01T00:00:00Z'
    }
  }),

  // Configuração
  getConfig: jest.fn().mockResolvedValue({
    success: true,
    data: {
      real_time_enabled: true,
      auto_refresh: false,
      refresh_interval: 30000,
      notifications_enabled: true,
      theme: 'auto',
      language: 'pt-BR'
    }
  }),

  updateConfig: jest.fn().mockResolvedValue({
    success: true,
    data: {
      real_time_enabled: true,
      auto_refresh: false,
      refresh_interval: 30000,
      notifications_enabled: true,
      theme: 'auto',
      language: 'pt-BR'
    }
  }),

  // Cache
  clearCache: jest.fn().mockResolvedValue(undefined),

  getCacheStatus: jest.fn().mockResolvedValue({
    success: true,
    data: {
      stats: { hits: 100, misses: 10, ttl: 3600 },
      modules: { hits: 50, misses: 5, ttl: 1800 },
      quick_actions: { hits: 200, misses: 20, ttl: 7200 }
    }
  })
};

export default mockAuraCoreService;
