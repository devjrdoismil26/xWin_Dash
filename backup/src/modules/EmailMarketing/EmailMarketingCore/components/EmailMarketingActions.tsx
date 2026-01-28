/**
 * Componente de ações rápidas do dashboard de Email Marketing
 * Exibe botões de ação e links rápidos
 */

import React from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { 
  Plus, 
  Mail, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  Send,
  Calendar,
  Target,
  Zap,
  TrendingUp,
  Download,
  Upload
} from 'lucide-react';
import { EmailMarketingMetrics } from '../types';
import { cn } from '@/lib/utils';

interface EmailMarketingActionsProps {
  metrics?: EmailMarketingMetrics | null;
  onRefresh?: () => void;
  className?: string;
}

export const EmailMarketingActions: React.FC<EmailMarketingActionsProps> = ({
  metrics,
  onRefresh,
  className
}) => {
  const quickActions = [
    {
      id: 'create-campaign',
      title: 'Nova Campanha',
      description: 'Criar uma nova campanha de email',
      icon: Plus,
      color: 'blue',
      action: () => {
        // Implementar navegação para criação de campanha
        console.log('Criar nova campanha');
      }
    },
    {
      id: 'create-template',
      title: 'Novo Template',
      description: 'Criar um novo template de email',
      icon: FileText,
      color: 'green',
      action: () => {
        // Implementar navegação para criação de template
        console.log('Criar novo template');
      }
    },
    {
      id: 'create-segment',
      title: 'Novo Segmento',
      description: 'Criar um novo segmento de público',
      icon: Users,
      color: 'purple',
      action: () => {
        // Implementar navegação para criação de segmento
        console.log('Criar novo segmento');
      }
    },
    {
      id: 'view-analytics',
      title: 'Ver Analytics',
      description: 'Acessar relatórios detalhados',
      icon: BarChart3,
      color: 'orange',
      action: () => {
        // Implementar navegação para analytics
        console.log('Ver analytics');
      }
    }
  ];

  const recentActions = [
    {
      id: 'send-campaign',
      title: 'Enviar Campanha',
      description: 'Enviar campanha agendada',
      icon: Send,
      color: 'blue',
      action: () => {
        console.log('Enviar campanha');
      }
    },
    {
      id: 'schedule-campaign',
      title: 'Agendar Campanha',
      description: 'Agendar envio de campanha',
      icon: Calendar,
      color: 'green',
      action: () => {
        console.log('Agendar campanha');
      }
    },
    {
      id: 'ab-test',
      title: 'A/B Test',
      description: 'Criar teste A/B',
      icon: Target,
      color: 'purple',
      action: () => {
        console.log('Criar A/B test');
      }
    },
    {
      id: 'automation',
      title: 'Automação',
      description: 'Configurar automação',
      icon: Zap,
      color: 'orange',
      action: () => {
        console.log('Configurar automação');
      }
    }
  ];

  const tools = [
    {
      id: 'import-contacts',
      title: 'Importar Contatos',
      description: 'Importar lista de contatos',
      icon: Upload,
      color: 'blue',
      action: () => {
        console.log('Importar contatos');
      }
    },
    {
      id: 'export-data',
      title: 'Exportar Dados',
      description: 'Exportar relatórios e dados',
      icon: Download,
      color: 'green',
      action: () => {
        console.log('Exportar dados');
      }
    },
    {
      id: 'performance',
      title: 'Performance',
      description: 'Otimizar performance',
      icon: TrendingUp,
      color: 'purple',
      action: () => {
        console.log('Otimizar performance');
      }
    },
    {
      id: 'settings',
      title: 'Configurações',
      description: 'Configurar sistema',
      icon: Settings,
      color: 'gray',
      action: () => {
        console.log('Abrir configurações');
      }
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Ações Rápidas */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
        <Card.Header>
          <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Ações Rápidas
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className={cn(
                  "h-auto p-4 flex flex-col items-center gap-3 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300",
                  action.color === 'blue' && "hover:shadow-blue-500/10",
                  action.color === 'green' && "hover:shadow-green-500/10",
                  action.color === 'purple' && "hover:shadow-purple-500/10",
                  action.color === 'orange' && "hover:shadow-orange-500/10"
                )}
                onClick={action.action}
              >
                <div className={cn(
                  "p-3 rounded-lg",
                  action.color === 'blue' && "bg-blue-500/20",
                  action.color === 'green' && "bg-green-500/20",
                  action.color === 'purple' && "bg-purple-500/20",
                  action.color === 'orange' && "bg-orange-500/20"
                )}>
                  <action.icon className={cn(
                    "h-6 w-6",
                    action.color === 'blue' && "text-blue-600",
                    action.color === 'green' && "text-green-600",
                    action.color === 'purple' && "text-purple-600",
                    action.color === 'orange' && "text-orange-600"
                  )} />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {action.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    {action.description}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Ações Recentes */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
        <Card.Header>
          <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-green-600" />
            Ações de Campanha
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className={cn(
                  "h-auto p-4 flex flex-col items-center gap-3 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300",
                  action.color === 'blue' && "hover:shadow-blue-500/10",
                  action.color === 'green' && "hover:shadow-green-500/10",
                  action.color === 'purple' && "hover:shadow-purple-500/10",
                  action.color === 'orange' && "hover:shadow-orange-500/10"
                )}
                onClick={action.action}
              >
                <div className={cn(
                  "p-3 rounded-lg",
                  action.color === 'blue' && "bg-blue-500/20",
                  action.color === 'green' && "bg-green-500/20",
                  action.color === 'purple' && "bg-purple-500/20",
                  action.color === 'orange' && "bg-orange-500/20"
                )}>
                  <action.icon className={cn(
                    "h-6 w-6",
                    action.color === 'blue' && "text-blue-600",
                    action.color === 'green' && "text-green-600",
                    action.color === 'purple' && "text-purple-600",
                    action.color === 'orange' && "text-orange-600"
                  )} />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {action.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    {action.description}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Ferramentas */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
        <Card.Header>
          <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600" />
            Ferramentas
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant="outline"
                className={cn(
                  "h-auto p-4 flex flex-col items-center gap-3 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300",
                  tool.color === 'blue' && "hover:shadow-blue-500/10",
                  tool.color === 'green' && "hover:shadow-green-500/10",
                  tool.color === 'purple' && "hover:shadow-purple-500/10",
                  tool.color === 'gray' && "hover:shadow-gray-500/10"
                )}
                onClick={tool.action}
              >
                <div className={cn(
                  "p-3 rounded-lg",
                  tool.color === 'blue' && "bg-blue-500/20",
                  tool.color === 'green' && "bg-green-500/20",
                  tool.color === 'purple' && "bg-purple-500/20",
                  tool.color === 'gray' && "bg-gray-500/20"
                )}>
                  <tool.icon className={cn(
                    "h-6 w-6",
                    tool.color === 'blue' && "text-blue-600",
                    tool.color === 'green' && "text-green-600",
                    tool.color === 'purple' && "text-purple-600",
                    tool.color === 'gray' && "text-gray-600"
                  )} />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {tool.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    {tool.description}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default EmailMarketingActions;
