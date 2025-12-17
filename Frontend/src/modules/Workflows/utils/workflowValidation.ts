/**
 * Sistema de Validação para Workflows
 *
 * @description
 * Sistema robusto de validação para workflows com regras configuráveis,
 * validação em tempo real, cross-field validation e sugestões de erro.
 * Implementa validação em tempo real com mensagens padronizadas.
 *
 * @module modules/Workflows/utils/workflowValidation
 * @since 1.0.0
 */

/**
 * Interfaces de validação
 *
 * @description
 * Interfaces TypeScript para regras de validação, resultados e contexto.
 */
interface ValidationRule<T = any> {
  name: string;
  message: string;
  validate: (value: T, context?: Record<string, any>) => boolean;
  severity: 'error' | 'warning' | 'info';
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number; }

interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error';
  value?: string;
  suggestion?: string; }

interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  severity: 'warning';
  value?: string;
  suggestion?: string; }

interface ValidationContext {
  workflow?: Record<string, any>;
  existingWorkflows?: Array<Record<string, any>>;
  userPermissions?: string[];
  systemLimits?: Record<string, number>; }

// Regras de validação básicas
const BASIC_RULES = {
  required: (message: string = 'Este campo é obrigatório'): ValidationRule => ({
    name: 'required',
    message,
    validate: (value: unknown) => value !== null && value !== undefined && value !== '',
    severity: 'error'
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    name: 'minLength',
    message: message || `Deve ter pelo menos ${min} caracteres`,
    validate: (value: unknown) => typeof value === 'string' && value.length >= min,
    severity: 'error'
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    name: 'maxLength',
    message: message || `Deve ter no máximo ${max} caracteres`,
    validate: (value: unknown) => typeof value === 'string' && value.length <= max,
    severity: 'error'
  }),

  email: (message: string = 'Email inválido'): ValidationRule => ({
    name: 'email',
    message,
    validate: (value: unknown) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return typeof value === 'string' && emailRegex.test(value);

    },
    severity: 'error'
  }),

  url: (message: string = 'URL inválida'): ValidationRule => ({
    name: 'url',
    message,
    validate: (value: unknown) => {
      try {
        new URL(value);

        return true;
      } catch {
        return false;
      } ,
    severity: 'error'
  }),

  number: (message: string = 'Deve ser um número'): ValidationRule => ({
    name: 'number',
    message,
    validate: (value: unknown) => !isNaN(Number(value)),
    severity: 'error'
  }),

  min: (min: number, message?: string): ValidationRule => ({
    name: 'min',
    message: message || `Deve ser maior ou igual a ${min}`,
    validate: (value: unknown) => Number(value) >= min,
    severity: 'error'
  }),

  max: (max: number, message?: string): ValidationRule => ({
    name: 'max',
    message: message || `Deve ser menor ou igual a ${max}`,
    validate: (value: unknown) => Number(value) <= max,
    severity: 'error'
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    name: 'pattern',
    message,
    validate: (value: unknown) => regex.test(String(value)),
    severity: 'error'
  }),

  custom: (validator: (value: Record<string, any>, context?: Record<string, any>) => boolean, message: string): ValidationRule => ({
    name: 'custom',
    message,
    validate: validator,
    severity: 'error'
  })};

// Regras específicas para workflows
const WORKFLOW_RULES = {
  uniqueName: (existingWorkflows: string[] = [], message?: string): ValidationRule => ({
    name: 'uniqueName',
    message: message || 'Nome já existe',
    validate: (value: unknown, context: unknown) => {
      const currentId = context?.workflow?.id;
      return !existingWorkflows.some(w => w.name === value && w.id !== currentId);

    },
    severity: 'error'
  }),

  validTriggerType: (message: string = 'Tipo de trigger inválido'): ValidationRule => ({
    name: 'validTriggerType',
    message,
    validate: (value: unknown) => {
      const validTypes = ['webhook', 'schedule', 'email_received', 'form_submitted', 'user_action', 'api_call', 'manual'];
      return validTypes.includes(value);

    },
    severity: 'error'
  }),

  validStatus: (message: string = 'Status inválido'): ValidationRule => ({
    name: 'validStatus',
    message,
    validate: (value: unknown) => {
      const validStatuses = ['draft', 'active', 'paused', 'archived'];
      return validStatuses.includes(value);

    },
    severity: 'error'
  }),

  hasSteps: (message: string = 'Workflow deve ter pelo menos um step'): ValidationRule => ({
    name: 'hasSteps',
    message,
    validate: (value: unknown) => Array.isArray(value) && value.length > 0,
    severity: 'error'
  }),

  maxSteps: (max: number = 100, message?: string): ValidationRule => ({
    name: 'maxSteps',
    message: message || `Máximo de ${max} steps permitidos`,
    validate: (value: unknown) => Array.isArray(value) && value.length <= max,
    severity: 'warning'
  }),

  validStepTypes: (message: string = 'Tipo de step inválido'): ValidationRule => ({
    name: 'validStepTypes',
    message,
    validate: (value: unknown) => {
      const validTypes = ['action', 'condition', 'delay', 'email', 'webhook', 'api', 'data', 'loop'];
      return Array.isArray(value) && value.every(step => validTypes.includes(step.type));

    },
    severity: 'error'
  }),

  noInfiniteLoops: (message: string = 'Loop infinito detectado'): ValidationRule => ({
    name: 'noInfiniteLoops',
    message,
    validate: (value: unknown) => {
      // Implementar detecção de loops infinitos
      return true; // Placeholder
    },
    severity: 'warning'
  }),

  validSchedule: (message: string = 'Agendamento inválido'): ValidationRule => ({
    name: 'validSchedule',
    message,
    validate: (value: unknown, context: unknown) => {
      if (context?.workflow?.trigger?.type !== 'schedule') return true;
      return value && typeof value === 'object' && value.cron;
    },
    severity: 'error'
  }),

  validWebhookUrl: (message: string = 'URL do webhook inválida'): ValidationRule => ({
    name: 'validWebhookUrl',
    message,
    validate: (value: unknown, context: unknown) => {
      if (context?.workflow?.trigger?.type !== 'webhook') return true;
      return value && typeof value === 'string' && value.startsWith('http');

    },
    severity: 'error'
  })};

/**
 * Classe principal do sistema de validação
 */
class WorkflowValidator {
  private rules: Map<string, ValidationRule[]> = new Map();

  constructor() {
    this.setupDefaultRules();

  }

  /**
   * Configura regras padrão
   */
  private setupDefaultRules(): void {
    // Regras para nome do workflow
    this.addRules('name', [
      BASIC_RULES.required('Nome do workflow é obrigatório'),
      BASIC_RULES.minLength(3, 'Nome deve ter pelo menos 3 caracteres'),
      BASIC_RULES.maxLength(100, 'Nome deve ter no máximo 100 caracteres'),
      WORKFLOW_RULES.uniqueName()
    ]);

    // Regras para descrição
    this.addRules('description', [
      BASIC_RULES.required('Descrição é obrigatória'),
      BASIC_RULES.minLength(10, 'Descrição deve ter pelo menos 10 caracteres'),
      BASIC_RULES.maxLength(500, 'Descrição deve ter no máximo 500 caracteres')
    ]);

    // Regras para trigger
    this.addRules('trigger.type', [
      BASIC_RULES.required('Tipo de trigger é obrigatório'),
      WORKFLOW_RULES.validTriggerType()
    ]);

    // Regras para status
    this.addRules('status', [
      BASIC_RULES.required('Status é obrigatório'),
      WORKFLOW_RULES.validStatus()
    ]);

    // Regras para steps
    this.addRules('steps', [
      WORKFLOW_RULES.hasSteps(),
      WORKFLOW_RULES.maxSteps(),
      WORKFLOW_RULES.validStepTypes(),
      WORKFLOW_RULES.noInfiniteLoops()
    ]);

    // Regras para schedule
    this.addRules('trigger.schedule', [
      WORKFLOW_RULES.validSchedule()
    ]);

    // Regras para webhook
    this.addRules('trigger.webhook_url', [
      WORKFLOW_RULES.validWebhookUrl()
    ]);

  }

  /**
   * Adiciona regras para um campo
   */
  addRules(field: string, rules: ValidationRule[]): void {
    if (!this.rules.has(field)) {
      this.rules.set(field, []);

    }
    this.rules.get(field)!.push(...rules);

  }

  /**
   * Remove regras de um campo
   */
  removeRules(field: string, ruleNames?: string[]): void {
    if (!this.rules.has(field)) return;

    if (!ruleNames) {
      this.rules.delete(field);

      return;
    }

    const fieldRules = this.rules.get(field)!;
    this.rules.set(field, fieldRules.filter(rule => !ruleNames.includes(rule.name)));

  }

  /**
   * Valida um campo específico
   */
  validateField(field: string, value: Record<string, any>, context?: ValidationContext): ValidationResult {
    const fieldRules = this.rules.get(field) || [];
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (const rule of fieldRules) {
      try {
        const isValid = rule.validate(value, context);

        if (!isValid) {
          const error: ValidationError = {
            field,
            message: rule.message,
            code: rule.name,
            severity: 'error',
            value,
            suggestion: this.getSuggestion(rule.name, field)};

          if (rule.severity === 'error') {
            errors.push(error);

          } else {
            warnings.push({
              ...error,
              severity: 'warning'
            });

          } } catch (error) {
        errors.push({
          field,
          message: `Erro na validação: ${getErrorMessage(error)}`,
          code: 'validation_error',
          severity: 'error',
          value
        });

      } const isValid = errors.length === 0;
    const score = this.calculateScore(errors, warnings);

    return {
      isValid,
      errors,
      warnings,
      score};

  }

  /**
   * Valida um objeto completo
   */
  validateObject(obj: Record<string, any>, context?: ValidationContext): ValidationResult {
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationWarning[] = [];

    // Validar cada campo
    for (const [field, rules] of this.rules.entries()) {
      const value = this.getNestedValue(obj, field);

      const result = this.validateField(field, value, context);

      allErrors.push(...result.errors);

      allWarnings.push(...result.warnings);

    }

    // Validações cross-field
    const crossFieldResult = this.validateCrossFields(obj, context);

    allErrors.push(...crossFieldResult.errors);

    allWarnings.push(...crossFieldResult.warnings);

    const isValid = allErrors.length === 0;
    const score = this.calculateScore(allErrors, allWarnings);

    return {
      isValid,
      errors: allErrors,
      warnings: allWarnings,
      score};

  }

  /**
   * Validações entre campos
   */
  private validateCrossFields(obj: Record<string, any>, context?: ValidationContext): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validação: se trigger é schedule, deve ter schedule configurado
    if (obj.trigger?.type === 'schedule' && !obj.trigger?.schedule) {
      errors.push({
        field: 'trigger.schedule',
        message: 'Agendamento é obrigatório para triggers do tipo schedule',
        code: 'missing_schedule',
        severity: 'error'
      });

    }

    // Validação: se trigger é webhook, deve ter URL configurada
    if (obj.trigger?.type === 'webhook' && !obj.trigger?.webhook_url) {
      errors.push({
        field: 'trigger.webhook_url',
        message: 'URL do webhook é obrigatória para triggers do tipo webhook',
        code: 'missing_webhook_url',
        severity: 'error'
      });

    }

    // Validação: workflow ativo deve ter pelo menos um step
    if (obj.status === 'active' && (!obj.steps || obj.steps.length === 0)) {
      errors.push({
        field: 'steps',
        message: 'Workflow ativo deve ter pelo menos um step',
        code: 'active_workflow_no_steps',
        severity: 'error'
      });

    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: this.calculateScore(errors, warnings)};

  }

  /**
   * Obtém valor aninhado de um objeto
   */
  private getNestedValue(obj: Record<string, any>, path: string): unknown {
    return path.split('.').reduce((current: unknown, key: unknown) => current?.[key], obj);

  }

  /**
   * Calcula score de validação
   */
  private calculateScore(errors: ValidationError[], warnings: ValidationWarning[]): number {
    let score = 100;
    score -= errors.length * 20; // -20 por erro
    score -= warnings.length * 5; // -5 por warning
    return Math.max(0, score);

  }

  /**
   * Obtém sugestão para um erro
   */
  private getSuggestion(ruleName: string, field: string): string | undefined {
    const suggestions: Record<string, Record<string, string>> = {
      required: {
        name: 'Digite um nome para o workflow',
        description: 'Descreva o que este workflow faz',
        'trigger.type': 'Selecione um tipo de trigger'
      },
      minLength: {
        name: 'Use pelo menos 3 caracteres para o nome',
        description: 'Forneça uma descrição mais detalhada'
      },
      maxLength: {
        name: 'Use um nome mais curto',
        description: 'Resuma a descrição'
      },
      uniqueName: {
        name: 'Escolha um nome único para este workflow'
      } ;

    return suggestions[ruleName]?.[field];
  }

  /**
   * Valida em tempo real (debounced)
   */
  validateRealtime(field: string, value: Record<string, any>, context?: ValidationContext): Promise<ValidationResult> {
    return new Promise((resolve: unknown) => {
      setTimeout(() => {
        resolve(this.validateField(field, value, context));

      }, 300); // Debounce de 300ms
    });

  }

  /**
   * Obtém regras de um campo
   */
  getFieldRules(field: string): ValidationRule[] {
    return this.rules.get(field) || [];
  }

  /**
   * Lista todos os campos com regras
   */
  getFields(): string[] {
    return Array.from(this.rules.keys());

  } // Instância global do validador
export const workflowValidator = new WorkflowValidator();

// Utilitários de validação
export const validationUtils = {
  /**
   * Valida workflow completo
   */
  validateWorkflow(workflow: Record<string, any>, context?: ValidationContext): ValidationResult {
    return workflowValidator.validateObject(workflow, context);

  },

  /**
   * Valida campo específico
   */
  validateField(field: string, value: Record<string, any>, context?: ValidationContext): ValidationResult {
    return workflowValidator.validateField(field, value, context);

  },

  /**
   * Valida em tempo real
   */
  validateRealtime(field: string, value: Record<string, any>, context?: ValidationContext): Promise<ValidationResult> {
    return workflowValidator.validateRealtime(field, value, context);

  },

  /**
   * Formata erros para exibição
   */
  formatErrors(errors: ValidationError[]): string[] {
    return errors.map(error => (error as any).message);

  },

  /**
   * Obtém primeiro erro de um campo
   */
  getFirstError(errors: ValidationError[], field: string): ValidationError | null {
    return errors.find(error => (error as any).field === field) || null;
  },

  /**
   * Verifica se há erros para um campo
   */
  hasFieldError(errors: ValidationError[], field: string): boolean {
    return errors.some(error => (error as any).field === field);

  },

  /**
   * Agrupa erros por campo
   */
  groupErrorsByField(errors: ValidationError[]): Record<string, ValidationError[]> {
    return errors.reduce((groups: unknown, error: unknown) => {
      if (!groups[error.field]) {
        groups[error.field] = [];
      }
      groups[error.field].push(error);

      return groups;
    }, {} as Record<string, ValidationError[]>);

  } ;

// Exportar regras básicas e específicas
export { BASIC_RULES, WORKFLOW_RULES };

export default WorkflowValidator;
