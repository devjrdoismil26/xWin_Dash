import React, { useState, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import InputError from '@/components/ui/InputError';
import { Select } from '@/components/ui/select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Copy, RefreshCw, TrendingUp, Zap, Lightbulb, Target } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/services';
const CONTENT_TYPES = [
  { value: 'subject_line', label: 'Linha de Assunto' },
  { value: 'email_body', label: 'Corpo do Email' },
  { value: 'call_to_action', label: 'Call-to-Action' },
  { value: 'preview_text', label: 'Texto de Prévia' },
];
const INDUSTRY_TYPES = [
  { value: 'technology', label: 'Tecnologia' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'healthcare', label: 'Saúde' },
  { value: 'education', label: 'Educação' },
  { value: 'finance', label: 'Finanças' },
  { value: 'real_estate', label: 'Imobiliário' },
  { value: 'automotive', label: 'Automotivo' },
  { value: 'food_beverage', label: 'Alimentação' },
  { value: 'travel', label: 'Viagem' },
  { value: 'fashion', label: 'Moda' },
];
const CAMPAIGN_GOALS = [
  { value: 'awareness', label: 'Conscientização' },
  { value: 'engagement', label: 'Engajamento' },
  { value: 'conversion', label: 'Conversão' },
  { value: 'retention', label: 'Retenção' },
  { value: 'upsell', label: 'Upsell/Cross-sell' },
  { value: 'reactivation', label: 'Reativação' },
];
const ContentRecommender: React.FC<{onContentSelect}> = ({ onContentSelect }) => {
  const [requestData, setRequestData] = useState({
    content_type: 'subject_line',
    industry: 'technology',
    campaign_goal: 'engagement',
    target_audience: '',
    key_message: '',
    tone: 'professional',
    length: 'medium',
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const handleDataChange = useCallback((field, value) => {
    setRequestData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  }, [errors]);
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!requestData.target_audience.trim()) newErrors.target_audience = 'Descrição da audiência é obrigatória.';
    if (!requestData.key_message.trim()) newErrors.key_message = 'Mensagem principal é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [requestData]);
  const generate = useCallback(async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { data } = await apiClient.post('/api/email-marketing/optimization/content-recommendations', requestData);
      const recs = data?.recommendations || [];
      setRecommendations(recs);
      if (recs.length > 0) toast.success(`${recs.length} recomendações geradas!`);
      else toast.info('Nenhuma recomendação gerada. Tente ajustar os parâmetros.');
    } catch (err) {
      toast.error('Erro ao gerar recomendações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [requestData, validateForm]);
  const copyToClipboard = useCallback(async (content) => {
    await navigator.clipboard.writeText(content);
    toast.success('Conteúdo copiado para a área de transferência!');
  }, []);
  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>Recomendador de Conteúdo</span>
          </Card.Title>
        </Card.Header>
        <Card.Content className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <InputLabel htmlFor="content_type">Tipo de Conteúdo</InputLabel>
              <Select id="content_type" value={requestData.content_type} onChange={(e) => handleDataChange('content_type', e.target.value)}>
                {CONTENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </Select>
            </div>
            <div>
              <InputLabel htmlFor="industry">Indústria</InputLabel>
              <Select id="industry" value={requestData.industry} onChange={(e) => handleDataChange('industry', e.target.value)}>
                {INDUSTRY_TYPES.map((industry) => (
                  <option key={industry.value} value={industry.value}>{industry.label}</option>
                ))}
              </Select>
            </div>
            <div>
              <InputLabel htmlFor="campaign_goal">Objetivo</InputLabel>
              <Select id="campaign_goal" value={requestData.campaign_goal} onChange={(e) => handleDataChange('campaign_goal', e.target.value)}>
                {CAMPAIGN_GOALS.map((goal) => (
                  <option key={goal.value} value={goal.value}>{goal.label}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="target_audience">Audiência *</InputLabel>
              <Textarea
                id="target_audience"
                rows={3}
                value={requestData.target_audience}
                onChange={(e) => handleDataChange('target_audience', e.target.value)}
                placeholder="Ex: decisores de marketing de empresas B2B, entre 25-45 anos..."
                className={errors.target_audience ? 'border-red-500' : ''}
              />
              <InputError text={errors.target_audience} />
            </div>
            <div>
              <InputLabel htmlFor="key_message">Mensagem Principal *</InputLabel>
              <Textarea
                id="key_message"
                rows={3}
                value={requestData.key_message}
                onChange={(e) => handleDataChange('key_message', e.target.value)}
                placeholder="Ex: desconto de 30% em todas as ferramentas de automação..."
                className={errors.key_message ? 'border-red-500' : ''}
              />
              <InputError text={errors.key_message} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="tone">Tom</InputLabel>
              <Select id="tone" value={requestData.tone} onChange={(e) => handleDataChange('tone', e.target.value)}>
                <option value="professional">Profissional</option>
                <option value="friendly">Amigável</option>
                <option value="urgent">Urgente</option>
                <option value="playful">Divertido</option>
                <option value="authoritative">Autoritativo</option>
              </Select>
            </div>
            <div>
              <InputLabel htmlFor="length">Tamanho</InputLabel>
              <Select id="length" value={requestData.length} onChange={(e) => handleDataChange('length', e.target.value)}>
                <option value="short">Curto</option>
                <option value="medium">Médio</option>
                <option value="long">Longo</option>
              </Select>
            </div>
          </div>
          <div className="flex justify-center">
            <Button onClick={generate} disabled={loading} className="flex items-center gap-2">
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Zap className="w-4 h-4" />}
              Gerar Recomendações
            </Button>
          </div>
          {recommendations.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Sugestões</span>
                <Badge variant="success">{recommendations.length}</Badge>
              </div>
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">Sugestão #{idx + 1}</h4>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(typeof rec === 'string' ? rec : JSON.stringify(rec))}>
                          <Copy className="w-3 h-3 mr-1" /> Copiar
                        </Button>
                        <Button size="sm" onClick={() => onContentSelect?.(rec)}>
                          <Target className="w-3 h-3 mr-1" /> Usar
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {typeof rec === 'string' ? rec : JSON.stringify(rec, null, 2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <Button onClick={generate} variant="outline" disabled={loading} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Gerar mais
                </Button>
              </div>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};
export default ContentRecommender;
