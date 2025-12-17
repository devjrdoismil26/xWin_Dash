/**
 * Fun??es Utilit?rias - utils.ts
 *
 * @description
 * Fun??es utilit?rias reutiliz?veis para formata??o, manipula??o
 * de dados e opera??es comuns.
 *
 * @module lib/utils
 * @since 1.0.0
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classes CSS usando clsx e tailwind-merge
 *
 * @description
 * Fun??o utilit?ria que combina classes CSS, resolvendo conflitos
 * do Tailwind CSS automaticamente atrav?s do tailwind-merge.
 *
 * @param {...ClassValue} inputs - Classes CSS a serem combinadas
 * @returns {string} Classes CSS combinadas e otimizadas
 *
 * @example
 * ```ts
 * cn('px-2 py-1', { 'bg-red-500': isActive }, 'rounded-md')
 * // Retorna: "px-2 py-1 bg-red-500 rounded-md"
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));

}

/**
 * Op??es de formata??o
 *
 * @interface FormatOptions
 * @property {string} [locale] - Locale para formata??o (padr?o: 'pt-BR')
 * @property {string} [currency] - Moeda para formata??o monet?ria (padr?o: 'BRL')
 */
interface FormatOptions {
  locale?: string;
  currency?: string;
  [key: string]: unknown; }

/**
 * Formata um valor baseado no tipo especificado
 *
 * @description
 * Formata valores para exibi??o em diferentes formatos:
 * - currency: Moeda (R$ 1.234,56)
 * - number: N?mero (1.234,56)
 * - percentage: Porcentagem (50%)
 * - date: Data (01/01/2024)
 * - datetime: Data e hora (01/01/2024, 10:30)
 * - text: Texto simples
 *
 * @param {any} value - Valor a ser formatado
 * @param {'currency' | 'number' | 'percentage' | 'date' | 'datetime' | 'text'} [type='text'] - Tipo de formata??o
 * @param {FormatOptions} [options={}] - Op??es de formata??o
 * @returns {string} Valor formatado ou string vazia se null/undefined
 *
 * @example
 * ```ts
 * formatValue(1234.56, 'currency') // "R$ 1.234,56"
 * formatValue(new Date(), 'date') // "29/10/2024"
 * formatValue(50, 'percentage') // "50%"
 * ```
 */
export function formatValue(
  value: unknown,
  type:
    | "currency"
    | "number"
    | "percentage"
    | "date"
    | "datetime"
    | "text" = "text",
  options: FormatOptions = {},
): string {
  if (value === null || value === undefined) return "";

  switch (type) {
    case "currency":
      return new Intl.NumberFormat(options.locale || "pt-BR", {
        style: "currency",
        currency: options.currency || "BRL",
      }).format(Number(value));

    case "number":
      return new Intl.NumberFormat(options.locale || "pt-BR").format(
        Number(value),);

    case "percentage":
      return `${Number(value)}%`;

    case "date":
      return new Date(value as Date | string | number).toLocaleDateString(
        options.locale || "pt-BR",);

    case "datetime":
      return new Date(value as Date | string | number).toLocaleString(
        options.locale || "pt-BR",);

    default:
      return String(value);

  } /**
 * Trunca um texto at? um comprimento m?ximo
 *
 * @description
 * Reduz o texto at? o comprimento especificado e adiciona "..."
 * se o texto original for maior.
 *
 * @param {string | null | undefined} text - Texto a ser truncado
 * @param {number} [length=100] - Comprimento m?ximo (padr?o: 100)
 * @returns {string} Texto truncado ou original se menor que length
 *
 * @example
 * ```ts
 * truncateText('Texto muito longo que ser? truncado', 20)
 * // Retorna: "Texto muito longo q..."
 * ```
 */
export function truncateText(
  text: string | null | undefined,
  length: number = 100,
): string {
  if (!text || text.length <= length) return text || "";
  return `${text.slice(0, length)}...`;
}

/**
 * Gera um ID ?nico
 *
 * @description
 * Gera um identificador ?nico usando um prefixo e string aleat?ria.
 *
 * @param {string} [prefix='id'] - Prefixo para o ID (padr?o: 'id')
 * @returns {string} ID ?nico gerado
 *
 * @example
 * ```ts
 * generateId('lead') // "lead-a3f9b2c1"
 * generateId() // "id-x7k8m9n0"
 * ```
 */
export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
