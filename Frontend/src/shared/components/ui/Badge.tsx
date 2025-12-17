/**
 * Componente Badge - Badge/Etiqueta Reutiliz?vel
 *
 * @description
 * Componente de badge/etiqueta altamente configur?vel com suporte a m?ltiplas
 * variantes e tamanhos. Usado para exibir status, categorias, contadores e
 * outras informa??es visuais.
 *
 * Funcionalidades principais:
 * - M?ltiplas variantes (default, primary, secondary, success, warning, error, destructive, info, outline, ghost, link)
 * - Tamanhos configur?veis (sm, md, lg, xl)
 * - Layout inline-flex
 * - Cores e estilos variados
 * - Suporte completo a dark mode
 *
 * @module components/ui/Badge
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import Badge from '@/shared/components/ui/Badge';
 *
 * // Badge b?sico
 * <Badge>Novo</Badge>
 *
 * // Badge com variante
 * <Badge variant="success">Ativo</Badge>
 *
 * // Badge com tamanho customizado
 * <Badge size="lg" variant="primary">Premium</Badge>
 * ```
 */

import React from "react";
import { cn } from '@/lib/utils';

/**
 * Props do componente Badge
 *
 * @description
 * Propriedades que podem ser passadas para o componente Badge.
 * Estende todas as propriedades de span HTML padr?o.
 *
 * @interface BadgeProps
 * @extends React.HTMLAttributes<HTMLSpanElement />
 * @property {'default'|'primary'|'secondary'|'success'|'warning'|'error'|'destructive'|'info'|'outline'|'ghost'|'link'} [variant='default'] - Variante visual do badge
 * @property {'sm'|'md'|'lg'|'xl'} [size='md'] - Tamanho do badge
 * @property {React.ReactNode} children - Conte?do do badge
 */
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "destructive"
    | "info"
    | "outline"
    | "ghost"
    | "link";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

/**
 * Componente Badge
 *
 * @description
 * Renderiza um badge/etiqueta com suporte a m?ltiplas variantes e tamanhos.
 *
 * @component
 * @param {BadgeProps} props - Props do componente
 * @returns {JSX.Element} Componente de badge
 */
const Badge: React.FC<BadgeProps> = ({ variant = "default",
  size = "md",
  className,
  children,
  ...props
   }) => {
  const baseClasses =
    "inline-flex items-center rounded-full font-medium transition-colors duration-200";

  // Combinando todas as variantes de ambos os componentes
  const variantClasses = {
    // Variantes do Badge.jsx
    default: "bg-gray-100 text-gray-600",
    primary: "bg-blue-600/10 text-blue-600",
    secondary: "bg-gray-600/10 text-gray-600",
    success: "bg-green-600/10 text-green-600",
    warning: "bg-yellow-600/10 text-yellow-600",
    destructive: "bg-red-600/10 text-red-600",
    outline: "border border-gray-300 text-gray-700",
    ghost: "text-gray-700",
    link: "text-blue-600",
    // Variantes do Badge.tsx (design tokens)
    error:
      "bg-[rgba(244,67,54,0.1)] text-[var(--error)] border border-[rgba(244,67,54,0.2)]",
    info: "bg-[rgba(33,150,243,0.1)] text-[var(--info)] border border-[rgba(33,150,243,0.2)]",};

  // Combinando todos os tamanhos de ambos os componentes
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
    xl: "px-4 py-1 text-sm",};

  return (
        <>
      <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )} { ...props }>
      </span>{children}
    </span>);};

export { Badge };

export default Badge;
