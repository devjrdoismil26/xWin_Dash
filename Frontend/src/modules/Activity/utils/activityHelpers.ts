/**
 * Funções auxiliares do módulo Activity
 *
 * @description
 * Centraliza lógica comum e funções utilitárias para o módulo Activity.
 * Inclui helpers para tipos de logs, filtros e transformações.
 *
 * @module modules/Activity/utils/activityHelpers
 * @since 1.0.0
 */

import { ActivityLog, ActivityLogType } from '../types';

/**
 * Obtém o tipo de log baseado no log_name
 */
export const getLogType = (logName: string): ActivityLogType => {
  const typeMap: Record<string, ActivityLogType> = {
    'login': 'login',
    'logout': 'logout',
    'user.created': 'create',
    'user.updated': 'update',
    'user.deleted': 'delete',
    'email.sent': 'email',
    'security.alert': 'security',
    'settings.updated': 'settings',
    'api.request': 'api',
    'error.occurred': 'error',};

  return typeMap[logName] || 'activity';};

/**
 * Obtém logs recentes ordenados por data
 */
export const getRecentLogs = (logs: ActivityLog[], limit: number = 10): ActivityLog[] => {
  return logs
    .sort((a: unknown, b: unknown) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);};

/**
 * Filtra logs por tipo
 */
export const getLogsByType = (logs: ActivityLog[], type: ActivityLogType): ActivityLog[] => {
  return logs.filter(log => getLogType(log.log_name) === type);};

/**
 * Filtra logs por usuário
 */
export const getLogsByUser = (logs: ActivityLog[], userType: string): ActivityLog[] => {
  return logs.filter(log => log.causer_type === userType);};

/**
 * Filtra logs de erro
 */
export const getErrorLogs = (logs: ActivityLog[]): ActivityLog[] => {
  return logs.filter(log => 
    log.log_name && (
      log.log_name.includes('error') || 
      log.log_name.includes('exception') ||
      log.log_name.includes('failed')
    ));};

/**
 * Filtra logs de segurança
 */
export const getSecurityLogs = (logs: ActivityLog[]): ActivityLog[] => {
  return logs.filter(log => 
    log.log_name && (
      log.log_name.includes('security') || 
      log.log_name.includes('login') ||
      log.log_name.includes('logout') ||
      log.log_name.includes('permission')
    ));};

/**
 * Agrupa logs por tipo
 */
export const groupLogsByType = (logs: ActivityLog[]): Record<string, number> => {
  const logsByType: Record<string, number> = {};

  logs.forEach(log => {
    const type = getLogType(log.log_name);

    logsByType[type] = (logsByType[type] || 0) + 1;
  });

  return logsByType;};

/**
 * Agrupa logs por usuário
 */
export const groupLogsByUser = (logs: ActivityLog[]): Record<string, number> => {
  const logsByUser: Record<string, number> = {};

  logs.forEach(log => {
    const user = log.causer_type || 'Sistema';
    logsByUser[user] = (logsByUser[user] || 0) + 1;
  });

  return logsByUser;};

/**
 * Filtra logs por período
 */
export const getLogsByDateRange = (
  logs: ActivityLog[], 
  startDate: string, 
  endDate: string
): ActivityLog[] => {
  const start = new Date(startDate);

  const end = new Date(endDate);

  return logs.filter(log => {
    const logDate = new Date(log.created_at);

    return logDate >= start && logDate <= end;
  });};

/**
 * Busca logs por texto
 */
export const searchLogs = (logs: ActivityLog[], query: string): ActivityLog[] => {
  const searchLower = query.toLowerCase();

  return logs.filter(log => 
    log.description?.toLowerCase().includes(searchLower) ||
    log.log_name?.toLowerCase().includes(searchLower) ||
    log.causer_type?.toLowerCase().includes(searchLower) ||
    log.subject_type?.toLowerCase().includes(searchLower) ||
    (log.properties && JSON.stringify(log.properties).toLowerCase().includes(searchLower)));};

/**
 * Calcula estatísticas básicas dos logs
 */
export const calculateLogStats = (logs: ActivityLog[]) => {
  const total = logs.length;
  const today = new Date().toDateString();

  const todayLogs = logs.filter(log => 
    new Date(log.created_at).toDateString() === today
  ).length;
  
  const errorLogs = getErrorLogs(logs).length;
  const securityLogs = getSecurityLogs(logs).length;
  
  const uniqueUsers = new Set(logs.map(log => log.causer_type).filter(Boolean)).size;
  
  return {
    total,
    today: todayLogs,
    errors: errorLogs,
    security: securityLogs,
    uniqueUsers,
    byType: groupLogsByType(logs),
    byUser: groupLogsByUser(logs)};
};

/**
 * Valida se um log é válido
 */
export const isValidLog = (log: Partial<ActivityLog>): boolean => {
  return !!(
    log.id &&
    log.log_name &&
    log.created_at);};

/**
 * Ordena logs por diferentes critérios
 */
export const sortLogs = (
  logs: ActivityLog[], 
  sortBy: 'date' | 'type' | 'user' = 'date',
  order: 'asc' | 'desc' = 'desc'
): ActivityLog[] => {
  const sorted = [...logs].sort((a: unknown, b: unknown) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();

        break;
      case 'type':
        comparison = a.log_name.localeCompare(b.log_name);

        break;
      case 'user':
        comparison = (a.causer_type || '').localeCompare(b.causer_type || '');

        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;};

/**
 * Pagina logs
 */
export const paginateLogs = (logs: ActivityLog[], 
  page: number = 1, 
  perPage: number = 15
) => {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  
  return {
    data: logs.slice(startIndex, endIndex),
    pagination: {
      current_page: page,
      last_page: Math.ceil(logs.length / perPage),
      per_page: perPage,
      total: logs.length,
      from: startIndex + 1,
      to: Math.min(endIndex, logs.length)
  } ;
};
