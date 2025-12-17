/**
 * Validadores de Analytics
 *
 * @description
 * Fun??es de valida??o para dados de analytics incluindo per?odos,
 * intervalos de datas, tipos de m?tricas e dados de relat?rios.
 *
 * @module modules/Analytics/utils/analyticsValidators
 * @since 1.0.0
 */

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
 * validatePeriod('7d'); // true
 * validatePeriod('invalid'); // false
 * ```
 */
export const validatePeriod = (period: string): boolean => {
  const validPeriods = ['1d', '7d', '30d', '90d', '1y'];
  return validPeriods.includes(period);};

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
 * validateDateRange('2024-01-01', '2024-01-31'); // true
 * validateDateRange('2024-01-31', '2024-01-01'); // false
 * ```
 */
export const validateDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);

  const end = new Date(endDate);

  return start <= end && start <= new Date();};

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
 * validateMetricType('views'); // true
 * validateMetricType('invalid'); // false
 * ```
 */
export const validateMetricType = (type: string): boolean => {
  const validTypes = ['views', 'users', 'sessions', 'conversion'];
  return validTypes.includes(type);};

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
 * validateReportData({ id: '1', name: 'Report' }); // true
 * validateReportData({ id: '1' }); // false
 * ```
 */
export const validateReportData = (data: Record<string, any>): boolean => {
  return data && typeof data === 'object' && 'id' in data && 'name' in data;};
