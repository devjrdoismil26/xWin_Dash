/**
 * Validadores do módulo Activity
 * Centraliza validações de dados e filtros
 */

import { ActivityFilters, ActivityLog } from '../types';

/**
 * Valida filtros de atividade
 */
export const validateActivityFilters = (filters: Partial<ActivityFilters>): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];

  // Validar datas
  if (filters.date_from && filters.date_to) {
    const startDate = new Date(filters.date_from);
    const endDate = new Date(filters.date_to);
    
    if (startDate > endDate) {
      errors.push('Data de início deve ser anterior à data de fim');
    }
    
    if (startDate > new Date()) {
      errors.push('Data de início não pode ser no futuro');
    }
  }

  // Validar paginação
  if (filters.per_page && (filters.per_page < 1 || filters.per_page > 100)) {
    errors.push('Per page deve estar entre 1 e 100');
  }

  if (filters.page && filters.page < 1) {
    errors.push('Página deve ser maior que 0');
  }

  // Validar busca
  if (filters.search && filters.search.length < 2) {
    errors.push('Termo de busca deve ter pelo menos 2 caracteres');
  }

  if (filters.search && filters.search.length > 100) {
    errors.push('Termo de busca deve ter no máximo 100 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida log de atividade
 */
export const validateActivityLog = (log: Partial<ActivityLog>): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];

  if (!log.id) {
    errors.push('ID é obrigatório');
  }

  if (!log.log_name) {
    errors.push('Nome do log é obrigatório');
  }

  if (!log.created_at) {
    errors.push('Data de criação é obrigatória');
  }

  // Validar formato da data
  if (log.created_at && isNaN(new Date(log.created_at).getTime())) {
    errors.push('Data de criação inválida');
  }

  // Validar propriedades se existirem
  if (log.properties && typeof log.properties !== 'object') {
    errors.push('Propriedades devem ser um objeto');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida formato de exportação
 */
export const validateExportFormat = (format: string): boolean => {
  const validFormats = ['csv', 'json', 'pdf'];
  return validFormats.includes(format.toLowerCase());
};

/**
 * Valida período de limpeza
 */
export const validateCleanupPeriod = (days: number): { 
  isValid: boolean; 
  error?: string 
} => {
  if (days < 1) {
    return { isValid: false, error: 'Período deve ser pelo menos 1 dia' };
  }
  
  if (days > 365) {
    return { isValid: false, error: 'Período não pode ser maior que 365 dias' };
  }
  
  return { isValid: true };
};

/**
 * Valida ID de usuário
 */
export const validateUserId = (userId: string): boolean => {
  return !!userId && userId.length > 0;
};

/**
 * Valida tipo de log
 */
export const validateLogType = (logType: string): boolean => {
  const validTypes = [
    'login', 'logout', 'create', 'update', 'delete', 
    'email', 'security', 'settings', 'api', 'error', 'activity'
  ];
  return validTypes.includes(logType);
};

/**
 * Valida query de busca
 */
export const validateSearchQuery = (query: string): { 
  isValid: boolean; 
  error?: string 
} => {
  if (!query || query.trim().length === 0) {
    return { isValid: false, error: 'Query de busca não pode estar vazia' };
  }
  
  if (query.length < 2) {
    return { isValid: false, error: 'Query deve ter pelo menos 2 caracteres' };
  }
  
  if (query.length > 100) {
    return { isValid: false, error: 'Query deve ter no máximo 100 caracteres' };
  }
  
  // Verificar caracteres especiais perigosos
  const dangerousChars = /[<>'"&]/;
  if (dangerousChars.test(query)) {
    return { isValid: false, error: 'Query contém caracteres inválidos' };
  }
  
  return { isValid: true };
};

/**
 * Valida configurações de tempo real
 */
export const validateRealTimeSettings = (settings: {
  interval?: number;
  maxRetries?: number;
  timeout?: number;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (settings.interval && (settings.interval < 1000 || settings.interval > 60000)) {
    errors.push('Intervalo deve estar entre 1 e 60 segundos');
  }

  if (settings.maxRetries && (settings.maxRetries < 1 || settings.maxRetries > 10)) {
    errors.push('Máximo de tentativas deve estar entre 1 e 10');
  }

  if (settings.timeout && (settings.timeout < 5000 || settings.timeout > 30000)) {
    errors.push('Timeout deve estar entre 5 e 30 segundos');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitiza entrada de usuário
 */
export const sanitizeUserInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>'"&]/g, '') // Remove caracteres perigosos
    .substring(0, 100); // Limita tamanho
};

/**
 * Valida configurações de paginação
 */
export const validatePaginationSettings = (page: number, perPage: number): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];

  if (page < 1) {
    errors.push('Página deve ser maior que 0');
  }

  if (perPage < 1 || perPage > 100) {
    errors.push('Itens por página deve estar entre 1 e 100');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida configurações de cache
 */
export const validateCacheSettings = (ttl: number): { 
  isValid: boolean; 
  error?: string 
} => {
  if (ttl < 0) {
    return { isValid: false, error: 'TTL não pode ser negativo' };
  }
  
  if (ttl > 3600000) { // 1 hora
    return { isValid: false, error: 'TTL não pode ser maior que 1 hora' };
  }
  
  return { isValid: true };
};
