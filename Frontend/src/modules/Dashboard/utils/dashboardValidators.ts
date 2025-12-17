/**
 * Validadores do módulo Dashboard
 *
 * @description
 * Funções de validação para o módulo Dashboard incluindo validação
 * de métricas, widgets, filtros e configurações.
 *
 * @module modules/Dashboard/utils/dashboardValidators
 * @since 1.0.0
 */

import { DashboardMetrics, DashboardWidget, DashboardFilters, DashboardSettings } from '../types/dashboardTypes';

/**
 * Valida métricas do dashboard
 *
 * @description
 * Valida métricas do dashboard verificando tipos e limites.
 *
 * @param {Partial<DashboardMetrics>} metrics - Métricas a validar
 * @returns {Object} Resultado da validação com errors
 */
export const validateDashboardMetrics = (metrics: Partial<DashboardMetrics>): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (typeof metrics.total_leads !== 'number' || metrics.total_leads < 0) {
    errors.push('Total de leads deve ser um número não negativo');

  }

  if (typeof metrics.total_users !== 'number' || metrics.total_users < 0) {
    errors.push('Total de usuários deve ser um número não negativo');

  }

  if (typeof metrics.total_projects !== 'number' || metrics.total_projects < 0) {
    errors.push('Total de projetos deve ser um número não negativo');

  }

  if (typeof metrics.active_projects !== 'number' || metrics.active_projects < 0) {
    errors.push('Projetos ativos deve ser um número não negativo');

  }

  if (typeof metrics.conversion_rate !== 'number' || metrics.conversion_rate < 0 || metrics.conversion_rate > 100) {
    errors.push('Taxa de conversão deve estar entre 0 e 100');

  }

  return {
    isValid: errors.length === 0,
    errors};
};

/**
 * Valida configuração de widget
 */
export const validateWidget = (widget: Partial<DashboardWidget>): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!widget.id || typeof widget.id !== 'string') {
    errors.push('ID do widget é obrigatório');

  }

  if (!widget.type || typeof widget.type !== 'string') {
    errors.push('Tipo do widget é obrigatório');

  }

  if (!widget.title || typeof widget.title !== 'string') {
    errors.push('Título do widget é obrigatório');

  }

  if (widget.position && (
    typeof widget.position.x !== 'number' ||
    typeof widget.position.y !== 'number' ||
    widget.position.x < 0 ||
    widget.position.y < 0
  )) {
    errors.push('Posição do widget deve ter coordenadas válidas');

  }

  if (widget.size && (
    typeof widget.size.width !== 'number' ||
    typeof widget.size.height !== 'number' ||
    widget.size.width <= 0 ||
    widget.size.height <= 0
  )) {
    errors.push('Tamanho do widget deve ter dimensões válidas');

  }

  return {
    isValid: errors.length === 0,
    errors};
};

/**
 * Valida filtros do dashboard
 */
export const validateDashboardFilters = (filters: Partial<DashboardFilters>): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (filters.date_range && !isValidDateRange(filters.date_range)) {
    errors.push('Período de data inválido');

  }

  if (filters.project_id && typeof filters.project_id !== 'string') {
    errors.push('ID do projeto deve ser uma string');

  }

  if (filters.user_id && typeof filters.user_id !== 'string') {
    errors.push('ID do usuário deve ser uma string');

  }

  return {
    isValid: errors.length === 0,
    errors};
};

/**
 * Valida configurações do dashboard
 */
export const validateDashboardSettings = (settings: Partial<DashboardSettings>): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (settings.theme && !['light', 'dark', 'auto'].includes(settings.theme)) {
    errors.push('Tema deve ser light, dark ou auto');

  }

  if (settings.layout && !['grid', 'list', 'compact'].includes(settings.layout)) {
    errors.push('Layout deve ser grid, list ou compact');

  }

  if (typeof settings.auto_refresh === 'boolean' && settings.refresh_interval) {
    if (typeof settings.refresh_interval !== 'number' || settings.refresh_interval < 1000) {
      errors.push('Intervalo de atualização deve ser pelo menos 1000ms');

    } return {
    isValid: errors.length === 0,
    errors};
};

/**
 * Valida se o período de data é válido
 */
export const isValidDateRange = (dateRange: string): boolean => {
  const validRanges = ['today', 'yesterday', '7days', '30days', '90days', '365days'];
  return validRanges.includes(dateRange);};

/**
 * Valida se um ID é válido
 */
export const isValidId = (id: string): boolean => {
  return typeof id === 'string' && id.length > 0;};

/**
 * Valida se um email é válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);};

/**
 * Valida se um número é positivo
 */
export const isPositiveNumber = (value: number): boolean => {
  return typeof value === 'number' && value >= 0;};

/**
 * Valida se um número está em um range
 */
export const isNumberInRange = (value: number, min: number, max: number): boolean => {
  return typeof value === 'number' && value >= min && value <= max;};
