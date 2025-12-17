import React from 'react';
import Card from '@/shared/components/ui/Card';
import { LeadMetricsDisplayProps } from '../types';
const LeadMetricsDisplay: React.FC<LeadMetricsDisplayProps> = ({ metrics, 
  period = '30d', 
  loading, 
  error 
   }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Métricas de Leads</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className="h-4 bg-gray-200 rounded w-2/3">
           
        </div></Card.Content>
      </Card>);

  }
  if (error) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Métricas de Leads</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-center text-red-500" />
          Erro: {error}
        </Card.Content>
      </Card>);

  }
  const getPeriodLabel = (period: string): string => {
    const labels = {
      '7d': 'Últimos 7 dias',
      '30d': 'Últimos 30 dias',
      '90d': 'Últimos 90 dias',
      '1y': 'Último ano'};

    return labels[period as keyof typeof labels] || period;};

  const conversionRate = metrics.total > 0 ? (metrics.won / metrics.total) * 100 : 0;
  const activeLeads = metrics.new + metrics.contacted + metrics.qualified + metrics.proposal + metrics.negotiation;
  return (
            <div className="{/* Header */}">$2</div>
      <div className=" ">$2</div><h2 className="text-2xl font-bold text-gray-900">Métricas de Leads</h2>
        <div className="{getPeriodLabel(period)}">$2</div>
        </div>
      {/* Métricas Principais */}
      <div className=" ">$2</div><Card />
          <Card.Content className="p-4" />
            <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold text-gray-900" />
                  {metrics.total.toLocaleString('pt-BR')}
                </p></div><div className=" ">$2</div><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" / /></svg></div>
          </Card.Content></Card><Card />
          <Card.Content className="p-4" />
            <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-green-600" />
                  {conversionRate.toFixed(1)}%
                </p></div><div className=" ">$2</div><svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" / /></svg></div>
          </Card.Content></Card><Card />
          <Card.Content className="p-4" />
            <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600">Score Médio</p>
                <p className="text-2xl font-bold text-purple-600" />
                  {metrics.avg_score.toFixed(1)}
                </p></div><div className=" ">$2</div><svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" / /></svg></div>
          </Card.Content></Card><Card />
          <Card.Content className="p-4" />
            <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600">Leads Ativos</p>
                <p className="text-2xl font-bold text-orange-600" />
                  {activeLeads.toLocaleString('pt-BR')}
                </p></div><div className=" ">$2</div><svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" / /></svg></div>
          </Card.Content></Card></div>
      {/* Distribuição Detalhada */}
      <div className=" ">$2</div><Card />
          <Card.Header />
            <Card.Title>Distribuição por Status</Card.Title>
          </Card.Header>
          <Card.Content className="p-4" />
            <div className="{[">$2</div>
                { label: 'Novos', value: metrics.new, color: 'bg-blue-500' },
                { label: 'Contactados', value: metrics.contacted, color: 'bg-yellow-500' },
                { label: 'Qualificados', value: metrics.qualified, color: 'bg-green-500' },
                { label: 'Propostas', value: metrics.proposal, color: 'bg-purple-500' },
                { label: 'Negociação', value: metrics.negotiation, color: 'bg-orange-500' }
              ].map((item: unknown, index: unknown) => {
                const percentage = metrics.total > 0 ? (item.value / metrics.total) * 100 : 0;
                return (
        <>
      <div key={index} className="flex items-center space-x-3">
      </div><div className="{item.label}">$2</div>
                    </div>
                    <div className=" ">$2</div><div 
                        className={`${item.color} h-3 rounded-full transition-all duration-300`}
                        style={width: `${percentage} %` } />
           
        </div><div className="{item.value}">$2</div>
                    </div>);

              })}
            </div>
          </Card.Content></Card><Card />
          <Card.Header />
            <Card.Title>Resultados Finais</Card.Title>
          </Card.Header>
          <Card.Content className="p-4" />
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><span className="font-medium text-green-800">Leads Ganhos</span></div><span className="{metrics.won.toLocaleString('pt-BR')}">$2</span>
                </span></div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><span className="font-medium text-red-800">Leads Perdidos</span></div><span className="{metrics.lost.toLocaleString('pt-BR')}">$2</span>
                </span></div><div className=" ">$2</div><div className=" ">$2</div><span className="text-gray-600">Taxa de Sucesso:</span>
                  <span className="{metrics.won + metrics.lost > 0 ">$2</span>
                      ? ((metrics.won / (metrics.won + metrics.lost)) * 100).toFixed(1)
                      : 0}%
                  </span></div></div>
          </Card.Content></Card></div>);};

export default LeadMetricsDisplay;
