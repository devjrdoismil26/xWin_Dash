import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { route } from 'ziggy-js';
import Card from '@/components/ui/Card';
import { apiClient } from '@/services';
const CampaignMetricsChart = ({ campaignId, dateRange = '30d' }) => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchMetrics = async () => {
      if (!campaignId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get(route('api.adstool.campaigns.metrics', { id: campaignId, range: dateRange }));
        const transformedData = (response.data || []).map((item) => ({
          date: new Date(item.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
          impressions: item.impressions || 0,
          clicks: item.clicks || 0,
          spend: item.spend || 0,
          ctr: item.clicks && item.impressions ? Number(((item.clicks / item.impressions) * 100).toFixed(2)) : 0,
          cpc: item.clicks && item.spend ? Number((item.spend / item.clicks).toFixed(2)) : 0,
        }));
        setMetrics(transformedData);
      } catch (err) {
        setError('Erro ao carregar métricas da campanha.');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [campaignId, dateRange]);
  const formatTooltipValue = (value, name) => {
    switch (name) {
      case 'spend':
        return [`R$ ${Number(value).toFixed(2)}`, 'Gasto'];
      case 'ctr':
        return [`${value}%`, 'CTR'];
      case 'cpc':
        return [`R$ ${value}`, 'CPC'];
      case 'impressions':
        return [new Intl.NumberFormat('pt-BR').format(value), 'Impressões'];
      case 'clicks':
        return [new Intl.NumberFormat('pt-BR').format(value), 'Cliques'];
      default:
        return [value, name];
    }
  };
  return (
    <Card className="p-6">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Métricas</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={formatTooltipValue} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#3b82f6" strokeWidth={2} name="Impressões" />
              <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} name="Cliques" />
              <Line yAxisId="right" type="monotone" dataKey="spend" stroke="#f59e0b" strokeWidth={2} name="Gasto (R$)" />
              <Line yAxisId="right" type="monotone" dataKey="ctr" stroke="#ef4444" strokeWidth={2} name="CTR (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
export default CampaignMetricsChart;
