import React, { useEffect, useState, useCallback } from 'react';
import Card from '@/components/ui/Card';
import { Select } from '@/components/ui/select';
import InputLabel from '@/components/ui/InputLabel';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';
import { apiClient } from '@/services';
const CampaignOptimizerDashboard: React.FC<{onOptimize}> = ({ onOptimize }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [campaignId, setCampaignId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [errorCampaigns, setErrorCampaigns] = useState(null);
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoadingCampaigns(true);
      setErrorCampaigns(null);
      try {
        const { data } = await apiClient.get('/api/email-marketing/campaigns', { params: { fields: 'id,name' } });
        setCampaigns(data?.data || data || []);
      } catch (err) {
        setErrorCampaigns('Falha ao carregar campanhas.');
      } finally {
        setLoadingCampaigns(false);
      }
    };
    fetchCampaigns();
  }, []);
  const handleOptimize = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const { data } = await apiClient.post('/api/email-marketing/optimization/optimize-campaign', { campaign_id: campaignId });
      onOptimize?.(data);
      toast.success('Otimização completa iniciada!');
    } catch (err) {
      const message = err?.response?.data?.message || 'Erro ao otimizar campanha.';
      toast.error('Erro ao otimizar campanha.', { description: message });
    } finally {
      setLoading(false);
    }
  }, [campaignId, onOptimize]);
  return (
    <Card>
      <Card.Header>
        <Card.Title>Dashboard de Otimização de Campanha</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div>
          <InputLabel htmlFor="campaign">Campanha</InputLabel>
          {loadingCampaigns ? (
            <p className="text-sm text-gray-500">Carregando campanhas...</p>
          ) : errorCampaigns ? (
            <p className="text-sm text-red-600">{errorCampaigns}</p>
          ) : (
            <Select id="campaign" value={campaignId} onChange={(e) => setCampaignId(e.target.value)}>
              <option value="">Selecione...</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || `#${c.id}`}
                </option>
              ))}
            </Select>
          )}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleOptimize} disabled={!campaignId || loading}>
            {loading ? 'Otimizando...' : 'Otimizar'}
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};
export default CampaignOptimizerDashboard;
