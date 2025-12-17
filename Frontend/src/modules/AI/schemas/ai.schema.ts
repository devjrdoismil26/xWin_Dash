import { z } from 'zod';

export const aiProviderSchema = z.enum(['openai', 'gemini', 'anthropic']);

export const aiChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1, 'Mensagem não pode estar vazia'),
  timestamp: z.string().datetime().optional(),
});

export const aiRequestSchema = z.object({
  provider: aiProviderSchema.default('openai'),
  model: z.string().optional(),
  messages: z.array(aiChatMessageSchema).min(1),
  temperature: z.number().min(0).max(2).default(0.7),
  max_tokens: z.number().int().min(1).max(8192).default(2000),
});

export const aiImageGenerationSchema = z.object({
  prompt: z.string().min(1, 'Prompt é obrigatório').max(1000),
  size: z.enum(['256x256', '512x512', '1024x1024']).default('512x512'),
  n: z.number().int().min(1).max(10).default(1),
});

export const aiTextAnalysisSchema = z.object({
  text: z.string().min(1, 'Texto é obrigatório'),
  analysis_type: z.enum(['sentiment', 'keywords', 'summary', 'entities']),
});

export type AIProvider = z.infer<typeof aiProviderSchema>;
export type AIChatMessage = z.infer<typeof aiChatMessageSchema>;
export type AIRequest = z.infer<typeof aiRequestSchema>;
export type AIImageGeneration = z.infer<typeof aiImageGenerationSchema>;
export type AITextAnalysis = z.infer<typeof aiTextAnalysisSchema>;
