/**
 * Tipos de nós suportados pelo backend Aura
 * Baseado nos executors disponíveis no backend
 */

export const SUPPORTED_AURA_NODE_TYPES = {
  // Nós básicos suportados pelo backend
  'send_message': {
    name: 'Enviar Mensagem',
    description: 'Envia uma mensagem de texto',
    executor: 'SendMessageNodeExecutor',
    configSchema: {
      message: { type: 'string', required: true }
    },
    component: 'SendMessageNode'
  },
  
  'multiple_choice': {
    name: 'Múltipla Escolha',
    description: 'Apresenta opções para o usuário escolher',
    executor: 'MultipleChoiceNodeExecutor',
    configSchema: {
      question: { type: 'string', required: true },
      options: { type: 'array', required: true, items: { value: 'string', next_node_id: 'string|null' } }
    },
    component: 'MultipleChoiceNode'
  },

  'transfer_to_human': {
    name: 'Transferir para Humano',
    description: 'Finaliza o fluxo automático e transfere para atendimento humano',
    executor: 'TransferToHumanNodeExecutor',
    configSchema: {
      transfer_message: { type: 'string', required: false }
    },
    component: 'TransferHumanNode'
  },

  // Nós do sistema Workflow (podem ser usados no Aura via integração)
  'delay': {
    name: 'Aguardar',
    description: 'Pausa o fluxo por um tempo determinado',
    executor: 'DelayNodeExecutor',
    configSchema: {
      delay_seconds: { type: 'number', required: true, min: 1, max: 3600 }
    },
    component: 'DelayNode'
  },

  'webhook': {
    name: 'Webhook',
    description: 'Chama uma API externa',
    executor: 'CustomWebhookNodeExecutor',
    configSchema: {
      webhook_name: { type: 'string', required: true },
      url: { type: 'string', required: true },
      method: { type: 'string', required: false, default: 'POST' }
    },
    component: 'WebhookNode'
  }
};

/**
 * Nós que existem no frontend mas NÃO têm suporte no backend Aura
 * Estes devem ser marcados como "não funcionais" ou removidos
 */
export const UNSUPPORTED_NODE_TYPES = [
  'AITextGenerationNode',
  'ConditionKeywordNode', 
  'DatabaseQueryNode',
  'EndFlow',
  'GoToFlow',
  'HttpRequestNode',
  'LoopNode',
  'RequestInputNode',
  'SendMediaNode', // Parcialmente suportado via WhatsApp API
  'SetVariableNode',
  'TriggerWorkflowNode'
];

/**
 * Valida se um tipo de nó é suportado pelo backend
 */
export const isNodeTypeSupported = (nodeType) => {
  return Object.keys(SUPPORTED_AURA_NODE_TYPES).includes(nodeType);
};

/**
 * Obtém a configuração de um tipo de nó
 */
export const getNodeTypeConfig = (nodeType) => {
  return SUPPORTED_AURA_NODE_TYPES[nodeType] || null;
};

/**
 * Valida a configuração de um nó
 */
export const validateNodeConfig = (nodeType, config) => {
  const nodeConfig = getNodeTypeConfig(nodeType);
  if (!nodeConfig) {
    return { valid: false, errors: ['Tipo de nó não suportado'] };
  }

  const errors = [];
  const schema = nodeConfig.configSchema;

  for (const [field, rules] of Object.entries(schema)) {
    const value = config[field];

    // Verificar campos obrigatórios
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors.push(`Campo '${field}' é obrigatório`);
      continue;
    }

    // Verificar tipos
    if (value !== undefined && value !== null) {
      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push(`Campo '${field}' deve ser uma string`);
      }
      if (rules.type === 'number' && typeof value !== 'number') {
        errors.push(`Campo '${field}' deve ser um número`);
      }
      if (rules.type === 'array' && !Array.isArray(value)) {
        errors.push(`Campo '${field}' deve ser um array`);
      }

      // Verificar limites numéricos
      if (rules.type === 'number' && typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push(`Campo '${field}' deve ser pelo menos ${rules.min}`);
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push(`Campo '${field}' deve ser no máximo ${rules.max}`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Lista todos os tipos de nós suportados
 */
export const getSupportedNodeTypes = () => {
  return Object.keys(SUPPORTED_AURA_NODE_TYPES);
};

/**
 * Obtém informações de todos os nós suportados
 */
export const getAllSupportedNodes = () => {
  return SUPPORTED_AURA_NODE_TYPES;
};
