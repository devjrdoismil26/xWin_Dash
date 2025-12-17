// Exportações dos services especializados
export { userManagementService } from './userManagementService';
export { userProfileService } from './userProfileService';
export { userRolesService } from './userRolesService';
export { userActivityService } from './userActivityService';
export { userNotificationsService } from './userNotificationService';
export { userStatsService } from './userStatsService';
export { userBulkService } from './userBulkService';
export { userAuditService } from './userAuditService';

// Exportações dos tipos dos services
export type {
  UserSearchParams,
  UserPaginatedResponse,
  CreateUserData,
  UpdateUserData,
  UserManagementStats,
  UserValidation,
  BulkOperationResult
} from './userManagementService';

export type {
  ProfileData,
  AvatarUploadData,
  CoverUploadData,
  ProfileStats,
  ProfileValidation,
  PrivacySettings,
  NotificationSettings
} from './userProfileService';

export type {
  Role,
  Permission,
  RoleAssignment,
  CreateRoleData,
  UpdateRoleData,
  RoleStats,
  RoleValidation,
  PermissionCheck
} from './userRolesService';

export type {
  Activity,
  ActivitySearchParams,
  ActivityPaginatedResponse,
  CreateActivityData,
  ActivityStats,
  ActivityType,
  ActivityFilters,
  ActivityReport
} from './userActivityService';

export type {
  Notification,
  NotificationSearchParams,
  NotificationPaginatedResponse,
  CreateNotificationData,
  NotificationStats,
  NotificationSettings,
  NotificationTemplate,
  BulkNotificationData,
  BulkNotificationResult
} from './userNotificationService';

export type {
  UserGeneralStats,
  UserGrowthStats,
  UserActivityStats,
  UserRoleStats,
  UserLocationStats,
  UserDeviceStats,
  UserTimeStats,
  UserRetentionStats,
  StatsParams
} from './userStatsService';

export type {
  BulkCreateData,
  BulkUpdateData,
  BulkDeleteData,
  BulkRoleAssignmentData,
  BulkRoleRemovalData,
  BulkActivationData,
  BulkDeactivationData,
  BulkSuspensionData,
  BulkImportData,
  BulkExportData,
  BulkOperationProgress
} from './userBulkService';

export type {
  AuditLog,
  AuditSearchParams,
  AuditPaginatedResponse,
  CreateAuditLogData,
  AuditStats,
  AuditActionType,
  AuditFilters,
  AuditReport,
  AuditSettings
} from './userAuditService';

// Exportação do service principal (Facade)
export { usersService } from './userService';
export { usersApiService } from './userApiService';
export default usersService;
