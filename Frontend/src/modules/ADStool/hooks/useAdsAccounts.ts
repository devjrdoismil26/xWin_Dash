/**
 * Hook especializado para contas de anúncios do módulo ADStool
 * @module modules/ADStool/hooks/useAdsAccountsStandardized
 * @description
 * Hook React padronizado para gerenciamento de contas de anúncios, usando hooks
 * do React (useState, useCallback) e integração com notificações avançadas.
 * Fornece operações CRUD padronizadas, estado local e métodos de refresh.
 * @since 1.0.0
 */
import { useCallback, useState, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { AdsAccountService } from '../services/adsAccountService';
import { AdsAccount, AdsFilters } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';

interface UseAdsAccountsReturn {
  // Estado
  accounts: AdsAccount[];
  currentAccount: AdsAccount | null;
  loading: boolean;
  error: string | null;
  // Ações
  loadAccounts: (filters?: AdsFilters) => Promise<void>;
  createAccount: (data: Partial<AdsAccount>) => Promise<AdsAccount>;
  updateAccount: (id: string, data: Partial<AdsAccount>) => Promise<AdsAccount>;
  deleteAccount: (id: string) => Promise<void>;
  // Utilitários
  clearError??: (e: any) => void;
  refresh: () => Promise<void>; }

export const useAdsAccounts = (): UseAdsAccountsReturn => {
  const [accounts, setAccounts] = useState<AdsAccount[]>([]);

  const [currentAccount, setCurrentAccount] = useState<AdsAccount | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const { showSuccess, showError } = useAdvancedNotifications();

  const loadAccounts = useCallback(async (filters?: AdsFilters) => {
    setLoading(true);

    setError(null);

    try {
      const result = await AdsAccountService.getAccounts(filters);

      setAccounts(result.data || []);

      showSuccess('Contas carregadas com sucesso!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao carregar contas';
      setError(errorMessage);

      showError('Erro ao carregar contas', errorMessage);

    } finally {
      setLoading(false);

    } , [showSuccess, showError]);

  const createAccount = useCallback(async (data: Partial<AdsAccount>) => {
    setLoading(true);

    setError(null);

    try {
      const result = await AdsAccountService.createAccount(data);

      setAccounts(prev => [result.data, ...prev]);

      showSuccess('Conta criada com sucesso!');

      return result.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao criar conta';
      setError(errorMessage);

      showError('Erro ao criar conta', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , [showSuccess, showError]);

  const updateAccount = useCallback(async (id: string, data: Partial<AdsAccount>) => {
    setLoading(true);

    setError(null);

    try {
      const result = await AdsAccountService.updateAccount(id, data);

      setAccounts(prev => prev.map(account => account.id === id ? result.data : account));

      showSuccess('Conta atualizada com sucesso!');

      return result.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? getErrorMessage(err) : 'Erro ao atualizar conta';
      setError(errorMessage);

      showError('Erro ao atualizar conta', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , [showSuccess, showError]);

  const deleteAccount = useCallback(async (id: string) => {
    setLoading(true);

    setError(null);

    try {
      await AdsAccountService.deleteAccount(id);

      setAccounts(prev => prev.filter(account => account.id !== id));

      showSuccess('Conta excluída com sucesso!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao excluir conta';
      setError(errorMessage);

      showError('Erro ao excluir conta', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , [showSuccess, showError]);

  return {
    accounts,
    currentAccount,
    loading,
    error,
    loadAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    clearError: () => setError(null),
    refresh: loadAccounts};
};

export default useAdsAccounts;