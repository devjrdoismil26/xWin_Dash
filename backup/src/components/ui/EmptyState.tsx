import React from 'react';
import Button from '@/components/ui/Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📋',
  title,
  description,
  action,
  className = ''
}) => (
  <div className={`text-center p-8 ${className}`}>
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
    )}
    {action && (
      <Button onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </div>
);

// Preset empty states for common scenarios
export const EmptyStates = {
  NoData: ({ title = 'Nenhum dado encontrado', description, action }: Omit<EmptyStateProps, 'icon'>) => (
    <EmptyState icon="📊" title={title} description={description} action={action} />
  ),
  
  NoChats: ({ action }: Pick<EmptyStateProps, 'action'>) => (
    <EmptyState 
      icon="💬" 
      title="Nenhuma conversa encontrada" 
      description="Quando alguém enviar uma mensagem, as conversas aparecerão aqui."
      action={action}
    />
  ),
  
  NoConnections: ({ action }: Pick<EmptyStateProps, 'action'>) => (
    <EmptyState 
      icon="🔌" 
      title="Nenhuma conexão configurada" 
      description="Configure uma conexão com WhatsApp para começar a receber mensagens."
      action={action}
    />
  ),
  
  NoFlows: ({ action }: Pick<EmptyStateProps, 'action'>) => (
    <EmptyState 
      icon="🔄" 
      title="Nenhum fluxo criado" 
      description="Crie fluxos automatizados para responder suas mensagens de forma inteligente."
      action={action}
    />
  ),
  
  NoStats: ({ action }: Pick<EmptyStateProps, 'action'>) => (
    <EmptyState 
      icon="📈" 
      title="Sem dados de estatísticas" 
      description="As estatísticas aparecerão aqui após você começar a usar o sistema."
      action={action}
    />
  ),
  
  NoAutomations: ({ action }: Pick<EmptyStateProps, 'action'>) => (
    <EmptyState 
      icon="⚙️" 
      title="Nenhuma automação configurada" 
      description="Crie automações para otimizar seus processos de atendimento."
      action={action}
    />
  ),
  
  SearchNoResults: ({ searchTerm }: { searchTerm: string }) => (
    <EmptyState 
      icon="🔍" 
      title={`Nenhum resultado encontrado`}
      description={`Não encontramos nada relacionado a "${searchTerm}". Tente usar outros termos.`}
    />
  ),
  
  Error: ({ title = 'Algo deu errado', description, action }: Omit<EmptyStateProps, 'icon'>) => (
    <EmptyState icon="⚠️" title={title} description={description} action={action} />
  ),
};

export default EmptyState;
