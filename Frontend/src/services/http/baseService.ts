/**
 * Serviço Base - Padrão para Todos os Serviços
 *
 * @description
 * Classe abstrata base que fornece funcionalidades comuns para todos os serviços
 * da aplicação. Inclui métodos HTTP padronizados, tratamento de respostas e erros,
 * utilitários para paginação e filtros, validações, formatação de dados e cache.
 *
 * Funcionalidades principais:
 * - Métodos HTTP padronizados (GET, POST, PUT, PATCH, DELETE)
 * - Upload e download de arquivos
 * - Tratamento padronizado de respostas e erros
 * - Utilidades para query strings e paginação
 * - Validações (campos obrigatórios, email, telefone)
 * - Formatação (data, telefone, moeda)
 * - Sistema de cache baseado em localStorage
 *
 * @module services/http/baseService
 * @since 1.0.0
 *
 * @example
 * ```ts
 * class UserService extends BaseService {
 *   constructor() {
 *     super('/api/users');

 *   }
 *
 *   async getAll(): Promise<ApiResponse<User[]>> {
 *     return this.get<User[]>();

 *   }
 *
 *   async create(data: CreateUserData): Promise<ApiResponse<User>> {
 *     return this.post<User>('', data);

 *   }
 * }
 * ```
 */

import { AxiosResponse, AxiosError } from 'axios';
import apiClient from './apiClient';
import { ApiResponse, ApiRequestConfig, PaginationParams } from './types';

// ========================================
// CLASSE SERVIÇO BASE
// ========================================

/**
 * Classe BaseService - Classe Abstrata Base para Serviços
 *
 * @description
 * Classe abstrata que fornece métodos comuns para serviços HTTP.
 * Serviços específicos devem estender esta classe e implementar suas
 * próprias funcionalidades.
 *
 * @abstract
 * @class BaseService
 * @since 1.0.0
 *
 * @example
 * ```ts
 * class ProductService extends BaseService {
 *   constructor() {
 *     super('/api/products');

 *   }
 *
 *   async list(params?: PaginationParams): Promise<ApiResponse<Product[]>> {
 *     return this.get<Product[]>('', this.buildPaginationParams(params || {}));

 *   }
 * }
 * ```
 */
export abstract class BaseService {
  /** Instância do cliente HTTP compartilhado */
  protected api = apiClient;
  
  /** URL base do serviço */
  protected baseUrl: string;

  /**
   * Constrói uma nova instância do BaseService
   *
   * @description
   * Inicializa o serviço com a URL base especificada. Esta URL será usada
   * como prefixo para todos os endpoints do serviço.
   *
   * @param {string} baseUrl - URL base do serviço (ex: '/api/users')
   *
   * @example
   * ```ts
   * class UserService extends BaseService {
   *   constructor() {
   *     super('/api/users');

   *   }
   * }
   * ```
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // ========================================
  // MÉTODOS HTTP PADRONIZADOS
  // ========================================

  /**
   * Realiza uma requisição HTTP GET
   *
   * @description
   * Método protegido para realizar requisições GET padronizadas.
   * Trata erros automaticamente e retorna respostas no formato ApiResponse.
   *
   * @template T - Tipo esperado dos dados da resposta
   * @param {string} [endpoint=''] - Endpoint relativo à URL base (vazio usa a base)
   * @param {Record<string, any>} [params] - Parâmetros de query string
   * @param {ApiRequestConfig} [config] - Configurações adicionais da requisição
   * @returns {Promise<ApiResponse<T>>} Promise com resposta padronizada
   *
   * @protected
   *
   * @example
   * ```ts
   * // GET na URL base
   * const response = await this.get<User[]>('');

   *
   * // GET com endpoint
   * const response = await this.get<User>('/123');

   *
   * // GET com parâmetros
   * const response = await this.get<User[]>('', { page: 1, limit: 10 });

   * ```
   */
  protected async get<T = any>(
    endpoint: string = '', 
    params?: Record<string, any>, 
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint ? `${this.baseUrl}/${endpoint}` : this.baseUrl;
      const response = await this.api.get<ApiResponse<T>>(url, { 
        params, 
        ...config 
      });

      return this.handleResponse(response);

    } catch (error: unknown) {
      return this.handleError(error as AxiosError);

    } /**
   * Realiza uma requisição HTTP POST
   *
   * @description
   * Método protegido para realizar requisições POST padronizadas.
   * Trata erros automaticamente e retorna respostas no formato ApiResponse.
   *
   * @template T - Tipo esperado dos dados da resposta
   * @param {string} [endpoint=''] - Endpoint relativo à URL base (vazio usa a base)
   * @param {any} [data] - Dados a serem enviados no corpo da requisição
   * @param {ApiRequestConfig} [config] - Configurações adicionais da requisição
   * @returns {Promise<ApiResponse<T>>} Promise com resposta padronizada
   *
   * @protected
   *
   * @example
   * ```ts
   * // POST na URL base
   * const response = await this.post<User>('', userData);

   *
   * // POST com endpoint
   * const response = await this.post<User>('/create', userData);

   * ```
   */
  protected async post<T = any>(
    endpoint: string = '', 
    data?: string, 
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint ? `${this.baseUrl}/${endpoint}` : this.baseUrl;
      const response = await this.api.post<ApiResponse<T>>(url, data, config);

      return this.handleResponse(response);

    } catch (error: unknown) {
      return this.handleError(error as AxiosError);

    } /**
   * Realiza uma requisição HTTP PUT
   *
   * @description
   * Método protegido para realizar requisições PUT padronizadas.
   * Trata erros automaticamente e retorna respostas no formato ApiResponse.
   *
   * @template T - Tipo esperado dos dados da resposta
   * @param {string} [endpoint=''] - Endpoint relativo à URL base (vazio usa a base)
   * @param {any} [data] - Dados completos do recurso a serem atualizados
   * @param {ApiRequestConfig} [config] - Configurações adicionais da requisição
   * @returns {Promise<ApiResponse<T>>} Promise com resposta padronizada
   *
   * @protected
   *
   * @example
   * ```ts
   * // PUT para atualizar recurso completo
   * const response = await this.put<User>('/123', userData);

   * ```
   */
  protected async put<T = any>(
    endpoint: string = '', 
    data?: string, 
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint ? `${this.baseUrl}/${endpoint}` : this.baseUrl;
      const response = await this.api.put<ApiResponse<T>>(url, data, config);

      return this.handleResponse(response);

    } catch (error: unknown) {
      return this.handleError(error as AxiosError);

    } /**
   * Realiza uma requisição HTTP PATCH
   *
   * @description
   * Método protegido para realizar requisições PATCH padronizadas.
   * Trata erros automaticamente e retorna respostas no formato ApiResponse.
   *
   * @template T - Tipo esperado dos dados da resposta
   * @param {string} [endpoint=''] - Endpoint relativo à URL base (vazio usa a base)
   * @param {any} [data] - Dados parciais do recurso a serem atualizados
   * @param {ApiRequestConfig} [config] - Configurações adicionais da requisição
   * @returns {Promise<ApiResponse<T>>} Promise com resposta padronizada
   *
   * @protected
   *
   * @example
   * ```ts
   * // PATCH para atualização parcial
   * const response = await this.patch<User>('/123', { email: 'new@example.com' });

   * ```
   */
  protected async patch<T = any>(
    endpoint: string = '', 
    data?: string, 
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint ? `${this.baseUrl}/${endpoint}` : this.baseUrl;
      const response = await this.api.patch<ApiResponse<T>>(url, data, config);

      return this.handleResponse(response);

    } catch (error: unknown) {
      return this.handleError(error as AxiosError);

    } /**
   * Realiza uma requisição HTTP DELETE
   *
   * @description
   * Método protegido para realizar requisições DELETE padronizadas.
   * Trata erros automaticamente e retorna respostas no formato ApiResponse.
   *
   * @template T - Tipo esperado dos dados da resposta (se houver)
   * @param {string} [endpoint=''] - Endpoint relativo à URL base (vazio usa a base)
   * @param {ApiRequestConfig} [config] - Configurações adicionais da requisição
   * @returns {Promise<ApiResponse<T>>} Promise com resposta padronizada
   *
   * @protected
   *
   * @example
   * ```ts
   * // DELETE de um recurso
   * const response = await this.delete<{ message: string }>('/123');

   * ```
   */
  protected async delete<T = any>(
    endpoint: string = '', 
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint ? `${this.baseUrl}/${endpoint}` : this.baseUrl;
      const response = await this.api.delete<ApiResponse<T>>(url, config);

      return this.handleResponse(response);

    } catch (error: unknown) {
      return this.handleError(error as AxiosError);

    } // ========================================
  // MÉTODOS ESPECIAIS
  // ========================================

  /**
   * Faz o download de um arquivo
   *
   * @description
   * Método protegido para realizar download de arquivos.
   * Lança erro se o download falhar.
   *
   * @param {string} endpoint - Endpoint relativo à URL base
   * @param {string} filename - Nome do arquivo para download
   * @param {Record<string, any>} [params] - Parâmetros de query string
   * @returns {Promise<void>} Promise que resolve quando o download é iniciado
   * @throws {AxiosError} Erro se o download falhar
   *
   * @protected
   *
   * @example
   * ```ts
   * // Download de um arquivo
   * await this.download('/export', 'report.pdf');

   *
   * // Download com parâmetros
   * await this.download('/export', 'report.pdf', { format: 'pdf' });

   * ```
   */
  protected async download(
    endpoint: string, 
    filename: string, 
    params?: Record<string, any />
  ): Promise<void> {
    try {
      const url = endpoint ? `${this.baseUrl}/${endpoint}` : this.baseUrl;
      await this.api.download(url, filename, { params });

    } catch (error: unknown) {
      this.handleError(error as AxiosError);

      throw error;
    } /**
   * Faz o upload de um arquivo ou múltiplos arquivos
   *
   * @description
   * Método protegido para realizar upload de arquivos usando FormData.
   * Trata erros automaticamente e retorna respostas no formato ApiResponse.
   *
   * @template T - Tipo esperado dos dados da resposta
   * @param {string} [endpoint=''] - Endpoint relativo à URL base (vazio usa a base)
   * @param {FormData} formData - FormData contendo os arquivos e dados adicionais
   * @param {ApiRequestConfig} [config] - Configurações adicionais da requisição
   * @returns {Promise<ApiResponse<T>>} Promise com resposta padronizada
   *
   * @protected
   *
   * @example
   * ```ts
   * // Upload simples
   * const formData = new FormData();

   * formData.append('file', file);

   * const response = await this.upload<{ url: string }>('/upload', formData);

   * ```
   */
  protected async upload<T = any>(
    endpoint: string = '', 
    formData: FormData, 
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint ? `${this.baseUrl}/${endpoint}` : this.baseUrl;
      const response = await this.api.upload<ApiResponse<T>>(url, formData, config);

      return this.handleResponse(response);

    } catch (error: unknown) {
      return this.handleError(error as AxiosError);

    } // ========================================
  // MÉTODOS DE TRATAMENTO DE RESPOSTA
  // ========================================

  protected handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
    // Se a resposta já tem o formato ApiResponse, retorna diretamente
    if (response.data && typeof (response as any).data === 'object' && 'success' in (response as any).data) {
      return (response as any).data as any;
    }

    // Se não, formata a resposta
    return {
      success: true,
      data: (response as any).data as T,
      meta: (response as any).data?.meta};

  }

  /**
   * Trata erros HTTP e converte em formato ApiResponse
   *
   * @description
   * Extrai a mensagem de erro da resposta HTTP ou do erro original
   * e retorna uma resposta padronizada com success: false.
   *
   * @param {AxiosError} error - Erro HTTP do Axios
   * @returns {ApiResponse<never>} Resposta de erro padronizada
   *
   * @protected
   */
  protected handleError(error: AxiosError): ApiResponse<never> {
    const message = (error as any).response?.data?.message || 
                   (error as any).message || 
                   'Erro desconhecido';
    
    return {
      success: false,
      error: message};

  }

  // ========================================
  // MÉTODOS DE UTILIDADE
  // ========================================

  /**
   * Constrói uma query string a partir de um objeto de parâmetros
   *
   * @description
   * Converte um objeto de parâmetros em uma string de query URL-encoded.
   * Trata arrays automaticamente adicionando colchetes.
   *
   * @param {Record<string, any>} params - Objeto com parâmetros
   * @returns {string} Query string formatada
   *
   * @protected
   *
   * @example
   * ```ts
   * const query = this.buildQueryString({ page: 1, tags: ['a', 'b'] });

   * // "page=1&tags[]=a&tags[]=b"
   * ```
   */
  protected buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(`${key}[]`, item));

        } else {
          searchParams.append(key, String(value));

        } });

    return searchParams.toString();

  }

  /**
   * Constrói parâmetros de paginação padronizados
   *
   * @description
   * Converte um objeto PaginationParams em parâmetros de paginação
   * com valores padrão aplicados.
   *
   * @param {PaginationParams} params - Parâmetros de paginação
   * @returns {Record<string, any>} Parâmetros formatados com valores padrão
   *
   * @protected
   *
   * @example
   * ```ts
   * const pagination = this.buildPaginationParams({ page: 1, per_page: 20 });

   * // { page: 1, per_page: 20, order: 'desc' }
   * ```
   */
  protected buildPaginationParams(params: PaginationParams): Record<string, any> {
    return {
      page: params.page || 1,
      per_page: params.per_page || 20,
      search: params.search,
      sort: params.sort,
      order: params.order || 'desc'};

  }

  /**
   * Limpa e valida filtros removendo valores vazios
   *
   * @description
   * Remove propriedades com valores undefined, null ou string vazia do objeto
   * de filtros, retornando apenas filtros válidos.
   *
   * @param {Record<string, any>} filters - Objeto com filtros
   * @returns {Record<string, any>} Objeto com filtros limpos
   *
   * @protected
   *
   * @example
   * ```ts
   * const clean = this.buildFilters({ name: 'John', status: '', page: 1 });

   * // { name: 'John', page: 1 }
   * ```
   */
  protected buildFilters(filters: Record<string, any>): Record<string, any> {
    const cleanFilters: Record<string, any> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleanFilters[key] = value;
      } );

    return cleanFilters;
  }

  // ========================================
  // MÉTODOS DE VALIDAÇÃO
  // ========================================

  /**
   * Valida se campos obrigatórios estão presentes
   *
   * @description
   * Verifica se todos os campos obrigatórios estão presentes e não são vazios.
   * Lança um erro se algum campo obrigatório estiver faltando.
   *
   * @param {Record<string, any>} data - Objeto com dados a serem validados
   * @param {string[]} required - Array com nomes dos campos obrigatórios
   * @returns {void}
   * @throws {Error} Erro se algum campo obrigatório estiver faltando
   *
   * @protected
   *
   * @example
   * ```ts
   * try {
   *   this.validateRequired(userData, ['name', 'email']);

   * } catch (error) {
   *   // Campos obrigatórios: name
   * }
   * ```
   */
  protected validateRequired(data: Record<string, any>, required: string[]): void {
    const missing = required.filter(field => !data[field]);

    if (missing.length > 0) {
      throw new Error(`Campos obrigatórios: ${missing.join(', ')}`);

    } protected validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);

  }

  /**
   * Valida formato de telefone
   *
   * @description
   * Verifica se uma string corresponde ao formato válido de telefone internacional.
   * Remove caracteres não numéricos antes de validar.
   *
   * @param {string} phone - Telefone a ser validado
   * @returns {boolean} true se o telefone for válido, false caso contrário
   *
   * @protected
   *
   * @example
   * ```ts
   * if (this.validatePhone(phone)) {
   *   // Telefone válido
   * }
   * ```
   */
  protected validatePhone(phone: string): boolean {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));

  }

  // ========================================
  // MÉTODOS DE FORMATAÇÃO
  // ========================================

  protected formatDate(date: string | Date): string {
    return new Date(date).toISOString();

  }

  /**
   * Formata número de telefone para padrão internacional
   *
   * @description
   * Formata um número de telefone brasileiro para o formato internacional (+55).
   * Suporta números com 10 ou 11 dígitos (DDD + número).
   *
   * @param {string} phone - Telefone a ser formatado
   * @returns {string} Telefone formatado com código do país
   *
   * @protected
   *
   * @example
   * ```ts
   * // Número com 11 dígitos (11XXXXXXXXX)
   * this.formatPhoneNumber('11987654321');

   * // '+5511987654321'
   *
   * // Número com 10 dígitos (11XXXXXXXX)
   * this.formatPhoneNumber('1198765432');

   * // '+5511198765432'
   * ```
   */
  protected formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 11 && cleaned.startsWith('11')) {
      return `+55${cleaned}`;
    } else if (cleaned.length === 10) {
      return `+5511${cleaned}`;
    } else if (cleaned.length === 13 && cleaned.startsWith('55')) {
      return `+${cleaned}`;
    }
    
    return phone;
  }

  protected formatCurrency(amount: number, currency: string = 'BRL'): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(amount);

  }

  // ========================================
  // MÉTODOS DE CACHE
  // ========================================

  /**
   * Gera uma chave de cache única para um endpoint
   *
   * @description
   * Cria uma chave de cache baseada na URL base, endpoint e parâmetros.
   * Usado internamente para armazenar e recuperar dados do cache.
   *
   * @param {string} endpoint - Endpoint relativo à URL base
   * @param {Record<string, any>} [params] - Parâmetros da requisição
   * @returns {string} Chave de cache única
   *
   * @protected
   *
   * @example
   * ```ts
   * const key = this.getCacheKey('/users', { page: 1 });

   * // '/api/users/users{"page":1}'
   * ```
   */
  protected getCacheKey(endpoint: string, params?: Record<string, any>): string {
    const paramsStr = params ? JSON.stringify(params) : '';
    return `${this.baseUrl}/${endpoint}${paramsStr}`;
  }

  protected setCache<T>(key: string, data: T, ttl: number = 300000): void {
    const item = {
      data,
      timestamp: Date.now(),
      ttl};

    localStorage.setItem(`cache_${key}`, JSON.stringify(item));

  }

  protected getCache<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`cache_${key}`);

      if (!item) return null;
      
      const parsed = JSON.parse(item);

      const now = Date.now();

      if (now - parsed.timestamp > parsed.ttl) {
        localStorage.removeItem(`cache_${key}`);

        return null;
      }
      
      return parsed.data;
    } catch {
      return null;
    } /**
   * Limpa entradas do cache
   *
   * @description
   * Remove entradas do cache do localStorage. Se um padrão for fornecido,
   * apenas entradas que correspondam ao padrão serão removidas.
   *
   * @param {string} [pattern] - Padrão opcional para filtrar entradas (remove todas se não fornecido)
   * @returns {void}
   *
   * @protected
   *
   * @example
   * ```ts
   * // Limpar todo o cache
   * this.clearCache();

   *
   * // Limpar apenas cache de usuários
   * this.clearCache('users');

   * ```
   */
  protected clearCache(pattern?: string): void {
    const keys = Object.keys(localStorage);

    const cacheKeys = keys.filter(key => key.startsWith('cache_'));

    cacheKeys.forEach(key => {
      if (!pattern || key.includes(pattern)) {
        localStorage.removeItem(key);

      } );

  } // ========================================
// EXPORTS
// ========================================

export default BaseService;
