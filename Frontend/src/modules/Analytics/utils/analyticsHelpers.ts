/**
 * Helpers de Analytics
 *
 * @description
 * Fun??es utilit?rias para formata??o de dados de analytics.
 * Inclui formata??o de n?meros, porcentagens, moeda, datas e c?lculos de taxa de crescimento.
 *
 * @module modules/Analytics/utils/analyticsHelpers
 * @since 1.0.0
 */

/**
 * Formata n?mero para exibi??o
 *
 * @description
 * Formata n?meros grandes usando sufixos K (milhares) e M (milh?es).
 *
 * @param {number} num - N?mero a formatar
 * @returns {string} N?mero formatado
 * @example
 * formatNumber(1500) // "1.5K"
 * formatNumber(2000000) // "2.0M"
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();};

export const formatPercentage = (num: number): string => {
  return num.toFixed(1) + '%';};

export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(num);};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));};

export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;};
