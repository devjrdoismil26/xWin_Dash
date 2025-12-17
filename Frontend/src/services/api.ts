/**
 * API Service - Wrapper para ApiClient
 *
 * @description
 * Este módulo serve como um wrapper/compatibilidade para o ApiClient moderno.
 * Re-exporta a instância global do ApiClient mantendo compatibilidade com código
 * legado e testes que importam de '@/services/api'.
 *
 * **Nota:** Para novos códigos, prefira importar diretamente de '@/services/http/apiClient'
 * ou usar a instância exportada de '@/services' que é mais completa e possui
 * melhor tipagem e documentação.
 *
 * Funcionalidades principais:
 * - Wrapper compatível com código legado
 * - Re-export da instância global do ApiClient
 * - Mantém compatibilidade com testes existentes
 *
 * @module services/api
 * @since 1.0.0
 * @deprecated Prefira usar apiClient de '@/services/http/apiClient' ou '@/services'
 *
 * @example
 * ```ts
 * // Uso legado (ainda funciona)
 * import apiClient from '@/services/api';
 * const users = await apiClient.get('/api/users');

 *
 * // Uso recomendado (novo código)
 * import { apiClient } from '@/services/http/apiClient';
 * const users = await apiClient.get<User[]>('/api/users');

 * ```
 */

/**
 * Re-exporta a instância global do ApiClient
 *
 * @description
 * Exporta a instância do ApiClient de '@/services/http/apiClient' para manter
 * compatibilidade com código legado e testes que importam de '@/services/api'.
 *
 * @constant {ApiClient}
 * @deprecated Use apiClient de '@/services/http/apiClient' ou '@/services' em vez disso
 */
export { apiClient as default } from './http/apiClient';