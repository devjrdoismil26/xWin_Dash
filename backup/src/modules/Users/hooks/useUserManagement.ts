import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { userManagementService } from '../services/userManagementService';
import { User } from '../types/userTypes';
import type {
  UserSearchParams,
  UserPaginatedResponse,
  CreateUserData,
  UpdateUserData,
  UserManagementStats,
  UserValidation,
  BulkOperationResult
} from '../services/userManagementService';

interface UserManagementState {
  // Estado dos usuários
  users: User[];
  selectedUser: User | null;
  usersStats: UserManagementStats | null;
  
  // Estado de paginação
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Estado de filtros
  filters: UserSearchParams;
  
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  
  // Estado de operações
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  activating: boolean;
  deactivating: boolean;
  suspending: boolean;
  
  // Estado de seleção múltipla
  selectedUsers: string[];
  bulkAction: string | null;
  
  // Estado de validação
  validation: UserValidation | null;
}

interface UserManagementActions {
  // Ações de busca e listagem
  fetchUsers: (params?: UserSearchParams) => Promise<void>;
  refreshUsers: () => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  
  // Ações de seleção
  selectUser: (user: User | null) => void;
  clearSelection: () => void;
  selectMultipleUsers: (userIds: string[]) => void;
  toggleUserSelection: (userId: string) => void;
  clearMultipleSelection: () => void;
  
  // Ações de CRUD
  createUser: (userData: CreateUserData) => Promise<User>;
  updateUser: (id: string, userData: UpdateUserData) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  duplicateUser: (id: string, overrides?: Partial<CreateUserData>) => Promise<User>;
  
  // Ações de status
  activateUser: (id: string) => Promise<User>;
  deactivateUser: (id: string) => Promise<User>;
  suspendUser: (id: string, reason?: string) => Promise<User>;
  unsuspendUser: (id: string) => Promise<User>;
  
  // Ações de validação
  validateUser: (userData: CreateUserData | UpdateUserData) => Promise<UserValidation>;
  clearValidation: () => void;
  
  // Ações de busca específica
  getUserById: (id: string) => Promise<User>;
  getUserByEmail: (email: string) => Promise<User | null>;
  getUsersByRole: (role: string) => Promise<User[]>;
  getUsersByStatus: (status: string) => Promise<User[]>;
  
  // Ações de estatísticas
  fetchUsersStats: () => Promise<void>;
  
  // Ações de filtros
  setFilters: (filters: Partial<UserSearchParams>) => void;
  clearFilters: () => void;
  
  // Ações de paginação
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  
  // Ações de estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Ações de bulk
  setBulkAction: (action: string | null) => void;
  executeBulkAction: (action: string, userIds: string[]) => Promise<BulkOperationResult>;
  
  // Ações de import/export
  exportUsers: (params?: UserSearchParams, format?: 'csv' | 'excel' | 'pdf') => Promise<Blob>;
  importUsers: (file: File) => Promise<BulkOperationResult>;
}

type UserManagementStore = UserManagementState & UserManagementActions;

const initialState: UserManagementState = {
  users: [],
  selectedUser: null,
  usersStats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  filters: {},
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false,
  activating: false,
  deactivating: false,
  suspending: false,
  selectedUsers: [],
  bulkAction: null,
  validation: null
};

export const useUserManagement = create<UserManagementStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Ações de busca e listagem
        fetchUsers: async (params?: UserSearchParams) => {
          try {
            set({ loading: true, error: null });
            
            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params };
            
            const response: UserPaginatedResponse = await userManagementService.getUsers(searchParams);
            
            set({
              users: response.data,
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
              error: error instanceof Error ? error.message : 'Erro ao carregar usuários',
              loading: false
            });
          }
        },

        refreshUsers: async () => {
          const { fetchUsers, filters, pagination } = get();
          await fetchUsers({
            ...filters,
            page: pagination.page,
            limit: pagination.limit
          });
        },

        searchUsers: async (query: string) => {
          const { fetchUsers } = get();
          await fetchUsers({ search: query });
        },

        // Ações de seleção
        selectUser: (user: User | null) => {
          set({ selectedUser: user });
        },

        clearSelection: () => {
          set({ selectedUser: null });
        },

        selectMultipleUsers: (userIds: string[]) => {
          set({ selectedUsers: userIds });
        },

        toggleUserSelection: (userId: string) => {
          set((state) => ({
            selectedUsers: state.selectedUsers.includes(userId)
              ? state.selectedUsers.filter(id => id !== userId)
              : [...state.selectedUsers, userId]
          }));
        },

        clearMultipleSelection: () => {
          set({ selectedUsers: [] });
        },

        // Ações de CRUD
        createUser: async (userData: CreateUserData) => {
          try {
            set({ creating: true, error: null });
            
            const newUser = await userManagementService.createUser(userData);
            
            set((state) => ({
              users: [newUser, ...state.users],
              creating: false
            }));
            
            return newUser;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao criar usuário',
              creating: false
            });
            throw error;
          }
        },

        updateUser: async (id: string, userData: UpdateUserData) => {
          try {
            set({ updating: true, error: null });
            
            const updatedUser = await userManagementService.updateUser(id, userData);
            
            set((state) => ({
              users: state.users.map(user =>
                user.id === id ? updatedUser : user
              ),
              selectedUser: state.selectedUser?.id === id ? updatedUser : state.selectedUser,
              updating: false
            }));
            
            return updatedUser;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao atualizar usuário',
              updating: false
            });
            throw error;
          }
        },

        deleteUser: async (id: string) => {
          try {
            set({ deleting: true, error: null });
            
            await userManagementService.deleteUser(id);
            
            set((state) => ({
              users: state.users.filter(user => user.id !== id),
              selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
              selectedUsers: state.selectedUsers.filter(userId => userId !== id),
              deleting: false
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao remover usuário',
              deleting: false
            });
            throw error;
          }
        },

        duplicateUser: async (id: string, overrides?: Partial<CreateUserData>) => {
          try {
            set({ creating: true, error: null });
            
            const duplicatedUser = await userManagementService.duplicateUser(id, overrides);
            
            set((state) => ({
              users: [duplicatedUser, ...state.users],
              creating: false
            }));
            
            return duplicatedUser;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao duplicar usuário',
              creating: false
            });
            throw error;
          }
        },

        // Ações de status
        activateUser: async (id: string) => {
          try {
            set({ activating: true, error: null });
            
            const activatedUser = await userManagementService.activateUser(id);
            
            set((state) => ({
              users: state.users.map(user =>
                user.id === id ? activatedUser : user
              ),
              selectedUser: state.selectedUser?.id === id ? activatedUser : state.selectedUser,
              activating: false
            }));
            
            return activatedUser;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao ativar usuário',
              activating: false
            });
            throw error;
          }
        },

        deactivateUser: async (id: string) => {
          try {
            set({ deactivating: true, error: null });
            
            const deactivatedUser = await userManagementService.deactivateUser(id);
            
            set((state) => ({
              users: state.users.map(user =>
                user.id === id ? deactivatedUser : user
              ),
              selectedUser: state.selectedUser?.id === id ? deactivatedUser : state.selectedUser,
              deactivating: false
            }));
            
            return deactivatedUser;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao desativar usuário',
              deactivating: false
            });
            throw error;
          }
        },

        suspendUser: async (id: string, reason?: string) => {
          try {
            set({ suspending: true, error: null });
            
            const suspendedUser = await userManagementService.suspendUser(id, reason);
            
            set((state) => ({
              users: state.users.map(user =>
                user.id === id ? suspendedUser : user
              ),
              selectedUser: state.selectedUser?.id === id ? suspendedUser : state.selectedUser,
              suspending: false
            }));
            
            return suspendedUser;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao suspender usuário',
              suspending: false
            });
            throw error;
          }
        },

        unsuspendUser: async (id: string) => {
          try {
            set({ updating: true, error: null });
            
            const unsuspendedUser = await userManagementService.unsuspendUser(id);
            
            set((state) => ({
              users: state.users.map(user =>
                user.id === id ? unsuspendedUser : user
              ),
              selectedUser: state.selectedUser?.id === id ? unsuspendedUser : state.selectedUser,
              updating: false
            }));
            
            return unsuspendedUser;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao remover suspensão do usuário',
              updating: false
            });
            throw error;
          }
        },

        // Ações de validação
        validateUser: async (userData: CreateUserData | UpdateUserData) => {
          try {
            const validation = await userManagementService.validateUser(userData);
            set({ validation });
            return validation;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao validar usuário'
            });
            throw error;
          }
        },

        clearValidation: () => {
          set({ validation: null });
        },

        // Ações de busca específica
        getUserById: async (id: string) => {
          try {
            const user = await userManagementService.getUserById(id);
            return user;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar usuário'
            });
            throw error;
          }
        },

        getUserByEmail: async (email: string) => {
          try {
            const user = await userManagementService.getUserByEmail(email);
            return user;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar usuário por email'
            });
            throw error;
          }
        },

        getUsersByRole: async (role: string) => {
          try {
            const users = await userManagementService.getUsersByRole(role);
            return users;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar usuários por role'
            });
            throw error;
          }
        },

        getUsersByStatus: async (status: string) => {
          try {
            const users = await userManagementService.getUsersByStatus(status);
            return users;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar usuários por status'
            });
            throw error;
          }
        },

        // Ações de estatísticas
        fetchUsersStats: async () => {
          try {
            const stats = await userManagementService.getUserManagementStats();
            set({ usersStats: stats });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar estatísticas'
            });
          }
        },

        // Ações de filtros
        setFilters: (filters: Partial<UserSearchParams>) => {
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
        },

        // Ações de bulk
        setBulkAction: (action: string | null) => {
          set({ bulkAction: action });
        },

        executeBulkAction: async (action: string, userIds: string[]) => {
          try {
            set({ loading: true, error: null });
            
            let result: BulkOperationResult;
            
            switch (action) {
              case 'activate':
                result = await userManagementService.bulkActivateUsers(userIds);
                break;
              case 'deactivate':
                result = await userManagementService.bulkDeactivateUsers(userIds);
                break;
              case 'suspend':
                result = await userManagementService.bulkSuspendUsers(userIds);
                break;
              case 'delete':
                result = await userManagementService.bulkDeleteUsers(userIds);
                break;
              default:
                throw new Error('Ação em lote não suportada');
            }
            
            // Atualizar lista de usuários
            const { refreshUsers } = get();
            await refreshUsers();
            
            set({ loading: false, selectedUsers: [] });
            return result;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao executar ação em lote',
              loading: false
            });
            throw error;
          }
        },

        // Ações de import/export
        exportUsers: async (params?: UserSearchParams, format: 'csv' | 'excel' | 'pdf' = 'csv') => {
          try {
            const blob = await userManagementService.exportUsers(params, format);
            return blob;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao exportar usuários'
            });
            throw error;
          }
        },

        importUsers: async (file: File) => {
          try {
            set({ loading: true, error: null });
            
            const result = await userManagementService.importUsers(file);
            
            // Atualizar lista de usuários
            const { refreshUsers } = get();
            await refreshUsers();
            
            set({ loading: false });
            return result;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao importar usuários',
              loading: false
            });
            throw error;
          }
        }
      }),
      {
        name: 'users-management-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
          selectedUser: state.selectedUser
        })
      }
    ),
    {
      name: 'UsersManagementStore'
    }
  )
);

export default useUserManagement;
