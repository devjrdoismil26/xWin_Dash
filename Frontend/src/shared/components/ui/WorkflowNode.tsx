/**
 * Componente WorkflowNode - Nó de Workflow para React Flow
 *
 * @description
 * Componente de nó personalizado para React Flow que exibe nós de workflow
 * com ícones, cores, handles de conexão e conteúdo customizável. Fornece
 * componentes especializados para diferentes tipos de nós (MessageNode,
 * QuestionNode, ConditionNode, ActionNode, AiNode, WebhookNode, DelayNode,
 * HumanHandoffNode).
 *
 * Funcionalidades principais:
 * - Handles de conexão (target e source)
 * - Ícones personalizados por tipo de nó
 * - Múltiplas cores disponíveis (primary, secondary, success, warning, error, purple, blue, indigo)
 * - Estado selecionado visual
 * - Conteúdo customizável via children ou data
 * - Integração com React Flow
 * - Suporte a diferentes tipos de nós
 *
 * @module components/ui/WorkflowNode
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import WorkflowNode, { MessageNode, AiNode } from '@/shared/components/ui/WorkflowNode';
 *
 * // Nó genérico
 * <WorkflowNode
 *   data={ label: 'Start', description: 'Início do workflow' } *   type="start"
 *   color="primary"
 * / />
 *
 * // Nós especializados
 * <MessageNode data={ label: 'Enviar Email' } / />
 * <AiNode data={ label: 'Processar IA' } / />
 * ```
 */

import React from "react";
import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils';

/**
 * Props do componente WorkflowNode
 *
 * @description
 * Propriedades que podem ser passadas para o componente WorkflowNode.
 * Estende as propriedades padrão do React Flow Node.
 *
 * @interface WorkflowNodeProps
 * @property {Record<string, any>} [data] - Dados do nó (label, title, description, type, status)
 * @property {boolean} [isConnectable=true] - Se o nó é conectável
 * @property {boolean} [selected=false] - Se o nó está selecionado
 * @property {string} [type='default'] - Tipo do nó
 * @property {React.ComponentType<{ className?: string }>} [icon] - Componente de ícone
 * @property {'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'purple' | 'blue' | 'indigo'} [color='primary'] - Cor do nó
 * @property {React.ReactNode} [children] - Conteúdo customizável do nó
 * @property {string} [className=''] - Classes CSS adicionais
 */
interface WorkflowNodeProps {
  data?: Record<string, any>;
  isConnectable?: boolean;
  selected?: boolean;
  type?: string;
  icon?: React.ComponentType<{ className?: string
children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }>;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "purple"
    | "blue"
    | "indigo";
  children?: React.ReactNode;
  className?: string;
}

/**
 * Componente WorkflowNode
 *
 * @description
 * Renderiza um nó de workflow personalizado para React Flow com header,
 * conteúdo e handles de conexão. Exibe ícone, título e descrição do nó.
 *
 * @component
 * @param {WorkflowNodeProps} props - Props do componente
 * @returns {JSX.Element} Nó de workflow estilizado
 */
const WorkflowNode: React.FC<WorkflowNodeProps> = ({ data,
  isConnectable = true,
  selected = false,
  type = "default",
  icon: Icon,
  color = "primary",
  children,
  className = "",
  ...props
   }) => {
  const colorClasses = {
    primary: "border-primary-300 bg-primary-50",
    secondary: "border-secondary-300 bg-secondary-50",
    success: "border-green-300 bg-green-50",
    warning: "border-yellow-300 bg-yellow-50",
    error: "border-red-300 bg-red-50",
    purple: "border-purple-300 bg-purple-50",
    blue: "border-blue-300 bg-blue-50",
    indigo: "border-indigo-300 bg-indigo-50",};

  const iconColorClasses = {
    primary: "bg-primary-500",
    secondary: "bg-secondary-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    purple: "bg-purple-500",
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",};

  return (
        <>
      <div
      className={cn(
        "workflow-node",
        colorClasses[color],
        selected && "selected",
        className,
      )} { ...props }>
      </div>{/* Handles */}
      <Handle
        type="target"
        position={ Position.Left }
        isConnectable={ isConnectable }
        className="workflow-node-handle target"
      / />
      <Handle
        type="source"
        position={ Position.Right }
        isConnectable={ isConnectable }
        className="workflow-node-handle source"
     >
          {/* Header */}
      <div className="{ Icon ? (">$2</div>
          <div className={cn("workflow-node-icon", iconColorClasses[color])  }>
        </div><Icon className="w-4 h-4" />
          </div>
        ) : null}
        <div className="{(data?.label as string) || (data?.title as string) || "Node"}">$2</div>
        </div>

      {/* Content */}
      <div className="{children || (">$2</div>
          <>
            {data?.description ? (
              <p className="text-xs text-gray-600 mb-2">{String(data.description)}</p>
            ) : null}
            {data?.type ? (
              <p className="text-xs text-gray-500" />
                <strong>Tipo:</strong> {String(data.type)}
              </p>
            ) : null}
            { data?.status ? (
              <div className=" ">$2</div><span
                  className={cn(
                    "badge",
                    (data as any).status === "active" && "badge-success",
                    (data as any).status === "inactive" && "badge-secondary",
                    (data as any).status === "error" && "badge-error",
                  )  }>
        </span>{String(data.status)}
                </span>
      </div>
    </>
  ) : null}
          </>
        )}
      </div>);};

/**
 * Componente MessageNode - Nó de Mensagem
 *
 * @description
 * Nó especializado para mensagens no workflow. Renderiza com ícone de mensagem
 * e cor azul.
 *
 * @component
 * @param {WorkflowNodeProps} props - Props do componente
 * @returns {JSX.Element} Nó de mensagem
 */
export const MessageNode: React.FC<WorkflowNodeProps> = (props: unknown) => (
  <WorkflowNode
    {...props}
    type="message"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20" />
        <path
          fillRule="evenodd"
          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
          clipRule="evenodd"
        / />
      </svg>
    )}
    color="blue" />);

/**
 * Componente QuestionNode - Nó de Pergunta
 *
 * @description
 * Nó especializado para perguntas no workflow. Renderiza com ícone de pergunta
 * e cor roxa.
 *
 * @component
 * @param {WorkflowNodeProps} props - Props do componente
 * @returns {JSX.Element} Nó de pergunta
 */
export const QuestionNode: React.FC<WorkflowNodeProps> = (props: unknown) => (
  <WorkflowNode
    {...props}
    type="question"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20" />
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        / />
      </svg>
    )}
    color="purple" />);

/**
 * Componente ConditionNode - Nó de Condição
 *
 * @description
 * Nó especializado para condições no workflow. Renderiza com ícone de condição
 * e cor amarela (warning).
 *
 * @component
 * @param {WorkflowNodeProps} props - Props do componente
 * @returns {JSX.Element} Nó de condição
 */
export const ConditionNode: React.FC<WorkflowNodeProps> = (props: unknown) => (
  <WorkflowNode
    {...props}
    type="condition"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20" />
        <path
          fillRule="evenodd"
          d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        / />
      </svg>
    )}
    color="warning" />);

/**
 * Componente ActionNode - Nó de Ação
 *
 * @description
 * Nó especializado para ações no workflow. Renderiza com ícone de ação
 * e cor verde (success).
 *
 * @component
 * @param {WorkflowNodeProps} props - Props do componente
 * @returns {JSX.Element} Nó de ação
 */
export const ActionNode: React.FC<WorkflowNodeProps> = (props: unknown) => (
  <WorkflowNode
    {...props}
    type="action"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20" />
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        / />
      </svg>
    )}
    color="success" />);

/**
 * Componente AiNode - Nó de IA
 *
 * @description
 * Nó especializado para processamento de IA no workflow. Renderiza com ícone
 * de IA e cor roxa.
 *
 * @component
 * @param {WorkflowNodeProps} props - Props do componente
 * @returns {JSX.Element} Nó de IA
 */
export const AiNode: React.FC<WorkflowNodeProps> = (props: unknown) => (
  <WorkflowNode
    {...props}
    type="ai"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20" />
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" / />
      </svg>
    )}
    color="purple" />);

/**
 * Componente WebhookNode - Nó de Webhook
 *
 * @description
 * Nó pré-configurado para webhooks em workflows. Usa ícone de webhook e cor vermelha.
 *
 * @component
 * @param {WorkflowNodeProps} props - Props do componente WorkflowNode
 * @returns {JSX.Element} Nó de webhook estilizado
 */
export const WebhookNode: React.FC<WorkflowNodeProps> = (props: unknown) => (
  <WorkflowNode
    {...props}
    type="webhook"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20" />
        <path
          fillRule="evenodd"
          d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
          clipRule="evenodd"
        / />
      </svg>
    )}
    color="error" />);

/**
 * Componente DelayNode - Nó de Delay
 *
 * @description
 * Nó especializado para delays no workflow. Renderiza com ícone de relógio
 * e cor índigo.
 *
 * @component
 * @param {WorkflowNodeProps} props - Props do componente
 * @returns {JSX.Element} Nó de delay
 */
export const DelayNode: React.FC<WorkflowNodeProps> = (props: unknown) => (
  <WorkflowNode
    {...props}
    type="delay"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20" />
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        / />
      </svg>
    )}
    color="indigo" />);

/**
 * Componente HumanHandoffNode - Nó de Transferência Humana
 *
 * @description
 * Nó especializado para transferências para atendimento humano no workflow.
 * Renderiza com ícone de usuário e cor vermelha (error).
 *
 * @component
 * @param {WorkflowNodeProps} props - Props do componente
 * @returns {JSX.Element} Nó de transferência humana
 */
export const HumanHandoffNode: React.FC<WorkflowNodeProps> = (props: unknown) => (
  <WorkflowNode
    {...props}
    type="human-handoff"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20" />
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" / />
      </svg>
    )}
    color="error" />);

export default WorkflowNode;
