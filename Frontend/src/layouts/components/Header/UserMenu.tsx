/**
 * Componente UserMenu
 *
 * @description
 * Menu dropdown do usuário que exibe informações do usuário autenticado
 * e opções de navegação (perfil, configurações, logout).
 *
 * @module layouts/components/Header/UserMenu
 * @since 1.0.0
 */

import React, { useCallback } from "react";
import { User as UserIcon, Settings, LogOut } from 'lucide-react';
import { router } from '@inertiajs/react';
import Dropdown from "@/shared/components/ui/Dropdown";
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

/**
 * Props do componente UserMenu
 *
 * @interface UserMenuProps
 * @property {string} [className] - Classes CSS adicionais (opcional)
 */
interface UserMenuProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente UserMenu
 *
 * @description
 * Menu dropdown do usuário integrado com AuthContext que exibe
 * informações do usuário autenticado e opções de navegação.
 *
 * @param {UserMenuProps} props - Props do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @returns {JSX.Element | null} Menu do usuário ou null se não autenticado
 *
 * @example
 * ```tsx
 * <UserMenu className="ml-4" />
 * ```
 */
const UserMenu: React.FC<UserMenuProps> = ({ className = ""    }) => {
  const { user, loading, logout } = useAuth();

  /**
   * Handler para logout
   *
   * @description
   * Chama a função de logout do AuthContext e redireciona para login.
   */
  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      await logout();

      router.visit("/login");

    } catch (error) {
      console.error("Erro ao fazer logout:", error);

    } , [logout]);

  // Mostrar loading state enquanto carrega usuário
  if (loading) { return (
        <>
      <div
        className={cn(
          "flex items-center space-x-3 p-2 rounded-lg",
          "animate-pulse bg-gray-200 dark:bg-gray-700",
          className,
        )  }>
      </div><div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600">
           
        </div><div className=" ">$2</div><div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-1">
           
        </div><div className="h-3 w-32 bg-gray-300 dark:bg-gray-600 rounded" / />
           
        </div></div>);

  }

  // Não renderizar se não houver usuário autenticado
  if (!user) {
    return null;
  }

  /**
   * Gera iniciais do nome do usuário para avatar
   *
   * @param {string} name - Nome do usuário
   * @returns {string} Iniciais do nome
   */
  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();

    }
    return name.substring(0, 2).toUpperCase();};

  /**
   * Iniciais do usuário para exibição no avatar
   */
  const userInitials = user.name ? getInitials(user.name) : "U";

  /**
   * Nome de exibição do usuário
   */
  const displayName = user.name || "Usuário";

  /**
   * Email do usuário
   */
  const userEmail = user.email || "";

  return (
        <>
      <Dropdown />
      <Dropdown.Trigger asChild />
        <button
          className={cn(
            "flex items-center space-x-3 p-2 rounded-lg",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            "transition-colors",
            className,
          )} aria-label="Abrir menu do usuário" />
          <span className="sr-only">Abrir menu do usuário</span>
          {user.avatar ? (
            <img
              src={ user.avatar }
              alt={ displayName }
              className="h-8 w-8 rounded-full object-cover shadow-lg"
            / />
          ) : (
            <div
              className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shadow-lg"
              aria-hidden="true">
           
        </div>{userInitials}
            </div>
          )}
          <div className=" ">$2</div><p className="text-sm font-medium text-gray-700 dark:text-gray-300" />
              {displayName}
            </p>
            <p
              className="text-xs text-gray-500 dark:text-gray-400 truncate"
              title={ userEmail } />
              {userEmail}
            </p></div></button>
      </Dropdown.Trigger>

      <Dropdown.Content align="right" className="w-56" />
        <div className=" ">$2</div><p className="text-sm font-medium text-gray-900 dark:text-white" />
            {displayName}
          </p>
          <p
            className="text-sm text-gray-500 dark:text-gray-400 truncate"
            title={ userEmail } />
            {userEmail}
          </p></div><Dropdown.Item href="/profile" />
          <UserIcon className="mr-3 h-4 w-4" />
          Perfil
        </Dropdown.Item>

        <Dropdown.Item href="/settings" />
          <Settings className="mr-3 h-4 w-4" />
          Configurações
        </Dropdown.Item>

        <Dropdown.Divider / />
        <Dropdown.Item as="button" onClick={ handleLogout } />
          <LogOut className="mr-3 h-4 w-4" />
          Sair
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>);};

export default UserMenu;
