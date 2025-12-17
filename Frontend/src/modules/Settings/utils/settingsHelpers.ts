// =========================================
// UTILITÁRIOS - CONFIGURAÇÕES
// =========================================

// =========================================
// INTERFACES
// =========================================

export interface SettingValue {
  value: string | number | boolean | Record<string, any> | unknown[];
  type: 'string' | 'number' | 'boolean' | 'json' | 'array'; }

export interface SettingMetadata {
  key: string;
  category: string;
  isRequired: boolean;
  isPublic: boolean;
  isSensitive: boolean;
  description?: string;
  validationRules?: string[]; }

// =========================================
// FUNÇÕES DE FORMATAÇÃO
// =========================================

/**
 * Formatar valor de configuração para exibição
 */
export function formatSettingValue(value: unknown, type: string): string {
  if (value === null || value === undefined) {
    return 'Não definido';
  }

  switch (type) {
    case 'boolean':
      return value ? 'Sim' : 'Não';
    case 'number':
      return new Intl.NumberFormat('pt-BR').format(value);

    case 'json':
      try {
        return JSON.stringify(value, null, 2);

      } catch {
        return String(value);

      }
    case 'array':
      return Array.isArray(value) ? value.join(', ') : String(value);

    default:
      return String(value);

  } /**
 * Formatar tipo de configuração
 */
export function formatSettingType(type: string): string {
  const typeMap: Record<string, string> = {
    string: 'Texto',
    number: 'Número',
    boolean: 'Sim/Não',
    json: 'JSON',
    array: 'Lista'};

  return typeMap[type] || type;
}

/**
 * Formatar categoria de configuração
 */
export function formatCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    general: 'Geral',
    auth: 'Autenticação',
    users: 'Usuários',
    database: 'Banco de Dados',
    email: 'Email',
    integrations: 'Integrações',
    ai: 'IA',
    api: 'API'};

  return categoryMap[category] || category;
}

/**
 * Formatar tamanho de arquivo
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Formatar duração em segundos
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);

    return `${minutes}m`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor((seconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
  } else {
    const days = Math.floor(seconds / 86400);

    const hours = Math.floor((seconds % 86400) / 3600);

    return `${days}d ${hours}h`;
  } // =========================================
// FUNÇÕES DE VALIDAÇÃO
// =========================================

/**
 * Validar valor de configuração
 */
export function validateSettingValue(value: unknown, type: string, rules?: Array<Record<string, any>>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validar tipo básico
  switch (type) {
    case 'string':
      if (typeof value !== 'string') {
        errors.push('Valor deve ser uma string');

      }
      break;
    case 'number':
      if (typeof value !== 'number' || isNaN(value)) {
        errors.push('Valor deve ser um número válido');

      }
      break;
    case 'boolean':
      if (typeof value !== 'boolean') {
        errors.push('Valor deve ser um booleano');

      }
      break;
    case 'json':
      try {
        JSON.parse(typeof value === 'string' ? value : JSON.stringify(value));

      } catch {
        errors.push('Valor deve ser um JSON válido');

      }
      break;
    case 'array':
      if (!Array.isArray(value)) {
        errors.push('Valor deve ser um array');

      }
      break;
  }

  // Validar regras específicas
  if (rules) {
    rules.forEach(rule => {
      switch (rule.type) {
        case 'required':
          if (value === null || value === undefined || value === '') {
            errors.push(rule.message || 'Campo é obrigatório');

          }
          break;
        case 'min':
          if (typeof value === 'string' && value.length < rule.value) {
            errors.push(rule.message || `Mínimo de ${rule.value} caracteres`);

          } else if (typeof value === 'number' && value < rule.value) {
            errors.push(rule.message || `Valor mínimo: ${rule.value}`);

          }
          break;
        case 'max':
          if (typeof value === 'string' && value.length > rule.value) {
            errors.push(rule.message || `Máximo de ${rule.value} caracteres`);

          } else if (typeof value === 'number' && value > rule.value) {
            errors.push(rule.message || `Valor máximo: ${rule.value}`);

          }
          break;
        case 'pattern':
          if (typeof value === 'string' && !rule.value.test(value)) {
            errors.push(rule.message || 'Formato inválido');

          }
          break;
      } );

  }

  return {
    isValid: errors.length === 0,
    errors};

}

/**
 * Validar email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);

}

/**
 * Validar URL
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);

    return true;
  } catch {
    return false;
  } /**
 * Validar timezone
 */
export function validateTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });

    return true;
  } catch {
    return false;
  } // =========================================
// FUNÇÕES DE CONVERSÃO
// =========================================

/**
 * Converter valor para tipo específico
 */
export function convertToType(value: unknown, type: string): string | number | boolean | Record<string, any> | unknown[] | null | undefined {
  if (value === null || value === undefined) {
    return value;
  }

  switch (type) {
    case 'string':
      return String(value);

    case 'number': {
      const num = parseFloat(value);

      return isNaN(num) ? 0 : num;
    }
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        return value.toLowerCase() === 'true' || value === '1';
      }
      return Boolean(value);

    case 'json':
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);

        } catch {
          return value;
        } return value;
    case 'array':
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        return value.split(',').map(item => item.trim());

      }
      return [value];
    default:
      return value;
  } /**
 * Converter valor de configuração para string
 */
export function stringifySettingValue(value: unknown, type: string): string {
  switch (type) {
    case 'boolean':
      return value ? 'true' : 'false';
    case 'number':
      return String(value);

    case 'json':
      return JSON.stringify(value);

    case 'array':
      return Array.isArray(value) ? value.join(',') : String(value);

    default:
      return String(value);

  } // =========================================
// FUNÇÕES DE UTILIDADE
// =========================================

/**
 * Obter cor da categoria
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    general: 'blue',
    auth: 'red',
    users: 'green',
    database: 'purple',
    email: 'orange',
    integrations: 'yellow',
    ai: 'indigo',
    api: 'gray'};

  return colors[category] || 'gray';
}

/**
 * Obter ícone da categoria
 */
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    general: '⚙️',
    auth: '🔒',
    users: '👥',
    database: '🗄️',
    email: '📧',
    integrations: '🔗',
    ai: '🤖',
    api: '🔑'};

  return icons[category] || '⚙️';
}

/**
 * Obter cor do tipo
 */
export function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    string: 'blue',
    number: 'green',
    boolean: 'purple',
    json: 'orange',
    array: 'pink'};

  return colors[type] || 'gray';
}

/**
 * Gerar ID único para configuração
 */
export function generateSettingId(category: string, key: string): string {
  return `${category}_${key}_${Date.now()}`;
}

/**
 * Sanitizar chave de configuração
 */
export function sanitizeSettingKey(key: string): string {
  return key
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

}

/**
 * Verificar se configuração é sensível
 */
export function isSensitiveSetting(key: string): boolean {
  const sensitiveKeys = [
    'password',
    'secret',
    'key',
    'token',
    'credential',
    'auth',
    'private'
  ];
  
  const lowerKey = key.toLowerCase();

  return sensitiveKeys.some(sensitive => lowerKey.includes(sensitive));

}

/**
 * Verificar se configuração é obrigatória
 */
export function isRequiredSetting(key: string, category: string): boolean {
  const requiredSettings: Record<string, string[]> = {
    general: ['app_name', 'app_version', 'timezone', 'language'],
    auth: ['password_min_length', 'session_timeout', 'max_login_attempts'],
    database: ['host', 'port', 'database', 'username'],
    email: ['smtp_host', 'smtp_port', 'smtp_username', 'from_email']};

  return requiredSettings[category]?.includes(key) || false;
}

// =========================================
// FUNÇÕES DE AGRUPAMENTO
// =========================================

/**
 * Agrupar configurações por categoria
 */
export function groupSettingsByCategory(settings: string[]): Record<string, unknown[]> {
  return settings.reduce((groups: unknown, setting: unknown) => {
    const category = setting.category || 'general';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(setting);

    return groups;
  }, {} as Record<string, unknown[]>);

}

/**
 * Agrupar configurações por tipo
 */
export function groupSettingsByType(settings: Array<Record<string, any>>): Record<string, Array<Record<string, any>>> {
  return settings.reduce((groups: unknown, setting: unknown) => {
    const type = setting.type || 'string';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(setting);

    return groups;
  }, {} as Record<string, unknown[]>);

}

/**
 * Filtrar configurações por critérios
 */
export function filterSettings(settings: string[], filters: {
  category?: string;
  type?: string;
  isRequired?: boolean;
  isPublic?: boolean;
  isSensitive?: boolean;
  search?: string;
}): unknown[] {
  return settings.filter(setting => {
    if (filters.category && setting.category !== filters.category) {
      return false;
    }
    
    if (filters.type && setting.type !== filters.type) {
      return false;
    }
    
    if (filters.isRequired !== undefined && setting.isRequired !== filters.isRequired) {
      return false;
    }
    
    if (filters.isPublic !== undefined && setting.isPublic !== filters.isPublic) {
      return false;
    }
    
    if (filters.isSensitive !== undefined && setting.isSensitive !== filters.isSensitive) {
      return false;
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();

      const searchableText = [
        setting.key,
        setting.description,
        setting.value
      ].join(' ').toLowerCase();

      if (!searchableText.includes(search)) {
        return false;
      } return true;
  });

}

// =========================================
// FUNÇÕES DE ORDENAÇÃO
// =========================================

/**
 * Ordenar configurações
 */
export function sortSettings(settings: string[], sortBy: string, sortOrder: 'asc' | 'desc' = 'asc'): unknown[] {
  return [...settings].sort((a: unknown, b: unknown) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Converter para string se necessário para comparação
    if (typeof aValue !== 'string') {
      aValue = String(aValue);

    }
    if (typeof bValue !== 'string') {
      bValue = String(bValue);

    }
    
    const comparison = aValue.localeCompare(bValue);

    return sortOrder === 'asc' ? comparison : -comparison;
  });

}

// =========================================
// FUNÇÕES DE ESTATÍSTICAS
// =========================================

/**
 * Calcular estatísticas das configurações
 */
export function calculateSettingsStats(settings: Array<Record<string, any>>): {
  total: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  required: number;
  public: number;
  sensitive: number;
  valid: number;
  invalid: number;
} {
  const stats = {
    total: settings.length,
    byCategory: {} as Record<string, number>,
    byType: {} as Record<string, number>,
    required: 0,
    public: 0,
    sensitive: 0,
    valid: 0,
    invalid: 0};

  settings.forEach(setting => {
    // Por categoria
    const category = setting.category || 'general';
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    
    // Por tipo
    const type = setting.type || 'string';
    stats.byType[type] = (stats.byType[type] || 0) + 1;
    
    // Flags
    if (setting.isRequired) stats.required++;
    if (setting.isPublic) stats.public++;
    if (setting.isSensitive) stats.sensitive++;
    
    // Validação
    const validation = validateSettingValue(setting.value, setting.type, setting.validationRules);

    if (validation.isValid) {
      stats.valid++;
    } else {
      stats.invalid++;
    } );

  return stats;
}

// =========================================
// EXPORTS
// =========================================

export default {
  formatSettingValue,
  formatSettingType,
  formatCategoryName,
  formatFileSize,
  formatDuration,
  validateSettingValue,
  validateEmail,
  validateURL,
  validateTimezone,
  convertToType,
  stringifySettingValue,
  getCategoryColor,
  getCategoryIcon,
  getTypeColor,
  generateSettingId,
  sanitizeSettingKey,
  isSensitiveSetting,
  isRequiredSetting,
  groupSettingsByCategory,
  groupSettingsByType,
  filterSettings,
  sortSettings,
  calculateSettingsStats};
