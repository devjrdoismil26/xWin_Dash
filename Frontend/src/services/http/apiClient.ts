/**
 * Cliente HTTP Base - Serviços Globais
 *
 * @description
 * Cliente HTTP centralizado baseado em Axios para comunicação com a API backend.
 * Inclui interceptores para autenticação, tratamento de erros e configurações
 * globais de requisições HTTP.
 *
 * Funcionalidades principais:
 * - Interceptores automáticos para autenticação (Bearer token)
 * - Interceptores para CSRF token
 * - Tratamento centralizado de erros HTTP
 * - Métodos HTTP (GET, POST, PUT, PATCH, DELETE)
 * - Métodos especiais (upload, download)
 * - Configuração dinâmica de headers e baseURL
 * - Gerenciamento de tokens de autenticação
 *
 * @module services/http/apiClient
 * @since 1.0.0
 *
 * @example
 * ```ts
 * import { apiClient } from '@/services';
 *
 * // GET request
 * const users = await apiClient.get<User[]>('/api/users');

 *
 * // POST request
 * const newUser = await apiClient.post<User>('/api/users', userData);

 *
 * // With authentication
 * apiClient.setAuthToken('token123');

 * const profile = await apiClient.get<User>('/api/profile');

 * ```
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'sonner';
import { ApiConfig, ApiRequestConfig, DownloadConfig } from './types';

// ========================================
// CONFIGURAÇÃO PADRÃO
// ========================================

/**
 * Configuração padrão para o ApiClient
 *
 * @description
 * Configuração inicial aplicada a todas as instâncias do ApiClient.
 * Pode ser sobrescrita através do construtor.
 *
 * @constant {ApiConfig}
 * @readonly
 */
const defaultConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },};

// ========================================
// CLASSE CLIENTE HTTP
// ========================================

/**
 * Classe ApiClient - Cliente HTTP Centralizado
 *
 * @description
 * Classe que encapsula uma instância do Axios com interceptores configurados
 * para autenticação, tratamento de erros e configurações personalizadas.
 *
 * @class ApiClient
 * @since 1.0.0
 *
 * @example
 * ```ts
 * // Usando a instância global
 * import { apiClient } from '@/services';
 * const data = await apiClient.get('/api/data');

 *
 * // Criando uma nova instância customizada
 * const customClient = new ApiClient({
 *   baseURL: 'https://api.example.com',
 *   timeout: 60000
 * });

 * ```
 */
class ApiClient {
  /** Instância do Axios configurada */
  private instance: AxiosInstance;
  
  /** Configuração atual do cliente */
  private config: ApiConfig;

  /**
   * Constrói uma nova instância do ApiClient
   *
   * @description
   * Inicializa o cliente HTTP com configuração padrão ou personalizada.
   * Configura automaticamente os interceptores de requisição e resposta.
   *
   * @param {Partial<ApiConfig>} [config={}] - Configuração parcial para sobrescrever valores padrão
   *
   * @example
   * ```ts
   * // Instância com configuração padrão
   * const client = new ApiClient();

   *
   * // Instância com configuração personalizada
   * const client = new ApiClient({
   *   baseURL: 'https://api.example.com',
   *   timeout: 60000,
   *   headers: { 'X-Custom-Header': 'value' }
   * });

   * ```
   */
  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...defaultConfig, ...config};

    this.instance = axios.create(this.config);

    this.setupInterceptors();

  }

  // ========================================
  // CONFIGURAÇÃO DE INTERCEPTORS
  // ========================================

  /**
   * Configura os interceptores de requisição e resposta
   *
   * @description
   * Configura automaticamente:
   * - Interceptor de requisição: Adiciona token de autenticação e CSRF token
   * - Interceptor de resposta: Trata erros HTTP e exibe notificações
   *
   * @private
   * @returns {void}
   */
  private setupInterceptors(): void {
    // Request Interceptor
    this.instance.interceptors.request.use(
      (config: unknown) => {
        // Adicionar token de autenticação
        const token = localStorage.getItem('auth_token');

        if (token) {
          config.headers = config.headers || {};

          config.headers.Authorization = `Bearer ${token}`;
        }

        // Adicionar CSRF token se disponível
        const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        if (csrf) {
          config.headers = config.headers || {};

          config.headers['X-CSRF-TOKEN'] = csrf;
        }

        return config;
      },
      (error: unknown) => {
        return Promise.reject(error);

      });

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response: unknown) => response,
      (error: unknown) => {
        this.handleResponseError(error);

        return Promise.reject(error);

      });

  }

  // ========================================
  // TRATAMENTO DE ERROS
  // ========================================

  /**
   * Trata erros de resposta HTTP
   *
   * @description
   * Processa erros HTTP de forma centralizada, exibindo mensagens apropriadas
   * através de toasts e tomando ações específicas baseadas no código de status.
   *
   * Códigos tratados:
   * - 401: Remove token e redireciona para login
   * - 403: Exibe erro de permissão
   * - 404: Exibe erro de recurso não encontrado
   * - 422: Exibe erro de validação
   * - 500: Exibe erro de servidor
   * - NETWORK_ERROR: Exibe erro de conexão
   *
   * @private
   * @param {any} error - Erro recebido (AxiosError ou outro)
   * @returns {void}
   */
  private handleResponseError(error: unknown): void {
    // Verifica se é um AxiosError
    const axiosError = error as AxiosError;
    const { response } = axiosError || {};

    switch (response?.status) {
      case 401: {
        localStorage.removeItem('auth_token');

        if (window.location.pathname !== '/login') {
          toast.error('Sessão expirada. Faça login novamente.');

          window.location.href = '/login';
        }
        break;
      }
      case 403:
        toast.error('Acesso negado. Você não tem permissão para esta ação.');

        break;
      case 404:
        toast.error('Recurso não encontrado.');

        break;
      case 422:
        toast.error((response.data as { message?: string })?.message || 'Dados inválidos.');

        break;
      case 500:
        toast.error('Erro interno do servidor. Tente novamente mais tarde.');

        break;
      default:
        if (axiosError.code === 'NETWORK_ERROR' || axiosError.message === 'Network Error') {
          toast.error('Erro de conexão. Verifique sua internet.');

        } else {
          const errorMessage = (response?.data as { message?: string })?.message || axiosError.message || 'Erro inesperado. Tente novamente.';
          toast.error(errorMessage);

        } }

  // ========================================
  // MÉTODOS HTTP BÁSICOS
  // ========================================

  /**
   * Realiza uma requisição HTTP GET
   *
   * @description
   * Método para buscar recursos da API. Retorna apenas os dados da resposta
   * (response.data), sem precisar acessar a propriedade manualmente.
   *
   * @template T - Tipo esperado da resposta
   * @param {string} url - URL do endpoint (relativa ou absoluta)
   * @param {ApiRequestConfig} [config] - Configurações adicionais da requisição
   * @returns {Promise<T>} Promise com os dados da resposta
   *
   * @throws {AxiosError} Erro de requisição ou resposta
   *
   * @example
   * ```ts
   * // GET simples
   * const users = await apiClient.get<User[]>('/api/users');

   *
   * // GET com parâmetros
   * const users = await apiClient.get<User[]>('/api/users', {
   *   params: { page: 1, limit: 10 }
   * });

   *
   * // GET com configurações personalizadas
   * const data = await apiClient.get('/api/data', {
   *   timeout: 60000,
   *   headers: { 'X-Custom': 'value' }
   * });

   * ```
   */
  async get<T = any>(url: string, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);

    return (response as any).data as any;
  }

  /**
   * Realiza uma requisição HTTP POST
   *
   * @description
   * Método para criar novos recursos na API. Envia dados no corpo da requisição
   * e retorna apenas os dados da resposta.
   *
   * @template T - Tipo esperado da resposta
   * @param {string} url - URL do endpoint (relativa ou absoluta)
   * @param {any} [data] - Dados a serem enviados no corpo da requisição
   * @param {ApiRequestConfig} [config] - Configurações adicionais da requisição
   * @returns {Promise<T>} Promise com os dados da resposta
   *
   * @throws {AxiosError} Erro de requisição ou resposta
   *
   * @example
   * ```ts
   * // POST simples
   * const newUser = await apiClient.post<User>('/api/users', {
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * });

   *
   * // POST com configurações
   * const result = await apiClient.post('/api/users', userData, {
   *   showLoading: true,
   *   showError: false
   * });

   * ```
   */
  async post<T = any>(url: string, data?: string, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);

    return (response as any).data as any;
  }

  /**
   * Realiza uma requisição HTTP PUT
   *
   * @description
   * Método para atualizar completamente um recurso na API. Substitui o recurso
   * inteiro pelos dados enviados.
   *
   * @template T - Tipo esperado da resposta
   * @param {string} url - URL do endpoint (relativa ou absoluta)
   * @param {any} [data] - Dados completos do recurso a serem atualizados
   * @param {ApiRequestConfig} [config] - Configurações adicionais da requisição
   * @returns {Promise<T>} Promise com os dados da resposta
   *
   * @throws {AxiosError} Erro de requisição ou resposta
   *
   * @example
   * ```ts
   * // PUT para atualizar recurso completo
   * const updatedUser = await apiClient.put<User>('/api/users/1', {
   *   name: 'John Doe Updated',
   *   email: 'john.updated@example.com'
   * });

   * ```
   */
  async put<T = any>(url: string, data?: string, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);

    return (response as any).data as any;
  }

  async patch<T = any>(url: string, data?: string, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);

    return (response as any).data as any;
  }

  /**
   * Realiza uma requisição HTTP DELETE
   *
   * @description
   * Método para excluir um recurso da API. Retorna os dados da resposta se
   * houver alguma informação retornada pelo servidor.
   *
   * @template T - Tipo esperado da resposta
   * @param {string} url - URL do endpoint (relativa ou absoluta)
   * @param {ApiRequestConfig} [config] - Configurações adicionais da requisição
   * @returns {Promise<T>} Promise com os dados da resposta (se houver)
   *
   * @throws {AxiosError} Erro de requisição ou resposta
   *
   * @example
   * ```ts
   * // DELETE simples
   * await apiClient.delete('/api/users/1');

   *
   * // DELETE com resposta
   * const result = await apiClient.delete<{ message: string }>('/api/users/1');

   * ```
   */
  async delete<T = any>(url: string, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);

    return (response as any).data as any;
  }

  // ========================================
  // MÉTODOS ESPECIAIS
  // ========================================

  /**
   * Faz o download de um arquivo
   *
   * @description
   * Realiza uma requisição GET para baixar um arquivo e inicia o download
   * automaticamente no navegador. Cria um link temporário, executa o clique
   * e remove o link, limpando a URL do objeto.
   *
   * @param {string} url - URL do endpoint que retorna o arquivo
   * @param {string} filename - Nome do arquivo para download
   * @param {DownloadConfig} [config={ filename }] - Configurações adicionais do download
   * @returns {Promise<void>} Promise que resolve quando o download é iniciado
   *
   * @throws {AxiosError} Erro de requisição ou resposta
   *
   * @example
   * ```ts
   * // Download simples
   * await apiClient.download('/api/reports/export', 'report.pdf');

   *
   * // Download com configurações
   * await apiClient.download('/api/files/123', 'document.pdf', {
   *   filename: 'custom-name.pdf',
   *   headers: { 'Accept': 'application/pdf' }
   * });

   * ```
   */
  async download(url: string, filename: string, config: DownloadConfig = { filename }): Promise<void> {
    const response = await this.instance.get(url, { 
      responseType: 'blob',
      ...config 
    });

    const blob = new Blob([response.data], { 
      type: (response as any).headers['content-type'] 
    });

    const objectUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = objectUrl;
    link.setAttribute('download', filename);

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(objectUrl);

  }

  /**
   * Faz o upload de um arquivo ou múltiplos arquivos
   *
   * @description
   * Realiza uma requisição POST com FormData para fazer upload de arquivos.
   * Configura automaticamente o Content-Type como 'multipart/form-data'.
   *
   * @template T - Tipo esperado da resposta
   * @param {string} url - URL do endpoint que processa o upload
   * @param {FormData} formData - FormData contendo os arquivos e dados adicionais
   * @param {ApiRequestConfig} [config] - Configurações adicionais da requisição
   * @returns {Promise<T>} Promise com os dados da resposta
   *
   * @throws {AxiosError} Erro de requisição ou resposta
   *
   * @example
   * ```ts
   * // Upload simples
   * const formData = new FormData();

   * formData.append('file', file);

   * const result = await apiClient.upload<{ url: string }>('/api/upload', formData);

   *
   * // Upload com dados adicionais
   * const formData = new FormData();

   * formData.append('file', file);

   * formData.append('title', 'My Image');

   * formData.append('description', 'Image description');

   * const result = await apiClient.upload('/api/upload', formData);

   * ```
   */
  async upload<T = any>(url: string, formData: FormData, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    });

    return (response as any).data as any;
  }

  // ========================================
  // MÉTODOS DE CONFIGURAÇÃO
  // ========================================

  /**
   * Define a URL base para todas as requisições
   *
   * @description
   * Atualiza a URL base da instância do Axios. Todas as requisições subsequentes
   * usarão esta URL base.
   *
   * @param {string} baseURL - URL base (ex: 'https://api.example.com/api')
   * @returns {void}
   *
   * @example
   * ```ts
   * apiClient.setBaseURL('https://api.example.com/api');

   * // Agora todas as requisições usarão esta base
   * const data = await apiClient.get('/users'); // GET https://api.example.com/api/users
   * ```
   */
  setBaseURL(baseURL: string): void {
    this.instance.defaults.baseURL = baseURL;
  }

  setTimeout(timeout: number): void {
    this.instance.defaults.timeout = timeout;
  }

  setHeader(key: string, value: string): void {
    this.instance.defaults.headers.common[key] = value;
  }

  /**
   * Remove um header padrão das requisições
   *
   * @description
   * Remove um header que estava configurado como padrão. As requisições
   * subsequentes não incluirão mais este header.
   *
   * @param {string} key - Nome do header a ser removido
   * @returns {void}
   *
   * @example
   * ```ts
   * apiClient.setHeader('X-API-Key', 'key');

   * // ... requisições com o header
   * apiClient.removeHeader('X-API-Key');

   * // ... requisições sem o header
   * ```
   */
  removeHeader(key: string): void {
    delete this.instance.defaults.headers.common[key];
  }

  // ========================================
  // MÉTODOS DE UTILIDADE
  // ========================================

  /**
   * Retorna a instância raw do Axios
   *
   * @description
   * Retorna a instância do Axios configurada, permitindo acesso direto a
   * funcionalidades avançadas do Axios se necessário.
   *
   * @returns {AxiosInstance} Instância do Axios configurada
   *
   * @example
   * ```ts
   * const instance = apiClient.getInstance();

   * // Agora pode usar métodos do Axios diretamente
   * instance.interceptors.request.use(...);

   * ```
   */
  getInstance(): AxiosInstance {
    return this.instance;
  }

  /**
   * Retorna uma cópia da configuração atual
   *
   * @description
   * Retorna uma cópia imutável da configuração atual do cliente, incluindo
   * baseURL, timeout, headers, etc.
   *
   * @returns {ApiConfig} Cópia da configuração atual
   *
   * @example
   * ```ts
   * const config = apiClient.getConfig();

   * ```
   */
  getConfig(): ApiConfig {
    return { ...this.config};

  }

  // ========================================
  // MÉTODOS DE AUTENTICAÇÃO
  // ========================================

  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);

    this.setHeader('Authorization', `Bearer ${token}`);

  }

  removeAuthToken(): void {
    localStorage.removeItem('auth_token');

    this.removeHeader('Authorization');

  }

  /**
   * Obtém o token de autenticação atual
   *
   * @description
   * Retorna o token de autenticação armazenado no localStorage, ou null
   * se nenhum token estiver configurado.
   *
   * @returns {string | null} Token de autenticação ou null se não houver token
   *
   * @example
   * ```ts
   * const token = apiClient.getAuthToken();

   * if (token) {
   * } else {
   * }
   * ```
   */
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');

  }

  /**
   * Verifica se há um token de autenticação configurado
   *
   * @description
   * Retorna true se houver um token armazenado no localStorage, false caso contrário.
   * Não valida se o token é válido, apenas verifica sua existência.
   *
   * @returns {boolean} true se houver token, false caso contrário
   *
   * @example
   * ```ts
   * if (apiClient.isAuthenticated()) {
   *   // Usuário provavelmente autenticado
   *   const profile = await apiClient.get('/api/profile');

   * } else {
   *   // Redirecionar para login
   *   router.visit('/login');

   * }
   * ```
   */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();

  } // ========================================
// INSTÂNCIA GLOBAL
// ========================================

/**
 * Instância global do ApiClient
 *
 * @description
 * Instância única e compartilhada do ApiClient configurada com as configurações
 * padrão. Esta é a instância recomendada para uso na maioria dos casos.
 *
 * @constant {ApiClient}
 * @global
 *
 * @example
 * ```ts
 * import { apiClient } from '@/services';
 *
 * // Usar em qualquer lugar da aplicação
 * const users = await apiClient.get('/api/users');

 * ```
 */
const apiClient = new ApiClient();

// ========================================
// EXPORTS
// ========================================

export { ApiClient, apiClient };

export default apiClient;
