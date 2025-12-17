/**
 * Componente de a??es do header
 *
 * @description
 * Agrupa a??es comuns do header: busca global, toggle de tema, notifica??es e menu do usu?rio.
 * Exibido apenas em telas maiores (sm:flex) para manter o header limpo em mobile.
 *
 * @module layouts/components/Header/HeaderActions
 * @since 1.0.0
 */

import React from "react";
import { Search } from 'lucide-react';
import { NotificationBell } from '@/shared/components/Notifications/NotificationBell';
import UserMenu from "./UserMenu";
import ThemeToggle from "./ThemeToggle";

/**
 * Props do componente HeaderActions
 *
 * @interface HeaderActionsProps
 * @property {() => void} onSearchOpen - Callback para abrir a busca global
 * @property {string} [className] - Classes CSS adicionais
 */
interface HeaderActionsProps {
  onSearchOpen??: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente HeaderActions
 *
 * @description
 * Agrupa e exibe a??es comuns do header com bot?es para busca, tema, notifica??es e menu do usu?rio.
 *
 * @param {HeaderActionsProps} props - Props do componente
 * @returns {JSX.Element} Grupo de a??es do header
 *
 * @example
 * ```tsx
 * <HeaderActions onSearchOpen={ () => setSearchOpen(true) } />
 * ```
 */
const HeaderActions: React.FC<HeaderActionsProps> = ({ onSearchOpen,
  className = "",
   }) => {
  return (
        <>
      <div className={`hidden sm:flex sm:items-center sm:space-x-4 ${className} `}>
      </div>{/* Global Search */}
      <button
        onClick={ onSearchOpen }
        className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        title="Busca global (Cmd+K)" />
        <Search className="h-5 w-5" />
      </button>

      {/* Theme Toggle */}
      <ThemeToggle compact={ true  }>
          {/* Notifications */}
      <NotificationBell>
          {/* User Menu */}
      <UserMenu / />
    </div>);};

export default HeaderActions;
