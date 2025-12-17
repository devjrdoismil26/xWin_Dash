// Exportações dos hooks especializados
export { useUsers } from './useUserList';
export { useUsersAdvanced as useUserManagement } from './useUserManagement';
export { useUserProfile } from './useUserProfile';
export { useUserRoles } from './useUserRoles';
export { useUserActivity } from './useUserActivity';
export { useUserNotifications } from './useUserNotification';
export { useUserStats } from './useUserStats';
export { default as useUsersStore } from './useUserStore';

// Exportações dos tipos dos hooks
export type {
  UserManagementState,
  UserManagementActions,
  UserManagementStore
} from './useUserManagement';

export type {
  UserProfileState,
  UserProfileActions,
  UserProfileStore
} from './useUserProfile';

export type {
  UserRolesState,
  UserRolesActions,
  UserRolesStore
} from './useUserRoles';

export type {
  UserActivityState,
  UserActivityActions,
  UserActivityStore
} from './useUserActivity';

export type {
  UserNotificationsState,
  UserNotificationsActions,
  UserNotificationsStore
} from './useUserNotification';

export type {
  UserStatsState,
  UserStatsActions,
  UserStatsStore
} from './useUserStats';

// Re-exportação de hooks existentes (se houver)
