/**
 * Componente de cabeçalho do dashboard de Email Marketing
 * Exibe informações principais e ações do cabeçalho
 */

import React from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  RefreshCw, 
  Download, 
  Settings, 
  Mail, 
  Users, 
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { EmailMarketingMetrics } from '../types';
import { cn } from '@/lib/utils';

interface EmailMarketingHeaderProps {
  metrics?: EmailMarketingMetrics | null;
  onRefresh?: () => void;
  loading?: boolean;
  className?: string;
}

export const EmailMarketingHeader: React.FC<EmailMarketingHeaderProps> = ({
  metrics,
  onRefresh,
  loading = false,
  className
}) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(amount);
  };

  return (
    <Card className={cn("backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300", className)}>
      <Card.Header>
        <div className="flex items-center justify-between">
          <div>
            <Card.Title className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Mail className="h-6 w-6 text-blue-600" />
              Email Marketing Dashboard
            </Card.Title>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Visão geral das suas campanhas e métricas de email marketing
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={loading}
              className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              Atualizar
            </Button>
            <Button
              variant="outline"
              className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button
              variant="outline"
              className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card.Header>
      
      {metrics && (
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total de Campanhas */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatNumber(metrics.total_campaigns)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total de Campanhas
              </div>
              <Badge variant="outline" className="mt-2 backdrop-blur-sm bg-white/10 border-white/20">
                {metrics.active_campaigns} ativas
              </Badge>
            </div>

            {/* Total de Inscritos */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatNumber(metrics.total_subscribers)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total de Inscritos
              </div>
              <Badge variant="outline" className="mt-2 backdrop-blur-sm bg-white/10 border-white/20">
                {formatNumber(metrics.total_segments)} segmentos
              </Badge>
            </div>

            {/* Taxa de Abertura */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {metrics.open_rate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Taxa de Abertura
              </div>
              <Badge variant="outline" className="mt-2 backdrop-blur-sm bg-white/10 border-white/20">
                {metrics.click_rate.toFixed(1)}% cliques
              </Badge>
            </div>

            {/* Receita Gerada */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(metrics.revenue_generated)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Receita Gerada
              </div>
              <Badge variant="outline" className="mt-2 backdrop-blur-sm bg-white/10 border-white/20">
                {metrics.conversion_rate.toFixed(1)}% conversão
              </Badge>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Última campanha: {new Date().toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="backdrop-blur-sm bg-white/10 border-white/20">
                  {metrics.total_templates} templates
                </Badge>
                <Badge variant="outline" className="backdrop-blur-sm bg-white/10 border-white/20">
                  {metrics.emails_delivered} emails enviados
                </Badge>
              </div>
            </div>
          </div>
        </Card.Content>
      )}
    </Card>
  );
};

export default EmailMarketingHeader;
