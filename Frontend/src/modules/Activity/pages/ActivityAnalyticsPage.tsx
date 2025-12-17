import React from 'react';
import { ModuleLayout, PageHeader, Card } from '@/shared/components/ui';
import { ActivityMetricsCards } from '../components';
import { useActivityRefactored } from '../hooks/useActivity';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';

export const ActivityAnalyticsPage: React.FC = () => {
  const { metrics, analytics, loading } = useActivityRefactored();

  return (
        <>
      <ModuleLayout />
      <PageHeader
        title="Analytics de Atividades"
        description="Análise detalhada de logs e atividades"
      / />
      <ActivityMetricsCards metrics={metrics} loading={loading} / />
      <div className=" ">$2</div><Card title="Atividades por Tipo" icon={ BarChart3 } />
          <div className="Gráfico de atividades por tipo">$2</div>
          </div></Card><Card title="Atividades por Usuário" icon={ Users } />
          <div className="Gráfico de atividades por usuário">$2</div>
          </div></Card><Card title="Evolução Temporal" icon={ TrendingUp } />
          <div className="Gráfico de evolução temporal">$2</div>
          </div></Card><Card title="Distribuição de Logs" icon={ Activity } />
          <div className="Gráfico de distribuição de logs">$2</div>
          </div></Card></div>

      <Card title="Insights" className="mt-6" />
        <div className=" ">$2</div><div className=" ">$2</div><h4 className="font-medium text-blue-900">Pico de Atividade</h4>
            <p className="text-sm text-blue-700">Maior volume de logs registrado às 14h</p></div><div className=" ">$2</div><h4 className="font-medium text-green-900">Usuários Mais Ativos</h4>
            <p className="text-sm text-green-700">Top 3 usuários responsáveis por 60% das atividades</p></div><div className=" ">$2</div><h4 className="font-medium text-yellow-900">Tipos Mais Comuns</h4>
            <p className="text-sm text-yellow-700">API calls representam 45% dos logs</p></div></Card>
    </ModuleLayout>);};

export default ActivityAnalyticsPage;
