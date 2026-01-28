// =========================================
// SOCIAL BUFFER EMPTY STATE - SOCIAL BUFFER
// =========================================

import React from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Hash, 
  Link as Link, 
  Image, 
  BarChart3, 
  Heart, 
  Users,
  FileText,
  Upload,
  Filter,
  RefreshCw
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Animated } from '@/components/ui/AdvancedAnimations';

// =========================================
// INTERFACES
// =========================================

interface EmptyStateProps {
  type?: 'posts' | 'schedules' | 'hashtags' | 'links' | 'media' | 'analytics' | 'engagement' | 'accounts' | 'search' | 'filter';
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  showAction?: boolean;
  showSecondaryAction?: boolean;
  className?: string;
}

interface EmptyStateConfig {
  icon: React.ReactNode;
  title: string;
  message: string;
  actionLabel: string;
  secondaryActionLabel?: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

// =========================================
// CONFIGURAÇÕES DE TIPOS DE ESTADO VAZIO
// =========================================

const emptyStates: Record<string, EmptyStateConfig> = {
  posts: {
    icon: <FileText className="w-16 h-16" />,
    title: 'Nenhum Post Encontrado',
    message: 'Você ainda não criou nenhum post. Comece criando seu primeiro post para compartilhar com sua audiência.',
    actionLabel: 'Criar Primeiro Post',
    secondaryActionLabel: 'Ver Templates',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  schedules: {
    icon: <Calendar className="w-16 h-16" />,
    title: 'Nenhum Agendamento',
    message: 'Você ainda não tem posts agendados. Agende seus posts para manter uma presença consistente nas redes sociais.',
    actionLabel: 'Agendar Post',
    secondaryActionLabel: 'Ver Calendário',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  hashtags: {
    icon: <Hash className="w-16 h-16" />,
    title: 'Nenhuma Hashtag',
    message: 'Você ainda não tem hashtags salvas. Crie coleções de hashtags para otimizar seus posts.',
    actionLabel: 'Criar Hashtag',
    secondaryActionLabel: 'Ver Trending',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  links: {
    icon: <Link className="w-16 h-16" />,
    title: 'Nenhum Link Encurtado',
    message: 'Você ainda não encurtou nenhum link. Encurte links para rastrear cliques e melhorar a aparência dos seus posts.',
    actionLabel: 'Encurtar Link',
    secondaryActionLabel: 'Ver Analytics',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200'
  },
  media: {
    icon: <Image className="w-16 h-16" />,
    title: 'Nenhuma Mídia',
    message: 'Você ainda não fez upload de nenhuma mídia. Faça upload de imagens e vídeos para enriquecer seus posts.',
    actionLabel: 'Fazer Upload',
    secondaryActionLabel: 'Ver Galerias',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200'
  },
  analytics: {
    icon: <BarChart3 className="w-16 h-16" />,
    title: 'Nenhum Dado de Analytics',
    message: 'Você ainda não tem dados de analytics. Publique alguns posts para começar a ver suas métricas de performance.',
    actionLabel: 'Ver Posts',
    secondaryActionLabel: 'Configurar Analytics',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200'
  },
  engagement: {
    icon: <Heart className="w-16 h-16" />,
    title: 'Nenhum Engajamento',
    message: 'Você ainda não tem dados de engajamento. Publique posts e interaja com sua audiência para ver métricas de engajamento.',
    actionLabel: 'Ver Posts',
    secondaryActionLabel: 'Configurar Monitoramento',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  accounts: {
    icon: <Users className="w-16 h-16" />,
    title: 'Nenhuma Conta Conectada',
    message: 'Você ainda não conectou nenhuma conta social. Conecte suas contas para começar a gerenciar suas redes sociais.',
    actionLabel: 'Conectar Conta',
    secondaryActionLabel: 'Ver Plataformas',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200'
  },
  search: {
    icon: <Search className="w-16 h-16" />,
    title: 'Nenhum Resultado Encontrado',
    message: 'Sua busca não retornou resultados. Tente usar termos diferentes ou ajustar os filtros.',
    actionLabel: 'Limpar Filtros',
    secondaryActionLabel: 'Ver Todos',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  },
  filter: {
    icon: <Filter className="w-16 h-16" />,
    title: 'Nenhum Item Filtrado',
    message: 'Os filtros aplicados não retornaram resultados. Tente ajustar os critérios de filtro.',
    actionLabel: 'Limpar Filtros',
    secondaryActionLabel: 'Ver Todos',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  }
};

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

const SocialBufferEmptyState: React.FC<EmptyStateProps> = ({
  type = 'posts',
  title,
  message,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  showAction = true,
  showSecondaryAction = false,
  className = ''
}) => {
  const emptyConfig = emptyStates[type] || emptyStates.posts;
  
  const finalTitle = title || emptyConfig.title;
  const finalMessage = message || emptyConfig.message;
  const finalActionLabel = actionLabel || emptyConfig.actionLabel;
  const finalSecondaryActionLabel = secondaryActionLabel || emptyConfig.secondaryActionLabel;

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      // Ações padrão baseadas no tipo
      switch (type) {
        case 'posts':
          // Navegar para criar post
          window.location.href = '/social-buffer/posts/create';
          break;
        case 'schedules':
          // Navegar para agendar post
          window.location.href = '/social-buffer/schedules/create';
          break;
        case 'hashtags':
          // Navegar para criar hashtag
          window.location.href = '/social-buffer/hashtags/create';
          break;
        case 'links':
          // Navegar para encurtar link
          window.location.href = '/social-buffer/links/create';
          break;
        case 'media':
          // Navegar para upload de mídia
          window.location.href = '/social-buffer/media/upload';
          break;
        case 'accounts':
          // Navegar para conectar conta
          window.location.href = '/social-buffer/accounts/connect';
          break;
        default:
          // Ação genérica
          console.log('Ação padrão para', type);
      }
    }
  };

  const handleSecondaryAction = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      // Ações secundárias padrão
      switch (type) {
        case 'posts':
          // Ver templates
          window.location.href = '/social-buffer/posts/templates';
          break;
        case 'schedules':
          // Ver calendário
          window.location.href = '/social-buffer/schedules/calendar';
          break;
        case 'hashtags':
          // Ver trending
          window.location.href = '/social-buffer/hashtags/trending';
          break;
        case 'links':
          // Ver analytics
          window.location.href = '/social-buffer/links/analytics';
          break;
        case 'media':
          // Ver galerias
          window.location.href = '/social-buffer/media/galleries';
          break;
        case 'search':
        case 'filter':
          // Limpar filtros
          window.location.reload();
          break;
        default:
          console.log('Ação secundária padrão para', type);
      }
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <Animated delay={0}>
        <Card className={`p-8 max-w-md w-full text-center ${emptyConfig.bgColor} ${emptyConfig.borderColor} border-2`}>
          <div className="space-y-6">
            {/* Ícone */}
            <div className={`flex justify-center ${emptyConfig.color}`}>
              {emptyConfig.icon}
            </div>

            {/* Título e Mensagem */}
            <div>
              <h2 className={`text-xl font-semibold ${emptyConfig.color} mb-2`}>
                {finalTitle}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {finalMessage}
              </p>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {showAction && (
                <Button
                  onClick={handleAction}
                  variant="default"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {finalActionLabel}
                </Button>
              )}
              
              {showSecondaryAction && finalSecondaryActionLabel && (
                <Button
                  onClick={handleSecondaryAction}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {type === 'search' || type === 'filter' ? (
                    <RefreshCw className="w-4 h-4" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {finalSecondaryActionLabel}
                </Button>
              )}
            </div>

            {/* Dicas adicionais */}
            <div className="text-xs text-gray-500 space-y-1">
              {type === 'posts' && (
                <p>💡 Dica: Use templates para criar posts mais rapidamente</p>
              )}
              {type === 'schedules' && (
                <p>💡 Dica: Agende posts nos horários de maior engajamento</p>
              )}
              {type === 'hashtags' && (
                <p>💡 Dica: Use hashtags relevantes para aumentar o alcance</p>
              )}
              {type === 'links' && (
                <p>💡 Dica: Encurte links para rastrear cliques e melhorar a aparência</p>
              )}
              {type === 'media' && (
                <p>💡 Dica: Use imagens de alta qualidade para melhor engajamento</p>
              )}
              {type === 'analytics' && (
                <p>💡 Dica: Publique posts regularmente para gerar dados de analytics</p>
              )}
              {type === 'engagement' && (
                <p>💡 Dica: Interaja com comentários para aumentar o engajamento</p>
              )}
              {type === 'accounts' && (
                <p>💡 Dica: Conecte todas as suas contas sociais para gerenciar tudo em um lugar</p>
              )}
              {type === 'search' && (
                <p>💡 Dica: Tente usar termos mais gerais ou menos filtros</p>
              )}
              {type === 'filter' && (
                <p>💡 Dica: Ajuste os filtros para encontrar o que você procura</p>
              )}
            </div>
          </div>
        </Card>
      </Animated>
    </div>
  );
};

// =========================================
// COMPONENTES ESPECIALIZADOS
// =========================================

export const PostsEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <SocialBufferEmptyState {...props} type="posts" />
);

export const SchedulesEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <SocialBufferEmptyState {...props} type="schedules" />
);

export const HashtagsEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <SocialBufferEmptyState {...props} type="hashtags" />
);

export const LinksEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <SocialBufferEmptyState {...props} type="links" />
);

export const MediaEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <SocialBufferEmptyState {...props} type="media" />
);

export const AnalyticsEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <SocialBufferEmptyState {...props} type="analytics" />
);

export const EngagementEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <SocialBufferEmptyState {...props} type="engagement" />
);

export const AccountsEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <SocialBufferEmptyState {...props} type="accounts" />
);

export const SearchEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <SocialBufferEmptyState {...props} type="search" />
);

export const FilterEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <SocialBufferEmptyState {...props} type="filter" />
);

export default SocialBufferEmptyState;
