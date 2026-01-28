/**
 * Enhanced Campaign Form - ADStool Module
 * Versão 95%+ com padrões de excelência UI/UX
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { 
  Calendar, 
  DollarSign, 
  Target, 
  TrendingUp, 
  Users, 
  Clock,
  AlertCircle,
  CheckCircle,
  Sparkles,
  BarChart3,
  Save,
  X
} from 'lucide-react';
// Hooks customizados
import { useT } from '@/hooks/useTranslation';
import { useFormWithSchema, moduleSchemas } from '@/hooks/useFormValidation';
import { useAsyncOperation } from '@/hooks/useAdvancedNotifications';
import { useFormLoadingStates } from '@/hooks/useLoadingStates';
// Componentes UI
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Textarea from '@/components/ui/Textarea';
import { Select } from '@/components/ui/select';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import Separator from '@/components/ui/Separator';
import Tooltip from '@/components/ui/Tooltip';
import { EmptyState } from '@/components/ui/EmptyStates';
interface Campaign {
  id?: string;
  name: string;
  budget: number;
  start_date: string;
  end_date: string;
  objective: string;
  target_audience: string;
  platform: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  project_id: string;
  description?: string;
  expected_reach?: number;
  expected_conversions?: number;
  bid_strategy?: string;
  daily_budget?: number;
}
interface EnhancedCampaignFormProps {
  campaign?: Campaign;
  projects?: Array<{ id: string; name: string }>;
  onSuccess?: (campaign: Campaign) => void;
  onCancel?: () => void;
  readonly?: boolean;
}
const CAMPAIGN_OBJECTIVES = [
  { value: 'awareness', label: 'Reconhecimento da Marca', icon: Users },
  { value: 'traffic', label: 'Tráfego do Site', icon: TrendingUp },
  { value: 'engagement', label: 'Engajamento', icon: Target },
  { value: 'leads', label: 'Geração de Leads', icon: BarChart3 },
  { value: 'conversions', label: 'Conversões', icon: CheckCircle },
];
const PLATFORMS = [
  { value: 'google', label: 'Google Ads', color: 'bg-blue-500' },
  { value: 'facebook', label: 'Meta Ads', color: 'bg-blue-600' },
  { value: 'linkedin', label: 'LinkedIn Ads', color: 'bg-blue-700' },
  { value: 'twitter', label: 'Twitter Ads', color: 'bg-black' },
  { value: 'tiktok', label: 'TikTok Ads', color: 'bg-pink-500' },
];
const BID_STRATEGIES = [
  { value: 'manual_cpc', label: 'CPC Manual' },
  { value: 'auto_cpc', label: 'CPC Automático' },
  { value: 'target_cpa', label: 'CPA Alvo' },
  { value: 'target_roas', label: 'ROAS Alvo' },
  { value: 'maximize_clicks', label: 'Maximizar Cliques' },
  { value: 'maximize_conversions', label: 'Maximizar Conversões' },
];
const EnhancedCampaignForm: React.FC<EnhancedCampaignFormProps> = ({
  campaign,
  projects = [],
  onSuccess,
  onCancel,
  readonly = false,
}) => {
  const { t, translations } = useT();
  const { executeWithFeedback } = useAsyncOperation();
  const { isSubmitting, getSubmissionError } = useFormLoadingStates();
  // Form validation
  const validation = useFormWithSchema(moduleSchemas.campaign);
  // Form state
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: campaign?.name || '',
    budget: campaign?.budget || 0,
    daily_budget: campaign?.daily_budget || 0,
    start_date: campaign?.start_date || '',
    end_date: campaign?.end_date || '',
    objective: campaign?.objective || '',
    target_audience: campaign?.target_audience || '',
    platform: campaign?.platform || '',
    project_id: campaign?.project_id || '',
    description: campaign?.description || '',
    expected_reach: campaign?.expected_reach || 0,
    expected_conversions: campaign?.expected_conversions || 0,
    bid_strategy: campaign?.bid_strategy || 'manual_cpc',
  });
  // Cálculos automáticos
  const campaignDuration = useMemo(() => {
    if (!data.start_date || !data.end_date) return 0;
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }, [data.start_date, data.end_date]);
  const dailyBudgetSuggestion = useMemo(() => {
    if (!data.budget || !campaignDuration) return 0;
    return Math.round((data.budget / campaignDuration) * 100) / 100;
  }, [data.budget, campaignDuration]);
  const estimatedReach = useMemo(() => {
    if (!data.budget || !data.platform) return 0;
    // Estimativa baseada em CPM médio por plataforma
    const cpmByPlatform: Record<string, number> = {
      google: 2.5,
      facebook: 7.5,
      linkedin: 15,
      twitter: 6.5,
      tiktok: 10,
    };
    const cpm = cpmByPlatform[data.platform] || 5;
    return Math.round((data.budget / cpm) * 1000);
  }, [data.budget, data.platform]);
  // Form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validation.validateForm(data);
    if (!isValid) return;
    const submitData = {
      ...data,
      budget: parseFloat(String(data.budget)) || 0,
      daily_budget: data.daily_budget || dailyBudgetSuggestion,
      expected_reach: estimatedReach,
    };
    await executeWithFeedback(
      async () => {
        if (campaign) {
          return put(route('api.adstool.campaigns.update', campaign.id), {
            onSuccess: () => {
              onSuccess?.(submitData as Campaign);
            },
          });
        } else {
          return post(route('api.adstool.campaigns.store'), {
            onSuccess: (response: any) => {
              reset();
              onSuccess?.(response.data);
            },
          });
        }
      },
      {
        loadingMessage: campaign 
          ? t('campaigns.updating') 
          : t('campaigns.creating'),
        successMessage: campaign 
          ? t('campaigns.updated_successfully') 
          : t('campaigns.created_successfully'),
        errorMessage: campaign 
          ? t('campaigns.update_failed') 
          : t('campaigns.create_failed'),
      }
    );
  }, [data, campaign, validation, executeWithFeedback, onSuccess, reset, post, put, t, dailyBudgetSuggestion, estimatedReach]);
  // Auto-update daily budget suggestion
  useEffect(() => {
    if (dailyBudgetSuggestion > 0 && !data.daily_budget) {
      setData('daily_budget', dailyBudgetSuggestion);
    }
  }, [dailyBudgetSuggestion, data.daily_budget, setData]);
  const formError = getSubmissionError('campaign-form');
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {campaign ? t('campaigns.edit') : t('campaigns.create')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {campaign 
                ? 'Atualize os detalhes da sua campanha publicitária'
                : 'Configure uma nova campanha para atingir seus objetivos'
              }
            </p>
          </div>
        </div>
        {campaign && (
          <Badge variant={campaign.status === 'active' ? 'success' : 'default'}>
            {t(`status.${campaign.status}`)}
          </Badge>
        )}
      </div>
      {/* Progress Indicator */}
      {processing && (
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
            <span className="text-sm font-medium">
              {campaign ? 'Atualizando campanha...' : 'Criando campanha...'}
            </span>
          </div>
        </Card>
      )}
      {/* Error Display */}
      {formError && (
        <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              {formError}
            </span>
          </div>
        </Card>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">{t('forms.basic_info')}</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <InputLabel htmlFor="name" required>
                    {t('forms.name')}
                  </InputLabel>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    onBlur={() => validation.validateField('name', data.name)}
                    placeholder="Ex: Campanha Black Friday 2024"
                    error={validation.hasError('name')}
                    disabled={readonly}
                    className="mt-1"
                  />
                  {validation.hasError('name') && (
                    <p className="mt-1 text-sm text-red-600">
                      {validation.getFieldError('name')}
                    </p>
                  )}
                </div>
                <div>
                  <InputLabel htmlFor="description">
                    {t('forms.description')}
                  </InputLabel>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Descreva os objetivos e detalhes da campanha..."
                    rows={3}
                    disabled={readonly}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputLabel htmlFor="objective" required>
                      {t('campaigns.objective')}
                    </InputLabel>
                    <Select
                      value={data.objective}
                      onValueChange={(value) => setData('objective', value)}
                      disabled={readonly}
                    >
                      <option value="">{t('actions.select')}</option>
                      {CAMPAIGN_OBJECTIVES.map((obj) => (
                        <option key={obj.value} value={obj.value}>
                          {obj.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <InputLabel htmlFor="platform" required>
                      {t('campaigns.platform')}
                    </InputLabel>
                    <Select
                      value={data.platform}
                      onValueChange={(value) => setData('platform', value)}
                      disabled={readonly}
                    >
                      <option value="">{t('actions.select')}</option>
                      {PLATFORMS.map((platform) => (
                        <option key={platform.value} value={platform.value}>
                          {platform.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                {projects.length > 0 && (
                  <div>
                    <InputLabel htmlFor="project_id" required>
                      {t('forms.project')}
                    </InputLabel>
                    <Select
                      value={data.project_id}
                      onValueChange={(value) => setData('project_id', value)}
                      disabled={readonly}
                    >
                      <option value="">{t('actions.select')}</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
              </div>
            </Card>
            {/* Orçamento e Estratégia */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold">{t('campaigns.budget')} & {t('campaigns.strategy')}</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputLabel htmlFor="budget" required>
                      {t('campaigns.total_budget')}
                    </InputLabel>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="budget"
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.budget}
                        onChange={(e) => setData('budget', parseFloat(e.target.value) || 0)}
                        onBlur={() => validation.validateField('budget', data.budget)}
                        placeholder="0.00"
                        error={validation.hasError('budget')}
                        disabled={readonly}
                        className="pl-10"
                      />
                    </div>
                    {validation.hasError('budget') && (
                      <p className="mt-1 text-sm text-red-600">
                        {validation.getFieldError('budget')}
                      </p>
                    )}
                  </div>
                  <div>
                    <InputLabel htmlFor="daily_budget">
                      {t('campaigns.daily_budget')}
                      <Tooltip content="Sugestão baseada na duração da campanha">
                        <span className="ml-1 text-xs text-gray-500">
                          (sugerido: R$ {dailyBudgetSuggestion.toFixed(2)})
                        </span>
                      </Tooltip>
                    </InputLabel>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="daily_budget"
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.daily_budget}
                        onChange={(e) => setData('daily_budget', parseFloat(e.target.value) || 0)}
                        placeholder={dailyBudgetSuggestion.toFixed(2)}
                        disabled={readonly}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <InputLabel htmlFor="bid_strategy">
                    {t('campaigns.bid_strategy')}
                  </InputLabel>
                  <Select
                    value={data.bid_strategy}
                    onValueChange={(value) => setData('bid_strategy', value)}
                    disabled={readonly}
                  >
                    {BID_STRATEGIES.map((strategy) => (
                      <option key={strategy.value} value={strategy.value}>
                        {strategy.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <InputLabel htmlFor="target_audience" required>
                    {t('campaigns.target_audience')}
                  </InputLabel>
                  <Textarea
                    id="target_audience"
                    value={data.target_audience}
                    onChange={(e) => setData('target_audience', e.target.value)}
                    onBlur={() => validation.validateField('target_audience', data.target_audience)}
                    placeholder="Descreva seu público-alvo: idade, interesses, localização..."
                    rows={2}
                    error={validation.hasError('target_audience')}
                    disabled={readonly}
                  />
                  {validation.hasError('target_audience') && (
                    <p className="mt-1 text-sm text-red-600">
                      {validation.getFieldError('target_audience')}
                    </p>
                  )}
                </div>
              </div>
            </Card>
            {/* Cronograma */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-5 w-5 text-purple-500" />
                <h3 className="text-lg font-semibold">{t('campaigns.schedule')}</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputLabel htmlFor="start_date" required>
                      {t('forms.start_date')}
                    </InputLabel>
                    <Input
                      id="start_date"
                      type="date"
                      value={data.start_date}
                      onChange={(e) => setData('start_date', e.target.value)}
                      onBlur={() => validation.validateField('start_date', data.start_date)}
                      error={validation.hasError('start_date')}
                      disabled={readonly}
                    />
                    {validation.hasError('start_date') && (
                      <p className="mt-1 text-sm text-red-600">
                        {validation.getFieldError('start_date')}
                      </p>
                    )}
                  </div>
                  <div>
                    <InputLabel htmlFor="end_date">
                      {t('forms.end_date')}
                    </InputLabel>
                    <Input
                      id="end_date"
                      type="date"
                      value={data.end_date}
                      onChange={(e) => setData('end_date', e.target.value)}
                      onBlur={() => validation.validateField('end_date', data.end_date)}
                      error={validation.hasError('end_date')}
                      disabled={readonly}
                    />
                    {validation.hasError('end_date') && (
                      <p className="mt-1 text-sm text-red-600">
                        {validation.getFieldError('end_date')}
                      </p>
                    )}
                  </div>
                </div>
                {campaignDuration > 0 && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Duração: {campaignDuration} dias
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
          {/* Coluna Lateral - Insights */}
          <div className="space-y-6">
            {/* Estimativas */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold">{t('campaigns.estimates')}</h3>
              </div>
              <div className="space-y-4">
                {estimatedReach > 0 && (
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Alcance Estimado</span>
                      <span className="text-lg font-bold text-green-600">
                        {estimatedReach.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Baseado no orçamento e plataforma selecionada
                    </p>
                  </div>
                )}
                {data.budget > 0 && dailyBudgetSuggestion > 0 && (
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Orçamento Diário</span>
                      <span className="text-lg font-bold text-blue-600">
                        R$ {dailyBudgetSuggestion.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Distribuição uniforme do orçamento
                    </p>
                  </div>
                )}
                {data.platform && (
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div 
                        className={`w-3 h-3 rounded-full ${
                          PLATFORMS.find(p => p.value === data.platform)?.color || 'bg-gray-400'
                        }`} 
                      />
                      <span className="text-sm font-medium">
                        {PLATFORMS.find(p => p.value === data.platform)?.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            {/* Dicas */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <h3 className="text-lg font-semibold">Dicas de Otimização</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Defina objetivos claros e mensuráveis</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Segmente seu público com precisão</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Monitore performance diariamente</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Teste diferentes criativos</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
        {/* Actions */}
        {!readonly && (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                <Button
                  type="submit"
                  variant="primary"
                  loading={processing || isSubmitting('campaign-form')}
                  disabled={processing || !validation.isValid}
                  className="min-w-[140px]"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {campaign ? t('actions.update') : t('actions.create')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={processing}
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('actions.cancel')}
                </Button>
              </div>
              {!validation.isValid && (
                <div className="flex items-center space-x-2 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    Preencha todos os campos obrigatórios
                  </span>
                </div>
              )}
            </div>
          </Card>
        )}
      </form>
    </div>
  );
};
export default EnhancedCampaignForm;
