import { http, HttpResponse } from 'msw';

// Handlers para mock de APIs
export const handlers = [
  // Dashboard
  http.get('/api/dashboard/stats', () => {
    return HttpResponse.json({
      totalLeads: 1250,
      totalProjects: 45,
      totalRevenue: 125000,
      conversionRate: 12.5
    });

  }),

  // Leads
  http.get('/api/leads', () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: 'João Silva',
          email: 'joao@example.com',
          phone: '+55 11 99999-9999',
          status: 'active',
          source: 'website',
          created_at: '2024-01-15T10:00:00Z'
        }
      ],
      meta: {
        total: 1,
        per_page: 15,
        current_page: 1
      } );

  }),

  http.post('/api/leads', () => {
    return HttpResponse.json({
      id: 2,
      name: 'Maria Santos',
      email: 'maria@example.com',
      phone: '+55 11 88888-8888',
      status: 'active',
      source: 'social',
      created_at: '2024-01-16T10:00:00Z'
    }, { status: 201 });

  }),

  // Projects
  http.get('/api/projects', () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: 'Projeto Alpha',
          description: 'Projeto de desenvolvimento',
          status: 'active',
          progress: 75,
          start_date: '2024-01-01',
          end_date: '2024-03-31'
        }
      ],
      meta: {
        total: 1,
        per_page: 15,
        current_page: 1
      } );

  }),

  // AI
  http.post('/api/ai/generate-text', () => {
    return HttpResponse.json({
      text: 'Texto gerado pela IA',
      tokens_used: 150,
      model: 'gpt-4'
    });

  }),

  http.post('/api/ai/generate-image', () => {
    return HttpResponse.json({
      image_url: 'https://example.com/generated-image.jpg',
      prompt: 'Imagem gerada pela IA',
      model: 'dall-e-3'
    });

  }),

  // Email Marketing
  http.get('/api/email-campaigns', () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: 'Campanha Janeiro',
          subject: 'Ofertas especiais',
          status: 'sent',
          sent_count: 1000,
          open_rate: 25.5,
          click_rate: 5.2
        }
      ]
    });

  }),

  // Analytics
  http.get('/api/analytics/overview', () => {
    return HttpResponse.json({
      page_views: 15000,
      unique_visitors: 8500,
      bounce_rate: 45.2,
      avg_session_duration: '2m 30s'
    });

  }),

  // Users
  http.get('/api/users', () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          created_at: '2024-01-01T00:00:00Z'
        }
      ]
    });

  }),

  // Settings
  http.get('/api/settings', () => {
    return HttpResponse.json({
      theme: 'light',
      language: 'pt-BR',
      notifications: {
        email: true,
        push: false,
        sms: false
      } );

  }),

  // Activity
  http.get('/api/activities', () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          type: 'lead_created',
          description: 'Novo lead criado',
          user: 'Admin User',
          created_at: '2024-01-16T10:00:00Z'
        }
      ]
    });

  }),

  // Media Library
  http.get('/api/media', () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: 'logo.png',
          type: 'image',
          size: 1024000,
          url: 'https://example.com/media/logo.png',
          created_at: '2024-01-15T10:00:00Z'
        }
      ]
    });

  }),

  // Workflows
  http.get('/api/workflows', () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: 'Lead Follow-up',
          status: 'active',
          trigger: 'lead_created',
          actions: ['send_email', 'create_task'],
          created_at: '2024-01-10T10:00:00Z'
        }
      ]
    });

  }),

  // Social Buffer
  http.get('/api/social-posts', () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          content: 'Post de exemplo',
          platform: 'facebook',
          status: 'scheduled',
          scheduled_at: '2024-01-17T10:00:00Z'
        }
      ]
    });

  }),

  // ADStool
  http.get('/api/ads/campaigns', () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: 'Campanha Facebook',
          platform: 'facebook',
          status: 'active',
          budget: 1000,
          spent: 250,
          impressions: 50000,
          clicks: 1200
        }
      ]
    });

  }),

  // Aura
  http.get('/api/aura/energy', () => {
    return HttpResponse.json({
      current_energy: 85,
      max_energy: 100,
      energy_type: 'positive',
      last_update: '2024-01-16T10:00:00Z'
    });

  }),

  // Error handlers
  http.get('/api/error', () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 });

  }),

  http.get('/api/not-found', () => {
    return HttpResponse.json(
      { error: 'Not Found' },
      { status: 404 });

  }),
];