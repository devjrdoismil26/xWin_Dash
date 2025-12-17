/**
 * Componente ResponsiveNavLink - Link de Navega??o Responsivo
 *
 * @description
 * Componente de link de navega??o responsivo que detecta automaticamente
 * se est? ativo baseado na URL atual. Suporta classes customizadas para
 * estados ativo/inativo e integra??o com Inertia.js.
 *
 * Funcionalidades principais:
 * - Detec??o autom?tica de estado ativo via URL
 * - Classes customiz?veis para estados ativo/inativo
 * - Integra??o com Inertia.js (usePage, Link)
 * - Transi??es suaves
 * - Suporte completo a dark mode
 *
 * @module components/ui/ResponsiveNavLink
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import ResponsiveNavLink from '@/shared/components/ui/ResponsiveNavLink';
 *
 * // Link b?sico
 * <ResponsiveNavLink href="/dashboard" />
 *   Dashboard
 * </ResponsiveNavLink>
 *
 * // Link com estado ativo manual
 * <ResponsiveNavLink href="/settings" active={ isActive } />
 *   Configura??es
 * </ResponsiveNavLink>
 *
 * // Link com classes customizadas
 * <ResponsiveNavLink
 *   href="/profile"
 *   activeClassName="border-green-500 text-green-700"
 *   inactiveClassName="border-gray-300 text-gray-500"
 * />
 *   Perfil
 * </ResponsiveNavLink>
 * ```
 */

import React from "react";
import PropTypes from "prop-types";
import { Link, usePage } from '@inertiajs/react';

/**
 * Props do componente ResponsiveNavLink
 *
 * @description
 * Propriedades que podem ser passadas para o componente ResponsiveNavLink.
 * Estende todas as propriedades de Link do Inertia.js.
 *
 * @interface ResponsiveNavLinkProps
 * @property {string} href - URL do link
 * @property {React.ReactNode} children - Conte?do do link
 * @property {boolean} [active] - Estado ativo manual (opcional, se n?o fornecido, detecta automaticamente)
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padr?o: '')
 * @property {string} [activeClassName='border-blue-400 text-blue-700 bg-blue-50'] - Classes quando ativo (opcional)
 * @property {string} [inactiveClassName='border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'] - Classes quando inativo (opcional)
 */
interface ResponsiveNavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string; }

/**
 * Componente ResponsiveNavLink
 *
 * @description
 * Renderiza um link de navega??o responsivo com detec??o autom?tica de
 * estado ativo baseado na URL atual ou estado manual fornecido.
 *
 * @component
 * @param {ResponsiveNavLinkProps} props - Props do componente
 * @param {string} props.href - URL do link
 * @param {React.ReactNode} props.children - Conte?do do link
 * @param {boolean} [props.active] - Estado ativo manual
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @param {string} [props.activeClassName] - Classes quando ativo
 * @param {string} [props.inactiveClassName] - Classes quando inativo
 * @returns {JSX.Element} Componente de link de navega??o responsivo
 */
const ResponsiveNavLink: React.FC<ResponsiveNavLinkProps> = ({ href,
  children,
  active,
  className = "",
  activeClassName = "border-blue-400 text-blue-700 bg-blue-50",
  inactiveClassName = "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300",
  ...props
   }) => {
  const { url } = usePage();

  const isActive = active !== undefined ? active : url === href;
  const combinedClassName =
    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${isActive ? activeClassName : inactiveClassName} ${className}`.trim();

  return (
            <Link to={href} className={combinedClassName} { ...props } />
      {children}
    </Link>);};

ResponsiveNavLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  inactiveClassName: PropTypes.string,};

export default ResponsiveNavLink;
