// ========================================
// SERVIÇO BASE - PADRÃO PARA TODOS OS SERVIÇOS
// ========================================

import { AxiosResponse } from 'axios';
import apiClient from './apiClient';
import { ApiResponse, ApiRequestConfig, PaginationParams } from './types';

// ========================================
// CLASSE SERVIÇO BASE
// ========================================

export abstract class BaseService {
  protected api = apiClient;
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // ========================================
  // MÉTODOS HTTP PADRONIZADOS
  // ========================================

  protected async get<T = any>(
    endpoint: string = '', 
    params?: any, 
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint ? `${this.baseUrl}/${endpoint}` : this.baseUrl;
      const response = await this.api.get<ApiResponse<T>>(url, { 
        params, 
        ...config 
      });
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  protected async post<T = any>(
    endpoint: string = '', 
    data?: any, 
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint ? `${this.baseUrl}/${endpoint}` : this.baseUrl;
      const response = await this.api.post<ApiResponse<T>>(url, data, config);
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  protected async put<T = any>(
    endpoint: string = '', 
    data?: any, 
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint ? `${this.baseUrl}/${endpoint}` : this.baseUrl;
      const response = await this.api.put<ApiResponse<T>>(url, data, config);
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  protected async patch<T = any>(
    endpoint: string = '', 
    data?: any, 
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint ? `${this.baseUrl}/${endpoint}` : this.baseUrl;
      const response = await this.api.patch<ApiResponse<T>>(url, data, config);
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  protected async delete<T = any>(
    endpoint: string = '', 
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint ? `${this.baseUrl}/${endpoint}` : this.baseUrl;
      const response = await this.api.delete<ApiResponse<T>>(url, config);
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // ========================================
  // MÉTODOS ESPECIAIS
  // ========================================

  protected async download(
    endpoint: string, 
    filename: string, 
    params?: any
  ): Promise<void> {
    try {
      const url = endpoint ? `${this.baseUrl}/${endpoint}` : this.baseUrl;
      await this.api.download(url, filename, { params });
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  protected async upload<T = any>(
    endpoint: string = '', 
    formData: FormData, 
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint ? `${this.baseUrl}/${endpoint}` : this.baseUrl;
      const response = await this.api.upload<ApiResponse<T>>(url, formData, config);
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // ========================================
  // MÉTODOS DE TRATAMENTO DE RESPOSTA
  // ========================================

  protected handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
    // Se a resposta já tem o formato ApiResponse, retorna diretamente
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      return response.data;
    }

    // Se não, formata a resposta
    return {
      success: true,
      data: response.data as T,
      meta: response.data?.meta
    };
  }

  protected handleError(error: any): ApiResponse<never> {
    const message = error.response?.data?.message || 
                   error.message || 
                   'Erro desconhecido';
    
    return {
      success: false,
      error: message
    };
  }

  // ========================================
  // MÉTODOS DE UTILIDADE
  // ========================================

  protected buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(`${key}[]`, item));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    
    return searchParams.toString();
  }

  protected buildPaginationParams(params: PaginationParams): Record<string, any> {
    return {
      page: params.page || 1,
      per_page: params.per_page || 20,
      search: params.search,
      sort: params.sort,
      order: params.order || 'desc'
    };
  }

  protected buildFilters(filters: Record<string, any>): Record<string, any> {
    const cleanFilters: Record<string, any> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleanFilters[key] = value;
      }
    });
    
    return cleanFilters;
  }

  // ========================================
  // MÉTODOS DE VALIDAÇÃO
  // ========================================

  protected validateRequired(data: Record<string, any>, required: string[]): void {
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`Campos obrigatórios: ${missing.join(', ')}`);
    }
  }

  protected validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

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

  protected getCacheKey(endpoint: string, params?: any): string {
    const paramsStr = params ? JSON.stringify(params) : '';
    return `${this.baseUrl}/${endpoint}${paramsStr}`;
  }

  protected setCache<T>(key: string, data: T, ttl: number = 300000): void {
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };
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
    }
  }

  protected clearCache(pattern?: string): void {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith('cache_'));
    
    cacheKeys.forEach(key => {
      if (!pattern || key.includes(pattern)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// ========================================
// EXPORTS
// ========================================

export default BaseService;
