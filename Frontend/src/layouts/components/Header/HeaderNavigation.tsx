/**
 * Componente de navega??o do header
 *
 * @description
 * Renderiza navega??o din?mica ou portal baseado no contexto da p?gina.
 * Alterna entre DynamicNavigation e PortalNavigation conforme necess?rio.
 *
 * @module layouts/components/Header/HeaderNavigation
 * @since 1.0.0
 */

import React from "react";
import DynamicNavigation from "@/shared/components/Navigation/DynamicNavigation";
import PortalNavigation from "@/shared/components/Navigation/PortalNavigation";

/**
 * Props do componente HeaderNavigation
 *
 * @interface HeaderNavigationProps
 * @property {boolean} isPortalPage - Indica se a p?gina atual ? um portal (usa PortalNavigation)
 * @property {string} [className] - Classes CSS adicionais
 */
interface HeaderNavigationProps {
  isPortalPage: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente HeaderNavigation
 *
 * @description
 * Renderiza navega??o condicionalmente baseado no tipo de p?gina.
 * Usa PortalNavigation para p?ginas de portal, DynamicNavigation para outras.
 *
 * @param {HeaderNavigationProps} props - Props do componente
 * @returns {JSX.Element} Navega??o do header
 *
 * @example
 * ```tsx
 * <HeaderNavigation isPortalPage={false} / />
 * ```
 */
const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ isPortalPage,
  className = "",
   }) => {
  return (
        <>
      <div className={`hidden lg:ml-8 lg:flex lg:space-x-1 ${className} `}>
      </div>{isPortalPage ? (
        <PortalNavigation className="flex space-x-1" />
      ) : (
        <DynamicNavigation / />
      )}
    </div>);};

export default HeaderNavigation;
