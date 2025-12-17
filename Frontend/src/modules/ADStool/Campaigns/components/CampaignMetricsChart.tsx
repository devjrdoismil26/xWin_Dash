/**
 * Gráfico de métricas de campanha
 *
 * @description
 * Componente para exibir gráfico de métricas de campanha (impressões, cliques,
 * gastos, CTR, CPC) ao longo do tempo usando Recharts.
 * Carrega dados da API e exibe em formato de linha.
 *
 * @module modules/ADStool/Campaigns/components/CampaignMetricsChart
 * @since 1.0.0
 */

import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { route } from 'ziggy-js';
import Card from '@/shared/components/ui/Card';
import { apiClient } from '@/services';

/**
 * Props do componente CampaignMetricsChart
 *
 * @interface CampaignMetricsChartProps
 * @property {string | number} campaignId - ID da campanha
 * @property {string} [dateRange] - Período de datas (padrão: '30d')
 */
interface CampaignMetricsChartProps {
  campaignId: string | number;
  dateRange?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Interface de métrica da campanha
 *
 * @interface CampaignMetric
 * @property {string} date - Data formatada
 * @property {number} impressions - Número de impressões
 * @property {number} clicks - Número de cliques
 * @property {number} spend - Gasto em R$
 * @property {number} ctr - Taxa de clique (CTR) em %
 * @property {number} cpc - Custo por clique (CPC) em R$
 */
interface CampaignMetric {
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpc: number; }

/**
 * Componente CampaignMetricsChart
 *
 * @description
 * Renderiza gráfico de linha responsivo com métricas de campanha.
 * Carrega dados da API, formata valores e exibe múltiplas linhas
 * para diferentes métricas.
 *
 * @param {CampaignMetricsChartProps} props - Props do componente
 * @returns {JSX.Element} Gráfico de métricas
 *
 * @example
 * ```tsx
 * <CampaignMetricsChart campaignId={123} dateRange="7d" / />
 * ```
 */
const CampaignMetricsChart: React.FC<CampaignMetricsChartProps> = ({ campaignId, dateRange = '30d'    }) => {
  const [metrics, setMetrics] = useState<CampaignMetric[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!campaignId) {
        setLoading(false);

        return;
      }
      try {
        setLoading(true);

        setError(null);

        const response = await apiClient.get(route('api.adstool.campaigns.metrics', { id: campaignId, range: dateRange })) as { data?: Array<{ date: string; impressions?: number; clicks?: number; spend?: number; [key: string]: unknown }>};

        const transformedData: CampaignMetric[] = (response.data || []).map((item: unknown) => {
          const impressions = item.impressions || 0;
          const clicks = item.clicks || 0;
          const spend = (item.spend || 0) as number;
          return {
            date: new Date(item.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
            impressions,
            clicks,
            spend,
            ctr: clicks && impressions ? Number(((clicks / impressions) * 100).toFixed(2)) : 0,
            cpc: clicks && spend ? Number((spend / clicks).toFixed(2)) : 0,};

        });

        setMetrics(transformedData);

      } catch (err) {
        setError('Erro ao carregar métricas da campanha.');

      } finally {
        setLoading(false);

      } ;

    fetchMetrics();

  }, [campaignId, dateRange]);

  const formatTooltipValue = (value: number | string, name: string): [string, string] => {
    const numValue = typeof value === 'string' ? Number(value) : value;
    switch (name) {
      case 'spend':
        return [`R$ ${numValue.toFixed(2)}`, 'Gasto'];
      case 'ctr':
        return [`${numValue}%`, 'CTR'];
      case 'cpc':
        return [`R$ ${numValue}`, 'CPC'];
      case 'impressions':
        return [new Intl.NumberFormat('pt-BR').format(numValue), 'Impressões'];
      case 'clicks':
        return [new Intl.NumberFormat('pt-BR').format(numValue), 'Cliques'];
      default:
        return [String(value), name];
    } ;

  return (
        <>
      <Card className="p-6" />
      <div className=" ">$2</div><h3 className="text-lg font-semibold mb-4">Métricas</h3>
        <div className=" ">$2</div><ResponsiveContainer width="100%" height="100%" />
            <LineChart data={ metrics } />
              <CartesianGrid strokeDasharray="3 3" / />
              <XAxis dataKey="date" / />
              <YAxis yAxisId="left" / />
              <YAxis yAxisId="right" orientation="right" / />
              <Tooltip formatter={formatTooltipValue} contentStyle={ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' } / />
              <Legend / />
              <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#3b82f6" strokeWidth={2} name="Impressões" / />
              <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} name="Cliques" / />
              <Line yAxisId="right" type="monotone" dataKey="spend" stroke="#f59e0b" strokeWidth={2} name="Gasto (R$)" / />
              <Line yAxisId="right" type="monotone" dataKey="ctr" stroke="#ef4444" strokeWidth={2} name="CTR (%)" / />
              <Line yAxisId="right" type="monotone" dataKey="cpc" stroke="#8b5cf6" strokeWidth={2} name="CPC (R$)" / /></LineChart></ResponsiveContainer></div></Card>);};

export default CampaignMetricsChart;
