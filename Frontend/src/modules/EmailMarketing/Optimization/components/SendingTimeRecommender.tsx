import React, { useState, useCallback } from 'react';
import Card from '@/shared/components/ui/Card';
import Select from '@/shared/components/ui/Select';
import InputLabel from '@/shared/components/ui/InputLabel';
import Button from '@/shared/components/ui/Button';
import { Clock, TrendingUp, Target } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/services';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import Badge from '@/shared/components/ui/Badge';
const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Segunda-feira' },
  { value: 'tuesday', label: 'Terça-feira' },
  { value: 'wednesday', label: 'Quarta-feira' },
  { value: 'thursday', label: 'Quinta-feira' },
  { value: 'friday', label: 'Sexta-feira' },
  { value: 'saturday', label: 'Sábado' },
  { value: 'sunday', label: 'Domingo' },
];
const AUDIENCE_TYPES = [
  { value: 'all', label: 'Toda audiência' },
  { value: 'engaged', label: 'Usuários engajados' },
  { value: 'new_subscribers', label: 'Novos assinantes' },
  { value: 'inactive', label: 'Usuários inativos' },
  { value: 'high_value', label: 'Alto valor' },
];
const SendingTimeRecommender: React.FC<{campaignId, onRecommendationSelect}> = ({ campaignId, onRecommendationSelect    }) => {
  const [filters, setFilters] = useState({ audience_type: 'all', day_of_week: '', time_zone: 'America/Sao_Paulo' });

  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);

  const handleFilterChange = useCallback((field: unknown, value: unknown) => {
    setFilters((prev: unknown) => ({ ...prev, [field]: value }));

  }, []);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await apiClient.get('/api/email-marketing/optimization/sending-times', {
        params: { campaign_id: campaignId, ...filters },
      });

      setRecommendations(data?.data || data || []);

    } catch (error) {
      toast.error('Erro ao carregar recomendações de horário.');

    } finally {
      setLoading(false);

    } , [campaignId, filters]);

  const formatTime: React.FC<timeString> = (timeString: unknown) => new Date(`2024-01-01T${timeString}`).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title className="flex items-center space-x-2" />
          <Clock className="w-5 h-5" />
          <span>Recomendação de Horário</span>
        </Card.Title>
      </Card.Header>
      <Card.Content className="space-y-6" />
        <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="audience_type">Audiência</InputLabel>
            <Select id="audience_type" value={filters.audience_type} onChange={ (e: unknown) => handleFilterChange('audience_type', e.target.value)  }>
              {(AUDIENCE_TYPES || []).map((t: unknown) => (
                <option key={t.value} value={ t.value }>{t.label}</option>
              ))}
            </Select></div><div>
           
        </div><InputLabel htmlFor="day_of_week">Dia da semana</InputLabel>
            <Select id="day_of_week" value={filters.day_of_week} onChange={ (e: unknown) => handleFilterChange('day_of_week', e.target.value)  }>
              <option value="">Qualquer</option>
              {(DAYS_OF_WEEK || []).map((d: unknown) => (
                <option key={d.value} value={ d.value }>{d.label}</option>
              ))}
            </Select></div><div>
           
        </div><InputLabel htmlFor="time_zone">Fuso horário</InputLabel>
            <Select id="time_zone" value={filters.time_zone} onChange={ (e: unknown) => handleFilterChange('time_zone', e.target.value)  }>
              <option value="America/Sao_Paulo">America/Sao_Paulo</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option></Select></div>
        <div className=" ">$2</div><Button onClick={fetchRecommendations} className="flex items-center gap-2" />
            <TrendingUp className="w-4 h-4" /> Analisar
          </Button>
        </div>
        {loading ? (
          <LoadingSpinner text="Analisando dados de engajamento..." / />
        ) : recommendations.length === 0 ? (
          <div className=" ">$2</div><Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            Nenhuma recomendação encontrada
          </div>
        ) : (
          <div className=" ">$2</div><h3 className="font-medium flex items-center space-x-2"><TrendingUp className="w-4 h-4" /> <span>Melhores horários</span></h3><div className="{(recommendations || []).map((rec: unknown, index: unknown) => (">$2</div>
                <div
                  key={ index }
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedRecommendation?.id === rec.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  } `}
                  onClick={() => { setSelectedRecommendation(rec); onRecommendationSelect?.(rec); } >
                  <div className=" ">$2</div><h4 className="font-medium text-gray-900">{rec.label || `${rec.day}, ${formatTime(rec.time)}`}</h4>
                    <Badge className="text-blue-700 bg-blue-100">{rec.score ? `${Math.round(rec.score)}%` : '—'}</Badge></div><div className=" ">$2</div><div className="flex items-center justify-between"><span className="text-gray-600">Dia:</span><span className="font-medium">{rec.day}</span></div><div className="flex items-center justify-between"><span className="text-gray-600">Hora:</span><span className="font-medium">{formatTime(rec.time)}</span></div>
                    {rec.estimated_opens != null && (
                      <div className="flex items-center justify-between"><span className="text-gray-600">Aberturas:</span><span className="font-medium">{rec.estimated_opens}</span></div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-200 text-blue-600 text-xs flex items-center"><Target className="w-3 h-3 mr-1" /> Sugerido para testes</div>
              ))}
            </div>
        )}
      </Card.Content>
    </Card>);};

export default SendingTimeRecommender;
