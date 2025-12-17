/**
 * Componente AdvancedProgress - Indicadores de Progresso Avançados
 *
 * @description
 * Módulo completo de indicadores de progresso para operações longas e contextuais.
 * Fornece múltiplos componentes: `Progress` (barra linear), `CircularProgress`
 * (circular), `StepProgress` (passos), `OperationProgress` (operações contextuais)
 * e `AnimatedCounter` (contador animado). Suporta variantes, tamanhos e estados
 * visuais diferentes.
 *
 * @example
 * ```tsx
 * import { Progress, CircularProgress, OperationProgress } from '@/shared/components/ui/AdvancedProgress';
 *
 * <Progress value={75} variant="success" showPercentage / />
 * <CircularProgress value={50} size={120} variant="default" / />
 * <OperationProgress
 *   operation={
 *     type: 'upload',
 *     title: 'Enviando arquivo...',
 *     progress: 45,
 *     status: 'running'
 *   } * / />
 * ```
 *
 * @module components/ui/AdvancedProgress
 * @since 1.0.0
 */
import React, { useEffect, useState } from "react";
import { cn } from '@/lib/utils';
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from './design-tokens';
import { CheckCircle, AlertCircle, Loader2, Clock, Zap, Upload, Download, Brain, Cpu,  } from 'lucide-react';

/**
 * Props do componente Progress
 *
 * @description
 * Propriedades que podem ser passadas para o componente Progress.
 *
 * @interface ProgressProps
 * @property {number} value - Valor do progresso (0-100 ou conforme max)
 * @property {number} [max] - Valor máximo do progresso (padrão: 100)
 * @property {string} [className] - Classes CSS adicionais para customização
 * @property {'sm' | 'md' | 'lg'} [size] - Tamanho da barra (padrão: 'md')
 * @property {'default' | 'success' | 'warning' | 'danger' | 'gradient'} [variant] - Variante visual (padrão: 'default')
 * @property {boolean} [animated] - Se deve exibir animação pulsante (padrão: true)
 * @property {boolean} [showPercentage] - Se deve exibir porcentagem (padrão: true)
 * @property {string} [label] - Label opcional para a barra
 */
interface ProgressProps {
  value: number;
  // 0-100
max?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "danger" | "gradient";
  animated?: boolean;
  showPercentage?: boolean;
  label?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const Progress: React.FC<ProgressProps> = ({ value,
  max = 100,
  className = "",
  size = "md",
  variant = "default",
  animated = true,
  showPercentage = true,
  label,
   }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-2";
      case "md":
        return "h-3";
      case "lg":
        return "h-4";
      default:
        return "h-3";
    } ;

  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "danger":
        return "bg-red-500";
      case "gradient":
        return "bg-gradient-to-r from-blue-500 to-purple-600";
      default:
        return "bg-blue-500";
    } ;

  return (
        <>
      <div className={cn("space-y-2", className)  }>
      </div>{(label || showPercentage) && (
        <div className="{label && (">$2</div>
            <span className="text-gray-700 dark:text-gray-300">{label}</span>
          )}
          {showPercentage && (
            <span className="{Math.round(percentage)}%">$2</span>
      </span>
    </>
  )}
        </div>
      )}

      <div
        className={cn(
          "w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
          getSizeClasses(),
        )  }>
        </div><div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            getVariantClasses(),
            animated && "animate-pulse",
          )} style={width: `${percentage} %` } / />
           
        </div></div>);};

/**
 * Props do componente CircularProgress
 *
 * @description
 * Propriedades que podem ser passadas para o componente CircularProgress.
 *
 * @interface CircularProgressProps
 * @property {number} value - Valor do progresso (0-100)
 * @property {number} [size=120] - Tamanho do círculo em pixels (opcional, padrão: 120)
 * @property {number} [strokeWidth=8] - Largura da linha em pixels (opcional, padrão: 8)
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padrão: '')
 * @property {'default' | 'success' | 'warning' | 'danger'} [variant='default'] - Variante visual (opcional, padrão: 'default')
 * @property {boolean} [showPercentage=true] - Se deve exibir porcentagem (opcional, padrão: true)
 * @property {React.ReactNode} [icon] - Ícone customizado para o centro (opcional)
 */
interface CircularProgressProps {
  value: number;
  // 0-100
size?: number;
  strokeWidth?: number;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger";
  showPercentage?: boolean;
  icon?: React.ReactNode; }

/**
 * Componente CircularProgress
 *
 * @description
 * Renderiza uma barra de progresso circular com SVG, suporta múltiplas
 * variantes e pode exibir porcentagem ou ícone customizado no centro.
 *
 * @component
 * @param {CircularProgressProps} props - Props do componente
 * @returns {JSX.Element} Componente de progresso circular
 */
export const CircularProgress: React.FC<CircularProgressProps> = ({ value,
  size = 120,
  strokeWidth = 8,
  className = "",
  variant = "default",
  showPercentage = true,
  icon,
   }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const getStrokeColor = () => {
    switch (variant) {
      case "success":
        return "#10b981";
      case "warning":
        return "#f59e0b";
      case "danger":
        return "#ef4444";
      default:
        return "#3b82f6";
    } ;

  return (
        <>
      <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )  }>
      </div><svg width={size} height={size} className="transform -rotate-90" />
        {/* Background circle */}
        <circle
          cx={ size / 2 }
          cy={ size / 2 }
          r={ radius }
          fill="none"
          stroke="currentColor"
          strokeWidth={ strokeWidth }
          className="text-gray-200 dark:text-gray-700"
       >
          {/* Progress circle */}
        <circle
          cx={ size / 2 }
          cy={ size / 2 }
          r={ radius }
          fill="none"
          stroke={ getStrokeColor() }
          strokeWidth={ strokeWidth }
          strokeLinecap="round"
          strokeDasharray={ strokeDasharray }
          strokeDashoffset={ strokeDashoffset }
          className={cn(
            "transition-all duration-500 ease-out",
            ENHANCED_TRANSITIONS.base,
          )} / />
      </svg>

      {/* Center content */}
      <div className="{icon ||">$2</div>
          (showPercentage && (
            <span className="{Math.round(value)}%">$2</span>
      </span>
    </>
  ))}
      </div>);};

// ===== STEP PROGRESS =====
interface StepProgressProps {
  steps: Array<{
id: string;
  title: string;
  description?: string;
  status: "pending" | "current" | "completed" | "error";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties; }>;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({ steps,
  orientation = "horizontal",
  className = "",
   }) => {
  const getStepIcon = (status: string, index: number) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "current":
        return (
                  <div className="{index + 1}">$2</div>
          </div>);

      default:
        return (
                  <div className="{index + 1}">$2</div>
          </div>);

    } ;

  if (orientation === "vertical") { return (
        <>
      <div className={cn("space-y-4", className)  }>
      </div>{(steps || []).map((step: unknown, index: unknown) => (
          <div key={step.id} className="flex items-start space-x-3">
           
        </div><div className="{getStepIcon(step.status, index)}">$2</div>
            </div>
            <div className=" ">$2</div><h3
                className={cn(
                  "text-sm font-medium",
                  step.status === "completed"
                    ? "text-green-700 dark:text-green-400"
                    : step.status === "current"
                      ? "text-blue-700 dark:text-blue-400"
                      : step.status === "error"
                        ? "text-red-700 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-400",
                ) } />
                {step.title}
              </h3>
              {step.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" />
                  {step.description}
                </p>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="flex-shrink-0 w-px h-8 bg-gray-200 dark:bg-gray-700 ml-2.5">
          )}
        </div>
    </div>
  ))}
      </div>);

  }

  return (
        <>
      <div className={cn("flex items-center space-x-4", className)  }>
      </div>{ (steps || []).map((step: unknown, index: unknown) => (
        <React.Fragment key={step.id } />
          <div className="{getStepIcon(step.status, index)}">$2</div>
            <div className=" ">$2</div><h3
                className={cn(
                  "text-xs font-medium",
                  step.status === "completed"
                    ? "text-green-700 dark:text-green-400"
                    : step.status === "current"
                      ? "text-blue-700 dark:text-blue-400"
                      : step.status === "error"
                        ? "text-red-700 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-400",
                ) } />
                {step.title}
              </h3>
            </div>

          { index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-px",
                steps[index + 1].status === "completed"
                  ? "bg-green-300"
                  : steps[index + 1].status === "current"
                    ? "bg-blue-300"
                    : "bg-gray-200 dark:bg-gray-700",
              ) } />
          )}
        </div>
      </React.Fragment>
    </>
  ))}
    </div>);};

/**
 * Props do componente OperationProgress
 *
 * @description
 * Propriedades que podem ser passadas para o componente OperationProgress.
 *
 * @interface OperationProgressProps
 * @property { type: 'upload' | 'download' | 'processing' | 'ai' | 'sync'; title: string; description?: string; progress: number; status: 'running' | 'completed' | 'error' | 'paused'; eta?: string; speed?: string } operation - Informações da operação
 */
interface OperationProgressProps {
  operation: {
type: "upload" | "download" | "processing" | "ai" | "sync";
  title: string;
  description?: string;
  progress: number;
  // 0-100
status: "running" | "completed" | "error" | "paused";
  eta?: string;
  // estimated time
speed?: string;
  // transfer speed

children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties; };

  onCancel???: (e: any) => void;
  onRetry???: (e: any) => void;
  className?: string;
}

export const OperationProgress: React.FC<OperationProgressProps> = ({ operation,
  onCancel,
  onRetry,
  className = "",
   }) => {
  const getOperationIcon = () => {
    switch (operation.type) {
      case "upload":
        return <Upload className="h-5 w-5" />;
      case "download":
        return <Download className="h-5 w-5" />;
      case "ai":
        return <Brain className="h-5 w-5" />;
      case "sync":
        return <Loader2 className="h-5 w-5 animate-spin" />;
      default:
        return <Cpu className="h-5 w-5" />;
    } ;

  const getStatusColor = () => {
    switch (operation.status) {
      case "completed":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "paused":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    } ;

  return (
        <>
      <div
      className={cn(
        "p-4 border rounded-lg bg-white dark:bg-gray-800 space-y-3",
        ENHANCED_TRANSITIONS.base,
        className,
      )  }>
      </div>{/* Header */}
      <div className=" ">$2</div><div className=" ">$2</div><div className={cn("p-2 rounded-lg", getStatusColor())  }>
        </div>{getOperationIcon()}
          </div>
          <div>
           
        </div><h3 className="text-sm font-medium text-gray-900 dark:text-white" />
              {operation.title}
            </h3>
            {operation.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400" />
                {operation.description}
              </p>
            )}
          </div>

        {/* Actions */}
        <div className="{operation.status === "error" && onRetry && (">$2</div>
            <button
              onClick={ onRetry }
              className="text-xs text-blue-500 hover:text-blue-700" />
              Tentar novamente
            </button>
          )}
          {operation.status === "running" && onCancel && (
            <button
              onClick={ onCancel }
              className="text-xs text-gray-500 hover:text-gray-700" />
              Cancelar
            </button>
          )}
        </div>

      {/* Progress */}
      <Progress
        value={ operation.progress }
        variant={ operation.status === "completed"
            ? "success"
            : operation.status === "error"
              ? "danger"
              : "default"
         }
        animated={ operation.status === "running" }
        showPercentage={ true  }>
          {/* Details */}
      {(operation.eta || operation.speed) && (
        <div className="{operation.speed && (">$2</div>
            <span className=" ">$2</span><Zap className="h-3 w-3" />
              <span>{operation.speed}</span>
          )}
          {operation.eta && (
            <span className=" ">$2</span><Clock className="h-3 w-3" />
              <span>{operation.eta}</span>
          )}
        </div>
      )}
    </div>);};

// ===== ANIMATED COUNTER =====
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties; }

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value,
  duration = 1000,
  className = "",
  suffix = "",
  prefix = "",
   }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCurrentValue(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);

      } ;

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);

      } ;

  }, [value, duration]);

  return (
        <>
      <span className={cn("font-mono", className)  }>
      </span>{prefix}
      {currentValue.toLocaleString()}
      {suffix}
    </span>);};

// Components are already exported individually above
