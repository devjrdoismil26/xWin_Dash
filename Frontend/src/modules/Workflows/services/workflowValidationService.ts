import { Workflow, WorkflowExecution, WorkflowStep, WorkflowTrigger, WorkflowCanvasData, WorkflowCanvasNode, WorkflowCanvasEdge, WorkflowValidationResult, WorkflowTemplate } from '../types/workflowTypes';

// Interface para resultado de validação detalhado
export interface DetailedValidationResult {
  is_valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
  score: number;
  // 0-100;
}

// Interface para erro de validação
export interface ValidationError {
  code: string;
  message: string;
  field?: string;
  node_id?: string;
  step_id?: string;
  severity: 'error' | 'warning' | 'info'; }

// Interface para aviso de validação
export interface ValidationWarning {
  code: string;
  message: string;
  field?: string;
  node_id?: string;
  step_id?: string;
  suggestion?: string; }

// Interface para sugestão de validação
export interface ValidationSuggestion {
  code: string;
  message: string;
  field?: string;
  node_id?: string;
  step_id?: string;
  action?: string; }

// Interface para validação de execução
export interface ExecutionValidationResult {
  is_valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  estimated_duration?: number;
  resource_requirements?: {
    memory: number;
  cpu: number;
  storage: number; };

}

// Interface para validação de template
export interface TemplateValidationResult {
  is_valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
  compatibility_score: number;
  required_variables: string[];
  optional_variables: string[]; }

/**
 * Service para validação de workflows
 * Responsável por validação de estrutura, execução e templates
 */
class WorkflowValidationService {
  private readonly MAX_STEPS = 100;
  private readonly MAX_NODES = 200;
  private readonly MAX_EDGES = 300;
  private readonly MAX_NAME_LENGTH = 100;
  private readonly MAX_DESCRIPTION_LENGTH = 500;

  /**
   * Valida um workflow completo
   */
  validateWorkflow(workflow: Workflow): DetailedValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: ValidationSuggestion[] = [];

    // Validações básicas
    this.validateBasicStructure(workflow, errors, warnings, suggestions);

    // Validações de trigger
    this.validateTrigger(workflow.trigger, errors, warnings, suggestions);

    // Validações de steps
    this.validateSteps(workflow.steps, errors, warnings, suggestions);

    // Validações de canvas
    if (workflow.canvas_data) {
      this.validateCanvasData(workflow.canvas_data, errors, warnings, suggestions);

    }
    
    // Validações de integridade
    this.validateWorkflowIntegrity(workflow, errors, warnings, suggestions);

    // Calcular score
    const score = this.calculateValidationScore(errors, warnings, suggestions);

    return {
      is_valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score};

  }

  /**
   * Valida uma execução de workflow
   */
  validateExecution(workflow: Workflow, variables?: Record<string, any>): ExecutionValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validação básica do workflow
    const workflowValidation = this.validateWorkflow(workflow);

    errors.push(...workflowValidation.errors);

    warnings.push(...workflowValidation.warnings);

    // Validação de variáveis
    if (variables) {
      this.validateExecutionVariables(workflow, variables, errors, warnings);

    }

    // Estimativa de duração
    const estimatedDuration = this.estimateExecutionDuration(workflow);

    // Requisitos de recursos
    const resourceRequirements = this.calculateResourceRequirements(workflow);

    return {
      is_valid: errors.length === 0,
      errors,
      warnings,
      estimated_duration: estimatedDuration,
      resource_requirements: resourceRequirements};

  }

  /**
   * Valida um template de workflow
   */
  validateTemplate(template: WorkflowTemplate): TemplateValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: ValidationSuggestion[] = [];

    // Validação básica do template
    this.validateTemplateStructure(template, errors, warnings, suggestions);

    // Validação dos dados do template
    if (template.template_data) {
      const workflowValidation = this.validateWorkflow({
        id: 0,
        name: template.name,
        description: template.description,
        status: 'draft',
        trigger: template.template_data.trigger || {} as WorkflowTrigger,
        steps: template.template_data.steps || [],
        canvas_data: template.template_data,
        is_active: false,
        executions_count: 0,
        success_rate: 0,
        created_at: template.created_at,
        updated_at: template.updated_at
      });

      errors.push(...workflowValidation.errors);

      warnings.push(...workflowValidation.warnings);

      suggestions.push(...workflowValidation.suggestions);

    }

    // Análise de variáveis
    const { required, optional } = this.analyzeTemplateVariables(template);

    // Score de compatibilidade
    const compatibilityScore = this.calculateCompatibilityScore(errors, warnings, suggestions);

    return {
      is_valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      compatibility_score: compatibilityScore,
      required_variables: required,
      optional_variables: optional};

  }

  /**
   * Valida estrutura básica do workflow
   */
  private validateBasicStructure(
    workflow: Workflow,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    // Nome
    if (!workflow.name || workflow.name.trim().length === 0) {
      errors.push({
        code: 'MISSING_NAME',
        message: 'Nome do workflow é obrigatório',
        field: 'name',
        severity: 'error'
      });

    } else if (workflow.name.length > this.MAX_NAME_LENGTH) {
      errors.push({
        code: 'NAME_TOO_LONG',
        message: `Nome deve ter no máximo ${this.MAX_NAME_LENGTH} caracteres`,
        field: 'name',
        severity: 'error'
      });

    }

    // Descrição
    if (workflow.description && workflow.description.length > this.MAX_DESCRIPTION_LENGTH) {
      warnings.push({
        code: 'DESCRIPTION_TOO_LONG',
        message: `Descrição deve ter no máximo ${this.MAX_DESCRIPTION_LENGTH} caracteres`,
        field: 'description'
      });

    }

    // Steps
    if (!workflow.steps || workflow.steps.length === 0) {
      errors.push({
        code: 'NO_STEPS',
        message: 'Workflow deve ter pelo menos um step',
        field: 'steps',
        severity: 'error'
      });

    } else if (workflow.steps.length > this.MAX_STEPS) {
      errors.push({
        code: 'TOO_MANY_STEPS',
        message: `Workflow deve ter no máximo ${this.MAX_STEPS} steps`,
        field: 'steps',
        severity: 'error'
      });

    } /**
   * Valida trigger do workflow
   */
  private validateTrigger(
    trigger: WorkflowTrigger,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    if (!trigger) {
      errors.push({
        code: 'MISSING_TRIGGER',
        message: 'Trigger é obrigatório',
        field: 'trigger',
        severity: 'error'
      });

      return;
    }

    if (!trigger.type) {
      errors.push({
        code: 'MISSING_TRIGGER_TYPE',
        message: 'Tipo do trigger é obrigatório',
        field: 'trigger.type',
        severity: 'error'
      });

    }

    // Validações específicas por tipo de trigger
    if (trigger.type === 'schedule' && !trigger.schedule) {
      errors.push({
        code: 'MISSING_SCHEDULE',
        message: 'Schedule é obrigatório para trigger de tipo schedule',
        field: 'trigger.schedule',
        severity: 'error'
      });

    }

    if (trigger.type === 'webhook' && (!trigger.conditions || trigger.conditions.length === 0)) {
      warnings.push({
        code: 'NO_WEBHOOK_CONDITIONS',
        message: 'Webhook sem condições pode ser executado por qualquer requisição',
        field: 'trigger.conditions'
      });

    } /**
   * Valida steps do workflow
   */
  private validateSteps(
    steps: WorkflowStep[],
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    if (!steps || steps.length === 0) return;

    const stepIds = new Set<string>();

    const stepNames = new Set<string>();

    steps.forEach((step: unknown, index: unknown) => {
      // ID único
      if (step.id) {
        if (stepIds.has(step.id)) {
          errors.push({
            code: 'DUPLICATE_STEP_ID',
            message: `ID duplicado encontrado: ${step.id}`,
            step_id: step.id,
            severity: 'error'
          });

        } else {
          stepIds.add(step.id);

        } // Nome único
      if (step.name) {
        if (stepNames.has(step.name)) {
          warnings.push({
            code: 'DUPLICATE_STEP_NAME',
            message: `Nome duplicado encontrado: ${step.name}`,
            step_id: step.id,
            suggestion: 'Considere usar nomes únicos para melhor identificação'
          });

        } else {
          stepNames.add(step.name);

        } // Validação de configuração
      if (!step.config) {
        warnings.push({
          code: 'MISSING_STEP_CONFIG',
          message: `Step ${index + 1} não possui configuração`,
          step_id: step.id,
          suggestion: 'Adicione configuração para o step'
        });

      }

      // Validação de tipo
      if (!step.type) {
        errors.push({
          code: 'MISSING_STEP_TYPE',
          message: `Tipo do step ${index + 1} é obrigatório`,
          step_id: step.id,
          severity: 'error'
        });

      } );

  }

  /**
   * Valida dados do canvas
   */
  private validateCanvasData(
    canvasData: WorkflowCanvasData,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    if (!canvasData) return;

    // Validação de nós
    if (canvasData.nodes) {
      if (canvasData.nodes.length > this.MAX_NODES) {
        errors.push({
          code: 'TOO_MANY_NODES',
          message: `Canvas deve ter no máximo ${this.MAX_NODES} nós`,
          field: 'canvas_data.nodes',
          severity: 'error'
        });

      }

      const nodeIds = new Set<string>();

      canvasData.nodes.forEach((node: unknown, index: unknown) => {
        if (nodeIds.has(node.id)) {
          errors.push({
            code: 'DUPLICATE_NODE_ID',
            message: `ID de nó duplicado: ${node.id}`,
            node_id: node.id,
            severity: 'error'
          });

        } else {
          nodeIds.add(node.id);

        } );

    }

    // Validação de arestas
    if (canvasData.edges) {
      if (canvasData.edges.length > this.MAX_EDGES) {
        errors.push({
          code: 'TOO_MANY_EDGES',
          message: `Canvas deve ter no máximo ${this.MAX_EDGES} arestas`,
          field: 'canvas_data.edges',
          severity: 'error'
        });

      }

      const edgeIds = new Set<string>();

      canvasData.edges.forEach((edge: unknown, index: unknown) => {
        if (edgeIds.has(edge.id)) {
          errors.push({
            code: 'DUPLICATE_EDGE_ID',
            message: `ID de aresta duplicado: ${edge.id}`,
            severity: 'error'
          });

        } else {
          edgeIds.add(edge.id);

        } );

    } /**
   * Valida integridade do workflow
   */
  private validateWorkflowIntegrity(
    workflow: Workflow,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    // Verificar se há loops infinitos
    if (this.hasInfiniteLoops(workflow)) {
      warnings.push({
        code: 'INFINITE_LOOP_DETECTED',
        message: 'Possível loop infinito detectado no workflow',
        suggestion: 'Revise as condições e loops no workflow'
      });

    }

    // Verificar se há nós órfãos
    if (workflow.canvas_data) {
      const orphanNodes = this.findOrphanNodes(workflow.canvas_data);

      if (orphanNodes.length > 0) {
        warnings.push({
          code: 'ORPHAN_NODES',
          message: `${orphanNodes.length} nós órfãos encontrados`,
          suggestion: 'Conecte todos os nós ao fluxo principal'
        });

      } }

  /**
   * Valida variáveis de execução
   */
  private validateExecutionVariables(
    workflow: Workflow,
    variables: Record<string, any>,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // Implementar validação de variáveis baseada no workflow
    // Por exemplo, verificar se variáveis obrigatórias estão presentes
    // e se os tipos estão corretos
  }

  /**
   * Valida estrutura do template
   */
  private validateTemplateStructure(
    template: WorkflowTemplate,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    if (!template.name || template.name.trim().length === 0) {
      errors.push({
        code: 'MISSING_TEMPLATE_NAME',
        message: 'Nome do template é obrigatório',
        field: 'name',
        severity: 'error'
      });

    }

    if (!template.description || template.description.trim().length === 0) {
      errors.push({
        code: 'MISSING_TEMPLATE_DESCRIPTION',
        message: 'Descrição do template é obrigatória',
        field: 'description',
        severity: 'error'
      });

    }

    if (!template.category || template.category.trim().length === 0) {
      errors.push({
        code: 'MISSING_TEMPLATE_CATEGORY',
        message: 'Categoria do template é obrigatória',
        field: 'category',
        severity: 'error'
      });

    }

    if (!template.template_data) {
      errors.push({
        code: 'MISSING_TEMPLATE_DATA',
        message: 'Dados do template são obrigatórios',
        field: 'template_data',
        severity: 'error'
      });

    } /**
   * Analisa variáveis do template
   */
  private analyzeTemplateVariables(template: WorkflowTemplate): { required: string[]; optional: string[] } {
    const required: string[] = [];
    const optional: string[] = [];

    // Implementar análise de variáveis baseada no template_data
    // Extrair variáveis obrigatórias e opcionais

    return { required, optional};

  }

  /**
   * Calcula score de validação
   */
  private calculateValidationScore(
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): number {
    let score = 100;
    
    // Penalizar por erros
    score -= errors.length * 20;
    
    // Penalizar por warnings
    score -= warnings.length * 5;
    
    // Penalizar por sugestões
    score -= suggestions.length * 2;
    
    return Math.max(0, score);

  }

  /**
   * Calcula score de compatibilidade
   */
  private calculateCompatibilityScore(
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): number {
    return this.calculateValidationScore(errors, warnings, suggestions);

  }

  /**
   * Estima duração da execução
   */
  private estimateExecutionDuration(workflow: Workflow): number {
    // Implementar estimativa baseada nos steps e suas configurações
    return workflow.steps.length * 1000; // Estimativa básica
  }

  /**
   * Calcula requisitos de recursos
   */
  private calculateResourceRequirements(workflow: Workflow): { memory: number; cpu: number; storage: number } {
    // Implementar cálculo baseado nos steps
    return {
      memory: workflow.steps.length * 10, // MB
      cpu: workflow.steps.length * 0.1,   // CPU units
      storage: workflow.steps.length * 1   // MB};

  }

  /**
   * Verifica se há loops infinitos
   */
  private hasInfiniteLoops(workflow: Workflow): boolean {
    // Implementar detecção de loops infinitos
    return false;
  }

  /**
   * Encontra nós órfãos
   */
  private findOrphanNodes(canvasData: WorkflowCanvasData): string[] {
    // Implementar detecção de nós órfãos
    return [];
  } // Instância singleton
export const workflowValidationService = new WorkflowValidationService();

export default workflowValidationService;
