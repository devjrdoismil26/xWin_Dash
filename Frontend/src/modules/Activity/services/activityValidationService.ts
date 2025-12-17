/**
 * Serviço de Validação para o módulo Activity
 * Responsável por validar dados e filtros
 */

import { ActivityFilters } from '../types';
import { EXPORT_FORMATS, PAGINATION_LIMITS } from '../types/activityEnums';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  error?: string; }

class ActivityValidationService {
  /**
   * Valida filtros de atividade
   */
  validateFilters(filters: ActivityFilters): ValidationResult {
    const errors: string[] = [];

    // Validar search
    if (filters.search !== undefined && filters.search !== null) {
      if (typeof filters.search !== 'string') {
        errors.push('Search deve ser uma string');

      } else if (filters.search.length > 255) {
        errors.push('Search não pode ter mais de 255 caracteres');

      } // Validar type
    if (filters.type !== undefined && filters.type !== null) {
      const validTypes = ['all', 'login', 'create', 'update', 'delete', 'email', 'security', 'api', 'error'];
      if (!validTypes.includes(filters.type)) {
        errors.push(`Type deve ser um dos valores: ${validTypes.join(', ')}`);

      } // Validar user
    if (filters.user !== undefined && filters.user !== null) {
      const validUsers = ['all', 'admin', 'user', 'system'];
      if (!validUsers.includes(filters.user)) {
        errors.push(`User deve ser um dos valores: ${validUsers.join(', ')}`);

      } // Validar date
    if (filters.date !== undefined && filters.date !== null) {
      const validDates = ['all', 'today', 'yesterday', 'week', 'month'];
      if (!validDates.includes(filters.date)) {
        errors.push(`Date deve ser um dos valores: ${validDates.join(', ')}`);

      } // Validar page
    if (filters.page !== undefined && filters.page !== null) {
      if (!Number.isInteger(filters.page) || filters.page < 1) {
        errors.push('Page deve ser um número inteiro maior que 0');

      } // Validar per_page
    if (filters.per_page !== undefined && filters.per_page !== null) {
      if (!Number.isInteger(filters.per_page)) {
        errors.push('Per_page deve ser um número inteiro');

      } else if (filters.per_page < PAGINATION_LIMITS.MIN_PER_PAGE || filters.per_page > PAGINATION_LIMITS.MAX_PER_PAGE) {
        errors.push(`Per_page deve estar entre ${PAGINATION_LIMITS.MIN_PER_PAGE} e ${PAGINATION_LIMITS.MAX_PER_PAGE}`);

      } return {
      isValid: errors.length === 0,
      errors};

  }

  /**
   * Valida ID de usuário
   */
  validateUserId(userId: string): boolean {
    if (!userId || typeof userId !== 'string') {
      return false;
    }

    // UUID v4 format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(userId);

  }

  /**
   * Valida ID de log
   */
  validateLogId(logId: string): boolean {
    if (!logId || typeof logId !== 'string') {
      return false;
    }

    // UUID v4 format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(logId);

  }

  /**
   * Valida tipo de log
   */
  validateLogType(type: string): boolean {
    if (!type || typeof type !== 'string') {
      return false;
    }

    const validTypes = ['login', 'logout', 'create', 'update', 'delete', 'email', 'security', 'settings', 'api', 'error', 'activity'];
    return validTypes.includes(type);

  }

  /**
   * Valida query de busca
   */
  validateSearchQuery(query: string): ValidationResult {
    if (!query || typeof query !== 'string') {
      return {
        isValid: false,
        error: 'Query de busca é obrigatória'};

    }

    if (query.trim().length === 0) {
      return {
        isValid: false,
        error: 'Query de busca não pode estar vazia'};

    }

    if (query.length > 255) {
      return {
        isValid: false,
        error: 'Query de busca não pode ter mais de 255 caracteres'};

    }

    // Verificar caracteres perigosos
    const dangerousChars = /[<>'"&]/;
    if (dangerousChars.test(query)) {
      return {
        isValid: false,
        error: 'Query de busca contém caracteres inválidos'};

    }

    return {
      isValid: true,
      errors: []};

  }

  /**
   * Valida formato de exportação
   */
  validateExportFormat(format: string): boolean {
    if (!format || typeof format !== 'string') {
      return false;
    }

    type ExportFormat = 'csv' | 'json' | 'pdf' | 'xlsx';
    return (EXPORT_FORMATS as readonly string[]).includes(format as ExportFormat);

  }

  /**
   * Valida período de limpeza
   */
  validateCleanupPeriod(daysToKeep: number): ValidationResult {
    if (!Number.isInteger(daysToKeep)) {
      return {
        isValid: false,
        error: 'Período de limpeza deve ser um número inteiro'};

    }

    if (daysToKeep < 1) {
      return {
        isValid: false,
        error: 'Período de limpeza deve ser pelo menos 1 dia'};

    }

    if (daysToKeep > 365) {
      return {
        isValid: false,
        error: 'Período de limpeza não pode ser maior que 365 dias'};

    }

    return {
      isValid: true,
      errors: []};

  }

  /**
   * Valida array de IDs
   */
  validateIds(ids: string[]): ValidationResult {
    if (!Array.isArray(ids)) {
      return {
        isValid: false,
        error: 'IDs devem ser um array'};

    }

    if (ids.length === 0) {
      return {
        isValid: false,
        error: 'Array de IDs não pode estar vazio'};

    }

    if (ids.length > 100) {
      return {
        isValid: false,
        error: 'Não é possível processar mais de 100 IDs por vez'};

    }

    const errors: string[] = [];
    ids.forEach((id: unknown, index: unknown) => {
      if (!this.validateLogId(id)) {
        errors.push(`ID inválido no índice ${index}: ${id}`);

      } );

    return {
      isValid: errors.length === 0,
      errors};

  }

  /**
   * Valida range de datas
   */
  validateDateRange(startDate: string, endDate: string): ValidationResult {
    if (!startDate || !endDate) {
      return {
        isValid: false,
        error: 'Data de início e fim são obrigatórias'};

    }

    const start = new Date(startDate);

    const end = new Date(endDate);

    if (isNaN(start.getTime())) {
      return {
        isValid: false,
        error: 'Data de início inválida'};

    }

    if (isNaN(end.getTime())) {
      return {
        isValid: false,
        error: 'Data de fim inválida'};

    }

    if (start > end) {
      return {
        isValid: false,
        error: 'Data de início não pode ser maior que data de fim'};

    }

    // Verificar se o range não é muito grande (máximo 1 ano)
    const diffInDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    if (diffInDays > 365) {
      return {
        isValid: false,
        error: 'Range de datas não pode ser maior que 365 dias'};

    }

    return {
      isValid: true,
      errors: []};

  }

  /**
   * Valida propriedades de log
   */
  validateLogProperties(properties: Record<string, any>): ValidationResult {
    if (!properties || typeof properties !== 'object') {
      return {
        isValid: false,
        error: 'Propriedades devem ser um objeto'};

    }

    const errors: string[] = [];
    const keys = Object.keys(properties);

    if (keys.length > 50) {
      errors.push('Propriedades não podem ter mais de 50 chaves');

    }

    keys.forEach(key => {
      if (typeof key !== 'string' || key.length > 100) {
        errors.push(`Chave de propriedade inválida: ${key}`);

      }

      const value = properties[key];
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        errors.push(`Valor de propriedade não pode ser um objeto: ${key}`);

      }

      if (typeof value === 'string' && value.length > 1000) {
        errors.push(`Valor de propriedade muito longo: ${key}`);

      } );

    return {
      isValid: errors.length === 0,
      errors};

  }

  /**
   * Sanitiza query de busca
   */
  sanitizeSearchQuery(query: string): string {
    if (!query || typeof query !== 'string') {
      return '';
    }

    return query
      .trim()
      .replace(/[<>'"&]/g, '') // Remove caracteres perigosos
      .substring(0, 255); // Limita tamanho
  }

  /**
   * Sanitiza filtros
   */
  sanitizeFilters(filters: ActivityFilters): ActivityFilters {
    const sanitized: ActivityFilters = {};

    if (filters.search) {
      sanitized.search = this.sanitizeSearchQuery(filters.search);

    }

    if (filters.type) {
      const validTypes = ['all', 'login', 'create', 'update', 'delete', 'email', 'security', 'api', 'error'];
      sanitized.type = validTypes.includes(filters.type) ? filters.type : 'all';
    }

    if (filters.user) {
      const validUsers = ['all', 'admin', 'user', 'system'];
      sanitized.user = validUsers.includes(filters.user) ? filters.user : 'all';
    }

    if (filters.date) {
      const validDates = ['all', 'today', 'yesterday', 'week', 'month'];
      sanitized.date = validDates.includes(filters.date) ? filters.date : 'all';
    }

    if (filters.page && Number.isInteger(filters.page) && filters.page > 0) {
      sanitized.page = filters.page;
    }

    if (filters.per_page && Number.isInteger(filters.per_page)) {
      sanitized.per_page = Math.max(
        PAGINATION_LIMITS.MIN_PER_PAGE,
        Math.min(PAGINATION_LIMITS.MAX_PER_PAGE, filters.per_page));

    }

    return sanitized;
  } export const activityValidationService = new ActivityValidationService();

export default activityValidationService;
