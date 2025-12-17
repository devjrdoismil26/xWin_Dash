/**
 * Componente Button - Bot?o Reutiliz?vel
 *
 * @description
 * Componente de bot?o altamente configur?vel com suporte a m?ltiplas variantes,
 * tamanhos, estados (loading, disabled), ?cones e renderiza??o como child.
 * Projetado para ser o componente de bot?o padr?o da aplica??o.
 *
 * Funcionalidades principais:
 * - M?ltiplas variantes (default, primary, secondary, success, warning, destructive, outline, ghost, link)
 * - Tamanhos configur?veis (sm, md, lg, xl)
 * - Estado de loading com spinner
 * - Suporte a ?cones (esquerda/direita)
 * - Modo asChild para renderizar como outro elemento
 * - Estados disabled e loading
 * - Anima??es e transi??es suaves
 * - Suporte completo a dark mode
 * - Acessibilidade (ARIA, keyboard navigation)
 *
 * @module components/ui/Button
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import Button from '@/shared/components/ui/Button';
 *
 * // Bot?o prim?rio b?sico
 * <Button variant="primary">Salvar</Button>
 *
 * // Bot?o com ?cone e loading
 * <Button variant="primary" icon={<Save />} loading={ isSaving  }>
 *   Salvar
 * </Button>
 *
 * // Bot?o como child (para links)
 * <Button asChild variant="outline" />
 *   <Link href="/dashboard">Dashboard</Link>
 * </Button>
 * ```
 */

import React from "react";
import { cn } from '@/lib/utils';

/**
 * Props do componente Button
 *
 * @description
 * Propriedades que podem ser passadas para o componente Button.
 * Estende todas as propriedades de bot?o HTML padr?o.
 *
 * @interface ButtonProps
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement />
 * @property {'default'|'primary'|'secondary'|'success'|'warning'|'destructive'|'outline'|'ghost'|'link'} [variant='default'] - Variante visual do bot?o
 * @property {'sm'|'md'|'lg'|'xl'} [size='md'] - Tamanho do bot?o
 * @property {boolean} [loading=false] - Estado de carregamento
 * @property {React.ReactNode} [icon] - ?cone a ser exibido
 * @property {'left'|'right'} [iconPosition='left'] - Posi??o do ?cone
 * @property {boolean} [asChild=false] - Renderizar como child (span ao inv?s de button)
 * @property {React.ReactNode} children - Conte?do do bot?o
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  asChild?: boolean;
  children: React.ReactNode;
}

/**
 * Componente Button
 *
 * @description
 * Renderiza um bot?o com suporte a m?ltiplas variantes, tamanhos, estados e ?cones.
 *
 * @component
 * @param {ButtonProps} props - Props do componente
 * @returns {JSX.Element} Componente de bot?o
 */
const Button: React.FC<ButtonProps> = ({ variant = "default",
  size = "md",
  className,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  asChild = false,
  children,
  ...props
   }) => {
  const baseClasses = cn(
    "inline-flex items-center justify-center font-medium rounded-md",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]",
    "focus:ring-blue-500",
    disabled && "opacity-50 cursor-not-allowed grayscale",
    loading && "opacity-75 cursor-wait",);

  const variantClasses = {
    default:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    warning:
      "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
    link: "bg-transparent text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline dark:text-blue-400",};

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",};

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,);

  if (asChild) {
    return (
        <>
      <span className={buttonClasses} { ...props }>
      </span>{children}
      </span>);

  }

  return (
            <button className={buttonClasses} disabled={disabled || loading} { ...props } />
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24" />
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {icon && iconPosition === "left" && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </button>);};

export { Button };

export default Button;
