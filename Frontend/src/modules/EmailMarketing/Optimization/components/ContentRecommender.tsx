import React, { useState, useCallback } from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import InputError from '@/shared/components/ui/InputError';
import Select from '@/shared/components/ui/Select';
import Textarea from '@/shared/components/ui/Textarea';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
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
const ContentRecommender: React.FC<{onContentSelect}> = ({ onContentSelect    }) => {
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

  const handleDataChange = useCallback((field: unknown, value: unknown) => {
    setRequestData((prev: unknown) => ({ ...prev, [field]: value }));

    if (errors[field]) setErrors((prev: unknown) => ({ ...prev, [field]: null }));

  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {} as any;
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

    } , [requestData, validateForm]);

  const copyToClipboard = useCallback(async (content: unknown) => {
    await navigator.clipboard.writeText(content);

    toast.success('Conteúdo copiado para a área de transferência!');

  }, []);

  return (
            <div className=" ">$2</div><Card />
        <Card.Header />
          <Card.Title className="flex items-center space-x-2" />
            <Lightbulb className="w-5 h-5" />
            <span>Recomendador de Conteúdo</span>
          </Card.Title>
        </Card.Header>
        <Card.Content className="space-y-6" />
          <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="content_type">Tipo de Conteúdo</InputLabel>
              <Select id="content_type" value={requestData.content_type} onChange={ (e: unknown) => handleDataChange('content_type', e.target.value)  }>
                {(CONTENT_TYPES || []).map((type: unknown) => (
                  <option key={type.value} value={ type.value }>{type.label}</option>
                ))}
              </Select></div><div>
           
        </div><InputLabel htmlFor="industry">Indústria</InputLabel>
              <Select id="industry" value={requestData.industry} onChange={ (e: unknown) => handleDataChange('industry', e.target.value)  }>
                {(INDUSTRY_TYPES || []).map((industry: unknown) => (
                  <option key={industry.value} value={ industry.value }>{industry.label}</option>
                ))}
              </Select></div><div>
           
        </div><InputLabel htmlFor="campaign_goal">Objetivo</InputLabel>
              <Select id="campaign_goal" value={requestData.campaign_goal} onChange={ (e: unknown) => handleDataChange('campaign_goal', e.target.value)  }>
                {(CAMPAIGN_GOALS || []).map((goal: unknown) => (
                  <option key={goal.value} value={ goal.value }>{goal.label}</option>
                ))}
              </Select></div><div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="target_audience">Audiência *</InputLabel>
              <Textarea
                id="target_audience"
                rows={ 3 }
                value={ requestData.target_audience }
                onChange={ (e: unknown) => handleDataChange('target_audience', e.target.value) }
                placeholder="Ex: decisores de marketing de empresas B2B, entre 25-45 anos..."
                className={errors.target_audience ? 'border-red-500' : '' } />
              <InputError text={errors.target_audience} / /></div><div>
           
        </div><InputLabel htmlFor="key_message">Mensagem Principal *</InputLabel>
              <Textarea
                id="key_message"
                rows={ 3 }
                value={ requestData.key_message }
                onChange={ (e: unknown) => handleDataChange('key_message', e.target.value) }
                placeholder="Ex: desconto de 30% em todas as ferramentas de automação..."
                className={errors.key_message ? 'border-red-500' : '' } />
              <InputError text={errors.key_message} / /></div><div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="tone">Tom</InputLabel>
              <Select id="tone" value={requestData.tone} onChange={ (e: unknown) => handleDataChange('tone', e.target.value)  }>
                <option value="professional">Profissional</option>
                <option value="friendly">Amigável</option>
                <option value="urgent">Urgente</option>
                <option value="playful">Divertido</option>
                <option value="authoritative">Autoritativo</option></Select></div>
            <div>
           
        </div><InputLabel htmlFor="length">Tamanho</InputLabel>
              <Select id="length" value={requestData.length} onChange={ (e: unknown) => handleDataChange('length', e.target.value)  }>
                <option value="short">Curto</option>
                <option value="medium">Médio</option>
                <option value="long">Longo</option></Select></div>
          <div className=" ">$2</div><Button onClick={generate} disabled={loading} className="flex items-center gap-2" />
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Zap className="w-4 h-4" />}
              Gerar Recomendações
            </Button>
          </div>
          {recommendations.length > 0 && (
            <div>
           
        </div><div className=" ">$2</div><TrendingUp className="w-4 h-4" />
                <span className="font-medium">Sugestões</span>
                <Badge variant="success">{recommendations.length}</Badge></div><div className="{(recommendations || []).map((rec: unknown, idx: unknown) => (">$2</div>
                  <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
           
        </div><div className=" ">$2</div><h4 className="font-medium text-gray-900">Sugestão #{idx + 1}</h4>
                      <div className=" ">$2</div><Button size="sm" variant="outline" onClick={ () => copyToClipboard(typeof rec === 'string' ? rec : JSON.stringify(rec))  }>
                          <Copy className="w-3 h-3 mr-1" /> Copiar
                        </Button>
                        <Button size="sm" onClick={ () => onContentSelect?.(rec)  }>
                          <Target className="w-3 h-3 mr-1" /> Usar
                        </Button></div><div className="{typeof rec === 'string' ? rec : JSON.stringify(rec, null, 2)}">$2</div>
    </div>
  ))}
              </div>
              <div className=" ">$2</div><Button onClick={generate} variant="outline" disabled={loading} className="flex items-center gap-2" />
                  <RefreshCw className="w-4 h-4" /> Gerar mais
                </Button>
      </div>
    </>
  )}
        </Card.Content></Card></div>);};

export default ContentRecommender;
