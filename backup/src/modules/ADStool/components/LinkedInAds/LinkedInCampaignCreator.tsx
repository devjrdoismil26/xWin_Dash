import React, { useState, useCallback } from 'react';
import { BarChart3, Briefcase, Users, Calendar, DollarSign, GraduationCap, Plus, X } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import Textarea from '@/components/ui/Textarea';
import Switch from '@/components/ui/Switch';
import Badge from '@/components/ui/Badge';
import InputError from '@/components/ui/InputError';
const CAMPAIGN_TYPES = [
  { value: 'sponsored_content', label: 'Sponsored Content', formats: ['Single Image', 'Carousel', 'Video', 'Event', 'Document'] },
  { value: 'message_ads', label: 'Message Ads', formats: ['Conversation Ads', 'Message Ads'] },
  { value: 'dynamic_ads', label: 'Dynamic Ads', formats: ['Follower Ads', 'Spotlight Ads', 'Job Ads'] },
  { value: 'text_ads', label: 'Text Ads', formats: ['Text Ads'] },
  { value: 'lead_gen_forms', label: 'Lead Gen Forms', formats: ['Lead Gen Forms'] },
];
const BIDDING_STRATEGIES = [
  { value: 'cpc', label: 'CPC (Custo por Clique)' },
  { value: 'cpm', label: 'CPM (Custo por Mil Impressões)' },
  { value: 'cpv', label: 'CPV (Custo por Visualização)' },
  { value: 'cps', label: 'CPS (Custo por Envio)' },
];
const SENIORITY_LEVELS = [
  { value: 'unpaid', label: 'Não Remunerado' },
  { value: 'training', label: 'Trainee' },
  { value: 'entry', label: 'Entrada' },
  { value: 'associate', label: 'Associado' },
  { value: 'mid_senior', label: 'Pleno/Sênior' },
  { value: 'director', label: 'Diretor' },
  { value: 'vp', label: 'Vice-Presidente' },
  { value: 'cxo', label: 'C-Level' },
  { value: 'partner', label: 'Sócio' },
  { value: 'owner', label: 'Proprietário' },
];
const COMPANY_SIZES = [
  { value: 'self_employed', label: 'Autônomo (1)' },
  { value: 'startup', label: 'Startup (2-10)' },
  { value: 'small', label: 'Pequena (11-50)' },
  { value: 'medium', label: 'Média (51-200)' },
  { value: 'large', label: 'Grande (201-1000)' },
  { value: 'enterprise', label: 'Enterprise (1001-5000)' },
  { value: 'enterprise_plus', label: 'Enterprise+ (5001+)' },
];
const LinkedInCampaignCreator = ({ onSuccess, onCancel }) => {
  const [selectedType, setSelectedType] = useState('sponsored_content');
  const [jobTitles, setJobTitles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [skills, setSkills] = useState([]);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    campaign_type: 'sponsored_content',
    objective: 'lead_generation',
    status: 'paused',
    budget_amount: '',
    budget_type: 'daily',
    bidding_strategy: 'cpc',
    bid_amount: '',
    locations: [],
    age_min: 18,
    age_max: 65,
    job_titles: [],
    job_functions: [],
    seniority_levels: [],
    years_experience_min: '',
    years_experience_max: '',
    companies: [],
    company_sizes: [],
    industries: [],
    education_degrees: [],
    education_schools: [],
    skills: [],
    interests: [],
    member_groups: [],
    start_date: '',
    end_date: '',
    ad_format: '',
    call_to_action: 'learn_more',
    form_name: '',
    privacy_policy_url: '',
    custom_questions: [],
  });
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      post(route('api.adstool.linkedin.campaigns.store'), {
        onSuccess: () => {
          toast.success('Campanha LinkedIn criada com sucesso!');
          onSuccess?.();
        },
        onError: () => toast.error('Erro ao criar campanha. Verifique os dados.'),
      });
    },
    [post, onSuccess],
  );
  const handleTypeSelect = useCallback(
    (type) => {
      setSelectedType(type);
      setData('campaign_type', type);
      if (type === 'message_ads') setData('bidding_strategy', 'cps');
      else if (type === 'sponsored_content') setData('bidding_strategy', 'cpc');
    },
    [setData],
  );
  const addJobTitle = useCallback(
    (title) => {
      if (title && !jobTitles.includes(title)) setJobTitles((prev) => [...prev, title]);
    },
    [jobTitles],
  );
  const removeJobTitle = useCallback((title) => setJobTitles((prev) => prev.filter((t) => t !== title)), []);
  const addCompany = useCallback(
    (company) => {
      if (company && !companies.includes(company)) setCompanies((prev) => [...prev, company]);
    },
    [companies],
  );
  const removeCompany = useCallback((company) => setCompanies((prev) => prev.filter((c) => c !== company)), []);
  const addSkill = useCallback(
    (skill) => {
      if (skill && !skills.includes(skill)) setSkills((prev) => [...prev, skill]);
    },
    [skills],
  );
  const removeSkill = useCallback((skill) => setSkills((prev) => prev.filter((s) => s !== skill)), []);
  const selectedCampaignType = CAMPAIGN_TYPES.find((t) => t.value === selectedType);
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BarChart3 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Nova Campanha LinkedIn</h2>
          <p className="text-gray-600">Selecione o tipo e defina o público-alvo</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CAMPAIGN_TYPES.map((type) => {
                const isSelected = selectedType === type.value;
                const className = `cursor-pointer border-2 rounded-lg p-3 transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`;
                return (
                  <div key={type.value} onClick={() => handleTypeSelect(type.value)} className={className}>
                    <div className="flex items-start space-x-3">
                      <Briefcase className="w-5 h-5" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{type.label}</h3>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {type.formats.slice(0, 2).map((format, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Orçamento & Lance</span>
            </Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <InputLabel htmlFor="budget_amount">Orçamento</InputLabel>
                <Input id="budget_amount" type="number" step="0.01" value={data.budget_amount} onChange={(e) => setData('budget_amount', e.target.value)} placeholder="100.00" />
              </div>
              <div>
                <InputLabel htmlFor="bidding_strategy">Estratégia</InputLabel>
                <Select id="bidding_strategy" value={data.bidding_strategy} onChange={(e) => setData('bidding_strategy', e.target.value)}>
                  {BIDDING_STRATEGIES.map((strategy) => (
                    <option key={strategy.value} value={strategy.value}>
                      {strategy.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <InputLabel htmlFor="bid_amount">Lance</InputLabel>
                <Input id="bid_amount" type="number" step="0.01" value={data.bid_amount} onChange={(e) => setData('bid_amount', e.target.value)} placeholder="5.00" />
              </div>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Público</span>
            </Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputLabel htmlFor="job_title_input">Cargos</InputLabel>
                <div className="flex space-x-2">
                  <Input id="job_title_input" placeholder="Ex: Technology Officer" onKeyPress={(e) => { if (e.key === 'Enter') { addJobTitle(e.currentTarget.value); e.currentTarget.value = ''; } }} />
                  <Button type="button" variant="outline" onClick={() => {
                    const input = document.getElementById('job_title_input');
                    if (input && 'value' in input && input.value) { addJobTitle(input.value); input.value = ''; }
                  }}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {jobTitles.map((title, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{title}</span>
                      <button type="button" onClick={() => removeJobTitle(title)} className="ml-1 hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <InputLabel htmlFor="job_functions">Funções</InputLabel>
                <Select id="job_functions" multiple value={data.job_functions} onChange={(e) => setData('job_functions', Array.from(e.target.selectedOptions, (o) => o.value))}>
                  {['Marketing', 'Engenharia', 'Vendas', 'TI', 'Operações'].map((func) => (
                    <option key={func} value={func}>
                      {func}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputLabel htmlFor="years_experience_min">Exp. mínima</InputLabel>
                <Input id="years_experience_min" type="number" value={data.years_experience_min} onChange={(e) => setData('years_experience_min', e.target.value)} placeholder="5" />
              </div>
              <div>
                <InputLabel htmlFor="years_experience_max">Exp. máxima</InputLabel>
                <Input id="years_experience_max" type="number" value={data.years_experience_max} onChange={(e) => setData('years_experience_max', e.target.value)} placeholder="20" />
              </div>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Datas</span>
            </Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputLabel htmlFor="start_date">Início</InputLabel>
                <Input id="start_date" type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} />
              </div>
              <div>
                <InputLabel htmlFor="end_date">Término</InputLabel>
                <Input id="end_date" type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
              </div>
            </div>
          </Card.Content>
        </Card>
        <div className="flex items-center justify-end space-x-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={processing} className="min-w-[120px]">
            {processing ? 'Criando...' : 'Criar Campanha'}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default LinkedInCampaignCreator;
