/**
 * Funções auxiliares para o módulo AI
 */

import { AIProvider, AIGenerationType, AIGeneration } from '../types';

/**
 * Formatar moeda
 */
export const formatCurrency = (value: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency
  }).format(value);
};

/**
 * Formatar números
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

/**
 * Formatar percentual
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

/**
 * Formatar data
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
  }).format(dateObj);
};


/**
 * Calcular CTR (Click Through Rate)
 */
export const calculateCTR = (clicks: number, impressions: number): number => {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
};

/**
 * Calcular CPC (Cost Per Click)
 */
export const calculateCPC = (cost: number, clicks: number): number => {
  if (clicks === 0) return 0;
  return cost / clicks;
};

/**
 * Calcular ROI (Return on Investment)
 */
export const calculateROI = (revenue: number, cost: number): number => {
  if (cost === 0) return 0;
  return ((revenue - cost) / cost) * 100;
};

/**
 * Calcular qualidade média
 */
export const calculateAverageQuality = (generations: AIGeneration[]): number => {
  if (generations.length === 0) return 0;
  const totalQuality = generations.reduce((sum, gen) => sum + (gen.metadata.quality || 0), 0);
  return totalQuality / generations.length;
};

/**
 * Calcular custo total
 */
export const calculateTotalCost = (generations: AIGeneration[]): number => {
  return generations.reduce((sum, gen) => sum + (gen.metadata.cost || 0), 0);
};

/**
 * Calcular tokens totais
 */
export const calculateTotalTokens = (generations: AIGeneration[]): number => {
  return generations.reduce((sum, gen) => sum + (gen.metadata.tokens || 0), 0);
};

/**
 * Obter cor baseada no status
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
  }
};

/**
 * Obter ícone baseado no tipo de geração
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
  }
};

/**
 * Obter ícone baseado no provedor
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
  }
};

/**
 * Truncar texto
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Gerar ID único
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Validar email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Copiar para clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Erro ao copiar para clipboard:', error);
    return false;
  }
};

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
  URL.revokeObjectURL(url);
};

/**
 * Obter tamanho de arquivo formatado
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Obter tempo relativo
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
  }
};
