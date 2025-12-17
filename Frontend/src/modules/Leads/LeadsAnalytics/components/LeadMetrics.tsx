import React from 'react';
import Card from '@/shared/components/ui/Card';
import { LeadMetricsProps } from '../types';
const LeadMetrics: React.FC<LeadMetricsProps> = ({ metrics, loading, error    }) => { if (loading) {
    return (
              <div className="{[...Array(4)].map((_: unknown, index: unknown) => (">$2</div>
          <Card key={index } />
            <Card.Content className="p-4" />
              <div className=" ">$2</div><div className=" ">$2</div><div className="h-8 bg-gray-200 rounded w-1/2">
           
        </div></Card.Content>
      </Card>
    </>
  ))}
      </div>);

  }
  if (error) {
    return (
        <>
      <Card />
      <Card.Content className="p-4 text-center text-red-500" />
          Erro: {error}
        </Card.Content>
      </Card>);

  }
  const metricsData = [
    {
      title: 'Total de Leads',
      value: metrics.total,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Taxa de Conversão',
      value: `${metrics.conversion_rate.toFixed(1)}%`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Score Médio',
      value: metrics.avg_score.toFixed(1),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Leads Ganhos',
      value: metrics.won,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];
  const statusData = [
    { label: 'Novos', value: metrics.new, color: 'bg-blue-500' },
    { label: 'Contactados', value: metrics.contacted, color: 'bg-yellow-500' },
    { label: 'Qualificados', value: metrics.qualified, color: 'bg-green-500' },
    { label: 'Propostas', value: metrics.proposal, color: 'bg-purple-500' },
    { label: 'Negociação', value: metrics.negotiation, color: 'bg-orange-500' },
    { label: 'Ganhos', value: metrics.won, color: 'bg-emerald-500' },
    { label: 'Perdidos', value: metrics.lost, color: 'bg-red-500' }
  ];
  const totalStatus = statusData.reduce((sum: unknown, item: unknown) => sum + item.value, 0);

  return (
            <div className="{/* Métricas Principais */}">$2</div>
      <div className="{ (metricsData || []).map((metric: unknown, index: unknown) => (">$2</div>
          <Card key={index } />
            <Card.Content className={`p-4 ${metric.bgColor} rounded-lg`} />
              <div className="{metric.title}">$2</div>
              </div>
              <div className={`text-2xl font-bold ${metric.color} `}>
           
        </div>{metric.value.toLocaleString('pt-BR')}
              </div>
            </Card.Content>
      </Card>
    </>
  ))}
      </div>
      {/* Distribuição por Status */}
      <Card />
        <Card.Header />
          <Card.Title>Distribuição por Status</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className="{(statusData || []).map((item: unknown, index: unknown) => {">$2</div>
              const percentage = totalStatus > 0 ? (item.value / totalStatus) * 100 : 0;
              return (
        <>
      <div key={index} className="flex items-center space-x-3">
      </div><div className="{item.label}">$2</div>
                  </div>
                  <div className=" ">$2</div><div 
                      className={`${item.color} h-4 rounded-full transition-all duration-300`}
                      style={width: `${percentage} %` } />
           
        </div><div className="{item.value.toLocaleString('pt-BR')}">$2</div>
                  </div>
                  <div className="{percentage.toFixed(1)}%">$2</div>
                  </div>);

            })}
          </div>
        </Card.Content>
      </Card>
      {/* Resumo Executivo */}
      <div className=" ">$2</div><Card />
          <Card.Header />
            <Card.Title>Resumo Executivo</Card.Title>
          </Card.Header>
          <Card.Content className="p-4" />
            <div className=" ">$2</div><div className=" ">$2</div><span>Total de Leads:</span>
                <span className="font-medium">{metrics.total.toLocaleString('pt-BR')}</span></div><div className=" ">$2</div><span>Taxa de Conversão:</span>
                <span className="{metrics.conversion_rate.toFixed(1)}%">$2</span>
                </span></div><div className=" ">$2</div><span>Score Médio:</span>
                <span className="font-medium">{metrics.avg_score.toFixed(1)}</span></div><div className=" ">$2</div><span>Leads Ativos:</span>
                <span className="{(metrics.new + metrics.contacted + metrics.qualified + metrics.proposal + metrics.negotiation).toLocaleString('pt-BR')}">$2</span>
                </span></div></Card.Content></Card><Card />
          <Card.Header />
            <Card.Title>Performance</Card.Title>
          </Card.Header>
          <Card.Content className="p-4" />
            <div className=" ">$2</div><div className=" ">$2</div><span>Leads Ganhos:</span>
                <span className="{metrics.won.toLocaleString('pt-BR')}">$2</span>
                </span></div><div className=" ">$2</div><span>Leads Perdidos:</span>
                <span className="{metrics.lost.toLocaleString('pt-BR')}">$2</span>
                </span></div><div className=" ">$2</div><span>Taxa de Sucesso:</span>
                <span className="{metrics.won + metrics.lost > 0 ">$2</span>
                    ? ((metrics.won / (metrics.won + metrics.lost)) * 100).toFixed(1)
                    : 0}%
                </span></div></Card.Content></Card></div>);};

export default LeadMetrics;
