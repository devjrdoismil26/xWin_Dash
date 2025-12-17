import React from 'react';
import { Mail, Eye, MousePointer, Users, TrendingUp, TrendingDown } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';
import { EmailCampaignStats } from '@/types/emailTypes';
interface CampaignMetricsProps {
  metrics: EmailCampaignStats;
  loading?: boolean;
  error?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const CampaignMetrics: React.FC<CampaignMetricsProps> = ({ 
  metrics = {} as any, 
  loading = false, 
  error 
}) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Métricas da Campanha</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className="{[...Array(4)].map((_: unknown, i: unknown) => (">$2</div>
      <div key={i} className="h-4 bg-gray-200 rounded">
    </>
  ))}
        </div>
          </div>
        </Card.Content>
      </Card>);

  }
  if (error) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Métricas da Campanha</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-center text-red-500" />
          Erro: {error}
        </Card.Content>
      </Card>);

  }
  const formatNumber = (num: number = 0): string => {
    return num.toLocaleString('pt-BR');};

  const formatPercentage = (num: number = 0): string => {
    return `${num.toFixed(2)}%`;};

  const getRateColor = (rate: number): string => {
    if (rate >= 20) return 'text-green-600';
    if (rate >= 10) return 'text-yellow-600';
    return 'text-red-600';};

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Métricas da Campanha</Card.Title>
      </Card.Header>
      <Card.Content className="p-4" />
        <div className="{/* Enviados */}">$2</div>
          <div className=" ">$2</div><div className=" ">$2</div><Mail className="h-5 w-5 text-blue-600" /></div><div className="{formatNumber(metrics.sent)}">$2</div>
            </div>
            <div className="text-sm text-gray-600">Enviados</div>
          {/* Entregues */}
          <div className=" ">$2</div><div className=" ">$2</div><Users className="h-5 w-5 text-green-600" /></div><div className="{formatNumber(metrics.delivered)}">$2</div>
            </div>
            <div className="text-sm text-gray-600">Entregues</div>
          {/* Aberturas */}
          <div className=" ">$2</div><div className=" ">$2</div><Eye className="h-5 w-5 text-purple-600" /></div><div className="{formatNumber(metrics.opened)}">$2</div>
            </div>
            <div className="text-sm text-gray-600">Aberturas</div>
            <div className={`text-xs font-medium ${getRateColor(metrics.open_rate)} `}>
           
        </div>{formatPercentage(metrics.open_rate)} taxa
            </div>
          {/* Cliques */}
          <div className=" ">$2</div><div className=" ">$2</div><MousePointer className="h-5 w-5 text-orange-600" /></div><div className="{formatNumber(metrics.clicked)}">$2</div>
            </div>
            <div className="text-sm text-gray-600">Cliques</div>
            <div className={`text-xs font-medium ${getRateColor(metrics.click_rate)} `}>
           
        </div>{formatPercentage(metrics.click_rate)} taxa
            </div>
        </div>
        {/* Métricas Adicionais */}
        <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className="{formatNumber(metrics.bounced)}">$2</div>
              </div>
              <div className="text-gray-500">Bounces</div>
              <div className={`text-xs ${getRateColor(100 - metrics.bounce_rate)} `}>
           
        </div>{formatPercentage(metrics.bounce_rate)} taxa
              </div>
            <div className=" ">$2</div><div className="{formatNumber(metrics.unsubscribed)}">$2</div>
              </div>
              <div className="text-gray-500">Descadastros</div>
              <div className={`text-xs ${getRateColor(100 - metrics.unsubscribe_rate)} `}>
           
        </div>{formatPercentage(metrics.unsubscribe_rate)} taxa
              </div>
            <div className=" ">$2</div><div className="{formatNumber(metrics.spam_reports)}">$2</div>
              </div>
              <div className="text-gray-500">Spam Reports</div>
            <div className=" ">$2</div><div className="{formatPercentage(metrics.open_rate)}">$2</div>
              </div>
              <div className="text-gray-500">Taxa de Abertura</div>
              <div className="text-xs text-gray-400">Geral</div>
          </div>
        {/* Performance Indicators */}
        <div className=" ">$2</div><div className=" ">$2</div><span className="text-sm text-gray-600">Performance</span>
            <div className="{metrics.open_rate >= 20 ? (">$2</div>
                <Badge variant="success" className="flex items-center gap-1" />
                  <TrendingUp className="h-3 w-3" />
                  Excelente
                </Badge>
              ) : metrics.open_rate >= 10 ? (
                <Badge variant="warning" className="flex items-center gap-1" />
                  <TrendingUp className="h-3 w-3" />
                  Boa
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1" />
                  <TrendingDown className="h-3 w-3" />
                  Precisa melhorar
                </Badge>
              )}
            </div></div></Card.Content>
    </Card>);};

export default CampaignMetrics;
