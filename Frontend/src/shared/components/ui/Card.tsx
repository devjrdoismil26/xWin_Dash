/**
 * Componente Card - Cart?o Reutiliz?vel
 *
 * @description
 * Componente de cart?o modular com suporte a m?ltiplas variantes, padding customiz?vel
 * e sub-componentes (Header, Content, Footer, Title, Description). Projetado para ser
 * o componente de cart?o padr?o da aplica??o.
 *
 * Funcionalidades principais:
 * - M?ltiplas variantes (default, outlined, elevated)
 * - Padding configur?vel (none, sm, md, lg)
 * - Sub-componentes modulares (Header, Content, Footer, Title, Description)
 * - Suporte completo a dark mode
 * - Layout responsivo
 * - Anima??es e transi??es suaves
 *
 * @module components/ui/Card
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import Card from '@/shared/components/ui/Card';
 *
 * // Card b?sico
 * <Card />
 *   <Card.Title>T?tulo</Card.Title>
 *   <Card.Content>Conte?do do cart?o</Card.Content>
 * </Card>
 *
 * // Card completo com todos os sub-componentes
 * <Card variant="elevated" padding="lg" />
 *   <Card.Header />
 *     <Card.Title>T?tulo do Card</Card.Title>
 *     <Card.Description>Descri??o do card</Card.Description>
 *   </Card.Header>
 *   <Card.Content />
 *     Conte?do principal do cart?o
 *   </Card.Content>
 *   <Card.Footer />
 *     <Button>A??o</Button>
 *   </Card.Footer>
 * </Card>
 * ```
 */

import React from "react";
import { cn } from '@/lib/utils';

/**
 * Props do componente Card
 *
 * @description
 * Propriedades que podem ser passadas para o componente Card.
 *
 * @interface CardProps
 * @property {React.ReactNode} [children] - Conte?do do card
 * @property {string} [className] - Classes CSS adicionais
 * @property {'default'|'outlined'|'elevated'} [variant='default'] - Variante visual do card
 * @property {'none'|'sm'|'md'|'lg'} [padding='md'] - Padding interno do card
 */
export interface CardProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg"; }

/**
 * Componente Card
 *
 * @description
 * Renderiza um cart?o com suporte a variantes, padding e sub-componentes.
 *
 * @component
 * @param {CardProps} props - Props do componente
 * @returns {JSX.Element} Componente de card
 */
const Card: React.FC<CardProps> & {
  /** Sub-componente Header do Card */
  Header: React.FC<{ children: React.ReactNode; className?: string }>;
  /** Sub-componente Content do Card */
  Content: React.FC<{ children: React.ReactNode; className?: string }>;
  /** Sub-componente Footer do Card */
  Footer: React.FC<{ children: React.ReactNode; className?: string }>;
  /** Sub-componente Title do Card */
  Title: React.FC<{ children: React.ReactNode; className?: string }>;
  /** Sub-componente Description do Card */
  Description: React.FC<{ children: React.ReactNode; className?: string }>;
} = ({
  children,
  className,
  variant = "default",
  padding = "md",
  ...props
}) => {
  const baseClasses =
    "bg-white dark:bg-gray-800 rounded-lg transition-all duration-200";

  const variantClasses = {
    default: "border border-gray-200 dark:border-gray-700",
    outlined: "border-2 border-gray-300 dark:border-gray-600",
    elevated: "shadow-lg border border-gray-100 dark:border-gray-700",};

  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",};

  return (
        <>
      <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        className,
      )} { ...props }>
      </div>{children}
    </div>);};

const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className    }) => (
  <div
    className={cn(
      "mb-4 pb-4 border-b border-gray-200 dark:border-gray-700",
      className,
    )  }>
        </div>{children}
  </div>);

const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className    }) => (
  <div className={cn("", className) } >{children}</div>);

/**
 * Sub-componente CardFooter
 *
 * @description
 * Renderiza o rodap? do card com borda superior.
 *
 * @component
 * @param {object} props - Props do componente
 * @param {React.ReactNode} props.children - Conte?do do footer
 * @param {string} [props.className] - Classes CSS adicionais
 * @returns {JSX.Element} Componente de footer do card
 */
const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className    }) => (
  <div
    className={cn(
      "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700",
      className,
    )  }>
        </div>{children}
  </div>);

const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className    }) => (
  <h3
    className={cn(
      "text-lg font-semibold text-gray-900 dark:text-white",
      className,
    ) } />
    {children}
  </h3>);

/**
 * Sub-componente CardDescription
 *
 * @description
 * Renderiza a descri??o do card.
 *
 * @component
 * @param {object} props - Props do componente
 * @param {React.ReactNode} props.children - Texto da descri??o
 * @param {string} [props.className] - Classes CSS adicionais
 * @returns {JSX.Element} Componente de descri??o do card
 */
const CardDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className    }) => (
  <p className={cn("text-sm text-gray-600 dark:text-gray-400 mt-1", className) } />
    {children}
  </p>);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export { Card };

export default Card;
