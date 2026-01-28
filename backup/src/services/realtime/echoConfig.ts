// ========================================
// CONFIGURAÇÃO LARAVEL ECHO - PUSHER LOCAL
// ========================================

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { EchoConfig } from './types';

// ========================================
// CONFIGURAÇÃO PUSHER
// ========================================

// Expor Pusher globalmente para Echo
if (typeof window !== 'undefined') {
  (window as any).Pusher = Pusher;
}

// ========================================
// CONFIGURAÇÃO ECHO PARA PUSHER LOCAL
// ========================================

const echoConfig: EchoConfig = {
  broadcaster: 'pusher',
  key: 'local',
  cluster: 'mt1',
  wsHost: '127.0.0.1',
  wsPort: 4006,
  forceTLS: false,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
};

console.log('🚀 Echo Config Pusher Local:', echoConfig);

// ========================================
// INSTÂNCIA ECHO
// ========================================

const echo = new Echo(echoConfig);

// ========================================
// MÉTODOS DE UTILIDADE
// ========================================

export const getEchoConfig = (): EchoConfig => {
  return { ...echoConfig };
};

export const updateEchoConfig = (newConfig: Partial<EchoConfig>): void => {
  Object.assign(echoConfig, newConfig);
};

export const isEchoConnected = (): boolean => {
  return false; // Sempre desconectado
};

export const getEchoConnectionStatus = (): string => {
  return 'disabled';
};

// ========================================
// EXPORTS
// ========================================

export { echo, echoConfig };
export default echo;