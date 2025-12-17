/**
 * Componente de cabeçalho do dashboard de Email Marketing
 * Exibe informações principais e ações do cabeçalho
 */

import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { RefreshCw, Download, Settings, Mail, Users, TrendingUp, Calendar, Clock } from 'lucide-react';
import { EmailMarketingMetrics } from '../types';
import { cn } from '@/lib/utils';

interface EmailMarketingHeaderProps {
  metrics?: EmailMarketingMetrics | null;
  onRefresh???: (e: any) => void;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const EmailMarketingHeader: React.FC<EmailMarketingHeaderProps> = ({ metrics,
  onRefresh,
  loading = false,
  className
   }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);};

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(amount);};

  return (
        <>
      <Card className={cn("backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300", className) } />
      <Card.Header />
        <div className=" ">$2</div><div>
           
        </div><Card.Title className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2" />
              <Mail className="h-6 w-6 text-blue-600" />
              Email Marketing Dashboard
            </Card.Title>
            <p className="text-gray-600 dark:text-gray-300 mt-1" />
              Visão geral das suas campanhas e métricas de email marketing
            </p></div><div className=" ">$2</div><Button
              variant="outline"
              onClick={ onRefresh }
              disabled={ loading }
              className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20" />
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} / />
              Atualizar
            </Button>
            <Button
              variant="outline"
              className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20" />
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button
              variant="outline"
              className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20" />
              <Settings className="h-4 w-4" /></Button></div>
      </Card.Header>
      
      {metrics && (
        <Card.Content />
          <div className="{/* Total de Campanhas */}">$2</div>
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Mail className="h-5 w-5 text-blue-600" /></div><div className="{formatNumber(metrics.total_campaigns)}">$2</div>
              </div>
              <div className="Total de Campanhas">$2</div>
              </div>
              <Badge variant="outline" className="mt-2 backdrop-blur-sm bg-white/10 border-white/20" />
                {metrics.active_campaigns} ativas
              </Badge>
            </div>

            {/* Total de Inscritos */}
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Users className="h-5 w-5 text-green-600" /></div><div className="{formatNumber(metrics.total_subscribers)}">$2</div>
              </div>
              <div className="Total de Inscritos">$2</div>
              </div>
              <Badge variant="outline" className="mt-2 backdrop-blur-sm bg-white/10 border-white/20" />
                {formatNumber(metrics.total_segments)} segmentos
              </Badge>
            </div>

            {/* Taxa de Abertura */}
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><TrendingUp className="h-5 w-5 text-purple-600" /></div><div className="{metrics.open_rate.toFixed(1)}%">$2</div>
              </div>
              <div className="Taxa de Abertura">$2</div>
              </div>
              <Badge variant="outline" className="mt-2 backdrop-blur-sm bg-white/10 border-white/20" />
                {metrics.click_rate.toFixed(1)}% cliques
              </Badge>
            </div>

            {/* Receita Gerada */}
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><TrendingUp className="h-5 w-5 text-orange-600" /></div><div className="{formatCurrency(metrics.revenue_generated)}">$2</div>
              </div>
              <div className="Receita Gerada">$2</div>
              </div>
              <Badge variant="outline" className="mt-2 backdrop-blur-sm bg-white/10 border-white/20" />
                {metrics.conversion_rate.toFixed(1)}% conversão
              </Badge>
            </div>

          {/* Informações adicionais */}
          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Calendar className="h-4 w-4" />
                  <span>Última campanha: {new Date().toLocaleDateString('pt-BR')}</span></div><div className=" ">$2</div><Clock className="h-4 w-4" />
                  <span>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span></div><div className=" ">$2</div><Badge variant="outline" className="backdrop-blur-sm bg-white/10 border-white/20" />
                  {metrics.total_templates} templates
                </Badge>
                <Badge variant="outline" className="backdrop-blur-sm bg-white/10 border-white/20" />
                  {metrics.emails_delivered} emails enviados
                </Badge></div></div>
      </Card.Content>
    </>
  )}
    </Card>);};

export default EmailMarketingHeader;
