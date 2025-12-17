/**
 * Componente EmptyState - Estado Vazio
 *
 * @description
 * Componente que exibe uma tela de estado vazio com ícone, título, descrição
 * e ação opcional. Ideal para comunicar ao usuário que não há dados disponíveis
 * ou que uma ação é necessária. Inclui presets para cenários comuns.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon="📊"
 *   title="Nenhum dado encontrado"
 *   description="Comece criando seu primeiro item"
 *   action={ label: "Criar Item", onClick: handleCreate } * / />
 * ```
 *
 * @module components/ui/EmptyState
 * @since 1.0.0
 */
import React from "react";
import Button from "@/shared/components/ui/Button";

/**
 * Props do componente EmptyState
 *
 * @description
 * Propriedades que podem ser passadas para o componente EmptyState.
 *
 * @interface EmptyStateProps
 * @property {string} [icon] - Ícone emoji ou texto a ser exibido (padrão: '📋')
 * @property {string} title - Título do estado vazio
 * @property {string} [description] - Descrição opcional do estado vazio
 * @property { label: string; onClick?: (e: any) => void } [action] - Ação opcional com label e onClick
 * @property {string} [className] - Classes CSS adicionais para customização
 */
interface EmptyStateProps {
  /** Ícone emoji ou texto a ser exibido (padrão: '📋') */
icon?: string;
  /** Título do estado vazio */
title: string;
  /** Descrição opcional do estado vazio */
description?: string;
  /** Ação opcional com label e onClick */
action?: {
/** Label do botão de ação */
label: string;
  /** Função chamada quando o botão é clicado */
onClick?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (e: any) => void; };

  /** Classes CSS adicionais para customização */
  className?: string;
}

/**
 * Componente EmptyState
 *
 * @description
 * Renderiza uma tela de estado vazio centralizada com ícone, título,
 * descrição e botão opcional de ação.
 *
 * @component
 * @param {EmptyStateProps} props - Props do componente
 * @returns {JSX.Element} Tela de estado vazio estilizada
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ icon = "📋",
  title,
  description,
  action,
  className = "",
   }) => (
  <div className={`text-center p-8 ${className} `}>
           
        </div><div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
    )}
    {action && <Button onClick={ action.onClick }>{action.label}</Button>}
  </div>);

/**
 * Presets de estados vazios para cenários comuns
 *
 * @description
 * Objeto com componentes pré-configurados de EmptyState para cenários
 * comuns do sistema. Facilita o uso rápido de estados vazios padronizados.
 *
 * @constant {object} EmptyStates
 * @property {React.FC<Omit<EmptyStateProps, 'icon'>>} NoData - Estado vazio para "nenhum dado encontrado"
 * @property {React.FC<Pick<EmptyStateProps, 'action'>>} NoChats - Estado vazio para "nenhuma conversa encontrada"
 * @property {React.FC<Pick<EmptyStateProps, 'action'>>} NoConnections - Estado vazio para "nenhuma conexão configurada"
 * @property {React.FC<Pick<EmptyStateProps, 'action'>>} NoFlows - Estado vazio para "nenhum fluxo criado"
 * @property {React.FC<Pick<EmptyStateProps, 'action'>>} NoStats - Estado vazio para "sem dados de estatísticas"
 * @property {React.FC<Pick<EmptyStateProps, 'action'>>} NoAutomations - Estado vazio para "nenhuma automação configurada"
 * @property {React.FC<{ searchTerm: string }>} SearchNoResults - Estado vazio para "nenhum resultado de busca encontrado"
 * @property {React.FC<Omit<EmptyStateProps, 'icon'>>} Error - Estado vazio para "erro"
 *
 * @example
 * ```tsx
 * <EmptyStates.NoData
 *   title="Nenhum usuário encontrado"
 *   action={ label: "Criar Usuário", onClick: handleCreate } * / />
 * ```
 */
export const EmptyStates = {
  NoData: ({
    title = "Nenhum dado encontrado",
    description,
    action,
  }: Omit<EmptyStateProps, "icon">) => (
    <EmptyState
      icon="📊"
      title={ title }
      description={ description }
      action={ action }
    / />
  ),

  NoChats: ({ action }: Pick<EmptyStateProps, "action">) => (
    <EmptyState
      icon="💬"
      title="Nenhuma conversa encontrada"
      description="Quando alguém enviar uma mensagem, as conversas aparecerão aqui."
      action={ action }
    / />
  ),

  NoConnections: ({ action }: Pick<EmptyStateProps, "action">) => (
    <EmptyState
      icon="🔌"
      title="Nenhuma conexão configurada"
      description="Configure uma conexão com WhatsApp para começar a receber mensagens."
      action={ action }
    / />
  ),

  NoFlows: ({ action }: Pick<EmptyStateProps, "action">) => (
    <EmptyState
      icon="🔄"
      title="Nenhum fluxo criado"
      description="Crie fluxos automatizados para responder suas mensagens de forma inteligente."
      action={ action }
    / />
  ),

  NoStats: ({ action }: Pick<EmptyStateProps, "action">) => (
    <EmptyState
      icon="📈"
      title="Sem dados de estatísticas"
      description="As estatísticas aparecerão aqui após você começar a usar o sistema."
      action={ action }
    / />
  ),

  NoAutomations: ({ action }: Pick<EmptyStateProps, "action">) => (
    <EmptyState
      icon="⚙️"
      title="Nenhuma automação configurada"
      description="Crie automações para otimizar seus processos de atendimento."
      action={ action }
    / />
  ),

  SearchNoResults: ({ searchTerm }: { searchTerm: string }) => (
    <EmptyState
      icon="🔍"
      title={ `Nenhum resultado encontrado` }
      description={`Não encontramos nada relacionado a "${searchTerm}". Tente usar outros termos.`}
    / />
  ),

  Error: ({
    title = "Algo deu errado",
    description,
    action,
  }: Omit<EmptyStateProps, "icon">) => (
    <EmptyState
      icon="⚠️"
      title={ title }
      description={ description }
      action={ action }
    / />
  ),};

export default EmptyState;
