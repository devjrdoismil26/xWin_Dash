/**
 * Componente NotificationContainer - Container de Notificações
 *
 * @description
 * Componente que exibe um container fixo de notificações no canto superior direito
 * da tela. Consome notificações do hook `useAdvancedNotifications` e renderiza cada
 * notificação com animação de entrada. Inclui componente interno `NotificationItem`
 * para renderizar cada notificação individual.
 *
 * @example
 * ```tsx
 * import NotificationContainer from '@/shared/components/ui/NotificationContainer';
 *
 * <NotificationContainer / />
 * ```
 *
 * @module components/ui/NotificationContainer
 * @since 1.0.0
 */
import React from "react";
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import Button from "@/shared/components/ui/Button";

/**
 * Interface de notificação
 *
 * @description
 * Interface que define a estrutura de uma notificação individual.
 *
 * @interface NotificationData
 * @property {string} id - ID único da notificação
 * @property {string} type - Tipo da notificação (success, error, warning, info)
 * @property {string} title - Título da notificação
 * @property {string} [message] - Mensagem opcional da notificação
 * @property { label: string; onClick?: (e: any) => void } [action] - Ação opcional da notificação
 */
interface NotificationData {
  id: string;
  type: "success" | "error" | "warning" | "info" | string;
  title: string;
  message?: string;
  action?: {
    label: string;
  onClick?: (e: any) => void; };

}

/**
 * Props do componente NotificationItem
 *
 * @description
 * Propriedades que podem ser passadas para o componente NotificationItem.
 *
 * @interface NotificationItemProps
 * @property {NotificationData} notification - Dados da notificação
 * @property {(id: string) => void} onClose - Função chamada ao fechar a notificação
 */
interface NotificationItemProps {
  /** Dados da notificação */
notification: NotificationData;
  /** Função chamada ao fechar a notificação */
onClose?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente NotificationItem - Item de Notificação Individual
 *
 * @description
 * Componente interno que renderiza uma notificação individual com ícone, título,
 * mensagem, ação opcional e botão de fechar.
 *
 * @component
 * @param {NotificationItemProps} props - Props do componente
 * @returns {JSX.Element} Item de notificação estilizado
 */
const NotificationItem: React.FC<NotificationItemProps> = ({ notification,
  onClose,
   }) => {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    } ;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "•";
    } ;

  return (
        <>
      <div
      className={`p-4 rounded-md border shadow-lg ${getTypeStyles(notification.type)} animate-in slide-in-from-right-full duration-300`}>
      </div><div className=" ">$2</div><div className=" ">$2</div><span className="{getIcon(notification.type)}">$2</span>
          </span>
          <div className=" ">$2</div><h4 className="font-medium">{notification.title}</h4>
            {notification.message && (
              <p className="mt-1 text-sm opacity-90">{notification.message}</p>
            )}
            {notification.action && (
              <div className=" ">$2</div><Button
                  variant="outline"
                  size="sm"
                  onClick={ notification.action.onClick }
                  className="text-xs" />
                  {notification.action.label}
                </Button>
      </div>
    </>
  )}
          </div>
        <button
          onClick={ () => onClose(notification.id) }
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fechar notificação"
        >
          ×
        </button>
      </div>);};

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useAdvancedNotifications();

  if (notifications.length === 0) return null;

  return (
            <div className="{(notifications || []).map((notification: unknown) => (">$2</div>
      <NotificationItem
          key={ notification.id }
          notification={ notification }
          onClose={ removeNotification }
        / />
    </>
  ))}
    </div>);};

export default NotificationContainer;
