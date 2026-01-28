// =========================================
// SERVIÇO DE VALIDAÇÃO E TRATAMENTO DE ERROS - CONFIGURAÇÕES
// =========================================

// =========================================
// INTERFACES
// =========================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message?: string;
  validator?: (value: any) => boolean;
}

export interface ErrorContext {
  operation: string;
  settingId?: string;
  userId?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'validation' | 'network' | 'permission' | 'system' | 'unknown';
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
  suggestions?: string[];
}

// =========================================
// REGRAS DE VALIDAÇÃO
// =========================================

const VALIDATION_RULES: Record<string, ValidationRule[]> = {
  generalSettings: [
    { field: 'app_name', type: 'required', message: 'Nome da aplicação é obrigatório' },
    { field: 'app_name', type: 'min', value: 2, message: 'Nome da aplicação deve ter pelo menos 2 caracteres' },
    { field: 'app_name', type: 'max', value: 100, message: 'Nome da aplicação deve ter no máximo 100 caracteres' },
    { field: 'app_version', type: 'required', message: 'Versão da aplicação é obrigatória' },
    { field: 'app_version', type: 'pattern', value: /^\d+\.\d+\.\d+$/, message: 'Versão deve estar no formato X.Y.Z' },
    { field: 'timezone', type: 'required', message: 'Timezone é obrigatório' },
    { field: 'language', type: 'required', message: 'Idioma é obrigatório' },
    { field: 'theme', type: 'custom', validator: (value) => ['light', 'dark', 'auto'].includes(value), message: 'Tema deve ser light, dark ou auto' },
    { field: 'max_upload_size', type: 'min', value: 1024, message: 'Tamanho máximo de upload deve ser pelo menos 1KB' },
    { field: 'session_timeout', type: 'min', value: 300, message: 'Timeout de sessão deve ser pelo menos 5 minutos' }
  ],
  authSettings: [
    { field: 'password_min_length', type: 'required', message: 'Tamanho mínimo da senha é obrigatório' },
    { field: 'password_min_length', type: 'min', value: 6, message: 'Tamanho mínimo da senha deve ser pelo menos 6 caracteres' },
    { field: 'session_timeout', type: 'required', message: 'Timeout de sessão é obrigatório' },
    { field: 'session_timeout', type: 'min', value: 300, message: 'Timeout de sessão deve ser pelo menos 5 minutos' },
    { field: 'max_login_attempts', type: 'min', value: 1, message: 'Máximo de tentativas de login deve ser pelo menos 1' }
  ],
  userSettings: [
    { field: 'default_role', type: 'required', message: 'Função padrão é obrigatória' },
    { field: 'auto_approve_users', type: 'custom', validator: (value) => typeof value === 'boolean', message: 'Auto aprovação deve ser um valor booleano' }
  ],
  databaseSettings: [
    { field: 'host', type: 'required', message: 'Host do banco de dados é obrigatório' },
    { field: 'port', type: 'required', message: 'Porta do banco de dados é obrigatória' },
    { field: 'port', type: 'min', value: 1, message: 'Porta deve ser um número positivo' },
    { field: 'port', type: 'max', value: 65535, message: 'Porta deve ser menor que 65536' },
    { field: 'database', type: 'required', message: 'Nome do banco de dados é obrigatório' }
  ],
  emailSettings: [
    { field: 'smtp_host', type: 'required', message: 'Host SMTP é obrigatório' },
    { field: 'smtp_port', type: 'required', message: 'Porta SMTP é obrigatória' },
    { field: 'smtp_port', type: 'min', value: 1, message: 'Porta SMTP deve ser um número positivo' },
    { field: 'smtp_username', type: 'required', message: 'Usuário SMTP é obrigatório' },
    { field: 'from_email', type: 'pattern', value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email de origem deve ser válido' }
  ],
  integrationSettings: [
    { field: 'webhook_url', type: 'pattern', value: /^https?:\/\/.+/, message: 'URL do webhook deve ser válida' },
    { field: 'webhook_timeout', type: 'min', value: 1, message: 'Timeout do webhook deve ser pelo menos 1 segundo' }
  ],
  aiSettings: [
    { field: 'api_key', type: 'required', message: 'Chave da API é obrigatória' },
    { field: 'model', type: 'required', message: 'Modelo é obrigatório' },
    { field: 'max_tokens', type: 'min', value: 1, message: 'Máximo de tokens deve ser pelo menos 1' }
  ],
  apiSettings: [
    { field: 'rate_limit', type: 'min', value: 1, message: 'Limite de taxa deve ser pelo menos 1' },
    { field: 'timeout', type: 'min', value: 1000, message: 'Timeout deve ser pelo menos 1000ms' }
  ]
};

// =========================================
// SERVIÇO DE VALIDAÇÃO
// =========================================

class SettingsValidationService {
  /**
   * Validar dados de configurações gerais
   */
  validateGeneralSettingsData(data: any): ValidationResult {
    return this.validateData(data, 'generalSettings');
  }

  /**
   * Validar dados de configurações de autenticação
   */
  validateAuthSettingsData(data: any): ValidationResult {
    return this.validateData(data, 'authSettings');
  }

  /**
   * Validar dados de configurações de usuário
   */
  validateUserSettingsData(data: any): ValidationResult {
    return this.validateData(data, 'userSettings');
  }

  /**
   * Validar dados de configurações de banco de dados
   */
  validateDatabaseSettingsData(data: any): ValidationResult {
    return this.validateData(data, 'databaseSettings');
  }

  /**
   * Validar dados de configurações de email
   */
  validateEmailSettingsData(data: any): ValidationResult {
    return this.validateData(data, 'emailSettings');
  }

  /**
   * Validar dados de configurações de integração
   */
  validateIntegrationSettingsData(data: any): ValidationResult {
    return this.validateData(data, 'integrationSettings');
  }

  /**
   * Validar dados de configurações de IA
   */
  validateAISettingsData(data: any): ValidationResult {
    return this.validateData(data, 'aiSettings');
  }

  /**
   * Validar dados de configurações de API
   */
  validateAPISettingsData(data: any): ValidationResult {
    return this.validateData(data, 'apiSettings');
  }

  /**
   * Validar dados genéricos
   */
  private validateData(data: any, category: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const rules = VALIDATION_RULES[category] || [];

    rules.forEach(rule => {
      const value = data[rule.field];
      
      switch (rule.type) {
        case 'required':
          if (value === undefined || value === null || value === '') {
            errors.push(rule.message || `${rule.field} é obrigatório`);
          }
          break;
        
        case 'min':
          if (value !== undefined && value !== null) {
            if (typeof value === 'string' && value.length < rule.value) {
              errors.push(rule.message || `${rule.field} deve ter pelo menos ${rule.value} caracteres`);
            } else if (typeof value === 'number' && value < rule.value) {
              errors.push(rule.message || `${rule.field} deve ser pelo menos ${rule.value}`);
            }
          }
          break;
        
        case 'max':
          if (value !== undefined && value !== null) {
            if (typeof value === 'string' && value.length > rule.value) {
              errors.push(rule.message || `${rule.field} deve ter no máximo ${rule.value} caracteres`);
            } else if (typeof value === 'number' && value > rule.value) {
              errors.push(rule.message || `${rule.field} deve ser no máximo ${rule.value}`);
            }
          }
          break;
        
        case 'pattern':
          if (value !== undefined && value !== null && !rule.value.test(value)) {
            errors.push(rule.message || `${rule.field} não está no formato correto`);
          }
          break;
        
        case 'custom':
          if (value !== undefined && value !== null && rule.validator && !rule.validator(value)) {
            errors.push(rule.message || `${rule.field} não é válido`);
          }
          break;
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// =========================================
// SERVIÇO DE TRATAMENTO DE ERROS
// =========================================

class SettingsErrorService {
  private errorLogs: ErrorLog[] = [];

  /**
   * Categorizar erro
   */
  private categorizeError(error: any): 'validation' | 'network' | 'permission' | 'system' | 'unknown' {
    if (error.name === 'ValidationError') return 'validation';
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('network')) return 'network';
    if (error.status === 403 || error.message?.includes('permission')) return 'permission';
    if (error.status >= 500) return 'system';
    return 'unknown';
  }

  /**
   * Determinar severidade do erro
   */
  private getErrorSeverity(error: any, category: string): 'low' | 'medium' | 'high' | 'critical' {
    if (category === 'validation') return 'low';
    if (category === 'network') return 'medium';
    if (category === 'permission') return 'high';
    if (category === 'system') return 'critical';
    return 'medium';
  }

  /**
   * Gerar mensagem amigável
   */
  private getFriendlyMessage(error: any, context: ErrorContext): string {
    const operation = context.operation;
    
    switch (operation) {
      case 'getGeneralSettings':
        return 'Não foi possível carregar as configurações gerais';
      case 'updateGeneralSetting':
        return 'Não foi possível atualizar a configuração';
      case 'createGeneralSetting':
        return 'Não foi possível criar a configuração';
      case 'deleteGeneralSetting':
        return 'Não foi possível excluir a configuração';
      default:
        return error.message || 'Ocorreu um erro inesperado';
    }
  }

  /**
   * Gerar sugestões
   */
  private getSuggestions(error: any, context: ErrorContext): string[] {
    const suggestions: string[] = [];
    
    if (error.status === 403) {
      suggestions.push('Verifique se você tem permissão para realizar esta ação');
    } else if (error.status === 404) {
      suggestions.push('Verifique se a configuração existe');
    } else if (error.status >= 500) {
      suggestions.push('Tente novamente em alguns minutos');
      suggestions.push('Se o problema persistir, entre em contato com o suporte');
    } else if (error.message?.includes('network')) {
      suggestions.push('Verifique sua conexão com a internet');
      suggestions.push('Tente novamente em alguns segundos');
    }
    
    return suggestions;
  }

  /**
   * Log de erro
   */
  logError(error: any, context: ErrorContext): ErrorLog {
    const category = this.categorizeError(error);
    const severity = this.getErrorSeverity(error, category);
    
    const errorLog: ErrorLog = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: error.message || 'Erro desconhecido',
      stack: error.stack,
      context,
      severity,
      category,
      resolved: false,
      createdAt: new Date().toISOString()
    };

    this.errorLogs.push(errorLog);
    
    // Log no console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error('Settings Error:', errorLog);
    }
    
    return errorLog;
  }

  /**
   * Tratar erro e retornar resposta padronizada
   */
  handleError(error: any, context: ErrorContext): ErrorResponse {
    const errorLog = this.logError(error, context);
    const friendlyMessage = this.getFriendlyMessage(error, context);
    const suggestions = this.getSuggestions(error, context);

    return {
      success: false,
      error: friendlyMessage,
      code: error.code || error.status?.toString(),
      details: {
        originalError: error.message,
        errorId: errorLog.id,
        timestamp: new Date().toISOString()
      },
      suggestions
    };
  }

  /**
   * Obter logs de erro
   */
  getErrorLogs(filters?: {
    category?: string;
    severity?: string;
    resolved?: boolean;
  }): ErrorLog[] {
    let logs = [...this.errorLogs];
    
    if (filters) {
      if (filters.category) {
        logs = logs.filter(log => log.category === filters.category);
      }
      if (filters.severity) {
        logs = logs.filter(log => log.severity === filters.severity);
      }
      if (filters.resolved !== undefined) {
        logs = logs.filter(log => log.resolved === filters.resolved);
      }
    }
    
    return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Marcar erro como resolvido
   */
  markErrorAsResolved(errorId: string): boolean {
    const errorLog = this.errorLogs.find(log => log.id === errorId);
    if (errorLog) {
      errorLog.resolved = true;
      errorLog.resolvedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  /**
   * Limpar logs de erro
   */
  clearErrorLogs(): void {
    this.errorLogs = [];
  }
}

// =========================================
// INSTÂNCIAS SINGLETON
// =========================================

const settingsValidationService = new SettingsValidationService();
const settingsErrorService = new SettingsErrorService();

// =========================================
// FUNÇÕES UTILITÁRIAS
// =========================================

/**
 * Wrapper para operações com tratamento de erro
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  operationName: string,
  context: Partial<ErrorContext> = {}
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    const errorContext: ErrorContext = {
      operation: operationName,
      timestamp: Date.now(),
      ...context
    };
    
    const errorResponse = settingsErrorService.handleError(error, errorContext);
    throw new Error(errorResponse.error);
  }
}

/**
 * Wrapper para operações com retry
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Backoff exponencial
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError;
}

// =========================================
// EXPORTS
// =========================================

export { settingsValidationService, settingsErrorService };

// Funções de validação específicas
export const validateGeneralSettingsData = (data: any) => settingsValidationService.validateGeneralSettingsData(data);
export const validateAuthSettingsData = (data: any) => settingsValidationService.validateAuthSettingsData(data);
export const validateUserSettingsData = (data: any) => settingsValidationService.validateUserSettingsData(data);
export const validateDatabaseSettingsData = (data: any) => settingsValidationService.validateDatabaseSettingsData(data);
export const validateEmailSettingsData = (data: any) => settingsValidationService.validateEmailSettingsData(data);
export const validateIntegrationSettingsData = (data: any) => settingsValidationService.validateIntegrationSettingsData(data);
export const validateAISettingsData = (data: any) => settingsValidationService.validateAISettingsData(data);
export const validateAPISettingsData = (data: any) => settingsValidationService.validateAPISettingsData(data);

// Funções de tratamento de erro
export const handleSettingsError = (error: any, operation: string, context: Partial<ErrorContext> = {}) => {
  const errorContext: ErrorContext = {
    operation,
    timestamp: Date.now(),
    ...context
  };
  return settingsErrorService.handleError(error, errorContext);
};

export const logSettingsError = (error: any, context: ErrorContext) => settingsErrorService.logError(error, context);
export const getSettingsErrorLogs = (filters?: any) => settingsErrorService.getErrorLogs(filters);
export const markSettingsErrorAsResolved = (errorId: string) => settingsErrorService.markErrorAsResolved(errorId);
export const clearSettingsErrorLogs = () => settingsErrorService.clearErrorLogs();
