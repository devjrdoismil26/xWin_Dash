/**
 * Hook useAccountsStore - Store de Contas Sociais
 *
 * @description
 * Store Zustand para gerenciamento de estado de contas sociais do SocialBuffer.
 * Gerencia CRUD, conexão, sincronização, validação, paginação e filtros.
 *
 * @module modules/SocialBuffer/hooks/useAccountsStore
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { accountsService } from '../services/accountsService';
import { SocialAccount, SocialAccountStatus } from '../types/socialTypes';
import { getErrorMessage } from '@/utils/errorHelpers';
import type {
  AccountSearchParams,
  AccountPaginatedResponse,
  AccountConnectionData,
  AccountSyncData,
  AccountStats
} from '../services/accountsService';

/**
 * Estado de contas sociais
 *
 * @interface AccountsState
 * @property {SocialAccount[]} accounts - Lista de contas sociais
 * @property {SocialAccount | null} selectedAccount - Conta selecionada
 * @property {AccountStats | null} accountsStats - Estatísticas de contas
 * @property {Object} pagination - Dados de paginação
 * @property {AccountSearchParams} filters - Filtros de busca
 * @property {boolean} loading - Se está carregando
 * @property {string | null} error - Mensagem de erro
 * @property {boolean} connecting - Se está conectando
 * @property {boolean} syncing - Se está sincronizando
 * @property {boolean} validating - Se está validando
 */
interface AccountsState {
  // Estado das contas
  accounts: SocialAccount[];
  selectedAccount: SocialAccount | null;
  accountsStats: AccountStats | null;
  // Estado de paginação
  pagination: {
    page: number;
  limit: number;
  total: number;
  totalPages: number; };

  // Estado de filtros
  filters: AccountSearchParams;
  
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  
  // Estado de operações
  connecting: boolean;
  syncing: boolean;
  validating: boolean;
}

interface AccountsActions {
  // Ações de busca e listagem
  fetchAccounts: (params?: AccountSearchParams) => Promise<void>;
  refreshAccounts: () => Promise<void>;
  searchAccounts: (query: string) => Promise<void>;
  // Ações de seleção
  selectAccount?: (e: any) => void;
  clearSelection??: (e: any) => void;
  // Ações de CRUD
  createAccount: (accountData: Partial<SocialAccount>) => Promise<SocialAccount>;
  updateAccount: (id: string, accountData: Partial<SocialAccount>) => Promise<SocialAccount>;
  deleteAccount: (id: string) => Promise<void>;
  // Ações de conexão
  connectAccount: (data: AccountConnectionData) => Promise<SocialAccount>;
  disconnectAccount: (id: string) => Promise<void>;
  reconnectAccount: (id: string) => Promise<SocialAccount>;
  // Ações de sincronização
  syncAccount: (id: string, data?: AccountSyncData) => Promise<void>;
  syncAllAccounts: () => Promise<void>;
  // Ações de validação
  validateAccount: (id: string) => Promise<boolean>;
  validateAllAccounts: () => Promise<void>;
  // Ações de estatísticas
  fetchAccountsStats: () => Promise<void>;
  // Ações de filtros
  setFilters?: (e: any) => void;
  clearFilters??: (e: any) => void;
  // Ações de paginação
  setPage?: (e: any) => void;
  setLimit?: (e: any) => void;
  // Ações de estado
  setLoading?: (e: any) => void;
  setError?: (e: any) => void;
  clearError??: (e: any) => void; }

type AccountsStore = AccountsState & AccountsActions;

const initialState: AccountsState = {
  accounts: [],
  selectedAccount: null,
  accountsStats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  filters: {},
  loading: false,
  error: null,
  connecting: false,
  syncing: false,
  validating: false};

export const useAccountsStore = create<AccountsStore>()(
  devtools(
    persist(
      (set: unknown, get: unknown) => ({
        ...initialState,

        // Ações de busca e listagem
        fetchAccounts: async (params?: AccountSearchParams) => {
          try {
            set({ loading: true, error: null });

            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params};

            const response: AccountPaginatedResponse = await accountsService.getAccounts(searchParams);

            set({
              accounts: (response as any).data,
              pagination: {
                page: (response as any).page,
                limit: (response as any).limit,
                total: (response as any).total,
                totalPages: (response as any).total_pages
              },
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,

        refreshAccounts: async () => {
          const { fetchAccounts, filters, pagination } = get();

          await fetchAccounts({
            ...filters,
            page: pagination.page,
            limit: pagination.limit
          });

        },

        searchAccounts: async (query: string) => {
          const { fetchAccounts } = get();

          await fetchAccounts({ search: query });

        },

        // Ações de seleção
        selectAccount: (account: SocialAccount | null) => {
          set({ selectedAccount: account });

        },

        clearSelection: () => {
          set({ selectedAccount: null });

        },

        // Ações de CRUD
        createAccount: async (accountData: Partial<SocialAccount>) => {
          try {
            set({ loading: true, error: null });

            const newAccount = await accountsService.createAccount(accountData);

            set((state: unknown) => ({
              accounts: [newAccount, ...state.accounts],
              loading: false
            }));

            return newAccount;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

            throw error;
          } ,

        updateAccount: async (id: string, accountData: Partial<SocialAccount>) => {
          try {
            set({ loading: true, error: null });

            const updatedAccount = await accountsService.updateAccount(id, accountData);

            set((state: unknown) => ({
              accounts: state.accounts.map(account =>
                account.id === id ? updatedAccount : account
              ),
              selectedAccount: state.selectedAccount?.id === id ? updatedAccount : state.selectedAccount,
              loading: false
            }));

            return updatedAccount;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

            throw error;
          } ,

        deleteAccount: async (id: string) => {
          try {
            set({ loading: true, error: null });

            await accountsService.deleteAccount(id);

            set((state: unknown) => ({
              accounts: state.accounts.filter(account => account.id !== id),
              selectedAccount: state.selectedAccount?.id === id ? null : state.selectedAccount,
              loading: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

            throw error;
          } ,

        // Ações de conexão
        connectAccount: async (data: AccountConnectionData) => {
          try {
            set({ connecting: true, error: null });

            const connectedAccount = await accountsService.connectAccount(data);

            set((state: unknown) => ({
              accounts: state.accounts.map(account =>
                account.id === connectedAccount.id ? connectedAccount : account
              ),
              connecting: false
            }));

            return connectedAccount;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              connecting: false
            });

            throw error;
          } ,

        disconnectAccount: async (id: string) => {
          try {
            set({ loading: true, error: null });

            await accountsService.disconnectAccount(id);

            set((state: unknown) => ({
              accounts: state.accounts.map(account =>
                account.id === id ? { ...account, status: 'disconnected' as SocialAccountStatus } : account
              ),
              loading: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

            throw error;
          } ,

        reconnectAccount: async (id: string) => {
          try {
            set({ connecting: true, error: null });

            const reconnectedAccount = await accountsService.reconnectAccount(id);

            set((state: unknown) => ({
              accounts: state.accounts.map(account =>
                account.id === id ? reconnectedAccount : account
              ),
              connecting: false
            }));

            return reconnectedAccount;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              connecting: false
            });

            throw error;
          } ,

        // Ações de sincronização
        syncAccount: async (id: string, data?: AccountSyncData) => {
          try {
            set({ syncing: true, error: null });

            await accountsService.syncAccount(id, data);

            // Atualizar dados da conta após sincronização
            const { refreshAccounts } = get();

            await refreshAccounts();

            set({ syncing: false });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              syncing: false
            });

            throw error;
          } ,

        syncAllAccounts: async () => {
          try {
            set({ syncing: true, error: null });

            await accountsService.syncAllAccounts();

            // Atualizar dados após sincronização
            const { refreshAccounts } = get();

            await refreshAccounts();

            set({ syncing: false });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              syncing: false
            });

            throw error;
          } ,

        // Ações de validação
        validateAccount: async (id: string) => {
          try {
            set({ validating: true, error: null });

            const isValid = await accountsService.validateAccount(id);

            set({ validating: false });

            return isValid;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              validating: false
            });

            throw error;
          } ,

        validateAllAccounts: async () => {
          try {
            set({ validating: true, error: null });

            await accountsService.validateAllAccounts();

            set({ validating: false });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              validating: false
            });

            throw error;
          } ,

        // Ações de estatísticas
        fetchAccountsStats: async () => {
          try {
            const stats = await accountsService.getAccountsStats();

            set({ accountsStats: stats });

          } catch (error) {
            set({
              error: getErrorMessage(error)
  });

          } ,

        // Ações de filtros
        setFilters: (filters: Partial<AccountSearchParams>) => {
          set((state: unknown) => ({
            filters: { ...state.filters, ...filters },
            pagination: { ...state.pagination, page: 1 } // Reset para primeira página
          }));

        },

        clearFilters: () => {
          set({ filters: {}, pagination: { ...get().pagination, page: 1 } );

        },

        // Ações de paginação
        setPage: (page: number) => {
          set((state: unknown) => ({
            pagination: { ...state.pagination, page } ));

        },

        setLimit: (limit: number) => {
          set((state: unknown) => ({
            pagination: { ...state.pagination, limit, page: 1 } // Reset para primeira página
          }));

        },

        // Ações de estado
        setLoading: (loading: boolean) => {
          set({ loading });

        },

        setError: (error: string | null) => {
          set({ error });

        },

        clearError: () => {
          set({ error: null });

        } ),
      {
        name: 'socialbuffer-accounts-store',
        partialize: (state: unknown) => ({
          filters: state.filters,
          pagination: state.pagination,
          selectedAccount: state.selectedAccount
        })
  }
    ),
    {
      name: 'SocialBufferAccountsStore'
    }
  ));

export default useAccountsStore;
