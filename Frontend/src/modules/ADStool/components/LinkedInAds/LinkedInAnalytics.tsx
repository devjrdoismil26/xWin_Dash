/**
 * Componente LinkedInAnalytics - Analytics do LinkedIn Ads
 *
 * @description
 * Componente de analytics avançado para campanhas do LinkedIn Ads. Exibe
 * métricas detalhadas, gráficos de série temporal, distribuição por público,
 * performance por indústria e cargos com melhor desempenho.
 *
 * Funcionalidades principais:
 * - Métricas principais (impressões, cliques, leads, custo)
 * - Gráficos de série temporal (linha, barra, área)
 * - Distribuição por público (gráfico de pizza)
 * - Performance por indústria
 * - Cargos com melhor desempenho
 * - Seleção de período de tempo
 * - Exportação de dados
 * - Formatação de valores (moeda, porcentagem, números)
 * - Suporte completo a dark mode
 *
 * @module modules/ADStool/components/LinkedInAds/LinkedInAnalytics
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import LinkedInAnalytics from '@/modules/ADStool/components/LinkedInAds/LinkedInAnalytics';
 *
 * <LinkedInAnalytics
 *   data={
 *     total_impressions: 50000,
 *     total_clicks: 2500,
 *     total_leads: 125,
 *     total_cost: 15000,
 *     timeline: [...],
 *     audience_breakdown: {...},
 *     industry_performance: [...]
 *   } *   loading={ false }
 *   timePeriod="last_30_days"
 *   onTimePeriodChange={ (period: unknown) =>  }
 *   onExport={ () =>  }
 * />
 * ```
 */

import React, { useMemo, useState } from 'react';
import { TrendingUp, Eye, Target, UserCheck, Download, Users, Building, Briefcase, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import Select from '@/shared/components/ui/Select';
import InputLabel from '@/shared/components/ui/InputLabel';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';

/**
 * Cores para gráficos
 *
 * @constant {string[]}
 */
const COLORS = ['#0066CC', '#00A0B0', '#6A4C93', '#F39C12', '#E74C3C', '#2ECC71'];

/**
 * Períodos de tempo disponíveis
 *
 * @constant {Array<{value: string, label: string}>}
 */
const TIME_PERIODS = [
  { value: 'last_7_days', label: 'Últimos 7 dias' },
  { value: 'last_30_days', label: 'Últimos 30 dias' },
  { value: 'last_90_days', label: 'Últimos 90 dias' },
  { value: 'this_quarter', label: 'Este trimestre' },
  { value: 'this_year', label: 'Este ano' },
];

/**
 * Configuração de métricas
 *
 * @constant {Array<{key: string, label: string, color: string}>}
 */
const METRICS_CONFIG = [
  { key: 'impressions', label: 'Impressões', color: '#0066CC' },
  { key: 'clicks', label: 'Cliques', color: '#00A0B0' },
  { key: 'leads', label: 'Leads', color: '#6A4C93' },
  { key: 'cost', label: 'Custo', color: '#F39C12' },
];

/**
 * Formata valor como moeda brasileira
 *
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado como moeda
 * @private
 */
const formatCurrency = (value: number): string => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

/**
 * Formata valor como porcentagem
 *
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado como porcentagem
 * @private
 */
const formatPercentage = (value: number): string => `${value.toFixed(2)}%`;

/**
 * Formata número abreviado (K, M)
 *
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado (ex: 1.5K, 2.3M)
 * @private
 */
const formatNumber = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();};

/**
 * Calcula mudança percentual entre dois valores
 *
 * @param {number} current - Valor atual
 * @param {number} previous - Valor anterior
 * @returns {number} Mudança percentual
 * @private
 */
const calculateChange = (current: number, previous: number): number => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;};

/**
 * Props do componente LinkedInAnalytics
 *
 * @description
 * Propriedades que podem ser passadas para o componente LinkedInAnalytics.
 *
 * @interface LinkedInAnalyticsProps
 * @property {Record<string, any>} [data={}] - Dados de analytics (opcional, padrão: {})
 * @property {boolean} [loading=false] - Se está carregando dados (opcional, padrão: false)
 * @property {string} [timePeriod='last_30_days'] - Período de tempo selecionado (opcional, padrão: 'last_30_days')
 * @property {(period: string) => void} [onTimePeriodChange] - Callback ao alterar período (opcional)
 * @property {() => void} [onExport] - Callback ao exportar dados (opcional)
 */
interface LinkedInAnalyticsProps {
  data?: Record<string, any>;
  loading?: boolean;
  timePeriod?: string;
  onTimePeriodChange??: (e: any) => void;
  onExport???: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente LinkedInAnalytics
 *
 * @description
 * Renderiza um componente de analytics completo com gráficos e tabelas
 * para análise de campanhas do LinkedIn Ads. Gerencia estado de gráfico
 * e métricas selecionadas.
 *
 * @component
 * @param {LinkedInAnalyticsProps} props - Props do componente
 * @param {Record<string, any>} [props.data={}] - Dados de analytics
 * @property {boolean} [props.loading=false] - Se está carregando
 * @param {string} [props.timePeriod='last_30_days'] - Período de tempo
 * @param {(period: string) => void} [props.onTimePeriodChange] - Callback ao alterar período
 * @param {() => void} [props.onExport] - Callback ao exportar
 * @returns {JSX.Element} Componente de analytics renderizado
 */
interface TimelineItem {
  date: string | Date;
  impressions?: number;
  clicks?: number;
  leads?: number;
  cost?: number;
  [key: string]: unknown; }

const LinkedInAnalytics: React.FC<LinkedInAnalyticsProps> = ({ data = {} as any, loading = false, timePeriod = 'last_30_days', onTimePeriodChange, onExport }) => {
  const [selectedMetrics, setSelectedMetrics] = useState(['impressions', 'clicks', 'leads']);

  const timeSeriesData = useMemo(() => {
    const timeline = (data.timeline || []) as TimelineItem[];
    return timeline.map((item: unknown) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    }));

  }, [data.timeline]);

  const audienceData = useMemo(() => {
    if (!data.audience_breakdown) return [];
    return Object.entries(data.audience_breakdown).map(([key, value], index) => ({ name: key, value, color: COLORS[index % COLORS.length] }));

  }, [data.audience_breakdown]);

  const industryData = useMemo(() => {
    if (!data.industry_performance) return [];
    return ((data.industry_performance || []) as Array<Record<string, any>>).map((item, index: number) => ({ ...item, color: COLORS[index % COLORS.length] }));

  }, [data.industry_performance]);

  const jobTitleData = useMemo(() => {
    if (!data.job_title_performance) return [];
    return (data as any).job_title_performance.slice(0, 10);

  }, [data.job_title_performance]);

  const renderTimeSeriesChart = () => {
    const chartProps = { data: timeSeriesData, margin: { top: 20, right: 30, left: 20, bottom: 5 } ;

    if (chartType === 'area') { return (
        <>
      <AreaChart {...chartProps } />
      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" / />
          <XAxis dataKey="date" stroke="#64748b" / />
          <YAxis stroke="#64748b" fontSize={12} / />
          <Tooltip contentStyle={ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' } / />
          <Legend>
          {(selectedMetrics || []).map((metric: unknown) => {
                          const config = METRICS_CONFIG.find((m: unknown) => m.key === metric);

            return <Area key={metric} type="monotone" dataKey={metric} stackId="1" stroke={config.color} fill={config.color} fillOpacity={0.6} name={ config.label } />;
          })}
        </AreaChart>);

    }
    if (chartType === 'bar') { return (
        <>
      <BarChart {...chartProps } />
      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" / />
          <XAxis dataKey="date" stroke="#64748b" / />
          <YAxis stroke="#64748b" fontSize={12} / />
          <Tooltip contentStyle={ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' } / />
          <Legend>
          {(selectedMetrics || []).map((metric: unknown) => {
                          const config = METRICS_CONFIG.find((m: unknown) => m.key === metric);

            return <Bar key={metric} dataKey={metric} fill={config.color} name={config.label} radius={ [2, 2, 0, 0] } />;
          })}
        </BarChart>);

    }
    return (
        <>
      <LineChart { ...chartProps } />
      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" / />
        <XAxis dataKey="date" stroke="#64748b" / />
        <YAxis stroke="#64748b" fontSize={12} / />
        <Tooltip contentStyle={ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' } / />
        <Legend>
          {(selectedMetrics || []).map((metric: unknown) => {
                        const config = METRICS_CONFIG.find((m: unknown) => m.key === metric);

          return <Line key={metric} type="monotone" dataKey={metric} stroke={config.color} strokeWidth={2} dot={ fill: config.color, strokeWidth: 2, r: 4 } name={config.label} activeDot={ r: 6, stroke: config.color, strokeWidth: 2 } />;
        })}
      </LineChart>);};

  const [chartType, setChartType] = useState('line');

  if (loading) return <LoadingSpinner text="Carregando analytics..." />;
  return (
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><TrendingUp className="w-6 h-6 text-blue-600" /></div><div>
           
        </div><h2 className="text-xl font-bold text-gray-900">Analytics do LinkedIn</h2>
            <p className="text-gray-600">Acompanhe métricas de campanhas e público-alvo</p></div><div className=" ">$2</div><Button variant="outline" />
            <Download className="w-4 h-4 mr-2" /> Exportar
          </Button>
          <Select value={chartType} onChange={ (e: unknown) => setChartType(e.target.value)  }>
            <option value="line">Linha</option>
            <option value="bar">Barra</option>
            <option value="area">Área</option></Select></div>
      <div className=" ">$2</div><Card className="hover:shadow-lg transition-shadow duration-200" />
          <Card.Content className="p-6" />
            <div className=" ">$2</div><div className=" ">$2</div><div className="p-3 rounded-lg bg-opacity-10" style={backgroundColor: '#0066CC' } >
           
        </div><Eye className="w-6 h-6" /></div><div>
           
        </div><p className="text-sm font-medium text-gray-600">Impressões</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(data.total_impressions || 0)}</p></div></div>
          </Card.Content></Card><Card className="hover:shadow-lg transition-shadow duration-200" />
          <Card.Content className="p-6" />
            <div className=" ">$2</div><div className=" ">$2</div><div className="p-3 rounded-lg bg-opacity-10" style={backgroundColor: '#00A0B0' } >
           
        </div><Target className="w-6 h-6" /></div><div>
           
        </div><p className="text-sm font-medium text-gray-600">Cliques</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(data.total_clicks || 0)}</p></div></div>
          </Card.Content></Card><Card className="hover:shadow-lg transition-shadow duration-200" />
          <Card.Content className="p-6" />
            <div className=" ">$2</div><div className=" ">$2</div><div className="p-3 rounded-lg bg-opacity-10" style={backgroundColor: '#6A4C93' } >
           
        </div><UserCheck className="w-6 h-6" /></div><div>
           
        </div><p className="text-sm font-medium text-gray-600">Leads Gerados</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(data.total_leads || 0)}</p></div></div>
          </Card.Content></Card><Card className="hover:shadow-lg transition-shadow duration-200" />
          <Card.Content className="p-6" />
            <div className=" ">$2</div><div className=" ">$2</div><div className="p-3 rounded-lg bg-opacity-10" style={backgroundColor: '#F39C12' } >
           
        </div><TrendingUp className="w-6 h-6" /></div><div>
           
        </div><p className="text-sm font-medium text-gray-600">Custo Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.total_cost || 0)}</p></div></div>
          </Card.Content></Card></div>
      <Card />
        <Card.Content className="space-y-4" />
          <div className=" ">$2</div><div className=" ">$2</div><Calendar className="w-5 h-5" />
              <span>Período</span></div><Select value={timePeriod} onChange={ (e: unknown) => onTimePeriodChange?.(e.target.value)  }>
              {(TIME_PERIODS || []).map((p: unknown) => (
                <option key={p.value} value={ p.value } />
                  {p.label}
                </option>
              ))}
            </Select></div><div style={width: '100%', height: 300 } >
           
        </div><ResponsiveContainer width="100%" height="100%" />
              {renderTimeSeriesChart()}
            </ResponsiveContainer></div></Card.Content></Card><div className=" ">$2</div><Card />
          <Card.Header />
            <Card.Title className="flex items-center space-x-2" />
              <Users className="w-5 h-5" />
              <span>Distribuição por Público</span>
            </Card.Title>
          </Card.Header>
          <Card.Content />
            <ResponsiveContainer width="100%" height={ 240 } />
              <PieChart />
                <Pie data={audienceData} cx="50%" cy="50%" outerRadius={100} dataKey="value" />
                  {(audienceData || []).map((entry: unknown, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} / />
                  ))}
                </Pie></PieChart></ResponsiveContainer>
          </Card.Content></Card><Card />
          <Card.Header />
            <Card.Title className="flex items-center space-x-2" />
              <Building className="w-5 h-5" />
              <span>Performance por Indústria</span>
            </Card.Title>
          </Card.Header>
          <Card.Content />
            <div className="{(industryData || []).slice(0, 8).map((industry: unknown) => (">$2</div>
                <div key={industry.name} className="flex items-center justify-between">
           
        </div><div className=" ">$2</div><div className="w-4 h-4 rounded" style={backgroundColor: industry.color } />
           
        </div><span className="font-medium text-sm">{industry.name}</span></div><div className=" ">$2</div><div className="font-medium">{formatNumber(industry.value)}</div>
                    <div className="text-xs text-gray-500">{formatCurrency(industry.cost || 0)}</div>
    </div>
  ))}
            </div>
          </Card.Content></Card></div>
      <Card />
        <Card.Header />
          <Card.Title className="flex items-center space-x-2" />
            <Briefcase className="w-5 h-5" />
            <span>Cargos com melhor desempenho</span>
          </Card.Title>
        </Card.Header>
        <Card.Content />
          <div className=" ">$2</div><table className="w-full" />
              <thead />
                <tr className="border-b" />
                  <th className="text-left py-3 px-4">Cargo</th>
                  <th className="text-left py-3 px-4">Impressões</th>
                  <th className="text-left py-3 px-4">Cliques</th>
                  <th className="text-left py-3 px-4">CTR</th>
                  <th className="text-left py-3 px-4">Leads</th>
                  <th className="text-left py-3 px-4">Custo</th></tr></thead>
              <tbody />
                {(jobTitleData || []).map((job: unknown) => (
                  <tr key={job.title} className="border-b hover:bg-gray-50" />
                    <td className="py-3 px-4 font-medium">{job.title}</td>
                    <td className="py-3 px-4">{formatNumber(job.impressions)}</td>
                    <td className="py-3 px-4">{formatNumber(job.clicks)}</td>
                    <td className="py-3 px-4" />
                      <span className={`font-medium ${job.ctr >= 2 ? 'text-green-600' : job.ctr >= 1 ? 'text-yellow-600' : 'text-red-600'} `}>{formatPercentage(job.ctr)}</span></td><td className="py-3 px-4 font-medium">{formatNumber(job.leads)}</td>
                    <td className="py-3 px-4">{formatCurrency(job.cost)}</td>
      </tr>
    </>
  ))}
              </tbody></table></div>
        </Card.Content></Card></div>);};

export default LinkedInAnalytics;
