/**
 * Configuração Laravel Echo - Pusher Local
 *
 * @description
 * Este módulo configura e exporta a instância do Laravel Echo para comunicação
 * em tempo real usando Pusher local. Fornece configurações, utilitários e a
 * instância global do Echo para uso em toda a aplicação.
 *
 * Funcionalidades principais:
 * - Configuração do Laravel Echo com Pusher local
 * - Exposição do Pusher globalmente no window
 * - Instância global do Echo pronta para uso
 * - Utilitários para gerenciar configuração do Echo
 * - Verificação de status de conexão
 *
 * @module services/realtime/echoConfig
 * @since 1.0.0
 *
 * @example
 * ```ts
 * import echo from '@/services/realtime/echoConfig';
 *
 * // Usar o Echo
 * echo.channel('notifications')
 *   .listen('.notification.created', (e: NotificationEvent) => {
 *   });

 * ```
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { EchoConfig } from './types';

/**
 * Extensão da interface Window para incluir Pusher
 */
interface WindowWithPusher extends Window {
  Pusher?: typeof Pusher;
}

// ========================================
// CONFIGURAÇÃO PUSHER
// ========================================

/**
 * Expõe Pusher globalmente no window para uso pelo Laravel Echo
 *
 * @description
 * O Laravel Echo requer que o Pusher esteja disponível globalmente no objeto
 * window. Esta função garante que o Pusher seja exposto apenas no ambiente
 * do navegador (não no SSR).
 *
 * @since 1.0.0
 */
if (typeof window !== 'undefined') {
  (window as WindowWithPusher).Pusher = Pusher;
}

// ========================================
// CONFIGURAÇÃO ECHO PARA PUSHER LOCAL
// ========================================

/**
 * Configuração do Laravel Echo para Pusher local
 *
 * @description
 * Configuração padrão para conexão com servidor Pusher local. Esta configuração
 * é usada para desenvolvimento local com servidor Pusher em execução na porta 4006.
 *
 * @constant {EchoConfig}
 * @since 1.0.0
 */
const echoConfig: EchoConfig = {
  broadcaster: 'pusher',
  key: 'local',
  cluster: 'mt1',
  wsHost: '127.0.0.1',
  wsPort: 4006,
  forceTLS: false,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],};

// ========================================
// INSTÂNCIA ECHO
// ========================================

/**
 * Instância global do Laravel Echo
 *
 * @description
 * Instância única e compartilhada do Laravel Echo configurada para Pusher local.
 * Esta é a instância recomendada para uso na maioria dos casos em toda a aplicação.
 *
 * @constant {Echo}
 * @global
 * @since 1.0.0
 *
 * @example
 * ```ts
 * import echo from '@/services/realtime/echoConfig';
 *
 * // Escutar eventos em um canal público
 * echo.channel('notifications')
 *   .listen('.notification.created', (data: unknown) => {
 *   });

 * ```
 */
const echo = new Echo(echoConfig);

// ========================================
// MÉTODOS DE UTILIDADE
// ========================================

/**
 * Retorna uma cópia da configuração atual do Echo
 *
 * @description
 * Retorna uma cópia imutável da configuração do Echo. Útil para verificar
 * ou comparar configurações sem modificar o objeto original.
 *
 * @returns {EchoConfig} Cópia da configuração do Echo
 *
 * @example
 * ```ts
 * import { getEchoConfig } from '@/services/realtime/echoConfig';
 *
 * const config = getEchoConfig();

 * ```
 */
export const getEchoConfig = (): EchoConfig => {
  return { ...echoConfig};
};

/**
 * Atualiza a configuração do Echo com novos valores
 *
 * @description
 * Atualiza parcialmente a configuração do Echo. Esta função modifica o objeto
 * de configuração original, portanto todas as novas instâncias do Echo criadas
 * após esta atualização usarão a nova configuração.
 *
 * @param {Partial<EchoConfig>} newConfig - Objeto com as propriedades a serem atualizadas
 *
 * @example
 * ```ts
 * import { updateEchoConfig } from '@/services/realtime/echoConfig';
 *
 * // Atualizar apenas o host
 * updateEchoConfig({
 *   wsHost: 'localhost',
 *   wsPort: 8080
 * });

 * ```
 */
export const updateEchoConfig = (newConfig: Partial<EchoConfig>): void => {
  Object.assign(echoConfig, newConfig);};

/**
 * Verifica se o Echo está conectado
 *
 * @description
 * Retorna o status de conexão do Echo. Atualmente retorna sempre false,
 * indicando que a conexão está desabilitada.
 *
 * @returns {boolean} true se conectado, false caso contrário
 *
 * @example
 * ```ts
 * import { isEchoConnected } from '@/services/realtime/echoConfig';
 *
 * if (isEchoConnected()) {
 * } else {
 * }
 * ```
 */
export const isEchoConnected = (): boolean => {
  return false; // Sempre desconectado};

/**
 * Retorna o status da conexão do Echo como string
 *
 * @description
 * Retorna uma string representando o status atual da conexão do Echo.
 * Atualmente retorna sempre 'disabled'.
 *
 * @returns {string} Status da conexão ('disabled', 'connected', 'disconnected', etc.)
 *
 * @example
 * ```ts
 * import { getEchoConnectionStatus } from '@/services/realtime/echoConfig';
 *
 * const status = getEchoConnectionStatus();

 * ```
 */
export const getEchoConnectionStatus = (): string => {
  return 'disabled';};

// ========================================
// EXPORTS
// ========================================

export { echo, echoConfig };

export default echo;