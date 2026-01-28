/**
 * Exportações otimizadas do módulo Users
 * Entry point principal com lazy loading
 */
import React from 'react';

// Main Users Module - No lazy loading for main component
export { default } from './components/UsersDashboard';

// Core Components - Direct imports (no lazy loading for frequently used components)
export { default as UsersDashboard } from './components/UsersDashboard';
export { default as UsersStats } from './components/UsersStats';
export { default as UsersQuickActions } from './components/UsersQuickActions';
export { default as UsersRecentActivity } from './components/UsersRecentActivity';
export { default as UsersRoleDistribution } from './components/UsersRoleDistribution';

// Core Hooks - Direct imports
export { useUsers } from './hooks/useUsers';
export { useUserManagement } from './hooks/useUserManagement';
export { useUserProfile } from './hooks/useUserProfile';
export { useUserRoles } from './hooks/useUserRoles';
export { useUserActivity } from './hooks/useUserActivity';
export { useUserNotifications } from './hooks/useUserNotifications';
export { useUserStats } from './hooks/useUserStats';
export { default as useUsersStore } from './hooks/useUsersStore';

// Core Services - Direct imports
export { default as usersService } from './services/usersService';
export { usersApiService } from './services/usersApiService';
export { userManagementService } from './services/userManagementService';
export { userProfileService } from './services/userProfileService';
export { userRolesService } from './services/userRolesService';
export { userActivityService } from './services/userActivityService';
export { userNotificationsService } from './services/userNotificationsService';
export { userStatsService } from './services/userStatsService';
export { userBulkService } from './services/userBulkService';
export { userAuditService } from './services/userAuditService';

// Core Types - Direct imports
export * from './types/userTypes';

// Lazy loading only for heavy components that are not frequently used
export const AdvancedUserManagementDashboard = React.lazy(() => import('./components/AdvancedUserManagementDashboard'));
export const AdvancedUserManager = React.lazy(() => import('./components/AdvancedUserManager'));
export const UserPermissionsManager = React.lazy(() => import('./components/UserPermissionsManager'));
export const UsersIntegrationTest = React.lazy(() => import('./components/UsersIntegrationTest'));

// Legacy exports (preserved for compatibility) - Lazy loaded
export const useAuth = React.lazy(() => import('./hooks/useAuth'));
export const useNotifications = React.lazy(() => import('./hooks/useNotifications'));

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
export const NotificationSystem = React.lazy(() => import('./components/NotificationSystem'));
export const NotificationList = React.lazy(() => import('./components/NotificationList'));
export const NotificationItem = React.lazy(() => import('./components/NotificationItem'));
export const NotificationListener = React.lazy(() => import('./components/NotificationListener'));
