import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatValue(value, type = 'text', options = {}) {
  if (value === null || value === undefined) return '';
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat(options.locale || 'pt-BR', {
        style: 'currency',
        currency: options.currency || 'BRL',
      }).format(Number(value));
    case 'number':
      return new Intl.NumberFormat(options.locale || 'pt-BR').format(Number(value));
    case 'percentage':
      return `${Number(value)}%`;
    case 'date':
      return new Date(value).toLocaleDateString(options.locale || 'pt-BR');
    case 'datetime':
      return new Date(value).toLocaleString(options.locale || 'pt-BR');
    default:
      return String(value);
  }
}

export function truncateText(text, length = 100) {
  if (!text || text.length <= length) return text || '';
  return `${text.slice(0, length)}...`;
}

export function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
