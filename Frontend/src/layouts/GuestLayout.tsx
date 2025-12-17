/**
 * Layout para páginas de visitantes (não autenticados)
 *
 * @description
 * Layout utilizado em páginas públicas como login, registro e recuperação de senha.
 * Exibe o logo da aplicação, conteúdo centralizado com card estilizado e rodapé.
 *
 * @module layouts/GuestLayout
 * @since 1.0.0
 */

import React from "react";
import { Link } from '@inertiajs/react';
import ApplicationLogo from "@/shared/components/ui/ApplicationLogo";
import { cn } from '@/lib/utils';

/**
 * Props do componente GuestLayout
 *
 * @interface GuestLayoutProps
 * @property {React.ReactNode} children - Conteúdo a ser exibido no layout
 * @property {string} [title] - Título opcional da página
 * @property {string} [subtitle] - Subtítulo opcional da página
 * @property {'sm' | 'md' | 'lg'} [maxWidth] - Largura máxima do card (padrão: 'md')
 * @property {string} [className] - Classes CSS adicionais
 */
interface GuestLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: "sm" | "md" | "lg";
  className?: string; }

const maxWidthClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",};

/**
 * Componente GuestLayout
 *
 * @description
 * Layout público centralizado com logo, card de conteúdo e rodapé.
 * Ideal para páginas de autenticação e formulários públicos.
 *
 * @param {GuestLayoutProps} props - Props do componente
 * @returns {JSX.Element} Layout de visitante
 *
 * @example
 * ```tsx
 * <GuestLayout title="Entrar" subtitle="Acesse sua conta" />
 *   <LoginForm / />
 * </GuestLayout>
 * ```
 */
const GuestLayout: React.FC<GuestLayoutProps> = ({ children,
  title,
  subtitle,
  maxWidth = "md",
  className = "",
   }) => {
  return (
            <div className="{/* Logo */}">$2</div>
      <div className=" ">$2</div><Link href="/" className="block" />
          <ApplicationLogo className="w-20 h-20 fill-current text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors" /></Link></div>

      {/* Main Card */}
      <div
        className={cn(
          "w-full mt-6 px-6 py-8 bg-white dark:bg-gray-800 shadow-xl overflow-hidden sm:rounded-2xl border border-gray-200 dark:border-gray-700",
          maxWidthClasses[maxWidth],
          className,
        )  }>
        </div>{/* Header */}
        {(title || subtitle) && (
          <div className="{title && (">$2</div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2" />
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400" />
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="space-y-4">{children}</div>

      {/* Footer */}
      <div className=" ">$2</div><p className="text-xs text-gray-500 dark:text-gray-400" />
          © 2025 xWin Dash. Todos os direitos reservados.
        </p>
      </div>);};

export default GuestLayout;
