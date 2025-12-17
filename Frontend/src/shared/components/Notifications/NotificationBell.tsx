/**
 * Componente NotificationBell
 *
 * @description
 * Bot?o de notifica??es com contador de n?o lidas que abre
 * o centro de notifica??es ao ser clicado.
 *
 * @module components/Notifications/NotificationBell
 * @since 1.0.0
 */

import React, { useState, useCallback } from "react";
import { Bell } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { useNotifications } from './NotificationProvider';
import { cn } from '@/lib/utils';
import Button from "@/shared/components/ui/Button";

/**
 * Componente NotificationBell
 *
 * @description
 * Bot?o de sino que exibe contador de notifica??es n?o lidas
 * e abre o centro de notifica??es ao ser clicado.
 *
 * @returns {JSX.Element} Componente de sino de notifica??es
 *
 * @example
 * ```tsx
 * <NotificationBell / />
 * ```
 */
export const NotificationBell: React.FC = () => {
  const { unreadCount } = useNotifications();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  /**
   * Handler para toggle do centro de notifica??es
   */
  const handleToggle = useCallback((): void => {
    setIsOpen((prev: unknown) => !prev);

  }, []);

  /**
   * Handler para fechar o centro de notifica??es
   */
  const handleClose = useCallback((): void => {
    setIsOpen(false);

  }, []);

  return (
            <div className=" ">$2</div><Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={ handleToggle }
        className={cn(
          "relative p-2",
          "text-gray-600 dark:text-gray-400",
          "hover:text-gray-900 dark:hover:text-gray-100",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
        )} aria-label={`Notifica??es${unreadCount > 0 ? ` (${unreadCount} n?o lidas)` : ""}`}
        aria-expanded={ isOpen }
        aria-haspopup="dialog"
      >
        <Bell className="w-6 h-6" aria-hidden="true">
          {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full min-w-[1.25rem]"
            aria-label={`${unreadCount} notifica??es n?o lidas`}>
           
        </span>{unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      { isOpen && <NotificationCenter onClose={handleClose } />}
    </div>);};

export default NotificationBell;
