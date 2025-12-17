/**
 * @module modules/Aura/AuraCore/utils/auraCoreValidators
 * @description
 * Funções de validação para o módulo AuraCore.
 * 
 * Inclui validadores para:
 * - Configuração do AuraCore (refresh interval, tema, idioma)
 * - Módulos (ID, tipo, título, status, contagem, rota)
 * - Ações rápidas (ID, tipo, título, descrição, ícone, cor, ação)
 * - Notificações (ID, tipo, título, mensagem, timestamp, lida)
 * - Dados de dashboard (estatísticas, módulos, ações, notificações)
 * - Estatísticas (total de conexões, fluxos, mensagens, tempo de resposta, uptime)
 * - Filtros (status, tipo de módulo, intervalo de data, busca)
 * - Respostas da API (success, data, error, message)
 * 
 * @example
 * ```typescript
 * import { validateAuraConfig, validateAuraModule, validateAuraStats } from './auraCoreValidators';
 * 
 * const config = { refresh_interval: 5000, theme: 'dark'};

 * const validation = validateAuraConfig(config);

 * if (!validation.isValid) {
 *   console.error(validation.errors);

 * }
 * ```
 * 
 * @since 1.0.0
 */

import { AuraConfig, AuraModule, AuraQuickAction, AuraNotification } from '../types';

/**
 * Valida configuração do AuraCore
 *
 * @description
 * Valida configuração do AuraCore incluindo refresh interval, tema e idioma.
 *
 * @param {AuraConfig} config - Configuração a validar
 * @returns {Object} Resultado da validação com errors
 */
export const validateAuraConfig = (config: AuraConfig): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Validar refresh interval
  if (config.refresh_interval && (config.refresh_interval < 1000 || config.refresh_interval > 300000)) {
    errors.push('Intervalo de atualização deve estar entre 1 e 300 segundos');

  }

  // Validar tema
  if (config.theme && !['light', 'dark', 'auto'].includes(config.theme)) {
    errors.push('Tema deve ser light, dark ou auto');

  }

  // Validar idioma
  if (config.language && typeof config.language !== 'string') {
    errors.push('Idioma deve ser uma string válida');

  }

  return {
    isValid: errors.length === 0,
    errors};
};

/**
 * Valida módulo do AuraCore
 */
export const validateAuraModule = (module: AuraModule): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Validar ID
  if (!module.id || typeof module.id !== 'string') {
    errors.push('ID do módulo é obrigatório e deve ser uma string');

  }

  // Validar tipo
  if (!module.type || !['connections', 'flows', 'chats', 'stats'].includes(module.type)) {
    errors.push('Tipo do módulo deve ser connections, flows, chats ou stats');

  }

  // Validar título
  if (!module.title || typeof module.title !== 'string') {
    errors.push('Título do módulo é obrigatório e deve ser uma string');

  }

  // Validar status
  if (!module.status || !['active', 'inactive', 'error', 'loading', 'pending'].includes(module.status)) {
    errors.push('Status do módulo deve ser active, inactive, error, loading ou pending');

  }

  // Validar contagem
  if (typeof module.count !== 'number' || module.count < 0) {
    errors.push('Contagem do módulo deve ser um número não negativo');

  }

  // Validar rota
  if (!module.route || typeof module.route !== 'string') {
    errors.push('Rota do módulo é obrigatória e deve ser uma string');

  }

  return {
    isValid: errors.length === 0,
    errors};
};

/**
 * Valida ação rápida do AuraCore
 */
export const validateAuraQuickAction = (action: AuraQuickAction): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Validar ID
  if (!action.id || typeof action.id !== 'string') {
    errors.push('ID da ação rápida é obrigatório e deve ser uma string');

  }

  // Validar tipo
  if (!action.type || !['create_connection', 'create_flow', 'send_message', 'view_stats'].includes(action.type)) {
    errors.push('Tipo da ação rápida deve ser create_connection, create_flow, send_message ou view_stats');

  }

  // Validar título
  if (!action.title || typeof action.title !== 'string') {
    errors.push('Título da ação rápida é obrigatório e deve ser uma string');

  }

  // Validar descrição
  if (!action.description || typeof action.description !== 'string') {
    errors.push('Descrição da ação rápida é obrigatória e deve ser uma string');

  }

  // Validar ícone
  if (!action.icon || typeof action.icon !== 'string') {
    errors.push('Ícone da ação rápida é obrigatório e deve ser uma string');

  }

  // Validar cor
  if (!action.color || typeof action.color !== 'string') {
    errors.push('Cor da ação rápida é obrigatória e deve ser uma string');

  }

  // Validar ação
  if (!action.action || typeof action.action !== 'function') {
    errors.push('Ação da ação rápida é obrigatória e deve ser uma função');

  }

  // Validar habilitado
  if (typeof action.enabled !== 'boolean') {
    errors.push('Status habilitado da ação rápida deve ser um boolean');

  }

  return {
    isValid: errors.length === 0,
    errors};
};

/**
 * Valida notificação do AuraCore
 */
export const validateAuraNotification = (notification: AuraNotification): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Validar ID
  if (!notification.id || typeof notification.id !== 'string') {
    errors.push('ID da notificação é obrigatório e deve ser uma string');

  }

  // Validar tipo
  if (!notification.type || !['success', 'error', 'warning', 'info'].includes(notification.type)) {
    errors.push('Tipo da notificação deve ser success, error, warning ou info');

  }

  // Validar título
  if (!notification.title || typeof notification.title !== 'string') {
    errors.push('Título da notificação é obrigatório e deve ser uma string');

  }

  // Validar mensagem
  if (!notification.message || typeof notification.message !== 'string') {
    errors.push('Mensagem da notificação é obrigatória e deve ser uma string');

  }

  // Validar timestamp
  if (!notification.timestamp || typeof notification.timestamp !== 'string') {
    errors.push('Timestamp da notificação é obrigatório e deve ser uma string');

  }

  // Validar se é uma data válida
  if (notification.timestamp && isNaN(new Date(notification.timestamp).getTime())) {
    errors.push('Timestamp da notificação deve ser uma data válida');

  }

  // Validar lida
  if (typeof notification.read !== 'boolean') {
    errors.push('Status lida da notificação deve ser um boolean');

  }

  return {
    isValid: errors.length === 0,
    errors};
};

/**
 * Valida dados de dashboard
 */
export const validateDashboardData = (data: Record<string, any>): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Validar ID
  if (!data.id || typeof (data as any).id !== 'string') {
    errors.push('ID do dashboard é obrigatório e deve ser uma string');

  }

  // Validar estatísticas
  if (data.stats && !validateAuraStats(data.stats as Record<string, any>).isValid) {
    errors.push('Estatísticas do dashboard são inválidas');

  }

  // Validar módulos
  if (data.modules && Array.isArray(data.modules)) {
    (data as any).modules.forEach((module: Record<string, any>, index: number) => {
      const validation = validateAuraModule(module);

      if (!validation.isValid) {
        errors.push(`Módulo ${index + 1}: ${validation.errors.join(', ')}`);

      } );

  }

  // Validar ações rápidas
  if (data.quick_actions && Array.isArray(data.quick_actions)) {
    (data as any).quick_actions.forEach((action: unknown, index: number) => {
      const validation = validateAuraQuickAction(action);

      if (!validation.isValid) {
        errors.push(`Ação rápida ${index + 1}: ${validation.errors.join(', ')}`);

      } );

  }

  // Validar notificações
  if (data.notifications && Array.isArray(data.notifications)) {
    (data as any).notifications.forEach((notification: Record<string, any>, index: number) => {
      const validation = validateAuraNotification(notification);

      if (!validation.isValid) {
        errors.push(`Notificação ${index + 1}: ${validation.errors.join(', ')}`);

      } );

  }

  return {
    isValid: errors.length === 0,
    errors};
};

/**
 * Valida estatísticas do AuraCore
 */
export const validateAuraStats = (stats: Record<string, any>): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Validar ID
  if (!stats.id || typeof stats.id !== 'string') {
    errors.push('ID das estatísticas é obrigatório e deve ser uma string');

  }

  // Validar total de conexões
  if (typeof stats.total_connections !== 'number' || stats.total_connections < 0) {
    errors.push('Total de conexões deve ser um número não negativo');

  }

  // Validar fluxos ativos
  if (typeof stats.active_flows !== 'number' || stats.active_flows < 0) {
    errors.push('Fluxos ativos deve ser um número não negativo');

  }

  // Validar mensagens enviadas
  if (typeof stats.messages_sent !== 'number' || stats.messages_sent < 0) {
    errors.push('Mensagens enviadas deve ser um número não negativo');

  }

  // Validar tempo de resposta
  if (typeof stats.response_time !== 'number' || stats.response_time < 0) {
    errors.push('Tempo de resposta deve ser um número não negativo');

  }

  // Validar uptime
  if (typeof stats.uptime !== 'number' || stats.uptime < 0 || stats.uptime > 100) {
    errors.push('Uptime deve ser um número entre 0 e 100');

  }

  // Validar última atualização
  if (!stats.last_updated || typeof stats.last_updated !== 'string') {
    errors.push('Última atualização é obrigatória e deve ser uma string');

  }

  // Validar se é uma data válida
  if (stats.last_updated && isNaN(new Date(stats.last_updated).getTime())) {
    errors.push('Última atualização deve ser uma data válida');

  }

  return {
    isValid: errors.length === 0,
    errors};
};

/**
 * Valida filtros do AuraCore
 */
export const validateAuraFilters = (filters: unknown): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const f = filters as { status?: string; module_type?: string; date_range?: string; search?: string};

  // Validar status se fornecido
  if (f.status && !['active', 'inactive', 'error', 'loading', 'pending'].includes(f.status)) {
    errors.push('Status do filtro deve ser active, inactive, error, loading ou pending');

  }

  // Validar tipo de módulo se fornecido
  if (f.module_type && !['connections', 'flows', 'chats', 'stats'].includes(f.module_type)) {
    errors.push('Tipo de módulo do filtro deve ser connections, flows, chats ou stats');

  }

  // Validar intervalo de data se fornecido
  if (f.date_range && typeof f.date_range !== 'string') {
    errors.push('Intervalo de data do filtro deve ser uma string');

  }

  // Validar busca se fornecida
  if (f.search && typeof f.search !== 'string') {
    errors.push('Busca do filtro deve ser uma string');

  }

  return {
    isValid: errors.length === 0,
    errors};
};

/**
 * Valida resposta da API
 */
export const validateApiResponse = (response: Record<string, any>): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Validar sucesso
  if (typeof (response as any).success !== 'boolean') {
    errors.push('Campo success da resposta deve ser um boolean');

  }

  // Validar dados se sucesso for true
  if (response.success && (response as any).data === undefined) {
    errors.push('Campo data é obrigatório quando success é true');

  }

  // Validar erro se sucesso for false
  if (!response.success && !response.error) {
    errors.push('Campo error é obrigatório quando success é false');

  }

  // Validar mensagem se fornecida
  if (response.message && typeof (response as any).message !== 'string') {
    errors.push('Campo message deve ser uma string');

  }

  return {
    isValid: errors.length === 0,
    errors};
};
