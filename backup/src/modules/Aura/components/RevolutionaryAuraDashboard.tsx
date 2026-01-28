/**
 * Revolutionary Aura Dashboard - Módulo Aura
 * Plataforma WhatsApp de automação de última geração 95%+
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  MessageCircle, 
  Bot, 
  Users, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Send, 
  Phone, 
  PhoneOff, 
  Wifi, 
  WifiOff, 
  Activity, 
  BarChart3, 
  MessageSquare, 
  Heart, 
  ThumbsUp, 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Pause, 
  Play, 
  RefreshCw, 
  Settings, 
  Download, 
  Upload, 
  Filter, 
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Smartphone,
  Calendar,
  Target,
  Sparkles,
  Brain,
  Shield,
  Link,
  QrCode,
  UserPlus,
  UserMinus,
  MessageSquarePlus,
  Headphones,
  FileText,
  Image,
  Video,
  Mic,
  Paperclip
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
interface AuraConnection {
  id: string;
  name: string;
  phone: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  profile_picture?: string;
  last_seen: string;
  qr_code?: string;
  messages_sent: number;
  messages_received: number;
  contacts_count: number;
  flows_active: number;
  uptime_percentage: number;
  response_time: number;
  battery_level?: number;
  connection_quality: 'excellent' | 'good' | 'poor';
}
interface AuraMetrics {
  total_connections: number;
  active_connections: number;
  total_messages_sent: number;
  total_messages_received: number;
  total_contacts: number;
  active_flows: number;
  automation_rate: number;
  response_rate: number;
  average_response_time: number;
  success_rate: number;
  cost_per_message: number;
  monthly_cost: number;
  growth_rate: number;
  engagement_rate: number;
}
interface ChatMetrics {
  chat_id: string;
  contact_name: string;
  contact_phone: string;
  last_message: string;
  last_message_time: string;
  message_count: number;
  is_group: boolean;
  status: 'active' | 'archived' | 'blocked';
  tags: string[];
  lead_score?: number;
  automation_enabled: boolean;
  human_takeover: boolean;
}
interface FlowMetrics {
  flow_id: string;
  flow_name: string;
  status: 'active' | 'paused' | 'draft';
  executions: number;
  success_rate: number;
  avg_completion_time: number;
  triggers: number;
  revenue_generated: number;
  last_execution: string;
  nodes_count: number;
}
interface MessageStats {
  hour: number;
  sent: number;
  received: number;
  automated: number;
  human: number;
}
const MOCK_METRICS: AuraMetrics = {
  total_connections: 12,
  active_connections: 8,
  total_messages_sent: 45678,
  total_messages_received: 38945,
  total_contacts: 12456,
  active_flows: 23,
  automation_rate: 78.5,
  response_rate: 94.2,
  average_response_time: 145,
  success_rate: 96.8,
  cost_per_message: 0.02,
  monthly_cost: 890.45,
  growth_rate: 23.5,
  engagement_rate: 67.8,
};
const MOCK_CONNECTIONS: AuraConnection[] = [
  {
    id: '1',
    name: 'Vendas Principal',
    phone: '+55 11 99999-0001',
    status: 'connected',
    last_seen: '2024-08-15T10:30:00Z',
    messages_sent: 15678,
    messages_received: 12456,
    contacts_count: 4567,
    flows_active: 8,
    uptime_percentage: 98.5,
    response_time: 120,
    battery_level: 85,
    connection_quality: 'excellent',
  },
  {
    id: '2',
    name: 'Suporte Técnico',
    phone: '+55 11 99999-0002',
    status: 'connected',
    last_seen: '2024-08-15T10:25:00Z',
    messages_sent: 12456,
    messages_received: 10234,
    contacts_count: 3456,
    flows_active: 6,
    uptime_percentage: 95.2,
    response_time: 180,
    battery_level: 72,
    connection_quality: 'good',
  },
  {
    id: '3',
    name: 'Marketing',
    phone: '+55 11 99999-0003',
    status: 'connecting',
    last_seen: '2024-08-15T09:45:00Z',
    messages_sent: 8945,
    messages_received: 7234,
    contacts_count: 2345,
    flows_active: 4,
    uptime_percentage: 87.3,
    response_time: 250,
    connection_quality: 'poor',
  },
];
const MOCK_CHATS: ChatMetrics[] = [
  {
    chat_id: '1',
    contact_name: 'João Silva',
    contact_phone: '+55 11 98765-4321',
    last_message: 'Preciso de informações sobre o produto X',
    last_message_time: '2024-08-15T10:25:00Z',
    message_count: 15,
    is_group: false,
    status: 'active',
    tags: ['lead-quente', 'produto-x'],
    lead_score: 85,
    automation_enabled: true,
    human_takeover: false,
  },
  {
    chat_id: '2',
    contact_name: 'Grupo Vendas',
    contact_phone: '+55 11 99999-9999',
    last_message: 'Relatório de vendas enviado',
    last_message_time: '2024-08-15T10:20:00Z',
    message_count: 234,
    is_group: true,
    status: 'active',
    tags: ['interno', 'vendas'],
    automation_enabled: false,
    human_takeover: true,
  },
];
const MOCK_FLOWS: FlowMetrics[] = [
  {
    flow_id: '1',
    flow_name: 'Boas-vindas Novos Clientes',
    status: 'active',
    executions: 1567,
    success_rate: 94.5,
    avg_completion_time: 45,
    triggers: 1450,
    revenue_generated: 25670.45,
    last_execution: '2024-08-15T10:30:00Z',
    nodes_count: 12,
  },
  {
    flow_id: '2',
    flow_name: 'Carrinho Abandonado',
    status: 'active',
    executions: 892,
    success_rate: 87.2,
    avg_completion_time: 78,
    triggers: 756,
    revenue_generated: 15890.23,
    last_execution: '2024-08-15T10:28:00Z',
    nodes_count: 8,
  },
  {
    flow_id: '3',
    flow_name: 'Pesquisa Satisfação',
    status: 'paused',
    executions: 456,
    success_rate: 92.1,
    avg_completion_time: 32,
    triggers: 423,
    revenue_generated: 0,
    last_execution: '2024-08-14T15:20:00Z',
    nodes_count: 6,
  },
];
const MOCK_MESSAGE_STATS: MessageStats[] = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  sent: Math.floor(Math.random() * 500) + 100,
  received: Math.floor(Math.random() * 400) + 80,
  automated: Math.floor(Math.random() * 300) + 60,
  human: Math.floor(Math.random() * 200) + 40,
}));
interface RevolutionaryAuraDashboardProps {
  className?: string;
}
const RevolutionaryAuraDashboard: React.FC<RevolutionaryAuraDashboardProps> = ({
  className = '',
}) => {
  const { t } = useT();
  const { showSuccess, showError, showInfo } = useAdvancedNotifications();
  const { operations, isFetching, isUpdating } = useDataLoadingStates();
  // State
  const [metrics, setMetrics] = useState<AuraMetrics>(MOCK_METRICS);
  const [connections, setConnections] = useState<AuraConnection[]>(MOCK_CONNECTIONS);
  const [chats, setChats] = useState<ChatMetrics[]>(MOCK_CHATS);
  const [flows, setFlows] = useState<FlowMetrics[]>(MOCK_FLOWS);
  const [messageStats, setMessageStats] = useState<MessageStats[]>(MOCK_MESSAGE_STATS);
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [selectedConnection, setSelectedConnection] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  // Fetch data
  const fetchAuraData = useCallback(async () => {
    try {
      await operations.fetch('aura-dashboard', async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock real-time updates
        setMetrics(prev => ({
          ...prev,
          total_messages_sent: prev.total_messages_sent + Math.floor(Math.random() * 50),
          total_messages_received: prev.total_messages_received + Math.floor(Math.random() * 40),
          automation_rate: Math.min(100, prev.automation_rate + (Math.random() - 0.5) * 2),
        }));
        return true;
      });
    } catch (error) {
      showError('Erro ao carregar dados do Aura');
    }
  }, [operations, showError]);
  // Filtrar conexões ativas
  const activeConnections = useMemo(() => {
    return connections.filter(conn => conn.status === 'connected');
  }, [connections]);
  // Chart data para mensagens
  const messageChartData = useMemo(() => {
    return messageStats.map(stat => ({
      hour: `${stat.hour}:00`,
      Enviadas: stat.sent,
      Recebidas: stat.received,
      Automáticas: stat.automated,
      Humanas: stat.human,
    }));
  }, [messageStats]);
  // Actions
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    fetchAuraData();
    showSuccess('Dashboard Aura atualizado');
  }, [fetchAuraData, showSuccess]);
  const handleConnectionAction = useCallback(async (connectionId: string, action: 'connect' | 'disconnect' | 'restart') => {
    try {
      await operations.update(`connection-${action}`, async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setConnections(prev => prev.map(conn => 
          conn.id === connectionId 
            ? { 
                ...conn, 
                status: action === 'connect' ? 'connected' : 
                       action === 'disconnect' ? 'disconnected' : 'connecting',
                last_seen: new Date().toISOString()
              }
            : conn
        ));
        return true;
      });
      const actionText = action === 'connect' ? 'conectada' : 
                        action === 'disconnect' ? 'desconectada' : 'reiniciada';
      showSuccess(`Conexão ${actionText} com sucesso`);
    } catch (error) {
      showError(`Erro ao ${action} conexão`);
    }
  }, [operations, showSuccess, showError]);
  const handleFlowAction = useCallback(async (flowId: string, action: 'start' | 'pause' | 'stop') => {
    try {
      await operations.update(`flow-${action}`, async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        setFlows(prev => prev.map(flow => 
          flow.flow_id === flowId 
            ? { 
                ...flow, 
                status: action === 'start' ? 'active' : 'paused',
                last_execution: action === 'start' ? new Date().toISOString() : flow.last_execution
              }
            : flow
        ));
        return true;
      });
      const actionText = action === 'start' ? 'iniciado' : action === 'pause' ? 'pausado' : 'parado';
      showSuccess(`Flow ${actionText} com sucesso`);
    } catch (error) {
      showError(`Erro ao ${action} flow`);
    }
  }, [operations, showSuccess, showError]);
  // Real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (realTimeEnabled) {
      interval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          total_messages_sent: prev.total_messages_sent + Math.floor(Math.random() * 10),
          total_messages_received: prev.total_messages_received + Math.floor(Math.random() * 8),
          active_connections: Math.max(0, Math.min(prev.total_connections, prev.active_connections + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0))),
        }));
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [realTimeEnabled]);
  // Initial load
  useEffect(() => {
    fetchAuraData();
  }, [fetchAuraData, refreshKey]);
  const isLoading = isFetching('aura-dashboard');
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Aura WhatsApp Automation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Plataforma de automação WhatsApp de última geração com IA integrada
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
            className="w-32"
          >
            <option value="1h">1 hora</option>
            <option value="24h">24 horas</option>
            <option value="7d">7 dias</option>
            <option value="30d">30 dias</option>
          </Select>
          <Select
            value={selectedConnection}
            onValueChange={setSelectedConnection}
            className="w-40"
          >
            <option value="all">Todas Conexões</option>
            {connections.map(conn => (
              <option key={conn.id} value={conn.id}>{conn.name}</option>
            ))}
          </Select>
          <Button
            variant={realTimeEnabled ? "primary" : "outline"}
            onClick={() => setRealTimeEnabled(!realTimeEnabled)}
            className="flex items-center space-x-2"
          >
            <Activity className="h-4 w-4" />
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
            <MessageSquarePlus className="h-4 w-4" />
            <span>Nova Conexão</span>
          </Button>
        </div>
      </div>
      {/* Real-time Status */}
      {realTimeEnabled && (
        <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Sistema Ativo - Monitoramento em Tempo Real
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1">
                <Wifi className="h-4 w-4 text-green-500" />
                <span>{activeConnections.length}/{metrics.total_connections} conectadas</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4 text-blue-500" />
                <span>{metrics.active_flows} flows ativos</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bot className="h-4 w-4 text-purple-500" />
                <span>{metrics.automation_rate.toFixed(1)}% automação</span>
              </div>
            </div>
          </div>
        </Card>
      )}
      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Messages Sent */}
        <Card className="p-6">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Mensagens Enviadas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.total_messages_sent.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+{metrics.growth_rate}% vs. período anterior</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Send className="h-6 w-6 text-green-600" />
              </div>
            </div>
          )}
        </Card>
        {/* Automation Rate */}
        <Card className="p-6">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Taxa de Automação
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.automation_rate.toFixed(1)}%
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+5.2% vs. período anterior</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          )}
        </Card>
        {/* Response Rate */}
        <Card className="p-6">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Taxa de Resposta
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.response_rate.toFixed(1)}%
                </p>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-600 ml-1">{metrics.average_response_time}ms médio</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          )}
        </Card>
        {/* Monthly Cost */}
        <Card className="p-6">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Custo Mensal
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {metrics.monthly_cost.toFixed(2)}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-600">
                    R$ {metrics.cost_per_message.toFixed(3)}/mensagem
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          )}
        </Card>
      </div>
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b">
          <nav className="flex space-x-8">
            <button 
              className={`py-2 px-1 border-b-2 text-sm font-medium ${
                activeTab === 'overview' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Visão Geral
            </button>
            <button 
              className={`py-2 px-1 border-b-2 text-sm font-medium ${
                activeTab === 'connections' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('connections')}
            >
              Conexões
            </button>
            <button 
              className={`py-2 px-1 border-b-2 text-sm font-medium ${
                activeTab === 'chats' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('chats')}
            >
              Conversas
            </button>
            <button 
              className={`py-2 px-1 border-b-2 text-sm font-medium ${
                activeTab === 'flows' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('flows')}
            >
              Flows
            </button>
          </nav>
        </div>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="mt-6 space-y-6">
            {/* Message Activity Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Atividade de Mensagens (24h)</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="success">Tempo Real</Badge>
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
                    data={messageChartData}
                    categories={['Enviadas', 'Recebidas', 'Automáticas', 'Humanas']}
                    index="hour"
                    colors={['green', 'blue', 'purple', 'orange']}
                    valueFormatter={(value) => value.toString()}
                  />
                </div>
              )}
            </Card>
            {/* Connection Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connections.map((connection) => (
                <Card key={connection.id} className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        connection.status === 'connected' ? 'bg-green-500' :
                        connection.status === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                        connection.status === 'disconnected' ? 'bg-gray-500' :
                        'bg-red-500'
                      }`} />
                      <div>
                        <h4 className="font-medium">{connection.name}</h4>
                        <p className="text-sm text-gray-500">{connection.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {connection.status === 'connected' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleConnectionAction(connection.id, 'disconnect')}
                          loading={isUpdating(`connection-disconnect`)}
                        >
                          <PhoneOff className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleConnectionAction(connection.id, 'connect')}
                          loading={isUpdating(`connection-connect`)}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleConnectionAction(connection.id, 'restart')}
                        loading={isUpdating(`connection-restart`)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Mensagens Enviadas</span>
                      <span className="font-medium">{connection.messages_sent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contatos</span>
                      <span className="font-medium">{connection.contacts_count.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Flows Ativos</span>
                      <span className="font-medium">{connection.flows_active}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime</span>
                      <span className={`font-medium ${
                        connection.uptime_percentage > 95 ? 'text-green-600' :
                        connection.uptime_percentage > 90 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {connection.uptime_percentage.toFixed(1)}%
                      </span>
                    </div>
                    {connection.battery_level && (
                      <div className="flex justify-between items-center">
                        <span>Bateria</span>
                        <div className="flex items-center space-x-1">
                          <Progress value={connection.battery_level} className="w-12 h-2" />
                          <span className="text-xs">{connection.battery_level}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        {/* Connections Tab */}
        {activeTab === 'connections' && (
          <div className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Gerenciar Conexões WhatsApp</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <QrCode className="h-4 w-4 mr-2" />
                    Escanear QR Code
                  </Button>
                  <Button variant="primary" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nova Conexão
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
                  {connections.map((connection) => (
                    <div key={connection.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                              <MessageCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                              connection.status === 'connected' ? 'bg-green-500' :
                              connection.status === 'connecting' ? 'bg-yellow-500' :
                              connection.status === 'disconnected' ? 'bg-gray-500' :
                              'bg-red-500'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-medium">{connection.name}</h4>
                            <p className="text-sm text-gray-500">{connection.phone}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={
                                connection.status === 'connected' ? 'success' :
                                connection.status === 'connecting' ? 'warning' :
                                'default'
                              }>
                                {connection.status}
                              </Badge>
                              <Badge variant="secondary">
                                {connection.connection_quality}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-8">
                          <div className="text-center">
                            <p className="text-sm font-medium">{connection.messages_sent.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Enviadas</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">{connection.messages_received.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Recebidas</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">{connection.contacts_count.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Contatos</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">{connection.response_time}ms</p>
                            <p className="text-xs text-gray-500">Resposta</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {connection.status === 'connected' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleConnectionAction(connection.id, 'disconnect')}
                                loading={isUpdating(`connection-disconnect`)}
                              >
                                Desconectar
                              </Button>
                            ) : (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleConnectionAction(connection.id, 'connect')}
                                loading={isUpdating(`connection-connect`)}
                              >
                                Conectar
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
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
        {/* Flows Tab */}
        {activeTab === 'flows' && (
          <div className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Flows de Automação</h3>
                <div className="flex items-center space-x-2">
                  <Input placeholder="Buscar flows..." className="w-64" />
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="primary" size="sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Novo Flow
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
                  {flows.map((flow) => (
                    <div key={flow.flow_id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                            <Zap className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{flow.flow_name}</h4>
                            <p className="text-sm text-gray-500">{flow.nodes_count} nós</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={
                                flow.status === 'active' ? 'success' :
                                flow.status === 'paused' ? 'warning' :
                                'default'
                              }>
                                {flow.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-8">
                          <div className="text-center">
                            <p className="text-sm font-medium">{flow.executions.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Execuções</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">{flow.success_rate.toFixed(1)}%</p>
                            <p className="text-xs text-gray-500">Taxa Sucesso</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">{flow.avg_completion_time}s</p>
                            <p className="text-xs text-gray-500">Tempo Médio</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">R$ {flow.revenue_generated.toLocaleString('pt-BR')}</p>
                            <p className="text-xs text-gray-500">Receita</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {flow.status === 'active' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFlowAction(flow.flow_id, 'pause')}
                                loading={isUpdating(`flow-pause`)}
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleFlowAction(flow.flow_id, 'start')}
                                loading={isUpdating(`flow-start`)}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
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
      </Tabs>
    </div>
  );
};
export default RevolutionaryAuraDashboard;
