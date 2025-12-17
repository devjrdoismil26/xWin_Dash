import {  } from '@/lib/utils';
// getErrorMessage removido - usar try/catch direto
/**
 * Sistema de Validação para o módulo Users
 *
 * @description
 * Sistema robusto de validação para usuários com regras configuráveis,
 * validação em tempo real, validações assíncronas e cross-field validation.
 * Implementa validação robusta com mensagens padronizadas.
 *
 * @module modules/Users/utils/userValidation
 * @since 1.0.0
 */

/**
 * Interfaces de validação
 *
 * @description
 * Interfaces TypeScript para regras de validação, resultados e configuração.
 */
interface ValidationRule<T = any> {
  name: string;
  message: string;
  validate: (value: T, context?: Record<string, any>) => boolean | Promise<boolean>;
  priority?: number;
  async?: boolean;
}

// Interface para resultado de validação
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number;
  // 0-100;
}

// Interface para erro de validação
interface ValidationError {
  field: string;
  rule: string;
  message: string;
  value?: string;
  context?: Record<string, any>; }

// Interface para warning de validação
interface ValidationWarning {
  field: string;
  rule: string;
  message: string;
  suggestion?: string;
  value?: string; }

// Interface para configuração de validação
interface ValidationConfig {
  strictMode: boolean;
  showWarnings: boolean;
  asyncValidation: boolean;
  debounceMs: number;
  maxErrors: number;
  [key: string]: unknown; }

/**
 * Classe principal de validação
 */
class UserValidator {
  private rules = new Map<string, ValidationRule[]>();

  private config: ValidationConfig;
  private debounceTimers = new Map<string, NodeJS.Timeout>();

  constructor(config: Partial<ValidationConfig> = {}) {
    this.config = {
      strictMode: false,
      showWarnings: true,
      asyncValidation: true,
      debounceMs: 300,
      maxErrors: 10,
      ...config};

    this.initializeDefaultRules();

  }

  /**
   * Adiciona uma regra de validação
   */
  addRule(field: string, rule: ValidationRule): void {
    if (!this.rules.has(field)) {
      this.rules.set(field, []);

    }

    const fieldRules = this.rules.get(field)!;
    
    // Remover regra existente com o mesmo nome
    const existingIndex = fieldRules.findIndex(r => r.name === rule.name);

    if (existingIndex >= 0) {
      fieldRules[existingIndex] = rule;
    } else {
      fieldRules.push(rule);

    }

    // Ordenar por prioridade
    fieldRules.sort((a: unknown, b: unknown) => (b.priority || 0) - (a.priority || 0));

  }

  /**
   * Remove uma regra de validação
   */
  removeRule(field: string, ruleName: string): void {
    const fieldRules = this.rules.get(field);

    if (fieldRules) {
      const index = fieldRules.findIndex(r => r.name === ruleName);

      if (index >= 0) {
        fieldRules.splice(index, 1);

      } }

  /**
   * Valida um campo específico
   */
  async validateField(field: string, value: unknown, context?: Record<string, any>): Promise<ValidationResult> {
    const fieldRules = this.rules.get(field) || [];
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (const rule of fieldRules) {
      try {
        const isValid = await rule.validate(value, context);

        if (!isValid) {
          errors.push({
            field,
            rule: rule.name,
            message: rule.message,
            value,
            context
          });

          if (errors.length >= this.config.maxErrors) {
            break;
          } } catch (error) {
        errors.push({
          field,
          rule: rule.name,
          message: `Erro na validação: ${getErrorMessage(error)}`,
          value,
          context
        });

      } const score = this.calculateScore(errors, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score};

  }

  /**
   * Valida um objeto completo
   */
  async validateObject(data: Record<string, any>, context?: Record<string, any>): Promise<ValidationResult> {
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationWarning[] = [];

    // Validar campos individuais
    for (const [field, value] of Object.entries(data)) {
      const result = await this.validateField(field, value, { ...context, allData: data });

      allErrors.push(...result.errors);

      allWarnings.push(...result.warnings);

    }

    // Validações cross-field
    const crossFieldResult = await this.validateCrossFields(data, context);

    allErrors.push(...crossFieldResult.errors);

    allWarnings.push(...crossFieldResult.warnings);

    const score = this.calculateScore(allErrors, allWarnings);

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      score};

  }

  /**
   * Validação em tempo real com debounce
   */
  validateFieldRealtime(
    field: string,
    value: unknown,
    callback?: (e: any) => void,
    context?: Record<string, any />
  ): void {
    // Limpar timer anterior
    const existingTimer = this.debounceTimers.get(field);

    if (existingTimer) {
      clearTimeout(existingTimer);

    }

    // Criar novo timer
    const timer = setTimeout(async () => {
      const result = await this.validateField(field, value, context);

      callback(result);

      this.debounceTimers.delete(field);

    }, this.config.debounceMs);

    this.debounceTimers.set(field, timer);

  }

  /**
   * Validações cross-field
   */
  private async validateCrossFields(data: Record<string, any>, context?: Record<string, any>): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Exemplo: confirmar senha
    if (data.password && (data as any).confirmPassword) {
      if (data.password !== (data as any).confirmPassword) {
        errors.push({
          field: 'confirmPassword',
          rule: 'passwordMatch',
          message: 'As senhas não coincidem',
          value: (data as any).confirmPassword,
          context
        });

      } // Exemplo: data de nascimento vs idade mínima
    if (data.birthDate && (data as any).minAge) {
      const birthDate = new Date(data.birthDate);

      const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

      if (age < (data as any).minAge) {
        errors.push({
          field: 'birthDate',
          rule: 'minimumAge',
          message: `Idade mínima de ${data.minAge} anos não atendida`,
          value: (data as any).birthDate,
          context
        });

      } // Exemplo: verificar disponibilidade de email
    if (data.email && context?.checkEmailAvailability) {
      try {
        const isAvailable = await this.checkEmailAvailability(data.email);

        if (!isAvailable) {
          errors.push({
            field: 'email',
            rule: 'emailAvailability',
            message: 'Este email já está em uso',
            value: (data as any).email,
            context
          });

        } catch (error) {
        warnings.push({
          field: 'email',
          rule: 'emailAvailability',
          message: 'Não foi possível verificar a disponibilidade do email',
          suggestion: 'Tente novamente mais tarde',
          value: (data as any).email
        });

      } return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: this.calculateScore(errors, warnings)};

  }

  /**
   * Calcula score de validação
   */
  private calculateScore(errors: ValidationError[], warnings: ValidationWarning[]): number {
    const totalChecks = errors.length + warnings.length;
    if (totalChecks === 0) return 100;

    const errorWeight = 2; // Erros têm peso maior
    const warningWeight = 1;
    
    const totalPenalty = (errors.length * errorWeight) + (warnings.length * warningWeight);

    const maxPenalty = totalChecks * errorWeight;
    
    return Math.max(0, 100 - (totalPenalty / maxPenalty) * 100);

  }

  /**
   * Verifica disponibilidade de email (simulação)
   */
  private async checkEmailAvailability(email: string): Promise<boolean> {
    // Simular verificação assíncrona
    await new Promise(resolve => setTimeout(resolve, 100));

    // Simular alguns emails já em uso
    const usedEmails = ['admin@example.com', 'test@example.com', 'user@example.com'];
    return !usedEmails.includes(email.toLowerCase());

  }

  /**
   * Inicializa regras padrão
   */
  private initializeDefaultRules(): void {
    // Regras para nome
    this.addRule('name', {
      name: 'required',
      message: 'Nome é obrigatório',
      validate: (value: unknown) => value && value.trim().length > 0,
      priority: 10
    });

    this.addRule('name', {
      name: 'minLength',
      message: 'Nome deve ter pelo menos 2 caracteres',
      validate: (value: unknown) => !value || value.trim().length >= 2,
      priority: 9
    });

    this.addRule('name', {
      name: 'maxLength',
      message: 'Nome deve ter no máximo 100 caracteres',
      validate: (value: unknown) => !value || value.trim().length <= 100,
      priority: 8
    });

    // Regras para email
    this.addRule('email', {
      name: 'required',
      message: 'Email é obrigatório',
      validate: (value: unknown) => value && value.trim().length > 0,
      priority: 10
    });

    this.addRule('email', {
      name: 'emailFormat',
      message: 'Formato de email inválido',
      validate: (value: unknown) => {
        if (!value) return true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);

      },
      priority: 9
    });

    this.addRule('email', {
      name: 'maxLength',
      message: 'Email deve ter no máximo 255 caracteres',
      validate: (value: unknown) => !value || value.length <= 255,
      priority: 8
    });

    // Regras para senha
    this.addRule('password', {
      name: 'required',
      message: 'Senha é obrigatória',
      validate: (value: unknown) => value && value.length > 0,
      priority: 10
    });

    this.addRule('password', {
      name: 'minLength',
      message: 'Senha deve ter pelo menos 8 caracteres',
      validate: (value: unknown) => !value || value.length >= 8,
      priority: 9
    });

    this.addRule('password', {
      name: 'complexity',
      message: 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número',
      validate: (value: unknown) => {
        if (!value) return true;
        const hasUpper = /[A-Z]/.test(value);

        const hasLower = /[a-z]/.test(value);

        const hasNumber = /\d/.test(value);

        return hasUpper && hasLower && hasNumber;
      },
      priority: 8
    });

    // Regras para telefone
    this.addRule('phone', {
      name: 'phoneFormat',
      message: 'Formato de telefone inválido',
      validate: (value: unknown) => {
        if (!value) return true;
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(value.replace(/[\s\-()]/g, ''));

      },
      priority: 9
    });

    // Regras para data de nascimento
    this.addRule('birthDate', {
      name: 'dateFormat',
      message: 'Data de nascimento inválida',
      validate: (value: unknown) => {
        if (!value) return true;
        const date = new Date(value);

        return !isNaN(date.getTime()) && date <= new Date();

      },
      priority: 9
    });

    // Regras para role
    this.addRule('role', {
      name: 'validRole',
      message: 'Role inválida',
      validate: (value: unknown) => {
        if (!value) return true;
        const validRoles = ['admin', 'moderator', 'user', 'editor'];
        return validRoles.includes(value);

      },
      priority: 9
    });

  }

  /**
   * Limpa timers de debounce
   */
  destroy(): void {
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);

    }
    this.debounceTimers.clear();

  } // Instância global do validador
export const userValidator = new UserValidator();

// Funções utilitárias
export const validationUtils = {
  /**
   * Valida dados de criação de usuário
   */
  async validateCreateUser(data: Record<string, any>): Promise<ValidationResult> {
    return userValidator.validateObject(data, { 
      checkEmailAvailability: true,
      operation: 'create' 
    });

  },

  /**
   * Valida dados de atualização de usuário
   */
  async validateUpdateUser(data: Record<string, any>, userId: string): Promise<ValidationResult> {
    return userValidator.validateObject(data, { 
      checkEmailAvailability: true,
      operation: 'update',
      userId 
    });

  },

  /**
   * Valida dados de login
   */
  async validateLogin(data: Record<string, any>): Promise<ValidationResult> {
    const loginValidator = new UserValidator();

    // Adicionar regras específicas para login
    loginValidator.addRule('email', {
      name: 'required',
      message: 'Email é obrigatório',
      validate: (value: unknown) => value && value.trim().length > 0,
      priority: 10
    });

    loginValidator.addRule('password', {
      name: 'required',
      message: 'Senha é obrigatória',
      validate: (value: unknown) => value && value.length > 0,
      priority: 10
    });

    return loginValidator.validateObject(data);

  },

  /**
   * Valida dados de alteração de senha
   */
  async validateChangePassword(data: Record<string, any>): Promise<ValidationResult> {
    const passwordValidator = new UserValidator();

    // Regras para senha atual
    passwordValidator.addRule('currentPassword', {
      name: 'required',
      message: 'Senha atual é obrigatória',
      validate: (value: unknown) => value && value.length > 0,
      priority: 10
    });

    // Regras para nova senha
    passwordValidator.addRule('newPassword', {
      name: 'required',
      message: 'Nova senha é obrigatória',
      validate: (value: unknown) => value && value.length > 0,
      priority: 10
    });

    passwordValidator.addRule('newPassword', {
      name: 'minLength',
      message: 'Nova senha deve ter pelo menos 8 caracteres',
      validate: (value: unknown) => !value || value.length >= 8,
      priority: 9
    });

    // Regra para confirmação de senha
    passwordValidator.addRule('confirmPassword', {
      name: 'required',
      message: 'Confirmação de senha é obrigatória',
      validate: (value: unknown) => value && value.length > 0,
      priority: 10
    });

    const result = await passwordValidator.validateObject(data);

    // Validação cross-field: nova senha vs confirmação
    if (data.newPassword && (data as any).confirmPassword && (data as any).newPassword !== (data as any).confirmPassword) {
      result.errors.push({
        field: 'confirmPassword',
        rule: 'passwordMatch',
        message: 'As senhas não coincidem',
        value: (data as any).confirmPassword
      });

      result.isValid = false;
    }

    return result;
  },

  /**
   * Valida dados de perfil
   */
  async validateProfile(data: Record<string, any>): Promise<ValidationResult> {
    const profileValidator = new UserValidator();

    // Regras específicas para perfil
    profileValidator.addRule('bio', {
      name: 'maxLength',
      message: 'Biografia deve ter no máximo 500 caracteres',
      validate: (value: unknown) => !value || value.length <= 500,
      priority: 8
    });

    profileValidator.addRule('website', {
      name: 'urlFormat',
      message: 'URL do website inválida',
      validate: (value: unknown) => {
        if (!value) return true;
        try {
          new URL(value);

          return true;
        } catch {
          return false;
        } ,
      priority: 8
    });

    return profileValidator.validateObject(data);

  } ;

// Exportar tipos e classes
export { UserValidator };

export type { 
  ValidationRule, 
  ValidationResult, 
  ValidationError, 
  ValidationWarning, 
  ValidationConfig};
