import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';
import { ModuleLayout, PageHeader, Card } from '@/shared/components/ui';
import { useLeads } from '../hooks/useLeads';
import { LeadsMetricsCards } from '../components/LeadsMetricsCards';

export const LeadsAnalyticsPage: React.FC = () => {
  const { metrics, analytics, loading, fetchAnalytics, fetchMetrics } = useLeads();

  useEffect(() => {
    fetchMetrics();

    fetchAnalytics();

  }, []);

  return (
            <>
      <Head title="Analytics - Leads" / />
      <ModuleLayout
        moduleTitle="Leads"
        moduleIcon="users"
        menuItems={[
          { label: 'Lista', path: '/leads', icon: 'list' },
          { label: 'Analytics', path: '/leads/analytics', icon: 'chart' },
          { label: 'Segmentos', path: '/leads/segments', icon: 'filter' }
        ]} />
        <PageHeader
          title="Analytics de Leads"
          subtitle="Análise detalhada do desempenho dos seus leads"
        / />
        <LeadsMetricsCards metrics={metrics} loading={loading} / />
        <div className=" ">$2</div><Card title="Conversão por Origem" />
            <div className="Gráfico de conversão por origem">$2</div>
            </div></Card><Card title="Leads por Status" />
            <div className="Gráfico de distribuição por status">$2</div>
            </div></Card><Card title="Evolução Temporal" />
            <div className="Gráfico de evolução ao longo do tempo">$2</div>
            </div></Card><Card title="Score Médio por Segmento" />
            <div className="Gráfico de score médio">$2</div>
            </div></Card></div>

        <Card title="Principais Insights" />
          <div className=" ">$2</div><div className=" ">$2</div><TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
           
        </div><h4 className="font-medium text-blue-900">Crescimento Positivo</h4>
                <p className="text-sm text-blue-700" />
                  Aumento de 15% no número de leads qualificados este mês
                </p></div><div className=" ">$2</div><Target className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
           
        </div><h4 className="font-medium text-green-900">Alta Taxa de Conversão</h4>
                <p className="text-sm text-green-700" />
                  Leads vindos de indicações têm 40% mais chance de conversão
                </p></div><div className=" ">$2</div><Users className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
           
        </div><h4 className="font-medium text-purple-900">Engajamento Alto</h4>
                <p className="text-sm text-purple-700" />
                  Score médio dos leads aumentou 8 pontos nas últimas 2 semanas
                </p></div></div></Card></ModuleLayout>
    </>);};
