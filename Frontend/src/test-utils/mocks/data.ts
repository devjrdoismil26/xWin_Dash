/**
 * MOCK DATA - Baseado nos Schemas Reais
 * Atualizado: 24/11/2025
 */

import type {
  User,
  Lead,
  Product,
  Project,
  Workflow,
  SocialPost,
  MediaFile,
  EmailCampaign,
  ActivityLog,
  DashboardWidget
} from '@/schemas';

// ==================== USERS ====================
export const mockUser: User = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'John Doe',
  email: 'john@example.com',
  email_verified_at: '2024-01-01T00:00:00Z',
  role: 'admin',
  avatar: '/avatars/john.jpg',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'};

export const mockUsers: User[] = [
  mockUser,
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Jane Smith',
    email: 'jane@example.com',
    email_verified_at: '2024-01-02T00:00:00Z',
    role: 'user',
    avatar: null,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  }
];

// ==================== LEADS ====================
export const mockLead: Lead = {
  id: '650e8400-e29b-41d4-a716-446655440000',
  name: 'João Silva',
  email: 'joao@example.com',
  phone: '+55 11 99999-9999',
  company: 'Empresa XYZ',
  position: 'CEO',
  website: 'https://empresaxyz.com',
  notes: 'Lead qualificado',
  source: 'website',
  utm_source: 'google',
  utm_medium: 'cpc',
  utm_campaign: 'campaign_2024',
  utm_content: null,
  utm_term: null,
  address: 'São Paulo, SP',
  status: 'new',
  score: 85,
  last_activity_at: '2024-01-15T10:00:00Z',
  converted_at: null,
  value: 5000,
  assigned_to: mockUser.id,
  project_id: null,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z'};

export const mockLeads: Lead[] = [
  mockLead,
  {
    ...mockLead,
    id: '650e8400-e29b-41d4-a716-446655440001',
    name: 'Maria Santos',
    email: 'maria@example.com',
    phone: '+55 11 88888-8888',
    company: 'Tech Corp',
    status: 'qualified',
    score: 92
  }
];

// ==================== PRODUCTS ====================
export const mockProduct: Product = {
  id: '750e8400-e29b-41d4-a716-446655440000',
  name: 'Produto Premium',
  description: 'Descrição do produto premium',
  sku: 'PROD-001',
  price: 99.99,
  compare_price: 149.99,
  cost_price: 50.00,
  stock_quantity: 100,
  track_inventory: true,
  status: 'active',
  weight: 1.5,
  dimensions: { width: 10, height: 20, depth: 5 },
  images: ['/products/prod-001.jpg'],
  attributes: { color: 'blue', size: 'M' },
  project_id: null,
  created_by: mockUser.id,
  created_at: '2024-01-10T00:00:00Z',
  updated_at: '2024-01-10T00:00:00Z',
  deleted_at: null};

export const mockProducts: Product[] = [mockProduct];

// ==================== PROJECTS ====================
export const mockProject: Project = {
  id: '850e8400-e29b-41d4-a716-446655440000',
  name: 'Projeto Alpha',
  description: 'Projeto de desenvolvimento',
  slug: 'projeto-alpha',
  logo: '/logos/alpha.png',
  website: 'https://alpha.com',
  industry: 'technology',
  timezone: 'America/Sao_Paulo',
  currency: 'BRL',
  settings: { theme: 'dark' },
  modules: ['leads', 'products', 'workflows'],
  is_active: true,
  owner_id: mockUser.id,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'};

export const mockProjects: Project[] = [mockProject];

// ==================== WORKFLOWS ====================
export const mockWorkflow: Workflow = {
  id: '950e8400-e29b-41d4-a716-446655440000',
  name: 'Lead Follow-up',
  description: 'Workflow automático de follow-up',
  status: 'active',
  definition: { nodes: [], edges: [] },
  settings: { auto_start: true },
  variables: { delay: 24 },
  last_executed_at: '2024-01-15T10:00:00Z',
  execution_count: 150,
  is_template: false,
  category: 'leads',
  tags: ['automation', 'leads'],
  user_id: mockUser.id,
  project_id: mockProject.id,
  created_at: '2024-01-10T00:00:00Z',
  updated_at: '2024-01-15T10:00:00Z'};

export const mockWorkflows: Workflow[] = [mockWorkflow];

// ==================== SOCIAL POSTS ====================
export const mockSocialPost: SocialPost = {
  id: 'a50e8400-e29b-41d4-a716-446655440000',
  user_id: mockUser.id,
  content: 'Post de exemplo para redes sociais',
  status: 'scheduled',
  scheduled_at: '2024-01-17T10:00:00Z',
  published_at: null,
  platform_post_id: null,
  platform: 'facebook',
  post_url: null,
  created_at: '2024-01-16T10:00:00Z',
  updated_at: '2024-01-16T10:00:00Z'};

export const mockSocialPosts: SocialPost[] = [mockSocialPost];

// ==================== MEDIA FILES ====================
export const mockMediaFile: MediaFile = {
  id: 'b50e8400-e29b-41d4-a716-446655440000',
  name: 'Logo da Empresa',
  file_name: 'logo.png',
  mime_type: 'image/png',
  path: '/media/2024/01/logo.png',
  size: 1024000,
  folder_id: null,
  user_id: mockUser.id,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z'};

export const mockMediaFiles: MediaFile[] = [mockMediaFile];

// ==================== EMAIL CAMPAIGNS ====================
export const mockEmailCampaign: EmailCampaign = {
  id: 'c50e8400-e29b-41d4-a716-446655440000',
  name: 'Campanha Janeiro',
  subject: 'Ofertas especiais de Janeiro',
  template_id: 'd50e8400-e29b-41d4-a716-446655440000',
  status: 'sent',
  sent_count: 1000,
  open_rate: 25.5,
  click_rate: 5.2,
  scheduled_at: '2024-01-15T10:00:00Z'};

export const mockEmailCampaigns: EmailCampaign[] = [mockEmailCampaign];

// ==================== ACTIVITY LOGS ====================
export const mockActivityLog: ActivityLog = {
  id: 'e50e8400-e29b-41d4-a716-446655440000',
  user_id: mockUser.id,
  action: 'create',
  entity_type: 'lead',
  entity_id: mockLead.id,
  description: 'Novo lead criado',
  metadata: { source: 'website' },
  ip_address: '192.168.1.1',
  user_agent: 'Mozilla/5.0',
  created_at: '2024-01-16T10:00:00Z'};

export const mockActivityLogs: ActivityLog[] = [mockActivityLog];

// ==================== DASHBOARD WIDGETS ====================
export const mockDashboardWidget: DashboardWidget = {
  id: 'f50e8400-e29b-41d4-a716-446655440000',
  user_id: mockUser.id,
  type: 'stats',
  config: { metric: 'total_leads', period: '30d' },
  created_at: '2024-01-10T00:00:00Z',
  updated_at: '2024-01-10T00:00:00Z',
  deleted_at: null};

export const mockDashboardWidgets: DashboardWidget[] = [mockDashboardWidget];

// ==================== API RESPONSES ====================
export const mockApiResponse = <T>(data: T, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {} );

export const mockPaginatedResponse = <T>(data: T[], total = 100) => ({
  data,
  meta: {
    total,
    per_page: 15,
    current_page: 1,
    last_page: Math.ceil(total / 15)
  } );
