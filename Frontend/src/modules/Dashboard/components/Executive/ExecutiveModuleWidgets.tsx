import React from 'react';
import { Brain, MessageCircle, ShoppingCart, Mail, Image, Zap, BarChart3, Target } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';
import Progress from '@/shared/components/ui/Progress';

interface ModuleWidget {
  id: string;
  title: string;
  icon: React.ReactNode;
  value: number;
  total: number;
  status: 'success' | 'warning' | 'error' | 'info';
  description: string; }

interface ExecutiveModuleWidgetsProps {
  modules: {
ai: { active: number;
  total: number;
  status: string
children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

    aura: { conversations: number; pending: number; status: string};

    products: { active: number; total: number; status: string};

    email: { campaigns: number; sent: number; status: string};

    media: { files: number; storage: number; status: string};

    workflows: { active: number; total: number; status: string};

    analytics: { reports: number; insights: number; status: string};

    ads: { campaigns: number; budget: number; status: string};
};

}

export const ExecutiveModuleWidgets: React.FC<ExecutiveModuleWidgetsProps> = ({ modules    }) => {
  const widgets: ModuleWidget[] = [
    {
      id: 'ai',
      title: 'AI Processing',
      icon: <Brain className="w-5 h-5" />,
      value: modules.ai.active,
      total: modules.ai.total,
      status: modules.ai.status as any,
      description: 'Processamentos ativos'
    },
    {
      id: 'aura',
      title: 'Aura Conversations',
      icon: <MessageCircle className="w-5 h-5" />,
      value: modules.aura.conversations,
      total: modules.aura.pending,
      status: modules.aura.status as any,
      description: 'Conversas ativas'
    },
    {
      id: 'products',
      title: 'Products',
      icon: <ShoppingCart className="w-5 h-5" />,
      value: modules.products.active,
      total: modules.products.total,
      status: modules.products.status as any,
      description: 'Produtos ativos'
    },
    {
      id: 'email',
      title: 'Email Marketing',
      icon: <Mail className="w-5 h-5" />,
      value: modules.email.campaigns,
      total: modules.email.sent,
      status: modules.email.status as any,
      description: 'Campanhas ativas'
    },
    {
      id: 'media',
      title: 'Media Library',
      icon: <Image className="w-5 h-5" />,
      value: modules.media.files,
      total: modules.media.storage,
      status: modules.media.status as any,
      description: 'Arquivos armazenados'
    },
    {
      id: 'workflows',
      title: 'Workflows',
      icon: <Zap className="w-5 h-5" />,
      value: modules.workflows.active,
      total: modules.workflows.total,
      status: modules.workflows.status as any,
      description: 'Workflows ativos'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      value: modules.analytics.reports,
      total: modules.analytics.insights,
      status: modules.analytics.status as any,
      description: 'Relatórios gerados'
    },
    {
      id: 'ads',
      title: 'ADS Tool',
      icon: <Target className="w-5 h-5" />,
      value: modules.ads.campaigns,
      total: modules.ads.budget,
      status: modules.ads.status as any,
      description: 'Campanhas ativas'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    } ;

  return (
            <div className=" ">$2</div><h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4" />
        Status dos Módulos
      </h2>
      <div className="{widgets.map((widget: unknown) => {">$2</div>
          const percentage = (widget.value / widget.total) * 100;
          
          return (
        <>
      <Card key={widget.id} className="p-4 hover:shadow-lg transition-shadow" />
      <div className=" ">$2</div><div className="{widget.icon}">$2</div>
                </div>
                <Badge className={getStatusColor(widget.status) } />
                  {widget.status}
                </Badge></div><h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1" />
                {widget.title}
              </h3>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3" />
                {widget.description}
              </p>
              
              <div className=" ">$2</div><div className=" ">$2</div><span className="{widget.value} / {widget.total}">$2</span>
                  </span>
                  <span className="{percentage.toFixed(0)}%">$2</span>
                  </span></div><Progress value={percentage} className="h-2" /></div></Card>);

        })}
      </div>);};
