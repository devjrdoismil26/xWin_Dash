/**
 * Componente BrainLoader - Loader Animado de Cérebro
 *
 * @description
 * Componente de loader animado em formato de cérebro (SVG) com suporte a
 * múltiplas variantes de animação (default, pulse, glow, thinking) e
 * tamanhos configuráveis. Usado para indicar processamento de IA ou
 * operações de inteligência artificial.
 *
 * Funcionalidades principais:
 * - Múltiplas variantes de animação (default, pulse, glow, thinking)
 * - Tamanhos configuráveis (sm, md, lg, xl)
 * - Label opcional
 * - Animações específicas por variante (pulse, bounce, ping)
 * - Efeitos visuais (glow, particles para thinking)
 * - Suporte completo a dark mode
 *
 * @module components/ui/BrainLoader
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import BrainLoader from '@/shared/components/ui/BrainLoader';
 *
 * // Loader básico
 * <BrainLoader / />
 *
 * // Loader com variante thinking
 * <BrainLoader variant="thinking" label="Pensando..." / />
 *
 * // Loader com tamanho grande
 * <BrainLoader size="lg" variant="glow" / />
 * ```
 */

import React from "react";
import { getSizeClasses, ComponentSize } from './design-tokens';
import { cn } from '@/lib/utils';

/**
 * Variantes disponíveis para o brain loader
 *
 * @typedef {'default' | 'pulse' | 'glow' | 'thinking'} BrainLoaderVariant
 * @property {'default'} default - Animação padrão (pulse)
 * @property {'pulse'} pulse - Animação de pulso
 * @property {'glow'} glow - Efeito de brilho com sombra
 * @property {'thinking'} thinking - Animação thinking com partículas
 */
export type BrainLoaderVariant = "default" | "pulse" | "glow" | "thinking";

/**
 * Props do componente BrainLoader
 *
 * @description
 * Propriedades que podem ser passadas para o componente BrainLoader.
 *
 * @interface BrainLoaderProps
 * @property {ComponentSize} [size='md'] - Tamanho do loader (opcional, padrão: 'md')
 * @property {BrainLoaderVariant} [variant='default'] - Variante de animação (opcional, padrão: 'default')
 * @property {string} [label] - Label opcional a ser exibida abaixo do loader (opcional)
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padrão: '')
 */
export interface BrainLoaderProps {
  size?: ComponentSize;
  variant?: BrainLoaderVariant;
  label?: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Classes CSS para variantes de animação
 *
 * @constant
 * @type {Record<BrainLoaderVariant, string>}
 */
const variantClasses: Record<BrainLoaderVariant, string> = {
  default: "animate-pulse",
  pulse: "animate-pulse",
  glow: "animate-pulse shadow-lg shadow-blue-500/50",
  thinking: "animate-bounce",};

/**
 * Componente BrainLoader
 *
 * @description
 * Renderiza um loader animado em formato de cérebro com SVG, usando diferentes
 * variantes de animação e opção de label. Cada variante tem animações e efeitos
 * visuais específicos (pulse, bounce, ping particles, glow effect).
 *
 * @component
 * @param {BrainLoaderProps} props - Props do componente
 * @param {ComponentSize} [props.size='md'] - Tamanho do loader
 * @param {BrainLoaderVariant} [props.variant='default'] - Variante de animação
 * @param {string} [props.label] - Label opcional
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @returns {JSX.Element} Loader de cérebro animado estilizado
 */
const BrainLoader: React.FC<BrainLoaderProps> = ({ size = "md",
  className = "",
  label,
  variant = "default",
   }) => { const sizeClasses = getSizeClasses(size, "icon");

  return (
        <>
      <div className={cn("flex items-center justify-center", className)  }>
      </div><div className=" ">$2</div><div className={cn(sizeClasses, variantClasses[variant], "relative")  }>
        </div><svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-gray-800 dark:text-gray-200" />
            <path d="M10 2a6 6 0 00-6 6c0 1.4.5 2.8 1.4 3.9L6 22h3l1-5h4l1 5h3l1.6-10.1A6 6 0 0014 2c-1.5 0-2.8.5-3.8 1.3C9.7 2.5 8.5 2 7 2" / />
          </svg>
          {variant === "thinking" && (
            <>
              <div
                className="absolute -top-1 -right-1 w-1 h-1 bg-blue-500 rounded-full animate-ping"
                style={animationDelay: "0ms" } />
           
        </div><div
                className="absolute -top-2 right-0 w-1 h-1 bg-purple-500 rounded-full animate-ping"
                style={animationDelay: "200ms" } />
           
        </div><div
                className="absolute -top-1 right-1 w-1 h-1 bg-green-500 rounded-full animate-ping"
                style={animationDelay: "400ms" } />
           
        </div></>
          )}
          {variant === "glow" && (
            <div className=" ">$2</div><div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-sm" / />
          )}
        </div>
        </div>
        {label && (
          <span className="{label}">$2</span>
      </span>
    </>
  )}
      </div>);};

export { BrainLoader };

export default BrainLoader;
