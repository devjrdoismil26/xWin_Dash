/**
 * Exportações otimizadas do módulo Users
 * Entry point principal com lazy loading
 */
import React from 'react';

// Main Users Module - No lazy loading for main component
export { default } from './components/UserDashboard';

// Core Components - Direct imports (no lazy loading for frequently used components)
export { default as UsersDashboard } from './components/UserDashboard';
export { default as UsersStats } from './components/UserStatsCard';
export { default as UsersQuickActions } from './components/UserActionButtons';
export { default as UsersRecentActivity } from './components/UserActivityList';
export { default as UsersRoleDistribution } from './components/UserRoleChart';

// Core Hooks - Direct imports
export { useUsers } from './hooks/useUserList';
export { useUserManagement } from './hooks/useUserManagement';
export { useUserProfile } from './hooks/useUserProfile';
export { useUserRoles } from './hooks/useUserRoles';
export { useUserActivity } from './hooks/useUserActivity';
export { useUserNotifications } from './hooks/useUserNotification';
export { useUserStats } from './hooks/useUserStats';
export { default as useUsersStore } from './hooks/useUserStore';

// Core Services - Direct imports
export { usersService, default as usersServiceDefault } from './services/userService';
export { usersApiService } from './services/userApiService';
export { userManagementService } from './services/userManagementService';
export { userProfileService } from './services/userProfileService';
export { userRolesService } from './services/userRolesService';
export { userActivityService } from './services/userActivityService';
export { userNotificationsService } from './services/userNotificationService';
export { userStatsService } from './services/userStatsService';
export { userBulkService } from './services/userBulkService';
export { userAuditService } from './services/userAuditService';

// Core Types - Direct imports
export * from './types/user.types';

// Lazy loading only for heavy components that are not frequently used
export const AdvancedUserManagementDashboard = React.lazy(() => import('./components/Management/Advanced/UsersTable'));

export const AdvancedUserManager = React.lazy(() => import('./components/UserManagementTable'));

export const UserPermissionsManager = React.lazy(() => import('./components/UserPermissionsManager'));

export const UsersIntegrationTest = React.lazy(() => import('./__tests__/UsersIntegrationTest'));

// Legacy exports (preserved for compatibility) - Direct imports (hooks should not be lazy)
export { useAuth } from './hooks/useAuth';
export { useNotifications } from './hooks/useNotifications';

// Profile components - Lazy loaded (used less frequently)
export const ProfileEdit = React.lazy(() => import('./Profile/Edit'));

export const ProfileShow = React.lazy(() => import('./Profile/Show'));

export const ProfilePreferences = React.lazy(() => import('./Profile/Preferences'));

// Auth components - Lazy loaded (used less frequently)
export const Login = React.lazy(() => import('./Auth/Login'));

export const Register = React.lazy(() => import('./Auth/Register'));

export const ForgotPassword = React.lazy(() => import('./Auth/ForgotPassword'));

export const ResetPassword = React.lazy(() => import('./Auth/ResetPassword'));

export const VerifyEmail = React.lazy(() => import('./Auth/VerifyEmail'));

export const EmailVerified = React.lazy(() => import('./Auth/EmailVerified'));

export const ConfirmPassword = React.lazy(() => import('./Auth/ConfirmPassword'));

// Pages - Lazy loaded
export const UserCreateEdit = React.lazy(() => import('./components/UserCreateEdit'));

// Notification components - Lazy loaded (heavy components)
export const NotificationSystem = React.lazy(() => import('./components/UserNotificationSystem'));

export const NotificationList = React.lazy(() => import('./components/UserNotificationList'));

export const NotificationItem = React.lazy(() => import('./components/UserNotificationItem'));

export const NotificationListener = React.lazy(() => import('./components/UserNotificationListener'));
