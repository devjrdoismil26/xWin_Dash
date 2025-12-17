import React from 'react';
import { ModuleLayout, PageHeader, Card } from '@/shared/components/ui';
import { AIMetricsCards } from '../components';
import { useAIRefactored } from '../hooks/useAI';
import { BarChart3, TrendingUp, DollarSign, Zap } from 'lucide-react';

export const AIAnalyticsPage: React.FC = () => {
  const { metrics, analytics, loading } = useAIRefactored();

  return (
        <>
      <ModuleLayout />
      <PageHeader
        title="Analytics de IA"
        description="Análise de uso e performance"
      / />
      <AIMetricsCards metrics={metrics} loading={loading} / />
      <div className=" ">$2</div><Card title="Uso por Tipo" icon={ BarChart3 } />
          <div className="Gráfico de uso por tipo">$2</div>
          </div></Card><Card title="Custo por Provider" icon={ DollarSign } />
          <div className="Gráfico de custos">$2</div>
          </div></Card><Card title="Performance" icon={ Zap } />
          <div className="Gráfico de performance">$2</div>
          </div></Card><Card title="Evolução Temporal" icon={ TrendingUp } />
          <div className="Gráfico de evolução">$2</div>
          </div></Card></div>

      <Card title="Insights" className="mt-6" />
        <div className=" ">$2</div><div className=" ">$2</div><h4 className="font-medium text-blue-900">Modelo Mais Usado</h4>
            <p className="text-sm text-blue-700">GPT-4 com 45% das gerações</p></div><div className=" ">$2</div><h4 className="font-medium text-green-900">Economia</h4>
            <p className="text-sm text-green-700">R$ 1.200 economizados este mês</p></div><div className=" ">$2</div><h4 className="font-medium text-yellow-900">Recomendação</h4>
            <p className="text-sm text-yellow-700">Considere usar Claude para análises longas</p></div></Card>
    </ModuleLayout>);};

export default AIAnalyticsPage;
