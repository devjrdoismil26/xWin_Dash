import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { 
  Home,
  Brain,
  Users,
  Mail,
  Share2,
  MessageCircle,
  Target,
  BarChart3,
  Image,
  Package,
  Activity,
  Settings,
  Zap,
  Star,
  Clock,
  TrendingUp,
  Sparkles,
  FileText,
  Palette,
  Bot,
  Database,
  Globe,
  Shield,
  Workflow
} from 'lucide-react';

interface SubMenuItem {
  name: string;
  route: string;
  icon?: React.ReactNode;
  badge?: string;
  description?: string;
  isNew?: boolean;
  isPro?: boolean;
  isBeta?: boolean;
}

interface MenuItem {
  name: string;
  route: string;
  category: string;
  icon: React.ReactNode;
  badge?: string;
  description?: string;
  isPrimary?: boolean;
  isNew?: boolean;
  isPro?: boolean;
  isBeta?: boolean;
  subItems?: SubMenuItem[];
  color?: string;
  permissions?: string[];
}

export const useSidebarRoutes = () => {
  const { url } = usePage();

  const menuItems: MenuItem[] = useMemo(() => [
    {
      name: 'Portal Hub',
      route: '/portal',
      category: 'Principal',
              icon: React.createElement(Home, { className: "w-5 h-5" }),
      description: 'Centro de controle principal',
      isPrimary: true,
      color: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Universe',
      route: '/universe',
      category: 'Principal',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Experiência unificada com IA',
      isPrimary: true,
      color: 'from-purple-500 to-pink-600'
    },
    {
      name: 'Dashboard',
      route: '/dashboard',
      category: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Visão geral dos dados e métricas',
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'IA',
      route: '/ai',
      category: 'AI',
      icon: <Brain className="w-5 h-5" />,
      description: 'Laboratório de Inteligência Artificial',
      isNew: true,
      color: 'from-purple-500 to-indigo-600',
      subItems: [
        {
          name: 'Text Generator',
          route: '/ai/text-generator',
          icon: <FileText className="w-4 h-4" />,
          description: 'Geração de texto com IA',
          isNew: true
        },
        {
          name: 'Image Generator',
          route: '/ai/image-generator',
          icon: <Palette className="w-4 h-4" />,
          description: 'Criação de imagens com IA',
          isPro: true
        },
        {
          name: 'Chat Assistant',
          route: '/ai/chat',
          icon: <Bot className="w-4 h-4" />,
          description: 'Assistente conversacional'
        },
        {
          name: 'Content Analysis',
          route: '/ai/analysis',
          icon: <TrendingUp className="w-4 h-4" />,
          description: 'Análise de conteúdo',
          isPro: true
        },
        {
          name: 'AI Models',
          route: '/ai/models',
          icon: <Database className="w-4 h-4" />,
          description: 'Gerenciar modelos de IA',
          isBeta: true
        }
      ]
    },
    {
      name: 'Leads',
      route: '/leads',
      category: 'CRM',
      icon: <Users className="w-5 h-5" />,
      description: 'Gerenciamento de leads e clientes',
      color: 'from-blue-500 to-cyan-600',
      subItems: [
        {
          name: 'Lead List',
          route: '/leads/list',
          icon: <Users className="w-4 h-4" />,
          description: 'Lista de leads'
        },
        {
          name: 'Lead Scoring',
          route: '/leads/scoring',
          icon: <Star className="w-4 h-4" />,
          description: 'Pontuação de leads',
          isPro: true
        },
        {
          name: 'Lead Analytics',
          route: '/leads/analytics',
          icon: <BarChart3 className="w-4 h-4" />,
          description: 'Análise de performance'
        },
        {
          name: 'Lead Automation',
          route: '/leads/automation',
          icon: <Zap className="w-4 h-4" />,
          description: 'Automação de leads',
          isPro: true
        }
      ]
    },
    {
      name: 'Email Marketing',
      route: '/email-marketing',
      category: 'Marketing',
      icon: <Mail className="w-5 h-5" />,
      description: 'Campanhas e automação de email',
      color: 'from-orange-500 to-red-600',
      subItems: [
        {
          name: 'Campaigns',
          route: '/email-marketing/campaigns',
          icon: <Mail className="w-4 h-4" />,
          description: 'Gerenciar campanhas'
        },
        {
          name: 'Templates',
          route: '/email-marketing/templates',
          icon: <FileText className="w-4 h-4" />,
          description: 'Modelos de email'
        },
        {
          name: 'Automation',
          route: '/email-marketing/automation',
          icon: <Zap className="w-4 h-4" />,
          description: 'Automação de emails',
          isPro: true
        },
        {
          name: 'Segments',
          route: '/email-marketing/segments',
          icon: <Users className="w-4 h-4" />,
          description: 'Segmentação de público'
        },
        {
          name: 'Analytics',
          route: '/email-marketing/analytics',
          icon: <BarChart3 className="w-4 h-4" />,
          description: 'Métricas de email'
        }
      ]
    },
    {
      name: 'Social Buffer',
      route: '/social-buffer',
      category: 'Marketing',
      icon: <Share2 className="w-5 h-5" />,
      description: 'Gestão de redes sociais',
      color: 'from-pink-500 to-rose-600',
      subItems: [
        {
          name: 'Posts',
          route: '/social-buffer/posts',
          icon: <Share2 className="w-4 h-4" />,
          description: 'Gerenciar posts'
        },
        {
          name: 'Scheduling',
          route: '/social-buffer/scheduling',
          icon: <Clock className="w-4 h-4" />,
          description: 'Agendamento de posts'
        },
        {
          name: 'Analytics',
          route: '/social-buffer/analytics',
          icon: <BarChart3 className="w-4 h-4" />,
          description: 'Métricas sociais'
        },
        {
          name: 'Accounts',
          route: '/social-buffer/accounts',
          icon: <Globe className="w-4 h-4" />,
          description: 'Contas conectadas'
        }
      ]
    },
    {
      name: 'Aura WhatsApp',
      route: '/aura',
      category: 'Communication',
      icon: <MessageCircle className="w-5 h-5" />,
      description: 'Automação WhatsApp com IA',
      color: 'from-green-500 to-teal-600',
      subItems: [
        {
          name: 'Chats',
          route: '/aura/chats',
          icon: <MessageCircle className="w-4 h-4" />,
          description: 'Gerenciar conversas'
        },
        {
          name: 'Templates',
          route: '/aura/templates',
          icon: <FileText className="w-4 h-4" />,
          description: 'Modelos de mensagem'
        },
        {
          name: 'Automation',
          route: '/aura/automation',
          icon: <Zap className="w-4 h-4" />,
          description: 'Fluxos automatizados',
          isPro: true
        },
        {
          name: 'Analytics',
          route: '/aura/analytics',
          icon: <BarChart3 className="w-4 h-4" />,
          description: 'Métricas de conversas'
        }
      ]
    },
    {
      name: 'Ads Tool',
      route: '/adstool',
      category: 'Marketing',
      icon: <Target className="w-5 h-5" />,
      description: 'Gestão de anúncios e campanhas',
      color: 'from-yellow-500 to-orange-600',
      subItems: [
        {
          name: 'Campaigns',
          route: '/adstool/campaigns',
          icon: <Target className="w-4 h-4" />,
          description: 'Gerenciar campanhas'
        },
        {
          name: 'Creatives',
          route: '/adstool/creatives',
          icon: <Image className="w-4 h-4" />,
          description: 'Criativos de anúncios'
        },
        {
          name: 'Audiences',
          route: '/adstool/audiences',
          icon: <Users className="w-4 h-4" />,
          description: 'Públicos-alvo'
        },
        {
          name: 'Analytics',
          route: '/adstool/analytics',
          icon: <BarChart3 className="w-4 h-4" />,
          description: 'Performance de anúncios'
        }
      ]
    },
    {
      name: 'Analytics',
      route: '/analytics',
      category: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Análise avançada de dados',
      color: 'from-indigo-500 to-blue-600',
      subItems: [
        {
          name: 'Dashboard',
          route: '/analytics/dashboard',
          icon: <BarChart3 className="w-4 h-4" />,
          description: 'Painel principal'
        },
        {
          name: 'Reports',
          route: '/analytics/reports',
          icon: <FileText className="w-4 h-4" />,
          description: 'Relatórios personalizados'
        },
        {
          name: 'Real-time',
          route: '/analytics/realtime',
          icon: <Activity className="w-4 h-4" />,
          description: 'Dados em tempo real',
          isPro: true
        }
      ]
    },
    {
      name: 'Activity Logs',
      route: '/activity',
      category: 'System',
      icon: <Activity className="w-5 h-5" />,
      description: 'Sistema de auditoria e logs',
      color: 'from-slate-500 to-gray-600',
      subItems: [
        {
          name: 'All Activities',
          route: '/activity',
          icon: <Activity className="w-4 h-4" />,
          description: 'Todas as atividades'
        },
        {
          name: 'Security Logs',
          route: '/activity/security',
          icon: <Shield className="w-4 h-4" />,
          description: 'Logs de segurança'
        },
        {
          name: 'User Activities',
          route: '/activity/users',
          icon: <Users className="w-4 h-4" />,
          description: 'Atividades de usuários'
        },
        {
          name: 'System Events',
          route: '/activity/system',
          icon: <Database className="w-4 h-4" />,
          description: 'Eventos do sistema'
        },
        {
          name: 'Export Logs',
          route: '/activity/export',
          icon: <FileText className="w-4 h-4" />,
          description: 'Exportar logs',
          isPro: true
        }
      ]
    },
    {
      name: 'Mídia',
      route: '/media',
      category: 'Content',
      icon: <Image className="w-5 h-5" />,
      description: 'Biblioteca de mídia e assets',
      color: 'from-purple-500 to-pink-600',
      subItems: [
        {
          name: 'Library',
          route: '/media/library',
          icon: <Image className="w-4 h-4" />,
          description: 'Biblioteca de mídia'
        },
        {
          name: 'Upload',
          route: '/media/upload',
          icon: <Zap className="w-4 h-4" />,
          description: 'Upload de arquivos'
        },
        {
          name: 'AI Generation',
          route: '/media/ai-generation',
          icon: <Brain className="w-4 h-4" />,
          description: 'Geração com IA',
          isPro: true
        }
      ]
    },
    {
      name: 'Produtos',
      route: '/products',
      category: 'E-commerce',
      icon: <Package className="w-5 h-5" />,
      description: 'Gestão de produtos e catálogo',
      color: 'from-emerald-500 to-green-600',
      subItems: [
        {
          name: 'Products',
          route: '/products/list',
          icon: <Package className="w-4 h-4" />,
          description: 'Lista de produtos'
        },
        {
          name: 'Categories',
          route: '/products/categories',
          icon: <Database className="w-4 h-4" />,
          description: 'Categorias'
        },
        {
          name: 'Landing Pages',
          route: '/products/landing-pages',
          icon: <Globe className="w-4 h-4" />,
          description: 'Páginas de destino'
        },
        {
          name: 'A/B Testing',
          route: '/products/ab-testing',
          icon: <TrendingUp className="w-4 h-4" />,
          description: 'Testes A/B',
          isPro: true
        }
      ]
    },
    {
      name: 'Workflows',
      route: '/workflows',
      category: 'Automation',
      icon: <Activity className="w-5 h-5" />,
      description: 'Automação de processos',
      color: 'from-violet-500 to-purple-600',
      isNew: true,
      subItems: [
        {
          name: 'Workflow Builder',
          route: '/workflows/builder',
          icon: <Workflow className="w-4 h-4" />,
          description: 'Construtor de workflows',
          isNew: true
        },
        {
          name: 'Templates',
          route: '/workflows/templates',
          icon: <FileText className="w-4 h-4" />,
          description: 'Modelos de workflow'
        },
        {
          name: 'Executions',
          route: '/workflows/executions',
          icon: <Activity className="w-4 h-4" />,
          description: 'Histórico de execuções'
        },
        {
          name: 'Integrations',
          route: '/workflows/integrations',
          icon: <Zap className="w-4 h-4" />,
          description: 'Integrações disponíveis'
        }
      ]
    },
    {
      name: 'Configurações',
      route: '/settings',
      category: 'System',
      icon: <Settings className="w-5 h-5" />,
      description: 'Configurações do sistema',
      color: 'from-gray-500 to-slate-600',
      subItems: [
        {
          name: 'General',
          route: '/settings/general',
          icon: <Settings className="w-4 h-4" />,
          description: 'Configurações gerais'
        },
        {
          name: 'Integrations',
          route: '/settings/integrations',
          icon: <Globe className="w-4 h-4" />,
          description: 'Integrações externas'
        },
        {
          name: 'Security',
          route: '/settings/security',
          icon: <Shield className="w-4 h-4" />,
          description: 'Segurança e permissões',
          isPro: true
        },
        {
          name: 'API Keys',
          route: '/settings/api-keys',
          icon: <Database className="w-4 h-4" />,
          description: 'Chaves de API'
        }
      ]
    }
  ], []);

  // Filtrar itens baseado na URL atual
  const getActiveItem = useMemo(() => {
    return menuItems.find(item => 
      url.startsWith(item.route) ||
      item.subItems?.some(sub => url.startsWith(sub.route))
    );
  }, [menuItems, url]);

  // Obter item ativo e submenu ativo
  const getActiveSubmenu = useMemo(() => {
    if (!getActiveItem?.subItems) return null;
    
    return getActiveItem.subItems.find(sub => url.startsWith(sub.route));
  }, [getActiveItem, url]);

  return {
    menuItems,
    getActiveItem,
    getActiveSubmenu,
    currentUrl: url
  };
};

export default useSidebarRoutes;
