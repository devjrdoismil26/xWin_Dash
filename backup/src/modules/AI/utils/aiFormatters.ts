/**
 * Formatadores específicos para o módulo AI
 */

import { AIGeneration, AIProvider, AIGenerationType } from '../types';

/**
 * Formatar resultado de geração
 */
export const formatGenerationResult = (generation: AIGeneration): string => {
  const { type, result, metadata } = generation;
  
  switch (type) {
    case 'text':
      return result;
    case 'image':
      return `Imagem gerada: ${metadata.quality ? `Qualidade ${(metadata.quality * 100).toFixed(0)}%` : 'Imagem'}`;
    case 'video':
      return `Vídeo gerado: ${metadata.duration ? `${(metadata.duration / 1000).toFixed(1)}s` : 'Vídeo'}`;
    case 'audio':
      return `Áudio gerado: ${metadata.duration ? `${(metadata.duration / 1000).toFixed(1)}s` : 'Áudio'}`;
    case 'code':
      return `Código gerado: ${result.length} caracteres`;
    default:
      return result;
  }
};

/**
 * Formatar estatísticas de geração
 */
export const formatGenerationStats = (generation: AIGeneration): string => {
  const { metadata } = generation;
  const stats = [];
  
  if (metadata.tokens) {
    stats.push(`${metadata.tokens} tokens`);
  }
  
  if (metadata.cost) {
    stats.push(`R$ ${metadata.cost.toFixed(4)}`);
  }
  
  if (metadata.duration) {
    stats.push(`${(metadata.duration / 1000).toFixed(1)}s`);
  }
  
  if (metadata.quality) {
    stats.push(`${(metadata.quality * 100).toFixed(0)}% qualidade`);
  }
  
  return stats.join(' • ');
};

/**
 * Formatar nome do provedor
 */
export const formatProviderName = (provider: AIProvider): string => {
  const names: Record<AIProvider, string> = {
    openai: 'OpenAI',
    claude: 'Claude (Anthropic)',
    gemini: 'Google Gemini',
    anthropic: 'Anthropic',
    cohere: 'Cohere'
  };
  
  return names[provider] || provider;
};

/**
 * Formatar nome do modelo
 */
export const formatModelName = (model: string): string => {
  // Remover prefixos comuns
  const cleanModel = model
    .replace(/^gpt-/, 'GPT-')
    .replace(/^claude-/, 'Claude ')
    .replace(/^gemini-/, 'Gemini ')
    .replace(/-pro$/, ' Pro')
    .replace(/-turbo$/, ' Turbo');
  
  return cleanModel;
};

/**
 * Formatar tipo de geração
 */
export const formatGenerationType = (type: AIGenerationType): string => {
  const types: Record<AIGenerationType, string> = {
    text: 'Texto',
    image: 'Imagem',
    video: 'Vídeo',
    audio: 'Áudio',
    code: 'Código'
  };
  
  return types[type] || type;
};

/**
 * Formatar prompt para exibição
 */
export const formatPrompt = (prompt: string, maxLength: number = 100): string => {
  if (prompt.length <= maxLength) return prompt;
  
  // Tentar quebrar em uma palavra completa
  const truncated = prompt.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
};

/**
 * Formatar custo para exibição
 */
export const formatCost = (cost: number): string => {
  if (cost < 0.01) {
    return `R$ ${(cost * 1000).toFixed(2)} (mil)`;
  } else if (cost < 1) {
    return `R$ ${cost.toFixed(4)}`;
  } else {
    return `R$ ${cost.toFixed(2)}`;
  }
};

/**
 * Formatar tokens para exibição
 */
export const formatTokens = (tokens: number): string => {
  if (tokens < 1000) {
    return `${tokens} tokens`;
  } else if (tokens < 1000000) {
    return `${(tokens / 1000).toFixed(1)}K tokens`;
  } else {
    return `${(tokens / 1000000).toFixed(1)}M tokens`;
  }
};

/**
 * Formatar qualidade para exibição
 */
export const formatQuality = (quality: number): string => {
  const percentage = Math.round(quality * 100);
  
  if (percentage >= 90) return 'Excelente';
  if (percentage >= 80) return 'Muito Bom';
  if (percentage >= 70) return 'Bom';
  if (percentage >= 60) return 'Regular';
  return 'Baixo';
};

/**
 * Formatar duração para exibição
 */
export const formatDuration = (duration: number): string => {
  if (duration < 1000) {
    return `${duration}ms`;
  } else if (duration < 60000) {
    return `${(duration / 1000).toFixed(1)}s`;
  } else {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }
};

/**
 * Formatar status para exibição
 */
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    error: 'Erro',
    loading: 'Carregando',
    maintenance: 'Manutenção',
    completed: 'Concluído',
    failed: 'Falhou',
    pending: 'Pendente'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

/**
 * Formatar lista de gerações para exibição
 */
export const formatGenerationsList = (generations: AIGeneration[]): string => {
  if (generations.length === 0) return 'Nenhuma geração encontrada';
  
  const summary = generations.reduce((acc, gen) => {
    acc[gen.type] = (acc[gen.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const parts = Object.entries(summary).map(([type, count]) => 
    `${count} ${formatGenerationType(type as AIGenerationType)}${count > 1 ? 's' : ''}`
  );
  
  return parts.join(', ');
};

/**
 * Formatar resumo de analytics
 */
export const formatAnalyticsSummary = (data: any): string => {
  const { totalGenerations, totalCost, totalTokens, avgQuality } = data;
  
  const parts = [];
  
  if (totalGenerations) {
    parts.push(`${totalGenerations} gerações`);
  }
  
  if (totalCost) {
    parts.push(formatCost(totalCost));
  }
  
  if (totalTokens) {
    parts.push(formatTokens(totalTokens));
  }
  
  if (avgQuality) {
    parts.push(`${formatQuality(avgQuality)} qualidade`);
  }
  
  return parts.join(' • ');
};
