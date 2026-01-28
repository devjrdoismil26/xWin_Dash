// =========================================
// SOCIAL BUFFER SUCCESS STATE - SOCIAL BUFFER
// =========================================

import React from 'react';
import { 
  CheckCircle, 
  Send, 
  Calendar, 
  Hash, 
  Link as Link, 
  Image, 
  BarChart3, 
  Heart, 
  Users,
  Plus,
  FileText,
  Upload,
  Share2,
  Zap,
  TrendingUp,
  Award,
  Star
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Animated } from '@/components/ui/AdvancedAnimations';

// =========================================
// INTERFACES
// =========================================

interface SuccessStateProps {
  type?: 'post' | 'schedule' | 'hashtag' | 'link' | 'media' | 'analytics' | 'engagement' | 'account' | 'bulk' | 'import' | 'export';
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  showAction?: boolean;
  showSecondaryAction?: boolean;
  stats?: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
  }[];
  className?: string;
}

interface SuccessStateConfig {
  icon: React.ReactNode;
  title: string;
  message: string;
  actionLabel: string;
  secondaryActionLabel?: string;
  color: string;
  bgColor: string;
  borderColor: string;
  confetti?: boolean;
}

// =========================================
// CONFIGURAÇÕES DE TIPOS DE SUCESSO
// =========================================

const successStates: Record<string, SuccessStateConfig> = {
  post: {
    icon: <Send className="w-16 h-16" />,
    title: 'Post Criado com Sucesso!',
    message: 'Seu post foi criado e está pronto para ser publicado. Você pode agendar para mais tarde ou publicar agora.',
    actionLabel: 'Ver Post',
    secondaryActionLabel: 'Criar Outro',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    confetti: true
  },
  schedule: {
    icon: <Calendar className="w-16 h-16" />,
    title: 'Post Agendado com Sucesso!',
    message: 'Seu post foi agendado e será publicado automaticamente no horário programado.',
    actionLabel: 'Ver Agendamento',
    secondaryActionLabel: 'Ver Calendário',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    confetti: true
  },
  hashtag: {
    icon: <Hash className="w-16 h-16" />,
    title: 'Hashtag Criada com Sucesso!',
    message: 'Sua hashtag foi criada e adicionada à sua biblioteca. Use-a em seus posts para aumentar o alcance.',
    actionLabel: 'Ver Hashtag',
    secondaryActionLabel: 'Criar Grupo',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  link: {
    icon: <Link className="w-16 h-16" />,
    title: 'Link Encurtado com Sucesso!',
    message: 'Seu link foi encurtado e está pronto para uso. Você pode rastrear cliques e compartilhar facilmente.',
    actionLabel: 'Ver Link',
    secondaryActionLabel: 'Copiar Link',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200'
  },
  media: {
    icon: <Image className="w-16 h-16" />,
    title: 'Mídia Enviada com Sucesso!',
    message: 'Sua mídia foi enviada e está disponível para uso em seus posts. A otimização automática foi aplicada.',
    actionLabel: 'Ver Mídia',
    secondaryActionLabel: 'Fazer Upload',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200'
  },
  analytics: {
    icon: <BarChart3 className="w-16 h-16" />,
    title: 'Relatório Gerado com Sucesso!',
    message: 'Seu relatório de analytics foi gerado e está pronto para visualização. Baixe ou compartilhe os resultados.',
    actionLabel: 'Ver Relatório',
    secondaryActionLabel: 'Exportar',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200'
  },
  engagement: {
    icon: <Heart className="w-16 h-16" />,
    title: 'Monitoramento Ativado!',
    message: 'O monitoramento de engajamento foi ativado com sucesso. Você receberá alertas sobre o desempenho dos seus posts.',
    actionLabel: 'Ver Monitoramento',
    secondaryActionLabel: 'Configurar Alertas',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  account: {
    icon: <Users className="w-16 h-16" />,
    title: 'Conta Conectada com Sucesso!',
    message: 'Sua conta social foi conectada e está pronta para uso. Você pode começar a gerenciar seus posts.',
    actionLabel: 'Ver Conta',
    secondaryActionLabel: 'Conectar Outra',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    confetti: true
  },
  bulk: {
    icon: <Zap className="w-16 h-16" />,
    title: 'Operação em Lote Concluída!',
    message: 'Sua operação em lote foi concluída com sucesso. Todos os itens foram processados.',
    actionLabel: 'Ver Resultados',
    secondaryActionLabel: 'Fazer Outra',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  import: {
    icon: <Upload className="w-16 h-16" />,
    title: 'Importação Concluída!',
    message: 'Seus dados foram importados com sucesso. Todos os itens foram processados e estão disponíveis.',
    actionLabel: 'Ver Importados',
    secondaryActionLabel: 'Importar Mais',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  export: {
    icon: <Share2 className="w-16 h-16" />,
    title: 'Exportação Concluída!',
    message: 'Seus dados foram exportados com sucesso. O arquivo está pronto para download.',
    actionLabel: 'Baixar Arquivo',
    secondaryActionLabel: 'Exportar Outros',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  }
};

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

const SocialBufferSuccessState: React.FC<SuccessStateProps> = ({
  type = 'post',
  title,
  message,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  showAction = true,
  showSecondaryAction = false,
  stats = [],
  className = ''
}) => {
  const successConfig = successStates[type] || successStates.post;
  
  const finalTitle = title || successConfig.title;
  const finalMessage = message || successConfig.message;
  const finalActionLabel = actionLabel || successConfig.actionLabel;
  const finalSecondaryActionLabel = secondaryActionLabel || successConfig.secondaryActionLabel;

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      // Ações padrão baseadas no tipo
      switch (type) {
        case 'post':
          // Navegar para ver posts
          window.location.href = '/social-buffer/posts';
          break;
        case 'schedule':
          // Navegar para ver agendamentos
          window.location.href = '/social-buffer/schedules';
          break;
        case 'hashtag':
          // Navegar para ver hashtags
          window.location.href = '/social-buffer/hashtags';
          break;
        case 'link':
          // Navegar para ver links
          window.location.href = '/social-buffer/links';
          break;
        case 'media':
          // Navegar para ver mídia
          window.location.href = '/social-buffer/media';
          break;
        case 'analytics':
          // Navegar para ver analytics
          window.location.href = '/social-buffer/analytics';
          break;
        case 'engagement':
          // Navegar para ver engajamento
          window.location.href = '/social-buffer/engagement';
          break;
        case 'account':
          // Navegar para ver contas
          window.location.href = '/social-buffer/accounts';
          break;
        default:
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
        case 'post':
          // Criar outro post
          window.location.href = '/social-buffer/posts/create';
          break;
        case 'schedule':
          // Ver calendário
          window.location.href = '/social-buffer/schedules/calendar';
          break;
        case 'hashtag':
          // Criar grupo de hashtags
          window.location.href = '/social-buffer/hashtags/groups/create';
          break;
        case 'link':
          // Copiar link (implementar funcionalidade)
          console.log('Copiar link');
          break;
        case 'media':
          // Fazer upload de mais mídia
          window.location.href = '/social-buffer/media/upload';
          break;
        case 'analytics':
          // Exportar relatório
          console.log('Exportar relatório');
          break;
        case 'engagement':
          // Configurar alertas
          window.location.href = '/social-buffer/engagement/settings';
          break;
        case 'account':
          // Conectar outra conta
          window.location.href = '/social-buffer/accounts/connect';
          break;
        default:
          console.log('Ação secundária padrão para', type);
      }
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <Animated delay={0}>
        <Card className={`p-8 max-w-md w-full text-center ${successConfig.bgColor} ${successConfig.borderColor} border-2`}>
          <div className="space-y-6">
            {/* Ícone com animação */}
            <div className={`flex justify-center ${successConfig.color}`}>
              <Animated delay={200} type="bounce">
                {successConfig.icon}
              </Animated>
            </div>

            {/* Título e Mensagem */}
            <div>
              <h2 className={`text-xl font-semibold ${successConfig.color} mb-2`}>
                {finalTitle}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {finalMessage}
              </p>
            </div>

            {/* Estatísticas (se fornecidas) */}
            {stats.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <Animated key={index} delay={300 + (index * 100)}>
                    <div className="bg-white bg-opacity-50 rounded-lg p-4">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        {stat.icon && (
                          <div className={successConfig.color}>
                            {stat.icon}
                          </div>
                        )}
                        <span className="text-lg font-bold text-gray-900">
                          {stat.value}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {stat.label}
                      </p>
                    </div>
                  </Animated>
                ))}
              </div>
            )}

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {showAction && (
                <Animated delay={400}>
                  <Button
                    onClick={handleAction}
                    variant="default"
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {finalActionLabel}
                  </Button>
                </Animated>
              )}
              
              {showSecondaryAction && finalSecondaryActionLabel && (
                <Animated delay={500}>
                  <Button
                    onClick={handleSecondaryAction}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {type === 'post' && <FileText className="w-4 h-4" />}
                    {type === 'schedule' && <Calendar className="w-4 h-4" />}
                    {type === 'hashtag' && <Hash className="w-4 h-4" />}
                    {type === 'link' && <Link className="w-4 h-4" />}
                    {type === 'media' && <Image className="w-4 h-4" />}
                    {type === 'analytics' && <BarChart3 className="w-4 h-4" />}
                    {type === 'engagement' && <Heart className="w-4 h-4" />}
                    {type === 'account' && <Users className="w-4 h-4" />}
                    {!['post', 'schedule', 'hashtag', 'link', 'media', 'analytics', 'engagement', 'account'].includes(type) && (
                      <Plus className="w-4 h-4" />
                    )}
                    {finalSecondaryActionLabel}
                  </Button>
                </Animated>
              )}
            </div>

            {/* Dicas de sucesso */}
            <div className="text-xs text-gray-500 space-y-1">
              {type === 'post' && (
                <p>🎉 Parabéns! Seu post está pronto para engajar sua audiência</p>
              )}
              {type === 'schedule' && (
                <p>⏰ Seu post será publicado automaticamente no horário agendado</p>
              )}
              {type === 'hashtag' && (
                <p>📈 Use hashtags relevantes para aumentar o alcance dos seus posts</p>
              )}
              {type === 'link' && (
                <p>🔗 Seu link encurtado está pronto para compartilhar</p>
              )}
              {type === 'media' && (
                <p>🖼️ Sua mídia foi otimizada e está pronta para uso</p>
              )}
              {type === 'analytics' && (
                <p>📊 Seus dados de analytics estão prontos para análise</p>
              )}
              {type === 'engagement' && (
                <p>💝 O monitoramento de engajamento está ativo</p>
              )}
              {type === 'account' && (
                <p>🔗 Sua conta está conectada e pronta para uso</p>
              )}
              {type === 'bulk' && (
                <p>⚡ Operação em lote concluída com sucesso</p>
              )}
              {type === 'import' && (
                <p>📥 Seus dados foram importados com sucesso</p>
              )}
              {type === 'export' && (
                <p>📤 Seus dados foram exportados com sucesso</p>
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

export const PostSuccessState: React.FC<Omit<SuccessStateProps, 'type'>> = (props) => (
  <SocialBufferSuccessState {...props} type="post" />
);

export const ScheduleSuccessState: React.FC<Omit<SuccessStateProps, 'type'>> = (props) => (
  <SocialBufferSuccessState {...props} type="schedule" />
);

export const HashtagSuccessState: React.FC<Omit<SuccessStateProps, 'type'>> = (props) => (
  <SocialBufferSuccessState {...props} type="hashtag" />
);

export const LinkSuccessState: React.FC<Omit<SuccessStateProps, 'type'>> = (props) => (
  <SocialBufferSuccessState {...props} type="link" />
);

export const MediaSuccessState: React.FC<Omit<SuccessStateProps, 'type'>> = (props) => (
  <SocialBufferSuccessState {...props} type="media" />
);

export const AnalyticsSuccessState: React.FC<Omit<SuccessStateProps, 'type'>> = (props) => (
  <SocialBufferSuccessState {...props} type="analytics" />
);

export const EngagementSuccessState: React.FC<Omit<SuccessStateProps, 'type'>> = (props) => (
  <SocialBufferSuccessState {...props} type="engagement" />
);

export const AccountSuccessState: React.FC<Omit<SuccessStateProps, 'type'>> = (props) => (
  <SocialBufferSuccessState {...props} type="account" />
);

export const BulkSuccessState: React.FC<Omit<SuccessStateProps, 'type'>> = (props) => (
  <SocialBufferSuccessState {...props} type="bulk" />
);

export const ImportSuccessState: React.FC<Omit<SuccessStateProps, 'type'>> = (props) => (
  <SocialBufferSuccessState {...props} type="import" />
);

export const ExportSuccessState: React.FC<Omit<SuccessStateProps, 'type'>> = (props) => (
  <SocialBufferSuccessState {...props} type="export" />
);

export default SocialBufferSuccessState;
