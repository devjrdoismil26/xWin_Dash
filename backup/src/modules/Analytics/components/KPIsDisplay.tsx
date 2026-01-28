import React from 'react';
import Card from '@/components/ui/Card';
const KPI = ({ title, value, subtitle }) => (
  <Card>
    <Card.Content className="p-4">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </Card.Content>
  </Card>
);
const KPIsDisplay = ({ metrics = {} }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <KPI title="Leads" value={(metrics.leads || 0).toLocaleString('pt-BR')} />
    <KPI title="Conversões" value={(metrics.conversions || 0).toLocaleString('pt-BR')} />
    <KPI title="Custo" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.cost || 0)} />
    <KPI title="CTR" value={`${metrics.ctr || 0}%`} />
  </div>
);
export default KPIsDisplay;
