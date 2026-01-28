// ========================================
// PROVIDERS - ANALYTICS
// ========================================
// Providers específicos para o módulo Analytics

import { AnalyticsMetric, AnalyticsChart, AnalyticsInsight, AnalyticsFilters } from './analyticsTypes';

/**
 * Interface base para providers de analytics
 */
export interface AnalyticsProvider {
  id: string;
  name: string;
  type: string;
  version: string;
  enabled: boolean;
  config: Record<string, any>;
  credentials?: Record<string, any>;
  lastSync?: string;
  syncInterval: number;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
}

/**
 * Provider para Google Analytics
 */
export interface GoogleAnalyticsProvider extends AnalyticsProvider {
  type: 'google_analytics';
  config: {
    propertyId: string;
    viewId: string;
    measurementId?: string;
    apiVersion: string;
    scopes: string[];
  };
  credentials: {
    clientId: string;
    clientSecret: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: string;
  };
}

/**
 * Provider para Facebook Analytics
 */
export interface FacebookAnalyticsProvider extends AnalyticsProvider {
  type: 'facebook_analytics';
  config: {
    appId: string;
    apiVersion: string;
    endpoints: string[];
  };
  credentials: {
    accessToken: string;
    appSecret: string;
    expiresAt?: string;
  };
}

/**
 * Provider para Twitter Analytics
 */
export interface TwitterAnalyticsProvider extends AnalyticsProvider {
  type: 'twitter_analytics';
  config: {
    apiVersion: string;
    endpoints: string[];
  };
  credentials: {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
  };
}

/**
 * Provider para LinkedIn Analytics
 */
export interface LinkedInAnalyticsProvider extends AnalyticsProvider {
  type: 'linkedin_analytics';
  config: {
    apiVersion: string;
    endpoints: string[];
  };
  credentials: {
    clientId: string;
    clientSecret: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: string;
  };
}

/**
 * Provider para Instagram Analytics
 */
export interface InstagramAnalyticsProvider extends AnalyticsProvider {
  type: 'instagram_analytics';
  config: {
    apiVersion: string;
    endpoints: string[];
  };
  credentials: {
    accessToken: string;
    userId: string;
    expiresAt?: string;
  };
}

/**
 * Provider para YouTube Analytics
 */
export interface YouTubeAnalyticsProvider extends AnalyticsProvider {
  type: 'youtube_analytics';
  config: {
    apiVersion: string;
    endpoints: string[];
  };
  credentials: {
    clientId: string;
    clientSecret: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: string;
  };
}

/**
 * Provider para TikTok Analytics
 */
export interface TikTokAnalyticsProvider extends AnalyticsProvider {
  type: 'tiktok_analytics';
  config: {
    apiVersion: string;
    endpoints: string[];
  };
  credentials: {
    accessToken: string;
    expiresAt?: string;
  };
}

/**
 * Provider para API customizada
 */
export interface CustomApiProvider extends AnalyticsProvider {
  type: 'custom_api';
  config: {
    baseUrl: string;
    apiVersion?: string;
    endpoints: Record<string, string>;
    authType: 'none' | 'basic' | 'bearer' | 'api_key' | 'oauth2';
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  credentials?: {
    username?: string;
    password?: string;
    apiKey?: string;
    bearerToken?: string;
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: string;
  };
}

/**
 * Provider para Webhook
 */
export interface WebhookProvider extends AnalyticsProvider {
  type: 'webhook';
  config: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers: Record<string, string>;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
    verifySSL: boolean;
  };
  credentials?: {
    secret?: string;
    signature?: string;
  };
}

/**
 * Provider para banco de dados
 */
export interface DatabaseProvider extends AnalyticsProvider {
  type: 'database';
  config: {
    connectionString: string;
    driver: 'mysql' | 'postgresql' | 'sqlite' | 'mongodb' | 'redis';
    host: string;
    port: number;
    database: string;
    ssl: boolean;
    timeout: number;
    poolSize: number;
  };
  credentials: {
    username: string;
    password: string;
  };
}

/**
 * Provider para importação de arquivo
 */
export interface FileImportProvider extends AnalyticsProvider {
  type: 'file_import';
  config: {
    allowedFormats: string[];
    maxFileSize: number;
    encoding: string;
    delimiter?: string;
    hasHeader: boolean;
    dateFormat?: string;
    timezone?: string;
  };
  credentials?: {
    encryptionKey?: string;
  };
}

/**
 * Interface para métodos de provider
 */
export interface ProviderMethods {
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  testConnection(): Promise<boolean>;
  sync(): Promise<void>;
  getMetrics(filters: AnalyticsFilters): Promise<AnalyticsMetric[]>;
  getCharts(filters: AnalyticsFilters): Promise<AnalyticsChart[]>;
  getInsights(filters: AnalyticsFilters): Promise<AnalyticsInsight[]>;
  exportData(filters: AnalyticsFilters, format: string): Promise<any>;
  validateConfig(): Promise<{ isValid: boolean; errors: string[] }>;
  getStatus(): Promise<{
    connected: boolean;
    lastSync?: string;
    error?: string;
    metrics: {
      totalRequests: number;
      successfulRequests: number;
      failedRequests: number;
      averageResponseTime: number;
    };
  }>;
}

/**
 * Implementação base para providers
 */
export abstract class BaseAnalyticsProvider implements AnalyticsProvider, ProviderMethods {
  public id: string;
  public name: string;
  public type: string;
  public version: string;
  public enabled: boolean;
  public config: Record<string, any>;
  public credentials?: Record<string, any>;
  public lastSync?: string;
  public syncInterval: number;
  public status: 'connected' | 'disconnected' | 'error' | 'pending';

  constructor(config: Partial<AnalyticsProvider>) {
    this.id = config.id || '';
    this.name = config.name || '';
    this.type = config.type || '';
    this.version = config.version || '1.0.0';
    this.enabled = config.enabled || false;
    this.config = config.config || {};
    this.credentials = config.credentials;
    this.lastSync = config.lastSync;
    this.syncInterval = config.syncInterval || 3600000; // 1 hora
    this.status = config.status || 'disconnected';
  }

  abstract connect(): Promise<boolean>;
  abstract disconnect(): Promise<void>;
  abstract testConnection(): Promise<boolean>;
  abstract sync(): Promise<void>;
  abstract getMetrics(filters: AnalyticsFilters): Promise<AnalyticsMetric[]>;
  abstract getCharts(filters: AnalyticsFilters): Promise<AnalyticsChart[]>;
  abstract getInsights(filters: AnalyticsFilters): Promise<AnalyticsInsight[]>;
  abstract exportData(filters: AnalyticsFilters, format: string): Promise<any>;

  async validateConfig(): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!this.id) {
      errors.push('ID é obrigatório');
    }

    if (!this.name) {
      errors.push('Nome é obrigatório');
    }

    if (!this.type) {
      errors.push('Tipo é obrigatório');
    }

    if (this.syncInterval < 60000) { // Mínimo 1 minuto
      errors.push('Intervalo de sincronização deve ser pelo menos 1 minuto');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async getStatus(): Promise<{
    connected: boolean;
    lastSync?: string;
    error?: string;
    metrics: {
      totalRequests: number;
      successfulRequests: number;
      failedRequests: number;
      averageResponseTime: number;
    };
  }> {
    return {
      connected: this.status === 'connected',
      lastSync: this.lastSync,
      metrics: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0
      }
    };
  }

  protected log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    console[level](`[${this.type}:${this.name}] ${message}`);
  }

  protected handleError(error: any, context: string): void {
    this.log(`Erro em ${context}: ${error.message}`, 'error');
    this.status = 'error';
  }
}

/**
 * Factory para criar providers
 */
export class AnalyticsProviderFactory {
  private static providers: Map<string, new (config: any) => BaseAnalyticsProvider> = new Map();

  static register(type: string, providerClass: new (config: any) => BaseAnalyticsProvider): void {
    this.providers.set(type, providerClass);
  }

  static create(type: string, config: any): BaseAnalyticsProvider {
    const ProviderClass = this.providers.get(type);
    if (!ProviderClass) {
      throw new Error(`Provider type '${type}' not found`);
    }
    return new ProviderClass(config);
  }

  static getSupportedTypes(): string[] {
    return Array.from(this.providers.keys());
  }
}

/**
 * Registry de providers disponíveis
 */
export const AVAILABLE_PROVIDERS = {
  GOOGLE_ANALYTICS: 'google_analytics',
  FACEBOOK_ANALYTICS: 'facebook_analytics',
  TWITTER_ANALYTICS: 'twitter_analytics',
  LINKEDIN_ANALYTICS: 'linkedin_analytics',
  INSTAGRAM_ANALYTICS: 'instagram_analytics',
  YOUTUBE_ANALYTICS: 'youtube_analytics',
  TIKTOK_ANALYTICS: 'tiktok_analytics',
  CUSTOM_API: 'custom_api',
  WEBHOOK: 'webhook',
  DATABASE: 'database',
  FILE_IMPORT: 'file_import'
} as const;

export default {
  AnalyticsProvider,
  GoogleAnalyticsProvider,
  FacebookAnalyticsProvider,
  TwitterAnalyticsProvider,
  LinkedInAnalyticsProvider,
  InstagramAnalyticsProvider,
  YouTubeAnalyticsProvider,
  TikTokAnalyticsProvider,
  CustomApiProvider,
  WebhookProvider,
  DatabaseProvider,
  FileImportProvider,
  ProviderMethods,
  BaseAnalyticsProvider,
  AnalyticsProviderFactory,
  AVAILABLE_PROVIDERS
};