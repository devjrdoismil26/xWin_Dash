/**
 * Hook especializado para gerenciamento de contas de anúncios
 * Responsável por todas as operações relacionadas a contas
 */
import { create } from 'zustand';
import { adsAccountService } from '../services';
import { AdsAccount } from '../types';

interface AdsAccountsState {
  accounts: AdsAccount[];
  loading: boolean;
  error: string | null;
}

interface AdsAccountsActions {
  // Ações CRUD para contas
  fetchAccounts: () => Promise<void>;
  createAccount: (accountData: Partial<AdsAccount>) => Promise<any>;
  updateAccount: (id: string | number, accountData: Partial<AdsAccount>) => Promise<any>;
  deleteAccount: (id: string | number) => Promise<void>;
  
  // Ações específicas para contas
  connectAccount: (platform: string, credentials: any) => Promise<any>;
  disconnectAccount: (id: string | number) => Promise<void>;
  refreshAccountToken: (id: string | number) => Promise<any>;
  syncAccount: (id: string | number) => Promise<any>;
  
  // Métodos utilitários
  getConnectedAccounts: () => AdsAccount[];
  getAccountByPlatform: (platform: string) => AdsAccount[];
  getAccountById: (id: string | number) => AdsAccount | undefined;
  
  // Ações de UI
  clearError: () => void;
}

type AdsAccountsStore = AdsAccountsState & AdsAccountsActions;

const useAdsAccounts = create<AdsAccountsStore>((set, get) => ({
  // Estado
  accounts: [],
  loading: false,
  error: null,

  // Ações CRUD para contas
  fetchAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adsAccountService.getAccounts();
      if (response.success) {
        set({ accounts: response.data || [], loading: false });
      } else {
        set({ error: response.error, loading: false });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createAccount: async (accountData: Partial<AdsAccount>) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAccountService.createAccount(accountData);
      if (response.success) {
        set(state => ({ 
          accounts: [...state.accounts, response.data], 
          loading: false 
        }));
        return response;
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateAccount: async (id: string | number, accountData: Partial<AdsAccount>) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAccountService.updateAccount(id, accountData);
      if (response.success) {
        set(state => ({
          accounts: state.accounts.map(account => 
            account.id === id ? response.data : account
          ),
          loading: false
        }));
        return response;
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteAccount: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAccountService.deleteAccount(id);
      if (response.success) {
        set(state => ({
          accounts: state.accounts.filter(account => account.id !== id),
          loading: false
        }));
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações específicas para contas
  connectAccount: async (platform: string, credentials: any) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAccountService.connectAccount(platform, credentials);
      if (response.success) {
        set(state => ({ 
          accounts: [...state.accounts, response.data], 
          loading: false 
        }));
        return response;
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  disconnectAccount: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAccountService.disconnectAccount(id);
      if (response.success) {
        set(state => ({
          accounts: state.accounts.map(account => 
            account.id === id ? { ...account, status: 'DISCONNECTED' } : account
          ),
          loading: false
        }));
        return response;
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  refreshAccountToken: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAccountService.refreshToken(id);
      if (response.success) {
        set(state => ({
          accounts: state.accounts.map(account => 
            account.id === id ? { ...account, ...response.data } : account
          ),
          loading: false
        }));
        return response;
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  syncAccount: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAccountService.syncAccount(id);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Métodos utilitários
  getConnectedAccounts: () => {
    const { accounts } = get();
    return accounts.filter(account => account.status === 'active');
  },

  getAccountByPlatform: (platform: string) => {
    const { accounts } = get();
    return accounts.filter(account => account.platform === platform);
  },

  getAccountById: (id: string | number) => {
    const { accounts } = get();
    return accounts.find(account => account.id === id);
  },

  // Ações de UI
  clearError: () => set({ error: null }),
}));

export default useAdsAccounts;
