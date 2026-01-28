import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { accountsService } from '../services/accountsService';
import { SocialAccount, SocialAccountStatus } from '../types/socialTypes';
import type {
  AccountSearchParams,
  AccountPaginatedResponse,
  AccountConnectionData,
  AccountSyncData,
  AccountStats
} from '../services/accountsService';

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
    totalPages: number;
  };
  
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
  selectAccount: (account: SocialAccount | null) => void;
  clearSelection: () => void;
  
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
  setFilters: (filters: Partial<AccountSearchParams>) => void;
  clearFilters: () => void;
  
  // Ações de paginação
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  
  // Ações de estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

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
  validating: false
};

export const useAccountsStore = create<AccountsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Ações de busca e listagem
        fetchAccounts: async (params?: AccountSearchParams) => {
          try {
            set({ loading: true, error: null });
            
            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params };
            
            const response: AccountPaginatedResponse = await accountsService.getAccounts(searchParams);
            
            set({
              accounts: response.data,
              pagination: {
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.total_pages
              },
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar contas',
              loading: false
            });
          }
        },

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
            
            set((state) => ({
              accounts: [newAccount, ...state.accounts],
              loading: false
            }));
            
            return newAccount;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao criar conta',
              loading: false
            });
            throw error;
          }
        },

        updateAccount: async (id: string, accountData: Partial<SocialAccount>) => {
          try {
            set({ loading: true, error: null });
            
            const updatedAccount = await accountsService.updateAccount(id, accountData);
            
            set((state) => ({
              accounts: state.accounts.map(account =>
                account.id === id ? updatedAccount : account
              ),
              selectedAccount: state.selectedAccount?.id === id ? updatedAccount : state.selectedAccount,
              loading: false
            }));
            
            return updatedAccount;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao atualizar conta',
              loading: false
            });
            throw error;
          }
        },

        deleteAccount: async (id: string) => {
          try {
            set({ loading: true, error: null });
            
            await accountsService.deleteAccount(id);
            
            set((state) => ({
              accounts: state.accounts.filter(account => account.id !== id),
              selectedAccount: state.selectedAccount?.id === id ? null : state.selectedAccount,
              loading: false
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao remover conta',
              loading: false
            });
            throw error;
          }
        },

        // Ações de conexão
        connectAccount: async (data: AccountConnectionData) => {
          try {
            set({ connecting: true, error: null });
            
            const connectedAccount = await accountsService.connectAccount(data);
            
            set((state) => ({
              accounts: state.accounts.map(account =>
                account.id === connectedAccount.id ? connectedAccount : account
              ),
              connecting: false
            }));
            
            return connectedAccount;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao conectar conta',
              connecting: false
            });
            throw error;
          }
        },

        disconnectAccount: async (id: string) => {
          try {
            set({ loading: true, error: null });
            
            await accountsService.disconnectAccount(id);
            
            set((state) => ({
              accounts: state.accounts.map(account =>
                account.id === id ? { ...account, status: 'disconnected' as SocialAccountStatus } : account
              ),
              loading: false
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao desconectar conta',
              loading: false
            });
            throw error;
          }
        },

        reconnectAccount: async (id: string) => {
          try {
            set({ connecting: true, error: null });
            
            const reconnectedAccount = await accountsService.reconnectAccount(id);
            
            set((state) => ({
              accounts: state.accounts.map(account =>
                account.id === id ? reconnectedAccount : account
              ),
              connecting: false
            }));
            
            return reconnectedAccount;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao reconectar conta',
              connecting: false
            });
            throw error;
          }
        },

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
              error: error instanceof Error ? error.message : 'Erro ao sincronizar conta',
              syncing: false
            });
            throw error;
          }
        },

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
              error: error instanceof Error ? error.message : 'Erro ao sincronizar contas',
              syncing: false
            });
            throw error;
          }
        },

        // Ações de validação
        validateAccount: async (id: string) => {
          try {
            set({ validating: true, error: null });
            
            const isValid = await accountsService.validateAccount(id);
            
            set({ validating: false });
            return isValid;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao validar conta',
              validating: false
            });
            throw error;
          }
        },

        validateAllAccounts: async () => {
          try {
            set({ validating: true, error: null });
            
            await accountsService.validateAllAccounts();
            
            set({ validating: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao validar contas',
              validating: false
            });
            throw error;
          }
        },

        // Ações de estatísticas
        fetchAccountsStats: async () => {
          try {
            const stats = await accountsService.getAccountsStats();
            set({ accountsStats: stats });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar estatísticas'
            });
          }
        },

        // Ações de filtros
        setFilters: (filters: Partial<AccountSearchParams>) => {
          set((state) => ({
            filters: { ...state.filters, ...filters },
            pagination: { ...state.pagination, page: 1 } // Reset para primeira página
          }));
        },

        clearFilters: () => {
          set({ filters: {}, pagination: { ...get().pagination, page: 1 } });
        },

        // Ações de paginação
        setPage: (page: number) => {
          set((state) => ({
            pagination: { ...state.pagination, page }
          }));
        },

        setLimit: (limit: number) => {
          set((state) => ({
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
        }
      }),
      {
        name: 'socialbuffer-accounts-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
          selectedAccount: state.selectedAccount
        })
      }
    ),
    {
      name: 'SocialBufferAccountsStore'
    }
  )
);

export default useAccountsStore;
