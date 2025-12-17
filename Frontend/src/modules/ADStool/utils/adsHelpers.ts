/**
 * Helpers do ADStool
 *
 * @description
 * Funções auxiliares para o módulo ADStool incluindo cálculos de métricas
 * de anúncios: CTR, CPC, CPA, ROI, ROAS, taxa de conversão e outras métricas.
 *
 * @module modules/ADStool/utils/adsHelpers
 * @since 1.0.0
 */

/**
 * Calcula CTR (Click-Through Rate)
 *
 * @description
 * Calcula a taxa de cliques através de impressões.
 *
 * @param {number} clicks - Número de cliques
 * @param {number} impressions - Número de impressões
 * @returns {number} CTR em percentual
 */
export const calculateCTR = (clicks: number, impressions: number): number => {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;};

/**
 * Calcula CPC (Cost Per Click)
 */
export const calculateCPC = (spend: number, clicks: number): number => {
  if (clicks === 0) return 0;
  return spend / clicks;};

/**
 * Calcula CPA (Cost Per Acquisition)
 */
export const calculateCPA = (spend: number, conversions: number): number => {
  if (conversions === 0) return 0;
  return spend / conversions;};

/**
 * Calcula ROI (Return on Investment)
 */
export const calculateROI = (revenue: number, spend: number): number => {
  if (spend === 0) return 0;
  return ((revenue - spend) / spend) * 100;};

/**
 * Calcula ROAS (Return on Ad Spend)
 */
export const calculateROAS = (revenue: number, spend: number): number => {
  if (spend === 0) return 0;
  return revenue / spend;};

/**
 * Calcula conversão rate
 */
export const calculateConversionRate = (conversions: number, clicks: number): number => {
  if (clicks === 0) return 0;
  return (conversions / clicks) * 100;};

/**
 * Gera ID único
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: string[]) => any>(
  func: T,
  wait: number
)?: (e: any) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => func(...args), wait);};
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: string[]) => any>(
  func: T,
  limit: number
)?: (e: any) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);

      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);

    } ;
};

/**
 * Converte string para slug
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');};

/**
 * Capitaliza primeira letra
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);};

/**
 * Trunca texto
 */
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substr(0, length) + '...';};

/**
 * Verifica se é um email válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);};

/**
 * Verifica se é uma URL válida
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);

    return true;
  } catch {
    return false;
  } ;

/**
 * Converte bytes para formato legível
 */
export const bytesToSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];};

/**
 * Gera cor baseada em string
 */
export const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);

  }
  
  const color = Math.abs(hash).toString(16).substring(0, 6);

  return '#' + '000000'.substring(0, 6 - color.length) + color;};

/**
 * Ordena array por propriedade
 */
export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a: unknown, b: unknown) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });};

/**
 * Filtra array por propriedade
 */
export const filterBy = <T>(array: T[], key: keyof T, value: unknown): T[] => {
  return array.filter(item => item[key] === value);};

/**
 * Agrupa array por propriedade
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups: unknown, item: unknown) => {
    const group = String(item[key]);

    groups[group] = groups[group] || [];
    groups[group].push(item);

    return groups;
  }, {} as Record<string, T[]>);};

/**
 * Remove duplicatas de array
 */
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];};

/**
 * Calcula diferença entre datas em dias
 */
export const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));};

/**
 * Adiciona dias a uma data
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;};

/**
 * Verifica se data está no passado
 */
export const isPastDate = (date: Date): boolean => {
  return date < new Date();};

/**
 * Verifica se data está no futuro
 */
export const isFutureDate = (date: Date): boolean => {
  return date > new Date();};
