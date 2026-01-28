/**
 * Hook especializado para analytics AI
 * Gerencia métricas, relatórios e insights
 */
import { useCallback, useState, useEffect } from 'react';
import { useAIStore } from './useAIStore';
import { AIAnalytics, AIPeriod } from '../types';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';

export const useAIAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AIAnalytics | null>(null);
  const [period, setPeriod] = useState<AIPeriod>('week');
  
  const {
    textGenerations,
    imageGenerations,
    videoGenerations,
    getAnalytics: storeGetAnalytics
  } = useAIStore();

  // Carregar analytics na inicialização
  useEffect(() => {
    loadAnalytics(period);
  }, [period]);

  // Carregar analytics
  const loadAnalytics = useCallback(async (analyticsPeriod: AIPeriod = period) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await storeGetAnalytics(analyticsPeriod);
      setAnalytics(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar analytics';
      setError(errorMessage);
      notify('error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [storeGetAnalytics, period]);

  // Alterar período
  const changePeriod = useCallback((newPeriod: AIPeriod) => {
    setPeriod(newPeriod);
    loadAnalytics(newPeriod);
  }, [loadAnalytics]);

  // Calcular métricas em tempo real
  const calculateRealTimeMetrics = useCallback(() => {
    const allGenerations = [
      ...textGenerations,
      ...imageGenerations,
      ...videoGenerations
    ];

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filtrar por período
    const todayGenerations = allGenerations.filter(gen => 
      new Date(gen.created_at) >= oneDayAgo
    );
    const weekGenerations = allGenerations.filter(gen => 
      new Date(gen.created_at) >= oneWeekAgo
    );
    const monthGenerations = allGenerations.filter(gen => 
      new Date(gen.created_at) >= oneMonthAgo
    );

    // Calcular métricas
    const calculateMetrics = (generations: typeof allGenerations) => {
      const totalGenerations = generations.length;
      const totalCost = generations.reduce((sum, gen) => sum + (gen.metadata.cost || 0), 0);
      const totalTokens = generations.reduce((sum, gen) => sum + (gen.metadata.tokens || 0), 0);
      const avgQuality = generations.reduce((sum, gen) => sum + (gen.metadata.quality || 0), 0) / totalGenerations || 0;

      const providerUsage = generations.reduce((acc, gen) => {
        if (!acc[gen.provider]) {
          acc[gen.provider] = { generations: 0, tokens: 0, cost: 0 };
        }
        acc[gen.provider].generations += 1;
        acc[gen.provider].tokens += gen.metadata.tokens || 0;
        acc[gen.provider].cost += gen.metadata.cost || 0;
        return acc;
      }, {} as Record<string, { generations: number; tokens: number; cost: number }>);

      const typeStats = {
        text: generations.filter(gen => gen.type === 'text').length,
        image: generations.filter(gen => gen.type === 'image').length,
        video: generations.filter(gen => gen.type === 'video').length
      };

      return {
        totalGenerations,
        totalCost,
        totalTokens,
        avgQuality,
        providerUsage,
        typeStats
      };
    };

    return {
      today: calculateMetrics(todayGenerations),
      week: calculateMetrics(weekGenerations),
      month: calculateMetrics(monthGenerations),
      all: calculateMetrics(allGenerations)
    };
  }, [textGenerations, imageGenerations, videoGenerations]);

  // Obter tendências
  const getTrends = useCallback(() => {
    const metrics = calculateRealTimeMetrics();
    
    const trends = {
      generations: {
        today: metrics.today.totalGenerations,
        week: metrics.week.totalGenerations,
        month: metrics.month.totalGenerations,
        trend: metrics.week.totalGenerations > metrics.month.totalGenerations / 4 ? 'up' : 'down'
      },
      cost: {
        today: metrics.today.totalCost,
        week: metrics.week.totalCost,
        month: metrics.month.totalCost,
        trend: metrics.week.totalCost > metrics.month.totalCost / 4 ? 'up' : 'down'
      },
      quality: {
        today: metrics.today.avgQuality,
        week: metrics.week.avgQuality,
        month: metrics.month.avgQuality,
        trend: metrics.week.avgQuality > metrics.month.avgQuality ? 'up' : 'down'
      }
    };

    return trends;
  }, [calculateRealTimeMetrics]);

  // Obter insights
  const getInsights = useCallback(() => {
    const metrics = calculateRealTimeMetrics();
    const trends = getTrends();
    
    const insights = [];

    // Insight sobre uso
    if (metrics.week.totalGenerations > metrics.month.totalGenerations / 2) {
      insights.push({
        type: 'usage',
        level: 'high',
        message: 'Uso intenso detectado esta semana',
        recommendation: 'Considere otimizar prompts para reduzir custos'
      });
    }

    // Insight sobre custos
    if (metrics.week.totalCost > metrics.month.totalCost / 2) {
      insights.push({
        type: 'cost',
        level: 'warning',
        message: 'Custos elevados esta semana',
        recommendation: 'Revise provedores e modelos utilizados'
      });
    }

    // Insight sobre qualidade
    if (metrics.week.avgQuality < 0.7) {
      insights.push({
        type: 'quality',
        level: 'warning',
        message: 'Qualidade das gerações abaixo do esperado',
        recommendation: 'Ajuste parâmetros como temperature e max_tokens'
      });
    }

    // Insight sobre provedores
    const topProvider = Object.entries(metrics.week.providerUsage)
      .sort(([,a], [,b]) => b.generations - a.generations)[0];
    
    if (topProvider) {
      insights.push({
        type: 'provider',
        level: 'info',
        message: `${topProvider[0]} é o provedor mais utilizado`,
        recommendation: 'Considere diversificar provedores para melhor resiliência'
      });
    }

    return insights;
  }, [calculateRealTimeMetrics, getTrends]);

  // Gerar relatório
  const generateReport = useCallback((reportPeriod: AIPeriod = period) => {
    const metrics = calculateRealTimeMetrics();
    const trends = getTrends();
    const insights = getInsights();
    
    const report = {
      period: reportPeriod,
      generated_at: new Date().toISOString(),
      metrics: metrics[reportPeriod] || metrics.all,
      trends,
      insights,
      recommendations: insights.map(insight => insight.recommendation)
    };

    // Exportar relatório
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-analytics-report-${reportPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    notify('success', 'Relatório gerado com sucesso!');
    return report;
  }, [period, calculateRealTimeMetrics, getTrends, getInsights]);

  return {
    // Estado
    loading,
    error,
    analytics,
    period,
    
    // Ações
    loadAnalytics,
    changePeriod,
    generateReport,
    
    // Métricas
    calculateRealTimeMetrics,
    getTrends,
    getInsights,
    
    // Controle de erro
    clearError: () => setError(null)
  };
};
