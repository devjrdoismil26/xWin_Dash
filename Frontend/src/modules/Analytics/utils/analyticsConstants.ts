/**
 * Constantes de Analytics
 *
 * @description
 * Constantes e enums para o m?dulo Analytics incluindo per?odos,
 * m?tricas, cores e tipos de gr?ficos.
 *
 * @module modules/Analytics/utils/analyticsConstants
 * @since 1.0.0
 */

/**
 * Per?odos de analytics dispon?veis
 *
 * @constant ANALYTICS_PERIODS
 * @description
 * Per?odos pr?-definidos para an?lises de analytics.
 * @property {string} DAY - Per?odo de 1 dia
 * @property {string} WEEK - Per?odo de 7 dias
 * @property {string} MONTH - Per?odo de 30 dias
 * @property {string} QUARTER - Per?odo de 90 dias
 * @property {string} YEAR - Per?odo de 1 ano
 */
export const ANALYTICS_PERIODS: unknown = {
  DAY: '1d',
  WEEK: '7d',
  MONTH: '30d',
  QUARTER: '90d',
  YEAR: '1y'
} as const;

/**
 * M?tricas de analytics dispon?veis
 *
 * @constant ANALYTICS_METRICS
 * @description
 * Tipos de m?tricas dispon?veis para an?lise.
 * @property {string} VIEWS - Visualiza??es
 * @property {string} USERS - Usu?rios
 * @property {string} SESSIONS - Sess?es
 * @property {string} CONVERSION - Convers?es
 */
export const ANALYTICS_METRICS: unknown = {
  VIEWS: 'views',
  USERS: 'users',
  SESSIONS: 'sessions',
  CONVERSION: 'conversion'
} as const;

/**
 * Cores padr?o para analytics
 *
 * @constant ANALYTICS_COLORS
 * @description
 * Cores pr?-definidas para uso em gr?ficos e visualiza??es de analytics.
 * @property {string} PRIMARY - Cor prim?ria (azul)
 * @property {string} SUCCESS - Cor de sucesso (verde)
 * @property {string} WARNING - Cor de aviso (laranja)
 * @property {string} ERROR - Cor de erro (vermelho)
 * @property {string} INFO - Cor de informa??o (cinza)
 */
export const ANALYTICS_COLORS: unknown = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#6B7280'
} as const;

/**
 * Tipos de gr?ficos dispon?veis
 *
 * @constant ANALYTICS_CHART_TYPES
 * @description
 * Tipos de gr?ficos dispon?veis para visualiza??o de dados de analytics.
 * @property {string} LINE - Gr?fico de linha
 * @property {string} BAR - Gr?fico de barras
 * @property {string} PIE - Gr?fico de pizza
 * @property {string} AREA - Gr?fico de ?rea
 */
export const ANALYTICS_CHART_TYPES: unknown = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  AREA: 'area'
} as const;