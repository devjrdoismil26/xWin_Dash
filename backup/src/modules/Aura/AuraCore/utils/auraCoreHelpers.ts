/**
 * Funções auxiliares para o módulo AuraCore
 */

import { AuraStats, AuraModule, AuraQuickAction, AuraNotification } from '../types';

/**
 * Formata estatísticas para exibição
 */
export const formatAuraStats = (stats: AuraStats) => {
  return {
    total_connections: new Intl.NumberFormat('pt-BR').format(stats.total_connections),
    active_flows: new Intl.NumberFormat('pt-BR').format(stats.active_flows),
    messages_sent: new Intl.NumberFormat('pt-BR').format(stats.messages_sent),
    response_time: `${new Intl.NumberFormat('pt-BR').format(stats.response_time)}ms`,
    uptime: `${stats.uptime.toFixed(1)}%`
  };
};

/**
 * Formata módulo para exibição
 */
export const formatAuraModule = (module: AuraModule) => {
  const statusLabels: Record<string, string> = {
    'active': 'Ativo',
    'inactive': 'Inativo',
    'error': 'Erro',
    'loading': 'Carregando',
    'pending': 'Pendente'
  };

  const statusColors: Record<string, string> = {
    'active': 'green',
    'inactive': 'gray',
    'error': 'red',
    'loading': 'blue',
    'pending': 'yellow'
  };

  return {
    ...module,
    status_label: statusLabels[module.status] || module.status,
    status_color: statusColors[module.status] || 'gray',
    count_formatted: new Intl.NumberFormat('pt-BR').format(module.count),
    last_activity_formatted: module.last_activity 
      ? new Date(module.last_activity).toLocaleString('pt-BR')
      : 'Nunca'
  };
};

/**
 * Formata ação rápida para exibição
 */
export const formatAuraQuickAction = (action: AuraQuickAction) => {
  const typeLabels: Record<string, string> = {
    'create_connection': 'Criar Conexão',
    'create_flow': 'Criar Fluxo',
    'send_message': 'Enviar Mensagem',
    'view_stats': 'Ver Estatísticas'
  };

  return {
    ...action,
    type_label: typeLabels[action.type] || action.type,
    enabled_label: action.enabled ? 'Habilitado' : 'Desabilitado'
  };
};

/**
 * Formata notificação para exibição
 */
export const formatAuraNotification = (notification: AuraNotification) => {
  const typeLabels: Record<string, string> = {
    'success': 'Sucesso',
    'error': 'Erro',
    'warning': 'Aviso',
    'info': 'Informação'
  };

  const typeColors: Record<string, string> = {
    'success': 'green',
    'error': 'red',
    'warning': 'yellow',
    'info': 'blue'
  };

  return {
    ...notification,
    type_label: typeLabels[notification.type] || notification.type,
    type_color: typeColors[notification.type] || 'gray',
    timestamp_formatted: new Date(notification.timestamp).toLocaleString('pt-BR'),
    read_label: notification.read ? 'Lida' : 'Não lida'
  };
};

/**
 * Calcula estatísticas de resumo
 */
export const calculateStatsSummary = (stats: AuraStats) => {
  return {
    total_connections: stats.total_connections,
    active_flows: stats.active_flows,
    messages_sent: stats.messages_sent,
    response_time: stats.response_time,
    uptime: stats.uptime,
    health_score: calculateHealthScore(stats),
    performance_score: calculatePerformanceScore(stats)
  };
};

/**
 * Calcula score de saúde do sistema
 */
export const calculateHealthScore = (stats: AuraStats): number => {
  const uptimeScore = Math.min(stats.uptime, 100);
  const responseTimeScore = Math.max(0, 100 - (stats.response_time / 100));
  
  return Math.round((uptimeScore + responseTimeScore) / 2);
};

/**
 * Calcula score de performance
 */
export const calculatePerformanceScore = (stats: AuraStats): number => {
  const uptimeScore = Math.min(stats.uptime, 100);
  const responseTimeScore = Math.max(0, 100 - (stats.response_time / 100));
  const activityScore = Math.min((stats.messages_sent / 1000) * 100, 100);
  
  return Math.round((uptimeScore + responseTimeScore + activityScore) / 3);
};

/**
 * Filtra módulos por status
 */
export const filterModulesByStatus = (modules: AuraModule[], status: string) => {
  return modules.filter(module => module.status === status);
};

/**
 * Filtra ações rápidas por tipo
 */
export const filterQuickActionsByType = (actions: AuraQuickAction[], type: string) => {
  return actions.filter(action => action.type === type);
};

/**
 * Filtra notificações por tipo
 */
export const filterNotificationsByType = (notifications: AuraNotification[], type: string) => {
  return notifications.filter(notification => notification.type === type);
};

/**
 * Obtém notificações não lidas
 */
export const getUnreadNotifications = (notifications: AuraNotification[]) => {
  return notifications.filter(notification => !notification.read);
};

/**
 * Ordena módulos por atividade
 */
export const sortModulesByActivity = (modules: AuraModule[]) => {
  return modules.sort((a, b) => {
    if (!a.last_activity && !b.last_activity) return 0;
    if (!a.last_activity) return 1;
    if (!b.last_activity) return -1;
    return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime();
  });
};

/**
 * Ordena notificações por timestamp
 */
export const sortNotificationsByTimestamp = (notifications: AuraNotification[]) => {
  return notifications.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

/**
 * Gera ID único
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Valida se um valor é um número válido
 */
export const isValidNumber = (value: any): boolean => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

/**
 * Arredonda número para um número específico de casas decimais
 */
export const roundTo = (value: number, decimals: number = 2): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Calcula média de um array de números
 */
export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};

/**
 * Calcula mediana de um array de números
 */
export const calculateMedian = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
};

/**
 * Calcula desvio padrão de um array de números
 */
export const calculateStandardDeviation = (values: number[]): number => {
  if (values.length === 0) return 0;
  const mean = calculateAverage(values);
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  const avgSquaredDiff = calculateAverage(squaredDiffs);
  return Math.sqrt(avgSquaredDiff);
};

/**
 * Converte string para slug
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Capitaliza primeira letra
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Converte bytes para formato legível
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Formata tempo em segundos para formato legível
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

/**
 * Formata data para exibição
 */
export const formatDate = (date: string | Date, options?: {
  includeTime?: boolean;
  relative?: boolean;
}): string => {
  const { includeTime = false, relative = false } = options || {};
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (relative) {
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} dia${days > 1 ? 's' : ''} atrás`;
    } else if (hours > 0) {
      return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    } else if (minutes > 0) {
      return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
    } else {
      return 'Agora mesmo';
    }
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  if (includeTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
  }

  return new Intl.DateTimeFormat('pt-BR', formatOptions).format(dateObj);
};
