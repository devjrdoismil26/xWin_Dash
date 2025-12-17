/**
 * Componente NavLink - Link de Navegação
 *
 * @description
 * Componente de link de navegação que detecta automaticamente se está ativo
 * baseado na URL atual. Suporta classes customizadas para estados ativo/inativo
 * e integração com Inertia.js.
 *
 * @module components/ui/NavLink
 * @since 1.0.0
 */

import React from 'react';
import { Link, usePage } from '@inertiajs/react';

/**
 * Props do componente NavLink
 */
interface NavLinkProps extends Omit<React.ComponentProps<typeof Link>, 'className'> {
  /** URL de destino do link */
  href: string;
  /** Conteúdo do link */
  children: React.ReactNode;
  /** Força estado ativo (sobrescreve detecção automática) */
  active?: boolean;
  /** Classes CSS adicionais */
  className?: string;
  /** Classes CSS aplicadas quando ativo */
  activeClassName?: string;
  /** Classes CSS aplicadas quando inativo */
  inactiveClassName?: string;
}

/**
 * Componente NavLink
 *
 * @description
 * Renderiza um link de navegação com estado ativo visual. Detecta automaticamente
 * se a URL atual corresponde ao href e aplica classes apropriadas.
 */
const NavLink: React.FC<NavLinkProps> = ({ href,
  children,
  active,
  className = '',
  activeClassName = 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
  inactiveClassName = 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
  ...props
   }) => {
  const { url } = usePage();

  const isActive = active !== undefined ? active : url === href;
  
  const combinedClassName = [
    'inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
    isActive ? activeClassName : inactiveClassName,
    className
  ].filter(Boolean).join(' ').trim();

  return (
            <Link href={href} className={combinedClassName} { ...props } />
      {children}
    </Link>);};

export default NavLink;
