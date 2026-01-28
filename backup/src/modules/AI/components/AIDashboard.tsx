/**
 * Dashboard principal do módulo AI
 * Componente base com variantes (basic, advanced, revolutionary)
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Brain, 
  MessageSquare, 
  Image, 
  Video, 
  BarChart3, 
  Sparkles,
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Clock, 
  Users, 
  Cpu, 
  Database, 
  PieChart, 
  LineChart, 
  Settings, 
  RefreshCw, 
  Download, 
  Filter, 
  Search,
  Play,
  Pause,
  Square,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Monitor,
  Cloud,
  HardDrive,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Card } from "@/components/ui/Card"
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { AnimatedCounter, PageTransition } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { useAI } from '../hooks';
import { AIComponentProps } from '../types';

interface AIDashboardProps extends AIComponentProps {
  variant?: 'basic' | 'advanced' | 'revolutionary';
  features?: string[];
  showAdvancedMetrics?: boolean;
  showRealTimeData?: boolean;
  showProviderStatus?: boolean;
  showCostAnalytics?: boolean;
}

const AIDashboard: React.FC<AIDashboardProps> = ({ 
  variant = 'basic',
  className = '',
  onAction,
  features = [],
  showAdvancedMetrics = false,
  showRealTimeData = false,
  showProviderStatus = false,
  showCostAnalytics = false
}) => {
  const { 
    loading, 
    error, 
    servicesStatus, 
    generation, 
    providers, 
    history, 
    analytics 
  } = useAI();

  // Estado local para funcionalidades avançadas
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Configurações por variante
  const variantConfig = useMemo(() => {
    switch (variant) {
      case 'advanced':
        return {
          showAdvancedMetrics: true,
          showRealTimeData: true,
          showProviderStatus: true,
          showCostAnalytics: true,
          features: ['analytics', 'providers', 'costs', 'realtime']
        };
      case 'revolutionary':
        return {
          showAdvancedMetrics: true,
          showRealTimeData: true,
          showProviderStatus: true,
          showCostAnalytics: true,
          features: ['analytics', 'providers', 'costs', 'realtime', 'ai-insights', 'predictions']
        };
      default:
        return {
          showAdvancedMetrics: false,
          showRealTimeData: false,
          showProviderStatus: false,
          showCostAnalytics: false,
          features: ['basic']
        };
    }
  }, [variant]);

  // Estilos por variante
  const getVariantStyles = useCallback(() => {
    switch (variant) {
      case 'advanced':
        return 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-200/20';
      case 'revolutionary':
        return 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200/20';
      default:
        return 'bg-white/10 border-white/20';
    }
  }, [variant]);

  // Carregar dados em tempo real
  useEffect(() => {
    if (showRealTimeData) {
      const interval = setInterval(async () => {
        try {
          const data = await analytics.getRealTimeData();
          setRealTimeData(data);
        } catch (error) {
          console.error('Erro ao carregar dados em tempo real:', error);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [showRealTimeData, analytics]);

  // Função de refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        providers.loadProviders(),
        analytics.loadAnalytics(),
        history.loadHistory()
      ]);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [providers, analytics, history]);

  // Features básicas
  const basicFeatures = [
    {
      title: 'Geração de Texto',
      description: 'Crie textos inteligentes com IA',
      icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
      href: '/ai/generation',
      color: 'bg-blue-50 border-blue-200',
      count: generation.textGenerations.length
    },
    {
      title: 'Geração de Imagem',
      description: 'Crie imagens com IA',
      icon: <Image className="w-8 h-8 text-green-600" />,
      href: '/ai/image-generation',
      color: 'bg-green-50 border-green-200',
      count: generation.imageGenerations.length
    },
    {
      title: 'Geração de Vídeo',
      description: 'Crie vídeos com IA',
      icon: <Video className="w-8 h-8 text-purple-600" />,
      href: '/ai/video-generation',
      color: 'bg-purple-50 border-purple-200',
      count: generation.videoGenerations.length
    },
    {
      title: 'Chat Inteligente',
      description: 'Converse com IA',
      icon: <Brain className="w-8 h-8 text-orange-600" />,
      href: '/ai/chat',
      color: 'bg-orange-50 border-orange-200',
      count: history.chatHistory.length
    }
  ];

  // Features avançadas
  const advancedFeatures = [
    ...basicFeatures,
    {
      title: 'Analytics Avançados',
      description: 'Métricas detalhadas de uso',
      icon: <BarChart3 className="w-8 h-8 text-indigo-600" />,
      href: '/ai/analytics',
      color: 'bg-indigo-50 border-indigo-200',
      count: analytics.totalGenerations
    },
    {
      title: 'Gerenciamento de Providers',
      description: 'Configure provedores de IA',
      icon: <Settings className="w-8 h-8 text-gray-600" />,
      href: '/ai/providers',
      color: 'bg-gray-50 border-gray-200',
      count: providers.availableProviders.length
    }
  ];

  // Features revolucionárias
  const revolutionaryFeatures = [
    ...advancedFeatures,
    {
      title: 'Insights de IA',
      description: 'Análises preditivas',
      icon: <Sparkles className="w-8 h-8 text-pink-600" />,
      href: '/ai/insights',
      color: 'bg-pink-50 border-pink-200',
      count: analytics.aiInsights?.length || 0
    },
    {
      title: 'Previsões',
      description: 'Previsões de tendências',
      icon: <Target className="w-8 h-8 text-cyan-600" />,
      href: '/ai/predictions',
      color: 'bg-cyan-50 border-cyan-200',
      count: analytics.predictions?.length || 0
    }
  ];

  // Selecionar features baseado na variante
  const selectedFeatures = useMemo(() => {
    switch (variant) {
      case 'advanced':
        return advancedFeatures;
      case 'revolutionary':
        return revolutionaryFeatures;
      default:
        return basicFeatures;
    }
  }, [variant]);

  // Métricas básicas
  const basicMetrics = [
    {
      title: 'Total de Gerações',
      value: analytics.totalGenerations,
      icon: <Brain className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Textos Gerados',
      value: generation.textGenerations.length,
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Imagens Geradas',
      value: generation.imageGenerations.length,
      icon: <Image className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Vídeos Gerados',
      value: generation.videoGenerations.length,
      icon: <Video className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  // Métricas avançadas
  const advancedMetrics = [
    ...basicMetrics,
    {
      title: 'Custo Total',
      value: `R$ ${analytics.totalCost?.toFixed(2) || '0.00'}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Tempo Médio',
      value: `${analytics.averageTime || 0}s`,
      icon: <Clock className="w-6 h-6" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Taxa de Sucesso',
      value: `${analytics.successRate || 0}%`,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Providers Ativos',
      value: providers.activeProviders.length,
      icon: <Cpu className="w-6 h-6" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  // Selecionar métricas baseado na variante
  const selectedMetrics = useMemo(() => {
    if (variant === 'advanced' || variant === 'revolutionary') {
      return advancedMetrics;
    }
    return basicMetrics;
  }, [variant]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
        <Button onClick={handleRefresh} className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <PageTransition type="fade" duration={500}>
      <div className={`ai-dashboard space-y-6 ${getVariantStyles()} ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-600" />
              AI Dashboard
              {variant !== 'basic' && (
                <Badge variant="secondary" className="ml-2">
                  {variant === 'advanced' ? 'Avançado' : 'Revolucionário'}
                </Badge>
              )}
            </h1>
            <p className="text-gray-600 mt-1">
              {variant === 'basic' && 'Gerencie suas ferramentas de IA'}
              {variant === 'advanced' && 'Dashboard avançado com métricas detalhadas'}
              {variant === 'revolutionary' && 'Interface revolucionária com IA preditiva'}
            </p>
          </div>
          
          {(variant === 'advanced' || variant === 'revolutionary') && (
            <div className="flex items-center gap-3">
              <Select
                value={selectedTimeRange}
                onValueChange={setSelectedTimeRange}
                className="w-32"
              >
                <option value="1d">Último dia</option>
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
              </Select>
              
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          )}
        </div>

        {/* Métricas */}
        <ResponsiveGrid
          columns={{ xs: 1, sm: 2, lg: 4 }}
          gap={{ xs: '1rem', md: '1.5rem' }}
        >
          {selectedMetrics.map((metric, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter
                      value={typeof metric.value === 'number' ? metric.value : 0}
                      duration={2000}
                    />
                    {typeof metric.value === 'string' && metric.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </ResponsiveGrid>

        {/* Status dos Providers (Apenas variantes avançadas) */}
        {(variant === 'advanced' || variant === 'revolutionary') && showProviderStatus && (
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                Status dos Providers
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {providers.availableProviders.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        provider.status === 'active' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {provider.status === 'active' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-gray-600">{provider.type}</p>
                      </div>
                    </div>
                    <Badge variant={provider.status === 'active' ? 'success' : 'destructive'}>
                      {provider.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Features Grid */}
        <Card>
          <Card.Header>
            <Card.Title>Funcionalidades</Card.Title>
            <Card.Description>
              Acesse todas as ferramentas de IA disponíveis
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <ResponsiveGrid
              columns={{ xs: 1, sm: 2, lg: 3 }}
              gap={{ xs: '1rem', md: '1.5rem' }}
            >
              {selectedFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${feature.color}`}
                  onClick={() => onAction?.('navigate', { href: feature.href })}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      {feature.icon}
                    </div>
                    <Badge variant="secondary">
                      {feature.count}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </ResponsiveGrid>
          </Card.Content>
        </Card>

        {/* Dados em Tempo Real (Apenas variantes avançadas) */}
        {(variant === 'advanced' || variant === 'revolutionary') && showRealTimeData && realTimeData && (
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Dados em Tempo Real
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Gerações/min</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {realTimeData.generationsPerMinute || 0}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Usuários ativos</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {realTimeData.activeUsers || 0}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        )}
      </div>
    </PageTransition>
  );
};

export default AIDashboard;
