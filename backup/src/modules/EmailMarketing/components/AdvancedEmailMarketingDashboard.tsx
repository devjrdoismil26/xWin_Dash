/**
 * Advanced Email Marketing Dashboard - Módulo EmailMarketing
 * Plataforma de email marketing de última geração 95%+
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Mail, 
  Send, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  Heart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Clock, 
  Target, 
  Zap, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Filter, 
  Search, 
  Download, 
  Upload, 
  RefreshCw, 
  Settings, 
  Plus, 
  Play, 
  Pause, 
  Square, 
  Copy, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Phone,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  Maximize2,
  Minimize2,
  Brain,
  Sparkles,
  Split,
  Layers,
  Database,
  FileText,
  Image,
  Video,
  Link,
  Hash
} from 'lucide-react';
// Design System
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from '@/components/ui/design-tokens';
// Hooks
import { useT } from '@/hooks/useTranslation';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useDataLoadingStates } from '@/hooks/useLoadingStates';
// Componentes
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Select } from '@/components/ui/select';
import Input from '@/components/ui/Input';
import Progress from '@/components/ui/Progress';
import Skeleton from '@/components/ui/SkeletonLoaders';
import Tooltip from '@/components/ui/Tooltip';
import BarChart from '@/components/ui/BarChart';
import Tabs from '@/components/ui/Tabs';
interface EmailMetrics {
  total_campaigns: number;
  active_campaigns: number;
  total_sent: number;
  total_subscribers: number;
  open_rate: number;
  click_rate: number;
  unsubscribe_rate: number;
  bounce_rate: number;
  conversion_rate: number;
  revenue_generated: number;
  cost_per_acquisition: number;
  roi: number;
  deliverability_score: number;
  spam_score: number;
  list_growth_rate: number;
  engagement_score: number;
}
interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  type: 'newsletter' | 'promotional' | 'welcome' | 'abandoned_cart' | 'follow_up';
  sent_count: number;
  open_rate: number;
  click_rate: number;
  conversion_rate: number;
  revenue: number;
  created_at: string;
  scheduled_at?: string;
  sent_at?: string;
  segment: string;
  template_id?: string;
  ab_test?: boolean;
  automation?: boolean;
}
interface Subscriber {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'inactive' | 'unsubscribed' | 'bounced';
  source: string;
  tags: string[];
  engagement_score: number;
  lifetime_value: number;
  last_activity: string;
  subscription_date: string;
  location?: string;
  preferences: {
    frequency: 'daily' | 'weekly' | 'monthly';
    categories: string[];
  };
}
interface EmailTemplate {
  id: string;
  name: string;
  type: 'html' | 'plain' | 'mjml';
  category: string;
  thumbnail: string;
  usage_count: number;
  performance_score: number;
  last_used: string;
  created_at: string;
  ai_optimized?: boolean;
}
interface AutomationFlow {
  id: string;
  name: string;
  trigger: 'signup' | 'purchase' | 'abandoned_cart' | 'birthday' | 'custom';
  status: 'active' | 'paused' | 'draft';
  emails_count: number;
  subscribers_enrolled: number;
  completion_rate: number;
  conversion_rate: number;
  revenue_generated: number;
  created_at: string;
}
interface PerformanceData {
  date: string;
  sent: number;
  opened: number;
  clicked: number;
  conversions: number;
  revenue: number;
}
const MOCK_METRICS: EmailMetrics = {
  total_campaigns: 156,
  active_campaigns: 23,
  total_sent: 1245678,
  total_subscribers: 45678,
  open_rate: 28.5,
  click_rate: 5.7,
  unsubscribe_rate: 0.8,
  bounce_rate: 2.1,
  conversion_rate: 3.2,
  revenue_generated: 189456.78,
  cost_per_acquisition: 15.67,
  roi: 450,
  deliverability_score: 97.8,
  spam_score: 1.2,
  list_growth_rate: 12.5,
  engagement_score: 78.9,
};
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Black Friday 2024 - Ofertas Imperdíveis',
    subject: '🔥 Até 70% OFF - Últimas 24h!',
    status: 'sent',
    type: 'promotional',
    sent_count: 12456,
    open_rate: 32.5,
    click_rate: 8.9,
    conversion_rate: 4.2,
    revenue: 25678.90,
    created_at: '2024-08-10T10:00:00Z',
    sent_at: '2024-08-15T09:00:00Z',
    segment: 'Clientes VIP',
    ab_test: true,
    automation: false,
  },
  {
    id: '2',
    name: 'Newsletter Semanal - Novidades',
    subject: 'Suas novidades da semana chegaram! 📰',
    status: 'scheduled',
    type: 'newsletter',
    sent_count: 0,
    open_rate: 0,
    click_rate: 0,
    conversion_rate: 0,
    revenue: 0,
    created_at: '2024-08-14T15:30:00Z',
    scheduled_at: '2024-08-16T08:00:00Z',
    segment: 'Todos os Assinantes',
    ab_test: false,
    automation: true,
  },
  {
    id: '3',
    name: 'Carrinho Abandonado - Lembrete',
    subject: 'Você esqueceu algo no seu carrinho! 🛒',
    status: 'sending',
    type: 'abandoned_cart',
    sent_count: 856,
    open_rate: 25.8,
    click_rate: 6.7,
    conversion_rate: 12.3,
    revenue: 3456.78,
    created_at: '2024-08-15T08:00:00Z',
    segment: 'Carrinho Abandonado 24h',
    automation: true,
  },
];
const MOCK_TEMPLATES: EmailTemplate[] = [
  {
    id: '1',
    name: 'Black Friday Premium',
    type: 'html',
    category: 'Promocional',
    thumbnail: '/templates/black-friday.jpg',
    usage_count: 45,
    performance_score: 94.5,
    last_used: '2024-08-15T10:30:00Z',
    created_at: '2024-07-15T10:00:00Z',
    ai_optimized: true,
  },
  {
    id: '2',
    name: 'Newsletter Clean',
    type: 'mjml',
    category: 'Newsletter',
    thumbnail: '/templates/newsletter-clean.jpg',
    usage_count: 78,
    performance_score: 87.2,
    last_used: '2024-08-14T15:20:00Z',
    created_at: '2024-06-10T14:00:00Z',
    ai_optimized: false,
  },
];
const MOCK_AUTOMATIONS: AutomationFlow[] = [
  {
    id: '1',
    name: 'Sequência de Boas-vindas',
    trigger: 'signup',
    status: 'active',
    emails_count: 5,
    subscribers_enrolled: 3456,
    completion_rate: 78.9,
    conversion_rate: 12.5,
    revenue_generated: 45678.90,
    created_at: '2024-07-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Recuperação Carrinho',
    trigger: 'abandoned_cart',
    status: 'active',
    emails_count: 3,
    subscribers_enrolled: 1234,
    completion_rate: 65.7,
    conversion_rate: 18.9,
    revenue_generated: 23456.78,
    created_at: '2024-06-15T14:30:00Z',
  },
];
const MOCK_PERFORMANCE_DATA: PerformanceData[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2024, 7, i + 1).toISOString().split('T')[0],
  sent: Math.floor(Math.random() * 5000) + 2000,
  opened: Math.floor(Math.random() * 1500) + 500,
  clicked: Math.floor(Math.random() * 300) + 100,
  conversions: Math.floor(Math.random() * 100) + 20,
  revenue: Math.random() * 5000 + 1000,
}));
interface AdvancedEmailMarketingDashboardProps {
  className?: string;
}
const AdvancedEmailMarketingDashboard: React.FC<AdvancedEmailMarketingDashboardProps> = ({
  className = '',
}) => {
  const { t } = useT();
  const { showSuccess, showError, showInfo } = useAdvancedNotifications();
  const { operations, isFetching, isUpdating } = useDataLoadingStates();
  // State
  const [metrics, setMetrics] = useState<EmailMetrics>(MOCK_METRICS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [templates, setTemplates] = useState<EmailTemplate[]>(MOCK_TEMPLATES);
  const [automations, setAutomations] = useState<AutomationFlow[]>(MOCK_AUTOMATIONS);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>(MOCK_PERFORMANCE_DATA);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  // Fetch data
  const fetchEmailData = useCallback(async () => {
    try {
      await operations.fetch('email-dashboard', async () => {
        await new Promise(resolve => setTimeout(resolve, 1200));
        // Mock real-time updates
        setMetrics(prev => ({
          ...prev,
          total_sent: prev.total_sent + Math.floor(Math.random() * 100),
          total_subscribers: prev.total_subscribers + Math.floor(Math.random() * 10),
          revenue_generated: prev.revenue_generated + Math.random() * 500,
        }));
        return true;
      });
    } catch (error) {
      showError('Erro ao carregar dados de email marketing');
    }
  }, [operations, showError]);
  // Chart data para performance
  const performanceChartData = useMemo(() => {
    return performanceData.slice(-7).map(data => ({
      date: new Date(data.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      Enviados: data.sent,
      Abertos: data.opened,
      Cliques: data.clicked,
      Conversões: data.conversions,
    }));
  }, [performanceData]);
  // Actions
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    fetchEmailData();
    showSuccess('Dashboard de email marketing atualizado');
  }, [fetchEmailData, showSuccess]);
  const handleCampaignAction = useCallback(async (campaignId: string, action: 'play' | 'pause' | 'stop' | 'duplicate') => {
    try {
      await operations.update(`campaign-${action}`, async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCampaigns(prev => prev.map(campaign => 
          campaign.id === campaignId 
            ? { 
                ...campaign, 
                status: action === 'play' ? 'sending' : 
                       action === 'pause' ? 'paused' : 
                       action === 'stop' ? 'draft' : campaign.status
              }
            : campaign
        ));
        return true;
      });
      const actionText = {
        play: 'iniciada',
        pause: 'pausada',
        stop: 'parada',
        duplicate: 'duplicada'
      }[action];
      showSuccess(`Campanha ${actionText} com sucesso`);
    } catch (error) {
      showError(`Erro ao ${action} campanha`);
    }
  }, [operations, showSuccess, showError]);
  const handleAutomationAction = useCallback(async (automationId: string, action: 'start' | 'pause' | 'stop') => {
    try {
      await operations.update(`automation-${action}`, async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        setAutomations(prev => prev.map(automation => 
          automation.id === automationId 
            ? { 
                ...automation, 
                status: action === 'start' ? 'active' : action === 'pause' ? 'paused' : 'draft'
              }
            : automation
        ));
        return true;
      });
      const actionText = action === 'start' ? 'iniciada' : action === 'pause' ? 'pausada' : 'parada';
      showSuccess(`Automação ${actionText} com sucesso`);
    } catch (error) {
      showError(`Erro ao ${action} automação`);
    }
  }, [operations, showSuccess, showError]);
  // Real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (realTimeEnabled) {
      interval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          total_sent: prev.total_sent + Math.floor(Math.random() * 20),
          revenue_generated: prev.revenue_generated + Math.random() * 100,
          open_rate: Math.max(25, Math.min(35, prev.open_rate + (Math.random() - 0.5) * 2)),
          click_rate: Math.max(4, Math.min(8, prev.click_rate + (Math.random() - 0.5) * 0.5)),
        }));
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [realTimeEnabled]);
  // Initial load
  useEffect(() => {
    fetchEmailData();
  }, [fetchEmailData, refreshKey]);
  const isLoading = isFetching('email-dashboard');
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Email Marketing Avançado
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Plataforma completa de email marketing com automação inteligente e análises avançadas
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
            className="w-32"
          >
            <option value="7d">7 dias</option>
            <option value="30d">30 dias</option>
            <option value="90d">90 dias</option>
            <option value="1y">1 ano</option>
          </Select>
          <Select
            value={selectedSegment}
            onValueChange={setSelectedSegment}
            className="w-40"
          >
            <option value="all">Todos os Segmentos</option>
            <option value="vip">Clientes VIP</option>
            <option value="new">Novos Assinantes</option>
            <option value="engaged">Alta Engajamento</option>
          </Select>
          <Button
            variant={realTimeEnabled ? "primary" : "outline"}
            onClick={() => setRealTimeEnabled(!realTimeEnabled)}
            className="flex items-center space-x-2"
          >
            <Zap className="h-4 w-4" />
            <span>Tempo Real</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            loading={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Atualizar</span>
          </Button>
          <Button variant="primary" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nova Campanha</span>
          </Button>
        </div>
      </div>
      {/* Real-time Status */}
      {realTimeEnabled && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                <span className="font-medium text-blue-800 dark:text-blue-200">
                  Email Marketing Ativo - Monitoramento em Tempo Real
                </span>
              </div>
              <Badge variant="success">
                Deliverabilidade: {metrics.deliverability_score.toFixed(1)}%
              </Badge>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1">
                <Send className="h-4 w-4 text-green-500" />
                <span>{metrics.active_campaigns} campanhas ativas</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-blue-500" />
                <span>{metrics.total_subscribers.toLocaleString()} assinantes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="h-4 w-4 text-purple-500" />
                <span>{metrics.engagement_score.toFixed(1)}% engajamento</span>
              </div>
            </div>
          </div>
        </Card>
      )}
      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sent */}
        <Card className="p-6">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Emails Enviados
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.total_sent.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+12.5% vs. período anterior</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          )}
        </Card>
        {/* Open Rate */}
        <Card className="p-6">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Taxa de Abertura
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.open_rate.toFixed(1)}%
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+2.3% vs. período anterior</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          )}
        </Card>
        {/* Click Rate */}
        <Card className="p-6">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Taxa de Cliques
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.click_rate.toFixed(1)}%
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+0.8% vs. período anterior</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <MousePointer className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          )}
        </Card>
        {/* Revenue Generated */}
        <Card className="p-6">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Receita Gerada
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {metrics.revenue_generated.toLocaleString('pt-BR')}
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">ROI: {metrics.roi}%</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          )}
        </Card>
      </div>
      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Deliverability Score */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Entregabilidade</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {metrics.deliverability_score.toFixed(1)}%
              </p>
            </div>
            <div className={`p-2 rounded-lg ${
              metrics.deliverability_score > 95 ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'
            }`}>
              <CheckCircle className={`h-5 w-5 ${
                metrics.deliverability_score > 95 ? 'text-green-600' : 'text-yellow-600'
              }`} />
            </div>
          </div>
        </Card>
        {/* List Growth Rate */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Crescimento da Lista</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                +{metrics.list_growth_rate.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
        </Card>
        {/* Bounce Rate */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taxa de Rejeição</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {metrics.bounce_rate.toFixed(1)}%
              </p>
            </div>
            <div className={`p-2 rounded-lg ${
              metrics.bounce_rate < 3 ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'
            }`}>
              <AlertCircle className={`h-5 w-5 ${
                metrics.bounce_rate < 3 ? 'text-green-600' : 'text-yellow-600'
              }`} />
            </div>
          </div>
        </Card>
        {/* Unsubscribe Rate */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taxa de Descadastro</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {metrics.unsubscribe_rate.toFixed(1)}%
              </p>
            </div>
            <div className={`p-2 rounded-lg ${
              metrics.unsubscribe_rate < 1 ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'
            }`}>
              <XCircle className={`h-5 w-5 ${
                metrics.unsubscribe_rate < 1 ? 'text-green-600' : 'text-yellow-600'
              }`} />
            </div>
          </div>
        </Card>
      </div>
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b">
          <nav className="flex space-x-8">
            <button 
              className={`py-2 px-1 border-b-2 text-sm font-medium ${
                activeTab === 'overview' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Visão Geral
            </button>
            <button 
              className={`py-2 px-1 border-b-2 text-sm font-medium ${
                activeTab === 'campaigns' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('campaigns')}
            >
              Campanhas
            </button>
            <button 
              className={`py-2 px-1 border-b-2 text-sm font-medium ${
                activeTab === 'automations' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('automations')}
            >
              Automações
            </button>
            <button 
              className={`py-2 px-1 border-b-2 text-sm font-medium ${
                activeTab === 'templates' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('templates')}
            >
              Templates
            </button>
          </nav>
        </div>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="mt-6 space-y-6">
            {/* Performance Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Performance dos Últimos 7 Dias</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="info">Tempo Real</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {isLoading ? (
                <Skeleton className="h-64" />
              ) : (
                <div className="h-64">
                  <BarChart
                    data={performanceChartData}
                    categories={['Enviados', 'Abertos', 'Cliques', 'Conversões']}
                    index="date"
                    colors={['blue', 'green', 'purple', 'orange']}
                    valueFormatter={(value) => value.toLocaleString()}
                  />
                </div>
              )}
            </Card>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Top Performing Campaigns */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Campanhas Top</h3>
                <div className="space-y-3">
                  {campaigns.filter(c => c.status === 'sent').slice(0, 3).map((campaign, index) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{campaign.name}</p>
                          <p className="text-xs text-gray-500">{campaign.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{campaign.open_rate.toFixed(1)}%</p>
                        <p className="text-xs text-gray-500">abertura</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                    <Send className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Campanha enviada</p>
                      <p className="text-xs text-gray-500">Black Friday - há 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Novos assinantes</p>
                      <p className="text-xs text-gray-500">+156 hoje</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Automação ativada</p>
                      <p className="text-xs text-gray-500">Carrinho abandonado</p>
                    </div>
                  </div>
                </div>
              </Card>
              {/* AI Insights */}
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">Insights IA</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Melhor horário para envio
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      Terças às 10h têm 23% mais abertura
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Assunto otimizado
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-300">
                      Use emojis para +15% abertura
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900 rounded-lg">
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      Segmentação recomendada
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-300">
                      Foque em clientes VIP
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Gerenciar Campanhas</h3>
                <div className="flex items-center space-x-2">
                  <Input placeholder="Buscar campanhas..." className="w-64" />
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="primary" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Campanha
                  </Button>
                </div>
              </div>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <Mail className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{campaign.name}</h4>
                            <p className="text-sm text-gray-500">{campaign.subject}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={
                                campaign.status === 'sent' ? 'success' :
                                campaign.status === 'sending' ? 'warning' :
                                campaign.status === 'scheduled' ? 'info' :
                                'default'
                              }>
                                {campaign.status}
                              </Badge>
                              <Badge variant="secondary">
                                {campaign.type}
                              </Badge>
                              {campaign.ab_test && (
                                <Badge variant="info">A/B Test</Badge>
                              )}
                              {campaign.automation && (
                                <Badge variant="success">Auto</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-8">
                          <div className="text-center">
                            <p className="text-sm font-medium">{campaign.sent_count.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Enviados</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">{campaign.open_rate.toFixed(1)}%</p>
                            <p className="text-xs text-gray-500">Abertura</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">{campaign.click_rate.toFixed(1)}%</p>
                            <p className="text-xs text-gray-500">Cliques</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">R$ {campaign.revenue.toLocaleString('pt-BR')}</p>
                            <p className="text-xs text-gray-500">Receita</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {campaign.status === 'draft' || campaign.status === 'scheduled' ? (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleCampaignAction(campaign.id, 'play')}
                                loading={isUpdating(`campaign-play`)}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            ) : campaign.status === 'sending' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCampaignAction(campaign.id, 'pause')}
                                loading={isUpdating(`campaign-pause`)}
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                            ) : null}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCampaignAction(campaign.id, 'duplicate')}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
        {/* Automations Tab */}
        {activeTab === 'automations' && (
          <div className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Automações de Email</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Brain className="h-4 w-4 mr-2" />
                    IA Assistente
                  </Button>
                  <Button variant="primary" size="sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Nova Automação
                  </Button>
                </div>
              </div>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {automations.map((automation) => (
                    <div key={automation.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                            <Zap className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{automation.name}</h4>
                            <p className="text-sm text-gray-500">Trigger: {automation.trigger}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={
                                automation.status === 'active' ? 'success' :
                                automation.status === 'paused' ? 'warning' :
                                'default'
                              }>
                                {automation.status}
                              </Badge>
                              <Badge variant="secondary">
                                {automation.emails_count} emails
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-8">
                          <div className="text-center">
                            <p className="text-sm font-medium">{automation.subscribers_enrolled.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Inscritos</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">{automation.completion_rate.toFixed(1)}%</p>
                            <p className="text-xs text-gray-500">Conclusão</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">{automation.conversion_rate.toFixed(1)}%</p>
                            <p className="text-xs text-gray-500">Conversão</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">R$ {automation.revenue_generated.toLocaleString('pt-BR')}</p>
                            <p className="text-xs text-gray-500">Receita</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {automation.status === 'active' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAutomationAction(automation.id, 'pause')}
                                loading={isUpdating(`automation-pause`)}
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleAutomationAction(automation.id, 'start')}
                                loading={isUpdating(`automation-start`)}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Templates de Email</h3>
                <div className="flex items-center space-x-2">
                  <Input placeholder="Buscar templates..." className="w-64" />
                  <Button variant="outline" size="sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    IA Generator
                  </Button>
                  <Button variant="primary" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Template
                  </Button>
                </div>
              </div>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-48" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <Card key={template.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                        <Image className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{template.name}</h4>
                          {template.ai_optimized && (
                            <Badge variant="info">
                              <Brain className="h-3 w-3 mr-1" />
                              IA
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{template.category}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span>{template.usage_count} usos</span>
                          <span className={`font-medium ${
                            template.performance_score > 90 ? 'text-green-600' :
                            template.performance_score > 80 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {template.performance_score.toFixed(1)}% performance
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                          <Button variant="primary" size="sm" className="flex-1">
                            Usar Template
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </Tabs>
    </div>
  );
};
export default AdvancedEmailMarketingDashboard;
