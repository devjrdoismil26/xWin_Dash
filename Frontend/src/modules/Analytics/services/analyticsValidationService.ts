/**
 * Service de Valida??o de Analytics
 * @module modules/Analytics/services/analyticsValidationService
 * @description
 * Service respons?vel por validar dados de analytics, incluindo per?odos,
 * intervalos de datas, tipos de m?tricas e dados de relat?rios.
 * @since 1.0.0
 */

/**
 * Classe AnalyticsValidationService - Service de Valida??o de Analytics
 * @class
 * @description
 * Service respons?vel por validar dados de analytics, incluindo per?odos,
 * intervalos de datas, tipos de m?tricas e dados de relat?rios.
 *
 * @example
 * ```typescript
 * import analyticsValidationService from '@/modules/Analytics/services/analyticsValidationService';
 *
 * // Validar per?odo
 * const isValid = analyticsValidationService.validatePeriod('7d');

 *
 * // Validar intervalo de datas
 * const isValidRange = analyticsValidationService.validateDateRange('2024-01-01', '2024-01-31');

 * ```
 */
class AnalyticsValidationService {
  /**
   * Validar per?odo de analytics
   * @description
   * Verifica se o per?odo fornecido ? v?lido.
   *
   * @param {string} period - Per?odo a validar (ex: '1d', '7d', '30d', '90d', '1y')
   * @returns {boolean} Se o per?odo ? v?lido
   *
   * @example
   * ```typescript
   * analyticsValidationService.validatePeriod('7d'); // true
   * analyticsValidationService.validatePeriod('invalid'); // false
   * ```
   */
  validatePeriod(period: string): boolean {
    const validPeriods = ['1d', '7d', '30d', '90d', '1y'];
    return validPeriods.includes(period);

  }

  /**
   * Validar intervalo de datas
   * @description
   * Verifica se o intervalo de datas ? v?lido (data inicial <= data final <= hoje).
   *
   * @param {string} startDate - Data inicial (ISO 8601)
   * @param {string} endDate - Data final (ISO 8601)
   * @returns {boolean} Se o intervalo de datas ? v?lido
   *
   * @example
   * ```typescript
   * analyticsValidationService.validateDateRange('2024-01-01', '2024-01-31'); // true
   * analyticsValidationService.validateDateRange('2024-01-31', '2024-01-01'); // false
   * ```
   */
  validateDateRange(startDate: string, endDate: string): boolean {
    const start = new Date(startDate);

    const end = new Date(endDate);

    return start <= end && start <= new Date();

  }

  /**
   * Validar tipo de m?trica
   * @description
   * Verifica se o tipo de m?trica fornecido ? v?lido.
   *
   * @param {string} type - Tipo de m?trica a validar (ex: 'views', 'users', 'sessions', 'conversion')
   * @returns {boolean} Se o tipo de m?trica ? v?lido
   *
   * @example
   * ```typescript
   * analyticsValidationService.validateMetricType('views'); // true
   * analyticsValidationService.validateMetricType('invalid'); // false
   * ```
   */
  validateMetricType(type: string): boolean {
    const validTypes = ['views', 'users', 'sessions', 'conversion'];
    return validTypes.includes(type);

  }

  /**
   * Validar dados de relat?rio
   * @description
   * Verifica se os dados de relat?rio s?o v?lidos (objeto com id e name).
   *
   * @param {Record<string, any>} data - Dados do relat?rio a validar
   * @returns {boolean} Se os dados do relat?rio s?o v?lidos
   *
   * @example
   * ```typescript
   * analyticsValidationService.validateReportData({ id: '1', name: 'Report' }); // true
   * analyticsValidationService.validateReportData({ id: '1' }); // false
   * ```
   */
  validateReportData(data: Record<string, any>): boolean {
    return data && typeof data === 'object' && 'id' in data && 'name' in data;
  } const instance = new AnalyticsValidationService();

export const analyticsValidationService = instance;
export default instance;