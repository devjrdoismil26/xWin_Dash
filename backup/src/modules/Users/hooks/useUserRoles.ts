import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { userRolesService } from '../services/userRolesService';
import { User } from '../types/userTypes';
import type {
  Role,
  Permission,
  RoleAssignment,
  CreateRoleData,
  UpdateRoleData,
  RoleStats,
  RoleValidation,
  PermissionCheck
} from '../services/userRolesService';

interface UserRolesState {
  // Estado das roles
  roles: Role[];
  permissions: Permission[];
  permissionsByCategory: Record<string, Permission[]>;
  
  // Estado de roles do usuário
  userRoles: Role[];
  userPermissions: Permission[];
  
  // Estado de estatísticas
  roleStats: RoleStats | null;
  
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  
  // Estado de operações
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  assigning: boolean;
  removing: boolean;
  validating: boolean;
  
  // Estado de validação
  validation: RoleValidation | null;
  
  // Estado de verificação de permissões
  permissionChecks: Record<string, boolean>;
  roleChecks: Record<string, boolean>;
}

interface UserRolesActions {
  // Ações de roles
  fetchRoles: () => Promise<void>;
  getRoleById: (id: string) => Promise<Role>;
  createRole: (data: CreateRoleData) => Promise<Role>;
  updateRole: (id: string, data: UpdateRoleData) => Promise<Role>;
  deleteRole: (id: string) => Promise<void>;
  duplicateRole: (id: string, overrides?: Partial<CreateRoleData>) => Promise<Role>;
  
  // Ações de permissões
  fetchPermissions: () => Promise<void>;
  fetchPermissionsByCategory: () => Promise<void>;
  
  // Ações de atribuição de roles
  assignRole: (userId: string, roleId: string, expiresAt?: string) => Promise<RoleAssignment>;
  removeRole: (userId: string, roleId: string) => Promise<void>;
  assignMultipleRoles: (userId: string, roleIds: string[]) => Promise<RoleAssignment[]>;
  removeMultipleRoles: (userId: string, roleIds: string[]) => Promise<void>;
  
  // Ações de roles do usuário
  fetchUserRoles: (userId: string) => Promise<void>;
  fetchUserPermissions: (userId: string) => Promise<void>;
  
  // Ações de verificação
  hasPermission: (userId: string, permission: string) => Promise<boolean>;
  hasRole: (userId: string, role: string) => Promise<boolean>;
  checkPermissions: (userId: string, permissions: string[]) => Promise<Record<string, boolean>>;
  checkRoles: (userId: string, roles: string[]) => Promise<Record<string, boolean>>;
  getPermissionCheck: (userId: string, permission: string) => Promise<PermissionCheck>;
  
  // Ações de busca
  getUsersByRole: (roleId: string) => Promise<User[]>;
  getUsersByPermission: (permission: string) => Promise<User[]>;
  
  // Ações de estatísticas
  fetchRoleStats: () => Promise<void>;
  
  // Ações de validação
  validateRole: (data: CreateRoleData | UpdateRoleData) => Promise<RoleValidation>;
  clearValidation: () => void;
  
  // Ações de estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Ações de limpeza
  clearUserData: (userId: string) => void;
  clearAllData: () => void;
}

type UserRolesStore = UserRolesState & UserRolesActions;

const initialState: UserRolesState = {
  roles: [],
  permissions: [],
  permissionsByCategory: {},
  userRoles: [],
  userPermissions: [],
  roleStats: null,
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false,
  assigning: false,
  removing: false,
  validating: false,
  validation: null,
  permissionChecks: {},
  roleChecks: {}
};

export const useUserRoles = create<UserRolesStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Ações de roles
        fetchRoles: async () => {
          try {
            set({ loading: true, error: null });
            
            const roles = await userRolesService.getRoles();
            
            set({
              roles,
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar roles',
              loading: false
            });
          }
        },

        getRoleById: async (id: string) => {
          try {
            const role = await userRolesService.getRoleById(id);
            return role;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar role'
            });
            throw error;
          }
        },

        createRole: async (data: CreateRoleData) => {
          try {
            set({ creating: true, error: null });
            
            const newRole = await userRolesService.createRole(data);
            
            set((state) => ({
              roles: [newRole, ...state.roles],
              creating: false
            }));
            
            return newRole;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao criar role',
              creating: false
            });
            throw error;
          }
        },

        updateRole: async (id: string, data: UpdateRoleData) => {
          try {
            set({ updating: true, error: null });
            
            const updatedRole = await userRolesService.updateRole(id, data);
            
            set((state) => ({
              roles: state.roles.map(role =>
                role.id === id ? updatedRole : role
              ),
              updating: false
            }));
            
            return updatedRole;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao atualizar role',
              updating: false
            });
            throw error;
          }
        },

        deleteRole: async (id: string) => {
          try {
            set({ deleting: true, error: null });
            
            await userRolesService.deleteRole(id);
            
            set((state) => ({
              roles: state.roles.filter(role => role.id !== id),
              deleting: false
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao remover role',
              deleting: false
            });
            throw error;
          }
        },

        duplicateRole: async (id: string, overrides?: Partial<CreateRoleData>) => {
          try {
            set({ creating: true, error: null });
            
            const duplicatedRole = await userRolesService.duplicateRole(id, overrides);
            
            set((state) => ({
              roles: [duplicatedRole, ...state.roles],
              creating: false
            }));
            
            return duplicatedRole;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao duplicar role',
              creating: false
            });
            throw error;
          }
        },

        // Ações de permissões
        fetchPermissions: async () => {
          try {
            set({ loading: true, error: null });
            
            const permissions = await userRolesService.getPermissions();
            
            set({
              permissions,
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar permissões',
              loading: false
            });
          }
        },

        fetchPermissionsByCategory: async () => {
          try {
            set({ loading: true, error: null });
            
            const permissionsByCategory = await userRolesService.getPermissionsByCategory();
            
            set({
              permissionsByCategory,
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar permissões por categoria',
              loading: false
            });
          }
        },

        // Ações de atribuição de roles
        assignRole: async (userId: string, roleId: string, expiresAt?: string) => {
          try {
            set({ assigning: true, error: null });
            
            const assignment = await userRolesService.assignRole(userId, roleId, expiresAt);
            
            // Atualizar roles do usuário se for o usuário atual
            const { fetchUserRoles } = get();
            await fetchUserRoles(userId);
            
            set({ assigning: false });
            return assignment;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao atribuir role',
              assigning: false
            });
            throw error;
          }
        },

        removeRole: async (userId: string, roleId: string) => {
          try {
            set({ removing: true, error: null });
            
            await userRolesService.removeRole(userId, roleId);
            
            // Atualizar roles do usuário se for o usuário atual
            const { fetchUserRoles } = get();
            await fetchUserRoles(userId);
            
            set({ removing: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao remover role',
              removing: false
            });
            throw error;
          }
        },

        assignMultipleRoles: async (userId: string, roleIds: string[]) => {
          try {
            set({ assigning: true, error: null });
            
            const assignments = await userRolesService.assignMultipleRoles(userId, roleIds);
            
            // Atualizar roles do usuário se for o usuário atual
            const { fetchUserRoles } = get();
            await fetchUserRoles(userId);
            
            set({ assigning: false });
            return assignments;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao atribuir múltiplas roles',
              assigning: false
            });
            throw error;
          }
        },

        removeMultipleRoles: async (userId: string, roleIds: string[]) => {
          try {
            set({ removing: true, error: null });
            
            await userRolesService.removeMultipleRoles(userId, roleIds);
            
            // Atualizar roles do usuário se for o usuário atual
            const { fetchUserRoles } = get();
            await fetchUserRoles(userId);
            
            set({ removing: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao remover múltiplas roles',
              removing: false
            });
            throw error;
          }
        },

        // Ações de roles do usuário
        fetchUserRoles: async (userId: string) => {
          try {
            set({ loading: true, error: null });
            
            const roles = await userRolesService.getUserRoles(userId);
            
            set({
              userRoles: roles,
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar roles do usuário',
              loading: false
            });
          }
        },

        fetchUserPermissions: async (userId: string) => {
          try {
            set({ loading: true, error: null });
            
            const permissions = await userRolesService.getUserPermissions(userId);
            
            set({
              userPermissions: permissions,
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar permissões do usuário',
              loading: false
            });
          }
        },

        // Ações de verificação
        hasPermission: async (userId: string, permission: string) => {
          try {
            const hasPermission = await userRolesService.hasPermission(userId, permission);
            
            set((state) => ({
              permissionChecks: {
                ...state.permissionChecks,
                [`${userId}:${permission}`]: hasPermission
              }
            }));
            
            return hasPermission;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao verificar permissão'
            });
            return false;
          }
        },

        hasRole: async (userId: string, role: string) => {
          try {
            const hasRole = await userRolesService.hasRole(userId, role);
            
            set((state) => ({
              roleChecks: {
                ...state.roleChecks,
                [`${userId}:${role}`]: hasRole
              }
            }));
            
            return hasRole;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao verificar role'
            });
            return false;
          }
        },

        checkPermissions: async (userId: string, permissions: string[]) => {
          try {
            const checks = await userRolesService.checkPermissions(userId, permissions);
            
            set((state) => ({
              permissionChecks: {
                ...state.permissionChecks,
                ...Object.fromEntries(
                  Object.entries(checks).map(([permission, result]) => [
                    `${userId}:${permission}`,
                    result
                  ])
                )
              }
            }));
            
            return checks;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao verificar permissões'
            });
            throw error;
          }
        },

        checkRoles: async (userId: string, roles: string[]) => {
          try {
            const checks = await userRolesService.checkRoles(userId, roles);
            
            set((state) => ({
              roleChecks: {
                ...state.roleChecks,
                ...Object.fromEntries(
                  Object.entries(checks).map(([role, result]) => [
                    `${userId}:${role}`,
                    result
                  ])
                )
              }
            }));
            
            return checks;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao verificar roles'
            });
            throw error;
          }
        },

        getPermissionCheck: async (userId: string, permission: string) => {
          try {
            const check = await userRolesService.getPermissionCheck(userId, permission);
            return check;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao obter detalhes da permissão'
            });
            throw error;
          }
        },

        // Ações de busca
        getUsersByRole: async (roleId: string) => {
          try {
            const users = await userRolesService.getUsersByRole(roleId);
            return users;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar usuários por role'
            });
            throw error;
          }
        },

        getUsersByPermission: async (permission: string) => {
          try {
            const users = await userRolesService.getUsersByPermission(permission);
            return users;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar usuários por permissão'
            });
            throw error;
          }
        },

        // Ações de estatísticas
        fetchRoleStats: async () => {
          try {
            const stats = await userRolesService.getRoleStats();
            set({ roleStats: stats });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar estatísticas de roles'
            });
          }
        },

        // Ações de validação
        validateRole: async (data: CreateRoleData | UpdateRoleData) => {
          try {
            set({ validating: true, error: null });
            
            const validation = await userRolesService.validateRole(data);
            
            set({
              validation,
              validating: false
            });
            
            return validation;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao validar role',
              validating: false
            });
            throw error;
          }
        },

        clearValidation: () => {
          set({ validation: null });
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

        // Ações de limpeza
        clearUserData: (userId: string) => {
          set((state) => ({
            userRoles: [],
            userPermissions: [],
            permissionChecks: Object.fromEntries(
              Object.entries(state.permissionChecks).filter(
                ([key]) => !key.startsWith(`${userId}:`)
              )
            ),
            roleChecks: Object.fromEntries(
              Object.entries(state.roleChecks).filter(
                ([key]) => !key.startsWith(`${userId}:`)
              )
            )
          }));
        },

        clearAllData: () => {
          set({
            ...initialState
          });
        }
      }),
      {
        name: 'users-roles-store',
        partialize: (state) => ({
          roles: state.roles,
          permissions: state.permissions,
          permissionsByCategory: state.permissionsByCategory
        })
      }
    ),
    {
      name: 'UsersRolesStore'
    }
  )
);

export default useUserRoles;
