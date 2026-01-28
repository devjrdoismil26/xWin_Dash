// ========================================
// CLIENTE HTTP BASE - SERVIÇOS GLOBAIS
// ========================================

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { ApiConfig, ApiRequestConfig, DownloadConfig } from './types';

// ========================================
// CONFIGURAÇÃO PADRÃO
// ========================================

const defaultConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
};

// ========================================
// CLASSE CLIENTE HTTP
// ========================================

class ApiClient {
  private instance: AxiosInstance;
  private config: ApiConfig;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.instance = axios.create(this.config);
    this.setupInterceptors();
  }

  // ========================================
  // CONFIGURAÇÃO DE INTERCEPTORS
  // ========================================

  private setupInterceptors(): void {
    // Request Interceptor
    this.instance.interceptors.request.use(
      (config) => {
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
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        this.handleResponseError(error);
        return Promise.reject(error);
      }
    );
  }

  // ========================================
  // TRATAMENTO DE ERROS
  // ========================================

  private handleResponseError(error: any): void {
    const { response } = error || {};
    
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
        toast.error(response.data?.message || 'Dados inválidos.');
        break;
      case 500:
        toast.error('Erro interno do servidor. Tente novamente mais tarde.');
        break;
      default:
        if (error.code === 'NETWORK_ERROR') {
          toast.error('Erro de conexão. Verifique sua internet.');
        } else {
          toast.error(response?.data?.message || 'Erro inesperado. Tente novamente.');
        }
    }
  }

  // ========================================
  // MÉTODOS HTTP BÁSICOS
  // ========================================

  async get<T = any>(url: string, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  // ========================================
  // MÉTODOS ESPECIAIS
  // ========================================

  async download(url: string, filename: string, config: DownloadConfig = { filename }): Promise<void> {
    const response = await this.instance.get(url, { 
      responseType: 'blob',
      ...config 
    });
    
    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] 
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

  async upload<T = any>(url: string, formData: FormData, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    });
    return response.data;
  }

  // ========================================
  // MÉTODOS DE CONFIGURAÇÃO
  // ========================================

  setBaseURL(baseURL: string): void {
    this.instance.defaults.baseURL = baseURL;
  }

  setTimeout(timeout: number): void {
    this.instance.defaults.timeout = timeout;
  }

  setHeader(key: string, value: string): void {
    this.instance.defaults.headers.common[key] = value;
  }

  removeHeader(key: string): void {
    delete this.instance.defaults.headers.common[key];
  }

  // ========================================
  // MÉTODOS DE UTILIDADE
  // ========================================

  getInstance(): AxiosInstance {
    return this.instance;
  }

  getConfig(): ApiConfig {
    return { ...this.config };
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

  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

// ========================================
// INSTÂNCIA GLOBAL
// ========================================

const apiClient = new ApiClient();

// ========================================
// EXPORTS
// ========================================

export { ApiClient, apiClient };
export default apiClient;
