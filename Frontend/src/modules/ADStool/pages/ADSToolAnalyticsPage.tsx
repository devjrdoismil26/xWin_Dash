import React from 'react';
import { ModuleLayout, PageHeader, Card } from '@/shared/components/ui';
import { ADSToolMetricsCards } from '../components';
import { useADSToolRefactored } from '../hooks/useADSTool';
import { BarChart3, TrendingUp, Target, DollarSign } from 'lucide-react';

export const ADSToolAnalyticsPage: React.FC = () => {
  const { metrics, analytics, loading } = useADSToolRefactored();

  return (
        <>
      <ModuleLayout />
      <PageHeader
        title="Analytics de Campanhas"
        description="Análise detalhada de performance"
      / />
      <ADSToolMetricsCards metrics={metrics} loading={loading} / />
      <div className=" ">$2</div><Card title="Performance por Plataforma" icon={ BarChart3 } />
          <div className="Gráfico de performance por plataforma">$2</div>
          </div></Card><Card title="ROI por Campanha" icon={ DollarSign } />
          <div className="Gráfico de ROI">$2</div>
          </div></Card><Card title="Evolução de Gastos" icon={ TrendingUp } />
          <div className="Gráfico de evolução temporal">$2</div>
          </div></Card><Card title="Taxa de Conversão" icon={ Target } />
          <div className="Gráfico de conversões">$2</div>
          </div></Card></div>

      <Card title="Insights" className="mt-6" />
        <div className=" ">$2</div><div className=" ">$2</div><h4 className="font-medium text-blue-900">Melhor Performance</h4>
            <p className="text-sm text-blue-700">Google Ads com CTR de 3.2%</p></div><div className=" ">$2</div><h4 className="font-medium text-green-900">Maior ROI</h4>
            <p className="text-sm text-green-700">LinkedIn Ads com 280% de retorno</p></div><div className=" ">$2</div><h4 className="font-medium text-yellow-900">Oportunidade</h4>
            <p className="text-sm text-yellow-700">Aumentar orçamento em campanhas de conversão</p></div></Card>
    </ModuleLayout>);};

export default ADSToolAnalyticsPage;
