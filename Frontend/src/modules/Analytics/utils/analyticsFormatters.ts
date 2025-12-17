/**
 * Formatadores de Analytics
 *
 * @description
 * Fun??es de formata??o de dados de analytics para exibi??o.
 * Inclui formata??o de dados completos, n?meros e datas.
 *
 * @module modules/Analytics/utils/analyticsFormatters
 * @since 1.0.0
 */

/**
 * Formata dados de analytics para exibi??o
 * @description
 * Formata dados completos de analytics incluindo valores num?ricos e timestamps.
 *
 * @param {Record<string, any>} data - Dados de analytics a formatar
 * @returns {object} Dados formatados com formattedValue e formattedDate
 *
 * @example
 * ```typescript
 * const formatted = formatAnalyticsData({
 *   value: 1234,
 *   timestamp: '2024-01-01T00:00:00Z'
 * });

 * // { value: 1234, timestamp: '...', formattedValue: '1.2K', formattedDate: '01/01/2024' }
 * ```
 */
export const formatAnalyticsData = (data: Record<string, any>) => {
  return {
    ...data,
    formattedValue: formatNumber(data.value as number),
    formattedDate: formatDate(data.timestamp as string)};
};

/**
 * Formata n?mero para exibi??o compacta
 * @description
 * Formata n?meros grandes para exibi??o compacta (ex: 1.2M, 1.5K).
 *
 * @param {number} num - N?mero a formatar
 * @returns {string} N?mero formatado
 *
 * @example
 * ```typescript
 * formatNumber(1234567); // "1.2M"
 * formatNumber(1500); // "1.5K"
 * formatNumber(500); // "500"
 * ```
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();};

/**
 * Formata data para exibi??o
 * @description
 * Formata data para formato brasileiro (dd/mm/aaaa).
 *
 * @param {string | Date} date - Data a formatar (string ISO ou objeto Date)
 * @returns {string} Data formatada em pt-BR
 *
 * @example
 * ```typescript
 * formatDate('2024-01-01T00:00:00Z'); // "01/01/2024"
 * formatDate(new Date()); // "15/12/2024"
 * ```
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));};
