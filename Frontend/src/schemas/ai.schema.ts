import { z } from 'zod';

/**
 * Schema para a resposta da API de geração de texto.
 * Valida que a resposta é um objeto com uma propriedade 'result' que é uma string.
 */
export const TextGenerationResponseSchema = z.object({
  result: z.string({
    message: "A resposta da API deve conter um resultado válido.",
  }),
});

/**
 * Schema para a requisição de geração de texto.
 * Valida que a requisição contém um prompt e um modelo.
 */
export const TextGenerationRequestSchema = z.object({
  prompt: z.string().min(1, "O prompt não pode estar vazio."),
  model: z.string().min(1, "Um modelo deve ser selecionado."),
  provider: z.string().optional(), // O backend pode inferir o provedor a partir do modelo
});
