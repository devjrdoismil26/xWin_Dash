/**
 * Componente AIStatusIndicator - Indicador de Status de IA
 *
 * @description
 * Componente que exibe o status atual de processamento de Inteligência Artificial.
 * Fornece feedback visual através de ícones, cores e mensagens personalizáveis,
 * permitindo que os usuários acompanhem o estado de operações de IA (processando,
 * concluído, erro, etc.).
 *
 * @example
 * ```tsx
 * <AIStatusIndicator
 *   status="processing"
 *   message="Processando dados..."
 *   showLoader={ true }
 * / />
 * ```
 *
 * @module components/ui/AIStatusIndicator
 * @since 1.0.0
 */
import React from "react";
import { Brain, Zap, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import BrainLoader from "./BrainLoader";
import { cn } from '@/lib/utils';

/**
 * Status possíveis de processamento de IA
 *
 * @description
 * Enumeração dos estados que uma operação de IA pode estar.
 *
 * @typedef {('idle' | 'thinking' | 'processing' | 'analyzing' | 'generating' | 'streaming' | 'completed' | 'error')} AIStatus
 * @property {'idle'} idle - IA em standby, aguardando ação
 * @property {'thinking'} thinking - IA pensando/processando
 * @property {'processing'} processing - IA processando dados
 * @property {'analyzing'} analyzing - IA analisando informações
 * @property {'generating'} generating - IA gerando conteúdo
 * @property {'streaming'} streaming - IA transmitindo dados em tempo real
 * @property {'completed'} completed - Processamento concluído com sucesso
 * @property {'error'} error - Erro ocorrido durante processamento
 */
export type AIStatus =
  | "idle"
  | "thinking"
  | "processing"
  | "analyzing"
  | "generating"
  | "streaming"
  | "completed"
  | "error";

/**
 * Props do componente AIStatusIndicator
 *
 * @description
 * Propriedades que podem ser passadas para o componente AIStatusIndicator.
 *
 * @interface AIStatusIndicatorProps
 * @property {AIStatus} status - Status atual de processamento de IA
 * @property {string} [message] - Mensagem personalizada a ser exibida (substitui a mensagem padrão do status)
 * @property {boolean} [showLoader] - Se deve exibir o BrainLoader quando status está processando (padrão: true)
 * @property {string} [className] - Classes CSS adicionais para customização
 */
export interface AIStatusIndicatorProps {
  /** Status atual de processamento de IA */
status: AIStatus;
  /** Mensagem personalizada a ser exibida (substitui a mensagem padrão do status) */
message?: string;
  /** Se deve exibir o BrainLoader quando status está processando (padrão: true) */
showLoader?: boolean;
  /** Classes CSS adicionais para customização */
className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente AIStatusIndicator
 *
 * @description
 * Renderiza um indicador visual do status de processamento de IA com ícone,
 * cor de fundo e mensagem apropriados para o status atual. Pode exibir um
 * BrainLoader animado quando o status está em processamento.
 *
 * @component
 * @param {AIStatusIndicatorProps} props - Props do componente
 * @returns {JSX.Element} Indicador de status de IA estilizado
 */
const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({ status,
  message,
  showLoader = true,
  className = "",
   }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "idle":
        return {
          icon: Brain,
          color: "text-gray-400",
          bgColor: "bg-gray-100",
          message: message || "IA em standby",};

      case "thinking":
      case "processing":
      case "analyzing":
      case "generating":
      case "streaming":
        return {
          icon: Zap,
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          message: message || "IA processando...",};

      case "completed":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bgColor: "bg-green-100",
          message: message || "Processamento concluído",};

      case "error":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          bgColor: "bg-red-100",
          message: message || "Erro no processamento",};

      default:
        return {
          icon: Info,
          color: "text-gray-400",
          bgColor: "bg-gray-100",
          message: message || "Status desconhecido",};

    } ;

  const cfg = getStatusConfig();

  const Icon = cfg.icon;

  return (
        <>
      <div
      className={cn(
        "flex items-center space-x-2 px-3 py-2 rounded-lg",
        cfg.bgColor,
        className,
      )  }>
      </div><Icon className={cn("w-4 h-4", cfg.color)} / />
      <span className={cn("text-sm font-medium", cfg.color)  }>
        </span>{cfg.message}
      </span>
      {showLoader &&
        [
          "thinking",
          "processing",
          "analyzing",
          "generating",
          "streaming",
        ].includes(status) && (
          <div className=" ">$2</div><BrainLoader size="sm" variant="thinking" / />
          </div>
        )}
    </div>);};

export default AIStatusIndicator;
