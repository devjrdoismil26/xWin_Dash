// =========================================
// PRODUCTS ERROR SERVICE - TRATAMENTO DE ERROS
// =========================================
// Serviço para tratamento centralizado de erros
// Máximo: 200 linhas

// =========================================
// INTERFACES DE ERRO
// =========================================

interface ErrorContext {
  operation: string;
  productId?: string;
  userId?: string;
  timestamp: number;
  userAgent?: string;
  url?: string;
}

interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'validation' | 'network' | 'business' | 'system';
  resolved: boolean;
  createdAt: number;
  resolvedAt?: number;
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
  suggestions?: string[];
}

// =========================================
// CATEGORIZAÇÃO DE ERROS
// =========================================

const categorizeError = (error: any): { category: ErrorLog['category']; severity: ErrorLog['severity'] } => {
  // Erros de validação
  if (error.message?.includes('validation') || error.message?.includes('invalid') || error.message?.includes('required')) {
    return { category: 'validation', severity: 'medium' };
  }

  // Erros de rede
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('network') || error.message?.includes('timeout')) {
    return { category: 'network', severity: 'high' };
  }

  // Erros de negócio
  if (error.code === 'BUSINESS_ERROR' || error.message?.includes('business') || error.message?.includes('rule')) {
    return { category: 'business', severity: 'medium' };
  }

  // Erros críticos do sistema
  if (error.code === 'SYSTEM_ERROR' || error.message?.includes('system') || error.message?.includes('internal')) {
    return { category: 'system', severity: 'critical' };
  }

  // Erro padrão
  return { category: 'system', severity: 'high' };
};

// =========================================
// MENSAGENS DE ERRO AMIGÁVEIS
// =========================================

const getFriendlyErrorMessage = (error: any, operation: string): string => {
  const message = error.message || error.toString();

  // Erros de validação
  if (message.includes('validation') || message.includes('invalid')) {
    return 'Os dados fornecidos não são válidos. Verifique as informações e tente novamente.';
  }

  // Erros de rede
  if (message.includes('network') || message.includes('timeout') || message.includes('fetch')) {
    return 'Problema de conexão. Verifique sua internet e tente novamente.';
  }

  // Erros de permissão
  if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) {
    return 'Você não tem permissão para realizar esta operação.';
  }

  // Erros de não encontrado
  if (message.includes('not found') || message.includes('404')) {
    return 'O item solicitado não foi encontrado.';
  }

  // Erros de conflito
  if (message.includes('conflict') || message.includes('duplicate') || message.includes('already exists')) {
    return 'Já existe um item com essas informações.';
  }

  // Erros de servidor
  if (message.includes('server') || message.includes('500') || message.includes('internal')) {
    return 'Erro interno do servidor. Tente novamente em alguns minutos.';
  }

  // Mensagem padrão baseada na operação
  switch (operation) {
    case 'create':
      return 'Erro ao criar o item. Tente novamente.';
    case 'update':
      return 'Erro ao atualizar o item. Tente novamente.';
    case 'delete':
      return 'Erro ao excluir o item. Tente novamente.';
    case 'fetch':
      return 'Erro ao carregar os dados. Tente novamente.';
    default:
      return 'Ocorreu um erro inesperado. Tente novamente.';
  }
};

// =========================================
// SUGESTÕES DE SOLUÇÃO
// =========================================

const getErrorSuggestions = (error: any, operation: string): string[] => {
  const suggestions: string[] = [];
  const message = error.message || error.toString();

  // Sugestões baseadas no tipo de erro
  if (message.includes('validation') || message.includes('invalid')) {
    suggestions.push('Verifique se todos os campos obrigatórios estão preenchidos');
    suggestions.push('Confirme se os dados estão no formato correto');
  }

  if (message.includes('network') || message.includes('timeout')) {
    suggestions.push('Verifique sua conexão com a internet');
    suggestions.push('Tente novamente em alguns segundos');
    suggestions.push('Se o problema persistir, contate o suporte');
  }

  if (message.includes('permission') || message.includes('unauthorized')) {
    suggestions.push('Faça login novamente');
    suggestions.push('Verifique se você tem as permissões necessárias');
  }

  if (message.includes('not found') || message.includes('404')) {
    suggestions.push('Verifique se o item ainda existe');
    suggestions.push('Atualize a página e tente novamente');
  }

  if (message.includes('conflict') || message.includes('duplicate')) {
    suggestions.push('Verifique se já existe um item similar');
    suggestions.push('Tente usar informações diferentes');
  }

  // Sugestões baseadas na operação
  switch (operation) {
    case 'create':
      suggestions.push('Verifique se todos os campos estão preenchidos corretamente');
      break;
    case 'update':
      suggestions.push('Certifique-se de que o item ainda existe');
      suggestions.push('Verifique se você tem permissão para editar');
      break;
    case 'delete':
      suggestions.push('Verifique se o item não está sendo usado em outro lugar');
      suggestions.push('Confirme se você tem permissão para excluir');
      break;
  }

  return suggestions;
};

// =========================================
// LOGGING DE ERROS
// =========================================

class ProductsErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 1000;

  logError(error: any, context: ErrorContext): ErrorLog {
    const { category, severity } = categorizeError(error);
    
    const errorLog: ErrorLog = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: error.message || error.toString(),
      stack: error.stack,
      context,
      severity,
      category,
      resolved: false,
      createdAt: Date.now()
    };

    this.logs.unshift(errorLog);
    
    // Manter apenas os logs mais recentes
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Log no console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error('Products Error:', errorLog);
    }

    // Enviar para serviço de monitoramento em produção
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(errorLog);
    }

    return errorLog;
  }

  private async sendToMonitoring(errorLog: ErrorLog): Promise<void> {
    try {
      // Aqui você pode integrar com serviços como Sentry, LogRocket, etc.
      // await monitoringService.logError(errorLog);
    } catch (err) {
      console.error('Failed to send error to monitoring:', err);
    }
  }

  getLogs(filter?: { category?: string; severity?: string; resolved?: boolean }): ErrorLog[] {
    let filteredLogs = this.logs;

    if (filter) {
      if (filter.category) {
        filteredLogs = filteredLogs.filter(log => log.category === filter.category);
      }
      if (filter.severity) {
        filteredLogs = filteredLogs.filter(log => log.severity === filter.severity);
      }
      if (filter.resolved !== undefined) {
        filteredLogs = filteredLogs.filter(log => log.resolved === filter.resolved);
      }
    }

    return filteredLogs;
  }

  markAsResolved(errorId: string): boolean {
    const log = this.logs.find(l => l.id === errorId);
    if (log) {
      log.resolved = true;
      log.resolvedAt = Date.now();
      return true;
    }
    return false;
  }

  clearLogs(): void {
    this.logs = [];
  }
}

// Instância singleton
const errorLogger = new ProductsErrorLogger();

// =========================================
// FUNÇÕES PRINCIPAIS
// =========================================

export const handleProductsError = (error: any, operation: string, context?: Partial<ErrorContext>): ErrorResponse => {
  const errorContext: ErrorContext = {
    operation,
    timestamp: Date.now(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    ...context
  };

  // Log do erro
  const errorLog = errorLogger.logError(error, errorContext);

  // Gerar resposta amigável
  const friendlyMessage = getFriendlyErrorMessage(error, operation);
  const suggestions = getErrorSuggestions(error, operation);

  return {
    success: false,
    error: friendlyMessage,
    code: error.code || errorLog.id,
    details: process.env.NODE_ENV === 'development' ? error : undefined,
    suggestions
  };
};

export const logProductsError = (error: any, context: ErrorContext): ErrorLog => {
  return errorLogger.logError(error, context);
};

export const getErrorLogs = (filter?: { category?: string; severity?: string; resolved?: boolean }): ErrorLog[] => {
  return errorLogger.getLogs(filter);
};

export const markErrorAsResolved = (errorId: string): boolean => {
  return errorLogger.markAsResolved(errorId);
};

export const clearErrorLogs = (): void => {
  errorLogger.clearLogs();
};

// =========================================
// WRAPPER PARA OPERAÇÕES ASSÍNCRONAS
// =========================================

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  context?: Partial<ErrorContext>
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    const errorResponse = handleProductsError(error, operationName, context);
    throw new Error(errorResponse.error);
  }
};

// =========================================
// RETRY COM BACKOFF EXPONENCIAL
// =========================================

export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }

      // Não fazer retry para erros de validação ou permissão
      if (error.message?.includes('validation') || 
          error.message?.includes('permission') || 
          error.message?.includes('unauthorized')) {
        break;
      }

      // Delay exponencial
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};
