/**
import { getErrorMessage } from '@/utils/errorHelpers';
import {  } from '@/lib/utils';
// getErrorMessage removido - usar try/catch direto
 * Hook Orquestrador do SocialBuffer
 *
 * @description
 * Hook que coordena todos os hooks especializados do SocialBuffer em uma
 * interface unificada. Gerencia posts e contas com notificações integradas.
 *
 * @module modules/SocialBuffer/hooks/useSocialBufferStandardized
 * @since 1.0.0
 */

import { useCallback, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useSocialBufferStore } from './useSocialBufferStore';
import { useSocialPosts } from './useSocialPosts';
import { useSocialAccounts } from './useSocialAccounts';
import { SocialPost, SocialAccount, SocialFilters } from '../types';

interface UseSocialBufferReturn {
  // Estado consolidado
  loading: boolean;
  error: string | null;
  // Dados principais
  posts: SocialPost[];
  accounts: SocialAccount[];
  // Ações principais
  loadPosts: (filters?: SocialFilters) => Promise<void>;
  createPost: (data: unknown) => Promise<SocialPost>;
  updatePost: (id: string, data: unknown) => Promise<SocialPost>;
  deletePost: (id: string) => Promise<void>;
  // Hooks especializados
  posts: ReturnType<typeof useSocialPosts>;
  accounts: ReturnType<typeof useSocialAccounts>;
  // Utilitários
  clearError??: (e: any) => void;
  refresh: () => Promise<void>; }

export const useSocialBuffer = (): UseSocialBufferReturn => {
  const { showSuccess, showError } = useAdvancedNotifications();

  const store = useSocialBufferStore();

  const posts = useSocialPosts();

  const accounts = useSocialAccounts();

  // Lógica de orquestração
  const loadPosts = useCallback(async (filters?: SocialFilters) => {
    try {
      await posts.loadPosts(filters);

      showSuccess('Posts carregados com sucesso!');

    } catch (error: unknown) {
      showError('Erro ao carregar posts', getErrorMessage(error));

    } , [posts, showSuccess, showError]);

  const createPost = useCallback(async (data: unknown) => {
    try {
      const result = await posts.createPost(data);

      showSuccess('Post criado com sucesso!');

      return result;
    } catch (error: unknown) {
      showError('Erro ao criar post', getErrorMessage(error));

      throw error;
    } , [posts, showSuccess, showError]);

  const updatePost = useCallback(async (id: string, data: unknown) => {
    try {
      const result = await posts.updatePost(id, data);

      showSuccess('Post atualizado com sucesso!');

      return result;
    } catch (error: unknown) {
      showError('Erro ao atualizar post', getErrorMessage(error));

      throw error;
    } , [posts, showSuccess, showError]);

  const deletePost = useCallback(async (id: string) => {
    try {
      await posts.deletePost(id);

      showSuccess('Post excluído com sucesso!');

    } catch (error: unknown) {
      showError('Erro ao excluir post', getErrorMessage(error));

      throw error;
    } , [posts, showSuccess, showError]);

  // Inicialização
  useEffect(() => {
    loadPosts();

    accounts.loadAccounts();

  }, []);

  return {
    loading: store.loading || posts.loading || accounts.loading,
    error: store.error || posts.error || accounts.error,
    posts: store.posts,
    accounts: store.accounts,
    loadPosts,
    createPost,
    updatePost,
    deletePost,
    posts,
    accounts,
    clearError: () => {
      store.clearError();

      posts.clearError();

      accounts.clearError();

    },
    refresh: loadPosts};
};

export default useSocialBuffer;
