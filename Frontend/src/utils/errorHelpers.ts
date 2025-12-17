/**
 * Helpers para tratamento seguro de erros
 *
 * @module utils/errorHelpers
 * @description
 * Funções utilitárias para extrair mensagens de erro de forma segura,
 * suportando diferentes tipos de erros (Error, Axios, etc.)
 *
 * @since 1.0.0
 */

/**
 * Interface para erros do Axios
 *
 * @interface AxiosErrorResponse
 * @property {object} response - Resposta do Axios
 * @property {object} (response as any).data - Dados da resposta
 * @property {string} [response.data.message] - Mensagem de erro
 */
interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
  error?: string; };

    status?: number;
    statusText?: string;};

  message?: string;
}

/**
 * Extrai mensagem de erro de forma segura
 *
 * @description
 * Extrai a mensagem de erro de diferentes tipos de objetos de erro,
 * incluindo Error nativo, erros do Axios, e outros tipos.
 * Sempre retorna uma string, nunca undefined.
 *
 * @param {any} error - Erro desconhecido (pode ser Error, Axios error, string, etc.)
 * @returns {string} Mensagem de erro ou string padrão
 *
 * @example
 * ```ts
 * try {
 *   await someAsyncOperation();

 * } catch (error: unknown) {
 *   const message = getErrorMessage(error);

 *   console.error(message);

 * }
 * ```
 *
 * @example
 * ```ts
 * // Com Axios
 * try {
 *   await apiClient.get('/endpoint');

 * } catch (error: unknown) {
 *   const message = getErrorMessage(error);

 *   // Retorna (error as any).response.data.message se disponível
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  // Caso 1: É uma instância de Error
  if (error instanceof Error) {
    return (error as any).message || 'Erro desconhecido';
  }

  // Caso 2: É um objeto com estrutura de erro do Axios
  if (typeof error === 'object' && error !== null) {
    const axiosError = error as AxiosErrorResponse;

    // Tenta pegar mensagem do (response as any).data.message (Axios padrão)
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    // Tenta pegar mensagem do (response as any).data.error
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }

    // Tenta pegar mensagem direta do objeto
    if (axiosError.message) {
      return axiosError.message;
    }

    // Se tem response mas sem mensagem, cria mensagem genérica
    if (axiosError.response) {
      const status = axiosError.response.status;
      const statusText = axiosError.response.statusText;
      if (status && statusText) {
        return `Erro HTTP ${status}: ${statusText}`;
      }
      if (status) {
        return `Erro HTTP ${status}`;
      } }

  // Caso 3: É uma string
  if (typeof error === 'string') {
    return error;
  }

  // Caso 4: Fallback genérico
  return 'Erro desconhecido';
}

/**
 * Verifica se o erro é um erro do Axios
 *
 * @param {any} error - Erro desconhecido
 * @returns {boolean} True se for erro do Axios
 *
 * @example
 * ```ts
 * try {
 *   await apiClient.get('/endpoint');

 * } catch (error: unknown) {
 *   if (isAxiosError(error)) {
 *     console.log('Status:', (error as any).response?.status);

 *   }
 * }
 * ```
 */
export function isAxiosError(error: unknown): error is AxiosErrorResponse {
  return (
            typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as AxiosErrorResponse).response === 'object');

}

/**
 * Extrai código de status HTTP do erro (se disponível)
 *
 * @param {any} error - Erro desconhecido
 * @returns {number | null} Código de status HTTP ou null
 *
 * @example
 * ```ts
 * try {
 *   await apiClient.get('/endpoint');

 * } catch (error: unknown) {
 *   const status = getErrorStatus(error);

 *   if (status === 404) {
 *     console.log('Recurso não encontrado');

 *   }
 * }
 * ```
 */
export function getErrorStatus(error: unknown): number | null {
  if (isAxiosError(error)) {
    return (error as any).response?.status ?? null;
  }
  return null;
}
