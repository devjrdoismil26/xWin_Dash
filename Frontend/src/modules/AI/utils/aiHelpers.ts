/**
 * Helpers do módulo AI
 *
 * @description
 * Funções auxiliares para o módulo AI incluindo formatação de moeda,
 * números, percentuais, datas e outras utilidades.
 *
 * @module modules/AI/utils/aiHelpers
 * @since 1.0.0
 */

import { AIProvider, AIGenerationType, AIGeneration } from '../types';

/**
 * Formata valor monetário
 *
 * @description
 * Formata valores monetários usando Intl.NumberFormat.
 *
 * @param {number} value - Valor a formatar
 * @param {string} [currency='BRL'] - Código da moeda (opcional, padrão: 'BRL')
 * @returns {string} Valor formatado como moeda
 */
export const formatCurrency = (value: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency
  }).format(value);};

/**
 * Formatar números
 * @description
 * Formata números usando Intl.NumberFormat com locale pt-BR.
 *
 * @param {number} value - Valor numérico a formatar
 * @returns {string} Número formatado
 *
 * @example
 * ```typescript
 * formatNumber(1234.56); // "1.234,56"
 * ```
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);};

/**
 * Formatar percentual
 * @description
 * Formata valores percentuais usando Intl.NumberFormat com locale pt-BR.
 * 
 * @param {number} value - Valor percentual (0-100)
 * @returns {string} Percentual formatado
 * 
 * @example
 * ```typescript
 * formatPercentage(75); // "75,00%"
 * ```
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);};

/**
 * Formatar data
 * @description
 * Formata datas usando Intl.DateTimeFormat com locale pt-BR.
 * 
 * @param {string | Date} date - Data a formatar (string ISO ou objeto Date)
 * @param {Intl.DateTimeFormatOptions} [options] - Opções de formatação (opcional)
 * @returns {string} Data formatada
 * 
 * @example
 * ```typescript
 * formatDate(new Date()); // "19 dez. 2024, 14:30"
 * formatDate('2024-12-19', { year: 'numeric', month: 'long' }); // "dezembro 2024"
 * ```
 */
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }).format(dateObj);};

/**
 * Calcular CTR (Click Through Rate)
 * @description
 * Calcula taxa de cliques (CTR) em percentual.
 *
 * @param {number} clicks - Número de cliques
 * @param {number} impressions - Número de impressões
 * @returns {number} CTR em percentual (0-100)
 *
 * @example
 * ```typescript
 * calculateCTR(50, 1000); // 5
 * ```
 */
export const calculateCTR = (clicks: number, impressions: number): number => {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;};

/**
 * Calcular CPC (Cost Per Click)
 * @description
 * Calcula o custo por clique (CPC) baseado em custo total e número de cliques.
 * 
 * @param {number} cost - Custo total
 * @param {number} clicks - Número de cliques
 * @returns {number} CPC (custo por clique)
 * 
 * @example
 * ```typescript
 * calculateCPC(100, 50); // 2
 * ```
 */
export const calculateCPC = (cost: number, clicks: number): number => {
  if (clicks === 0) return 0;
  return cost / clicks;};

/**
 * Calcular ROI (Return on Investment)
 * @description
 * Calcula retorno sobre investimento (ROI) em percentual.
 *
 * @param {number} revenue - Receita total
 * @param {number} cost - Custo total
 * @returns {number} ROI em percentual
 *
 * @example
 * ```typescript
 * calculateROI(150, 100); // 50
 * ```
 */
export const calculateROI = (revenue: number, cost: number): number => {
  if (cost === 0) return 0;
  return ((revenue - cost) / cost) * 100;};

/**
 * Calcular qualidade média
 * @description
 * Calcula a qualidade média de um array de gerações de IA.
 * 
 * @param {AIGeneration[]} generations - Array de gerações
 * @returns {number} Qualidade média (0-1)
 * 
 * @example
 * ```typescript
 * calculateAverageQuality([{ metadata: { quality: 0.8 } , { metadata: { quality: 0.9 } ]); // 0.85
 * ```
 */
export const calculateAverageQuality = (generations: AIGeneration[]): number => {
  if (generations.length === 0) return 0;
  const totalQuality = generations.reduce((sum: unknown, gen: unknown) => sum + (gen.metadata.quality || 0), 0);

  return totalQuality / generations.length;};

/**
 * Calcular custo total
 * @description
 * Calcula custo total de uma lista de gerações de IA.
 *
 * @param {AIGeneration[]} generations - Lista de gerações de IA
 * @returns {number} Custo total
 *
 * @example
 * ```typescript
 * const total = calculateTotalCost(generations);

 * ```
 */
export const calculateTotalCost = (generations: AIGeneration[]): number => {
  return generations.reduce((sum: unknown, gen: unknown) => sum + (gen.metadata.cost || 0), 0);};

/**
 * Calcular tokens totais
 * @description
 * Calcula total de tokens de uma lista de gerações de IA.
 *
 * @param {AIGeneration[]} generations - Lista de gerações de IA
 * @returns {number} Total de tokens
 *
 * @example
 * ```typescript
 * const tokens = calculateTotalTokens(generations);

 * ```
 */
export const calculateTotalTokens = (generations: AIGeneration[]): number => {
  return generations.reduce((sum: unknown, gen: unknown) => sum + (gen.metadata.tokens || 0), 0);};

/**
 * Obter cor baseada no status
 * @description
 * Retorna classes CSS de cor baseadas no status fornecido.
 * 
 * @param {string} status - Status a verificar
 * @returns {string} Classes CSS de cor (text-{color}-600 bg-{color}-100)
 * 
 * @example
 * ```typescript
 * getStatusColor('active'); // "text-green-600 bg-green-100"
 * getStatusColor('error'); // "text-red-600 bg-red-100"
 * ```
 */
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'success':
      return 'text-green-600 bg-green-100';
    case 'inactive':
    case 'paused':
    case 'warning':
      return 'text-yellow-600 bg-yellow-100';
    case 'error':
    case 'failed':
    case 'danger':
      return 'text-red-600 bg-red-100';
    case 'loading':
    case 'pending':
      return 'text-blue-600 bg-blue-100';
    default:
      return 'text-gray-600 bg-gray-100';
  } ;

/**
 * Obter ícone baseado no tipo de geração
 * @description
 * Retorna emoji de ícone baseado no tipo de geração de IA.
 *
 * @param {AIGenerationType} type - Tipo de geração
 * @returns {string} Emoji do ícone
 *
 * @example
 * ```typescript
 * getGenerationIcon('text'); // "📝"
 * ```
 */
export const getGenerationIcon = (type: AIGenerationType): string => {
  switch (type) {
    case 'text':
      return '📝';
    case 'image':
      return '🖼️';
    case 'video':
      return '🎥';
    case 'audio':
      return '🎵';
    case 'code':
      return '💻';
    default:
      return '🤖';
  } ;

/**
 * Obter ícone baseado no provedor
 * @description
 * Retorna emoji de ícone baseado no provedor de IA.
 * 
 * @param {AIProvider} provider - Provedor de IA
 * @returns {string} Emoji do ícone
 * 
 * @example
 * ```typescript
 * getProviderIcon('openai'); // "🤖"
 * getProviderIcon('gemini'); // "💎"
 * ```
 */
export const getProviderIcon = (provider: AIProvider): string => {
  switch (provider) {
    case 'openai':
      return '🤖';
    case 'claude':
      return '🧠';
    case 'gemini':
      return '💎';
    case 'anthropic':
      return '🔬';
    case 'cohere':
      return '⚡';
    default:
      return '🤖';
  } ;

/**
 * Truncar texto
 * @description
 * Trunca texto para tamanho máximo, adicionando "..." se necessário.
 *
 * @param {string} text - Texto a truncar
 * @param {number} [maxLength=100] - Tamanho máximo (opcional, padrão: 100)
 * @returns {string} Texto truncado
 *
 * @example
 * ```typescript
 * truncateText('Texto muito longo...', 10); // "Texto muit..."
 * ```
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';};

/**
 * Gerar ID único
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);};

/**
 * Validar email
 * @description
 * Valida formato de email usando regex.
 *
 * @param {string} email - Email a validar
 * @returns {boolean} Se o email é válido
 *
 * @example
 * ```typescript
 * isValidEmail('test@example.com'); // true
 * ```
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);};

/**
 * Validar URL
 * @description
 * Valida se uma string é uma URL válida usando o construtor URL.
 * 
 * @param {string} url - URL a validar
 * @returns {boolean} Se a URL é válida
 * 
 * @example
 * ```typescript
 * isValidUrl('https://example.com'); // true
 * isValidUrl('invalid-url'); // false
 * ```
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);

    return true;
  } catch {
    return false;
  } ;

/**
 * Debounce function
 * @description
 * Cria uma função debounced que atrasa a execução até que não seja chamada por um período de tempo.
 *
 * @template T - Tipo da função
 * @param {T} func - Função a debounce
 * @param {number} wait - Tempo de espera em ms
 * @returns {(...args: Parameters<T>) => void} Função debounced
 *
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *   
 * }, 300);

 * ```
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
 * @description
 * Cria uma função throttled que limita a execução a uma vez por período de tempo.
 *
 * @template T - Tipo da função
 * @param {T} func - Função a throttle
 * @param {number} limit - Limite de tempo em ms
 * @returns {(...args: Parameters<T>) => void} Função throttled
 *
 * @example
 * ```typescript
 * const throttledScroll = throttle(() => {
 *   
 * }, 100);

 * ```
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
      setTimeout(() => (inThrottle = false), limit);

    } ;
};

/**
 * Copiar para clipboard
 * @description
 * Copia texto para área de transferência usando Clipboard API.
 *
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} Se a cópia foi bem-sucedida
 *
 * @example
 * ```typescript
 * await copyToClipboard('Texto a copiar');

 * ```
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch (error) {
    console.error('Erro ao copiar para clipboard:', error);

    return false;
  } ;

/**
 * Download de arquivo
 */
export const downloadFile = (data: string, filename: string, type: string = 'text/plain'): void => {
  const blob = new Blob([data], { type });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);};

/**
 * Obter tamanho de arquivo formatado
 * @description
 * Formata tamanho de arquivo em bytes para formato legível (KB, MB, GB, TB).
 *
 * @param {number} bytes - Tamanho em bytes
 * @returns {string} Tamanho formatado
 *
 * @example
 * ```typescript
 * formatFileSize(1024); // "1 KB"
 * ```
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];};

/**
 * Obter tempo relativo
 * @description
 * Retorna tempo relativo formatado (ex: "há 5 minutos", "há 2 horas").
 *
 * @param {string | Date} date - Data a comparar
 * @returns {string} Tempo relativo formatado
 *
 * @example
 * ```typescript
 * getRelativeTime(new Date(Date.now() - 300000)); // "há 5 minutos"
 * ```
 */
export const getRelativeTime = (date: string | Date): string => {
  const now = new Date();

  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'agora mesmo';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);

    return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);

    return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);

    return `${days} dia${days > 1 ? 's' : ''} atrás`;
  } else {
    return formatDate(targetDate);

  } ;
