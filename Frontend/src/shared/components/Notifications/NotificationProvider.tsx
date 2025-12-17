/**
 * Provider de Notifica??es - NotificationProvider
 *
 * @description
 * Provider que gerencia notifica??es do sistema, incluindo cria??o,
 * leitura, marca??o e remo??o. Integra com Laravel Echo para notifica??es
 * em tempo real via WebSocket.
 *
 * @module components/Notifications/NotificationProvider
 * @since 1.0.0
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from "react";

/**
 * Tipo de notifica??o
 */
export type NotificationType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "system";

/**
 * Interface de Notifica??o
 *
 * @interface Notification
 * @property {string} id - ID ?nico da notifica??o
 * @property {NotificationType} type - Tipo da notifica??o
 * @property {string} title - T?tulo da notifica??o
 * @property {string} message - Mensagem da notifica??o
 * @property {Date} date - Data de cria??o
 * @property {boolean} read - Se a notifica??o foi lida
 * @property {string} [category] - Categoria da notifica??o (opcional)
 * @property {string} [url] - URL de a??o (opcional)
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  category?: string;
  url?: string; }

/**
 * Tipo do Contexto de Notifica??es
 *
 * @interface NotificationContextType
 * @property {Notification[]} notifications - Lista de notifica??es
 * @property {number} unreadCount - N?mero de notifica??es n?o lidas
 * @property {Function} addNotification - Adiciona uma nova notifica??o
 * @property {Function} markAsRead - Marca uma notifica??o como lida
 * @property {Function} markAllAsRead - Marca todas as notifica??es como lidas
 * @property {Function} removeNotification - Remove uma notifica??o
 * @property {Function} clearAll - Remove todas as notifica??es
 */
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification?: (e: any) => void;
  markAsRead?: (e: any) => void;
  markAllAsRead??: (e: any) => void;
  removeNotification?: (e: any) => void;
  clearAll??: (e: any) => void; }

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,);

/**
 * Hook para usar o contexto de notifica??es
 *
 * @description
 * Hook que retorna o contexto de notifica??es. Deve ser usado dentro de um NotificationProvider.
 *
 * @returns {NotificationContextType} Objeto com notifica??es e fun??es de controle
 * @throws {Error} Se usado fora de um NotificationProvider
 *
 * @example
 * ```tsx
 * const { notifications, addNotification, markAsRead } = useNotifications();

 * ```
 */
export const useNotifications = (): NotificationContextType => {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error(
      "useNotifications deve ser usado dentro de um NotificationProvider",);

  }
  return ctx;};

/**
 * Props do NotificationProvider
 *
 * @interface NotificationProviderProps
 * @property {ReactNode} children - Componentes filhos
 */
interface NotificationProviderProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Provider de Notifica??es
 *
 * @description
 * Provider que gerencia notifica??es do sistema, incluindo:
 * - Estado de notifica??es
 * - Opera??es CRUD (criar, ler, atualizar, deletar)
 * - Integra??o com Laravel Echo para notifica??es em tempo real
 * - Contagem de n?o lidas
 *
 * @param {NotificationProviderProps} props - Props do provider
 * @param {ReactNode} props.children - Componentes filhos
 * @returns {JSX.Element} Provider do contexto de notifica??es
 *
 * @example
 * ```tsx
 * <NotificationProvider />
 *   <App / />
 * </NotificationProvider>
 * ```
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children,
   }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * Adiciona uma nova notifica??o
   *
   * @description
   * Cria uma nova notifica??o com ID ?nico, data atual e status n?o lida.
   *
   * @param {Omit<Notification, 'id' | 'date' | 'read'>} notification - Dados da notifica??o
   */
  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "date" | "read">): void => {
      const newNotification: Notification = {
        id: crypto.randomUUID(),
        date: new Date(),
        read: false,
        ...notification,};

      setNotifications((prev: unknown) => [newNotification, ...prev]);

    },
    [],);

  /**
   * Marca uma notifica??o como lida
   *
   * @param {string} id - ID da notifica??o
   */
  const markAsRead = useCallback((id: string): void => {
    setNotifications((prev: unknown) =>
      (prev || []).map((n: unknown) => (n.id === id ? { ...n, read: true } : n)),);

  }, []);

  /**
   * Marca todas as notifica??es como lidas
   */
  const markAllAsRead = useCallback((): void => {
    setNotifications((prev: unknown) => (prev || []).map((n: unknown) => ({ ...n, read: true })));

  }, []);

  /**
   * Remove uma notifica??o
   *
   * @param {string} id - ID da notifica??o
   */
  const removeNotification = useCallback((id: string): void => {
    setNotifications((prev: unknown) => (prev || []).filter((n: unknown) => n.id !== id));

  }, []);

  /**
   * Remove todas as notifica??es
   */
  const clearAll = useCallback((): void => {
    setNotifications([]);

  }, []);

  /**
   * Conta notifica??es n?o lidas
   *
   * @description
   * Memoiza a contagem de notifica??es n?o lidas para performance.
   */
  const unreadCount = useMemo(() => {
    return (notifications || []).filter((n: unknown) => !n.read).length;
  }, [notifications]);

  /**
   * Integra??o com Laravel Echo para notifica??es em tempo real
   *
   * @description
   * Efeito que configura o listener para notifica??es via WebSocket.
   * Escuta o canal 'notifications' e adiciona notifica??es automaticamente.
   */
  useEffect(() => {
    // Verificar se Laravel Echo est? dispon?vel
    const echo = (window as any as { Echo?: string }).Echo;
    if (!echo) {
      return;
    }

    try {
      // @ts-expect-error - Echo ? uma biblioteca externa
      const channel = echo.channel("notifications");

      /**
       * Handler para notifica??es recebidas via WebSocket
       *
       * @param {any} data - Dados da notifica??o recebida
       */
      const handler = (data: unknown): void => {
        if (
          data &&
          typeof data === "object" &&
          "title" in data &&
          "message" in data
        ) {
          addNotification({
            type: "info",
            title: String(data.title),
            message: String(data.message),
            category: "system" in data ? String(data.system) : undefined,
            url: "url" in data ? String(data.url) : undefined,
          });

        } ;

      // @ts-expect-error - Echo ? uma biblioteca externa
      channel.listen("GenericNotification", handler);

      return () => {
        try {
          // @ts-expect-error - Echo ? uma biblioteca externa
          channel.stopListening("GenericNotification", handler);

        } catch (err) {
          // Garantir cleanup mesmo se Echo estiver em estado inv?lido
        } ;

    } catch (error) {
    } , [addNotification]);

  /**
   * Valor do contexto de notifica??es
   *
   * @description
   * Memoiza o valor do contexto para evitar re-renders desnecess?rios.
   */
  const value = useMemo<NotificationContextType>(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
    }),
    [
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
    ],);

  return (
            <NotificationContext.Provider value={ value } />
      {children}
    </NotificationContext.Provider>);};

/**
 * Componente NotificationListener (legado)
 *
 * @description
 * Componente de compatibilidade que n?o faz nada.
 * A l?gica de listener foi movida para o NotificationProvider.
 *
 * @returns {null} Sempre retorna null
 * @deprecated N?o ? mais necess?rio, a l?gica est? no provider
 */
export const NotificationListener: React.FC = () => null;
