/**
 * Componente LinkedInCampaignCreator - Criador de Campanhas do LinkedIn Ads
 *
 * @description
 * Componente completo para criação de campanhas do LinkedIn Ads. Permite
 * selecionar tipo de campanha, definir orçamento, público-alvo detalhado,
 * datas e outras configurações avançadas.
 *
 * Funcionalidades principais:
 * - Seleção de tipo de campanha (Sponsored Content, Message Ads, Dynamic Ads, etc.)
 * - Configuração de orçamento e estratégia de lance
 * - Definição detalhada de público-alvo (cargos, funções, senioridade, empresas, etc.)
 * - Configuração de datas (início e fim)
 * - Formulários de lead gen (quando aplicável)
 * - Integração com Inertia.js para criação
 * - Validação de formulário
 * - Notificações toast para feedback
 * - Suporte completo a dark mode
 *
 * @module modules/ADStool/components/LinkedInAds/LinkedInCampaignCreator
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import LinkedInCampaignCreator from '@/modules/ADStool/components/LinkedInAds/LinkedInCampaignCreator';
 *
 * <LinkedInCampaignCreator
 *   onSuccess={ () =>  }
 *   onCancel={ () =>  }
 * />
 * ```
 */

import React, { useState, useCallback } from 'react';
import { BarChart3, Briefcase, Users, Calendar, DollarSign, GraduationCap, Plus, X } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import Textarea from '@/shared/components/ui/Textarea';
import Switch from '@/shared/components/ui/Switch';
import Badge from '@/shared/components/ui/Badge';
import InputError from '@/shared/components/ui/InputError';

/**
 * Tipos de campanha disponíveis
 *
 * @constant {Array<{value: string, label: string, formats: string[]}>}
 */
const CAMPAIGN_TYPES = [
  { value: 'sponsored_content', label: 'Sponsored Content', formats: ['Single Image', 'Carousel', 'Video', 'Event', 'Document'] },
  { value: 'message_ads', label: 'Message Ads', formats: ['Conversation Ads', 'Message Ads'] },
  { value: 'dynamic_ads', label: 'Dynamic Ads', formats: ['Follower Ads', 'Spotlight Ads', 'Job Ads'] },
  { value: 'text_ads', label: 'Text Ads', formats: ['Text Ads'] },
  { value: 'lead_gen_forms', label: 'Lead Gen Forms', formats: ['Lead Gen Forms'] },
];

/**
 * Estratégias de lance disponíveis
 *
 * @constant {Array<{value: string, label: string}>}
 */
const BIDDING_STRATEGIES = [
  { value: 'cpc', label: 'CPC (Custo por Clique)' },
  { value: 'cpm', label: 'CPM (Custo por Mil Impressões)' },
  { value: 'cpv', label: 'CPV (Custo por Visualização)' },
  { value: 'cps', label: 'CPS (Custo por Envio)' },
];

/**
 * Níveis de senioridade disponíveis
 *
 * @constant {Array<{value: string, label: string}>}
 */
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

/**
 * Tamanhos de empresa disponíveis
 *
 * @constant {Array<{value: string, label: string}>}
 */
const COMPANY_SIZES = [
  { value: 'self_employed', label: 'Autônomo (1)' },
  { value: 'startup', label: 'Startup (2-10)' },
  { value: 'small', label: 'Pequena (11-50)' },
  { value: 'medium', label: 'Média (51-200)' },
  { value: 'large', label: 'Grande (201-1000)' },
  { value: 'enterprise', label: 'Enterprise (1001-5000)' },
  { value: 'enterprise_plus', label: 'Enterprise+ (5001+)' },
];

/**
 * Props do componente LinkedInCampaignCreator
 *
 * @description
 * Propriedades que podem ser passadas para o componente LinkedInCampaignCreator.
 *
 * @interface LinkedInCampaignCreatorProps
 * @property {() => void} [onSuccess] - Callback chamado após criação bem-sucedida (opcional)
 * @property {() => void} [onCancel] - Callback chamado ao cancelar criação (opcional)
 */
interface LinkedInCampaignCreatorProps {
  onSuccess???: (e: any) => void;
  onCancel???: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente LinkedInCampaignCreator
 *
 * @description
 * Renderiza um formulário completo para criação de campanhas do LinkedIn Ads.
 * Gerencia estado do formulário, seleção de tipo, público-alvo e submissão.
 *
 * @component
 * @param {LinkedInCampaignCreatorProps} props - Props do componente
 * @param {() => void} [props.onSuccess] - Callback ao criar com sucesso
 * @param {() => void} [props.onCancel] - Callback ao cancelar
 * @returns {JSX.Element} Criador de campanha renderizado
 */
const LinkedInCampaignCreator: React.FC<LinkedInCampaignCreatorProps> = ({ onSuccess, onCancel    }) => {
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
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      post(route('api.adstool.linkedin.campaigns.store'), {
        onSuccess: () => {
          toast.success('Campanha LinkedIn criada com sucesso!');

          onSuccess?.();

        },
        onError: () => toast.error('Erro ao criar campanha. Verifique os dados.'),
      });

    },
    [post, onSuccess],);

  const handleTypeSelect = useCallback(
    (type: string) => {
      setSelectedType(type);

      setData('campaign_type', type);

      if (type === 'message_ads') setData('bidding_strategy', 'cps');

      else if (type === 'sponsored_content') setData('bidding_strategy', 'cpc');

    },
    [setData],);

  const addJobTitle = useCallback(
    (title: string) => {
      if (title && !jobTitles.includes(title)) setJobTitles((prev: unknown) => [...prev, title]);

    },
    [jobTitles],);

  const removeJobTitle = useCallback((title: string) => setJobTitles((prev: unknown) => (prev || []).filter((t: unknown) => t !== title)), []);

  const addCompany = useCallback(
    (company: string) => {
      if (company && !companies.includes(company)) setCompanies((prev: unknown) => [...prev, company]);

    },
    [companies],);

  const removeCompany = useCallback((company: string) => setCompanies((prev: unknown) => (prev || []).filter((c: unknown) => c !== company)), []);

  const addSkill = useCallback(
    (skill: string) => {
      if (skill && !skills.includes(skill)) setSkills((prev: unknown) => [...prev, skill]);

    },
    [skills],);

  const removeSkill = useCallback((skill: string) => setSkills((prev: unknown) => (prev || []).filter((s: unknown) => s !== skill)), []);

  const selectedCampaignType = CAMPAIGN_TYPES.find((t: unknown) => t.value === selectedType);

  return (
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><BarChart3 className="w-6 h-6 text-blue-600" /></div><div>
           
        </div><h2 className="text-xl font-bold text-gray-900">Nova Campanha LinkedIn</h2>
          <p className="text-gray-600">Selecione o tipo e defina o público-alvo</p></div><form onSubmit={handleSubmit} className="space-y-6" />
        <Card />
          <Card.Content />
            <div className="{(CAMPAIGN_TYPES || []).map((type: unknown) => {">$2</div>
                const isSelected = selectedType === type.value;
                const className = `cursor-pointer border-2 rounded-lg p-3 transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`;
                return (
                          <div key={type.value} onClick={() => handleTypeSelect(type.value)} className={className  }>
                    <div className=" ">$2</div><Briefcase className="w-5 h-5" />
                      <div className=" ">$2</div><h3 className="font-medium text-gray-900">{type.label}</h3>
                        <div className="{type.formats.slice(0, 2).map((format: unknown, index: number) => (">$2</div>
                            <Badge key={index} variant="secondary" className="text-xs" />
                              {format}
                            </Badge>
                          ))}
                        </div>
                    </div>);

              })}
            </div>
          </Card.Content></Card><Card />
          <Card.Header />
            <Card.Title className="flex items-center space-x-2" />
              <DollarSign className="w-5 h-5" />
              <span>Orçamento & Lance</span>
            </Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4" />
            <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="budget_amount">Orçamento</InputLabel>
                <Input id="budget_amount" type="number" step="0.01" value={data.budget_amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('budget_amount', e.target.value)} placeholder="100.00" /></div><div>
           
        </div><InputLabel htmlFor="bidding_strategy">Estratégia</InputLabel>
                <Select id="bidding_strategy" value={data.bidding_strategy} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('bidding_strategy', e.target.value)  }>
                  {(BIDDING_STRATEGIES || []).map((strategy: unknown) => (
                    <option key={strategy.value} value={ strategy.value } />
                      {strategy.label}
                    </option>
                  ))}
                </Select></div><div>
           
        </div><InputLabel htmlFor="bid_amount">Lance</InputLabel>
                <Input id="bid_amount" type="number" step="0.01" value={data.bid_amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('bid_amount', e.target.value)} placeholder="5.00" /></div></Card.Content></Card><Card />
          <Card.Header />
            <Card.Title className="flex items-center space-x-2" />
              <Users className="w-5 h-5" />
              <span>Público</span>
            </Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4" />
            <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="job_title_input">Cargos</InputLabel>
                <div className=" ">$2</div><Input id="job_title_input" placeholder="Ex: Technology Officer" onKeyPress={(e: unknown) => { if (e.key === 'Enter') { addJobTitle(e.currentTarget.value); e.currentTarget.value = ''; } } />
                  <Button type="button" variant="outline" onClick={ () => {
                    const input = document.getElementById('job_title_input')!;
                    if (input && 'value' in input && input.value) { addJobTitle(input.value); input.value = '';  } }>
                    <Plus className="w-4 h-4" /></Button></div>
                <div className="{(jobTitles || []).map((title: unknown, index: number) => (">$2</div>
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1" />
                      <span>{title}</span>
                      <button type="button" onClick={() => removeJobTitle(title)} className="ml-1 hover:text-red-600">
                        <X className="w-3 h-3" /></button></Badge>
                  ))}
                </div>
              <div>
           
        </div><InputLabel htmlFor="job_functions">Funções</InputLabel>
                <Select id="job_functions" multiple value={data.job_functions} onChange={ (value: string | number) => setData('job_functions', Array.isArray(value) ? value : [value])  }>
                  {['Marketing', 'Engenharia', 'Vendas', 'TI', 'Operações'].map((func: unknown) => (
                    <option key={func} value={ func } />
                      {func}
                    </option>
                  ))}
                </Select></div><div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="years_experience_min">Exp. mínima</InputLabel>
                <Input id="years_experience_min" type="number" value={data.years_experience_min} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('years_experience_min', e.target.value)} placeholder="5" /></div><div>
           
        </div><InputLabel htmlFor="years_experience_max">Exp. máxima</InputLabel>
                <Input id="years_experience_max" type="number" value={data.years_experience_max} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('years_experience_max', e.target.value)} placeholder="20" /></div></Card.Content></Card><Card />
          <Card.Header />
            <Card.Title className="flex items-center space-x-2" />
              <Calendar className="w-5 h-5" />
              <span>Datas</span>
            </Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4" />
            <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="start_date">Início</InputLabel>
                <Input id="start_date" type="date" value={data.start_date} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('start_date', e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="end_date">Término</InputLabel>
                <Input id="end_date" type="date" value={data.end_date} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('end_date', e.target.value) } /></div></Card.Content></Card><div className=" ">$2</div><Button type="button" variant="outline" onClick={ onCancel }>Cancelar</Button>
          <Button type="submit" disabled={processing} className="min-w-[120px]" />
            {processing ? 'Criando...' : 'Criar Campanha'}
          </Button></div></form>
    </div>);};

export default LinkedInCampaignCreator;
