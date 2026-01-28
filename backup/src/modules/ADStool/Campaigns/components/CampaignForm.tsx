import React, { useEffect, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputError from '@/components/ui/InputError';
import InputLabel from '@/components/ui/InputLabel';
import Textarea from '@/components/ui/Textarea';
import { Select } from '@/components/ui/select';
import { AdsCampaign, AdsPlatform, AdsObjective } from '../../types/adsCampaignTypes';
interface CampaignFormProps {
  campaign?: AdsCampaign;
  onSuccess?: () => void;
  onCancel?: () => void;
}
interface FormData {
  name: string;
  platform: AdsPlatform;
  budget: string;
  daily_budget: string;
  start_date: string;
  end_date: string;
  objective: AdsObjective;
  description: string;
}
const MAX_BUDGET_VALUE = 100000000;
const CampaignForm: React.FC<CampaignFormProps> = ({ campaign, onSuccess, onCancel }) => {
  const { data, setData, post, put, processing, errors, reset } = useForm<FormData>({
    name: campaign?.name || '',
    platform: campaign?.platform || 'google_ads',
    budget: campaign?.budget?.toString() || '',
    daily_budget: campaign?.daily_budget?.toString() || '',
    start_date: campaign?.start_date || '',
    end_date: campaign?.end_date || '',
    objective: campaign?.objective || 'awareness',
    description: '',
  });
  const platformOptions = [
    { value: 'google_ads', label: 'Google Ads' },
    { value: 'facebook_ads', label: 'Facebook Ads' },
    { value: 'linkedin_ads', label: 'LinkedIn Ads' },
    { value: 'twitter_ads', label: 'Twitter Ads' },
    { value: 'tiktok_ads', label: 'TikTok Ads' }
  ];
  const objectiveOptions = [
    { value: 'awareness', label: 'Reconhecimento de Marca' },
    { value: 'traffic', label: 'Tráfego' },
    { value: 'engagement', label: 'Engajamento' },
    { value: 'leads', label: 'Leads' },
    { value: 'sales', label: 'Vendas' },
    { value: 'app_installs', label: 'Instalações de App' }
  ];
  useEffect(() => {
    if (campaign) {
      setData({
        name: campaign.name || '',
        platform: campaign.platform || 'google_ads',
        budget: campaign.budget?.toString() || '',
        daily_budget: campaign.daily_budget?.toString() || '',
        start_date: campaign.start_date || '',
        end_date: campaign.end_date || '',
        objective: campaign.objective || 'awareness',
        description: '',
      });
    }
  }, [campaign, setData]);
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const payload = {
        ...data,
        budget: parseFloat(data.budget) || 0,
        daily_budget: parseFloat(data.daily_budget) || 0,
        targeting: {
          age_min: 18,
          age_max: 65,
          genders: ['all'],
          locations: ['BR'],
          interests: [],
          behaviors: [],
          languages: ['pt']
        }
      };
      if (campaign) {
        put(route('api.adstool.campaigns.update', campaign.id), {
          onSuccess: () => {
            toast.success('Campanha atualizada com sucesso!');
            onSuccess?.();
          },
          onError: () => {
            toast.error('Erro ao atualizar campanha.');
          },
        });
      } else {
        post(route('api.adstool.campaigns.store'), {
          onSuccess: () => {
            toast.success('Campanha criada com sucesso!');
            reset();
            onSuccess?.();
          },
          onError: () => {
            toast.error('Erro ao criar campanha.');
          },
        });
      }
    },
    [data, campaign, post, put, reset, onSuccess],
  );
  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <InputLabel htmlFor="name">Nome da Campanha</InputLabel>
          <Input 
            id="name" 
            type="text" 
            value={data.name} 
            onChange={(e) => setData('name', e.target.value)} 
            placeholder="Digite o nome da campanha" 
          />
          {errors?.name && <InputError text={errors.name} />}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputLabel htmlFor="platform">Plataforma</InputLabel>
            <Select
              id="platform"
              value={data.platform}
              onChange={(value) => setData('platform', value as AdsPlatform)}
              options={platformOptions}
            />
            {errors?.platform && <InputError text={errors.platform} />}
          </div>
          <div>
            <InputLabel htmlFor="objective">Objetivo</InputLabel>
            <Select
              id="objective"
              value={data.objective}
              onChange={(value) => setData('objective', value as AdsObjective)}
              options={objectiveOptions}
            />
            {errors?.objective && <InputError text={errors.objective} />}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputLabel htmlFor="budget">Orçamento Total</InputLabel>
            <Input
              id="budget"
              type="number"
              step="0.01"
              min="0"
              max={MAX_BUDGET_VALUE}
              value={data.budget}
              onChange={(e) => setData('budget', e.target.value)}
              placeholder="0.00"
            />
            {errors?.budget && <InputError text={errors.budget} />}
          </div>
          <div>
            <InputLabel htmlFor="daily_budget">Orçamento Diário</InputLabel>
            <Input
              id="daily_budget"
              type="number"
              step="0.01"
              min="0"
              max={MAX_BUDGET_VALUE}
              value={data.daily_budget}
              onChange={(e) => setData('daily_budget', e.target.value)}
              placeholder="0.00"
            />
            {errors?.daily_budget && <InputError text={errors.daily_budget} />}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputLabel htmlFor="start_date">Data de Início</InputLabel>
            <Input 
              id="start_date" 
              type="date" 
              value={data.start_date} 
              onChange={(e) => setData('start_date', e.target.value)} 
              required 
            />
            {errors?.start_date && <InputError text={errors.start_date} />}
          </div>
          <div>
            <InputLabel htmlFor="end_date">Data de Término</InputLabel>
            <Input 
              id="end_date" 
              type="date" 
              value={data.end_date} 
              onChange={(e) => setData('end_date', e.target.value)} 
            />
            {errors?.end_date && <InputError text={errors.end_date} />}
          </div>
        </div>
        <div>
          <InputLabel htmlFor="description">Descrição</InputLabel>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            placeholder="Descreva os objetivos e estratégia da campanha..."
            rows={3}
          />
          {errors?.description && <InputError text={errors.description} />}
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" loading={processing} disabled={processing}>
            {campaign ? 'Atualizar Campanha' : 'Criar Campanha'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={processing}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};
export default CampaignForm;
