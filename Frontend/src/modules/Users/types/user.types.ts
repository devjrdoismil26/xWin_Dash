// ===== USERS MODULE - CONSOLIDATED TYPES =====

// ===== CORE USER INTERFACES =====
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  role: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  avatar_url?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  preferences?: UserPreferences;
  avatar?: string; }

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
  push: boolean;
  sms: boolean; };

  privacy: {
    profile_visibility: 'public' | 'private' | 'friends';
    show_email: boolean;
    show_phone: boolean;};

}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  timezone: string;
  language: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string; }

export interface UserRole {
  id: string;
  name: string;
  display_name: string;
  description: string;
  permissions: string[];
  created_at: string;
  updated_at: string; }

export interface UserActivity {
  id: string;
  user_id: string;
  action: string;
  description: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  created_at: string; }

export interface UserNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  read_at?: string;
  created_at: string; }

export interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  new_users_this_month: number;
  users_by_role: {
    [role: string]: number; };

}

// ===== NEW ENDPOINT INTERFACES =====
export interface UserActivityStats {
  total_activities: number;
  activities_by_type: {
    [type: string]: number; };

  activities_by_date: {
    [date: string]: number;};

  most_active_hours: {
    [hour: string]: number;};

  top_actions: {
    action: string;
    count: number;
  }[];
  last_activity: UserActivity;
}

export interface SystemStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  suspended_users: number;
  new_users_today: number;
  new_users_this_week: number;
  new_users_this_month: number;
  users_by_role: {
    [role: string]: number; };

  users_by_status: {
    [status: string]: number;};

  login_stats: {
    total_logins: number;
    unique_logins: number;
    failed_logins: number;
    last_24h_logins: number;};

  system_health: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    last_check: string;};

}

export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: string;
  role: string;
  last_login_at?: string;
  created_at: string;
  relevance_score: number;
  matched_fields: string[]; }

export interface UserExport {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  profile?: UserProfile;
  activities_count: number;
  notifications_count: number; }

export interface UserImport {
  file: File;
  mapping: {
    name: string;
  email: string;
  role: string;
  status: string; };

  options: {
    skip_duplicates: boolean;
    send_welcome_email: boolean;
    assign_default_role: boolean;};

}

export interface UserBulkUpdate {
  user_ids: string[];
  updates: {
    status?: string;
  role?: string;
  [key: string]: unknown; };

  reason?: string;
}

export interface UserBulkDelete {
  user_ids: string[];
  reason: string;
  transfer_data_to?: string; }

export interface UserAuditLog {
  id: string;
  user_id: string;
  action: string;
  description: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  performed_by: string;
  performed_at: string; }

export interface UserPermission {
  id: string;
  name: string;
  display_name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
  created_at: string;
  updated_at: string; }

export interface UserPasswordReset {
  user_id: string;
  token: string;
  expires_at: string;
  used: boolean;
  created_at: string; }

export interface UserEmailVerification {
  user_id: string;
  token: string;
  expires_at: string;
  verified: boolean;
  verified_at?: string;
  created_at: string; }

// ===== API RESPONSE INTERFACES =====
export interface UserResponse {
  success: boolean;
  data?: Record<string, any>;
  message?: string;
  error?: string; }

export interface UserListResponse {
  success: boolean;
  data?: {
    users: User[];
  pagination: {
      current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  message?: string;
  error?: string; };
};

  message?: string;
  error?: string;
}

export interface UserStatsResponse {
  success: boolean;
  data?: UserStats | SystemStats;
  message?: string;
  error?: string; }

export interface UserActivityResponse {
  success: boolean;
  data?: {
    activities: UserActivity[];
  stats: UserActivityStats;
  message?: string;
  error?: string; };

  message?: string;
  error?: string;
}

export interface UserSearchResponse {
  success: boolean;
  data?: {
    results: UserSearchResult[];
  total: number;
  query: string;
  filters: Record<string, any>;
  message?: string;
  error?: string; };

  message?: string;
  error?: string;
}

export interface UserExportResponse {
  success: boolean;
  data?: {
    file_url: string;
  file_name: string;
  file_size: number;
  export_date: string;
  total_records: number;
  message?: string;
  error?: string; };

  message?: string;
  error?: string;
}

export interface UserImportResponse {
  success: boolean;
  data?: {
    total_records: number;
  imported: number;
  skipped: number;
  errors: string[];
  import_id: string;
  message?: string;
  error?: string; };

  message?: string;
  error?: string;
}

export interface UserBulkResponse {
  success: boolean;
  data?: {
    processed: number;
  successful: number;
  failed: number;
  errors: string[];
  operation_id: string;
  message?: string;
  error?: string; };

  message?: string;
  error?: string;
}

export interface UserAuditResponse {
  success: boolean;
  data?: {
    logs: UserAuditLog[];
  pagination: {
      current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  message?: string;
  error?: string; };
};

  message?: string;
  error?: string;
}

// ===== UTILITY TYPES =====
export type UserStatus = 'active' | 'inactive' | 'suspended';
export type UserRoleType = 'admin' | 'manager' | 'user' | 'guest';
export type UserAction = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'view';
export type UserPermissionCategory = 'users' | 'roles' | 'permissions' | 'system' | 'reports';

export interface UserFilters {
  status?: UserStatus;
  role?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  last_login_from?: string;
  last_login_to?: string;
  created_from?: string;
  created_to?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc'; }

export interface UserActivityFilters {
  user_id?: string;
  action?: UserAction;
  date_from?: string;
  date_to?: string;
  ip_address?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc'; }

export interface UserNotificationFilters {
  type?: string;
  is_read?: boolean;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc'; }

// ===== HOOK RETURN TYPES =====
export interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
  per_page: number;
  total: number;
  last_page: number; };

  fetchUsers: (filters?: UserFilters) => Promise<void>;
  createUser: (userData: Record<string, any>) => Promise<boolean>;
  updateUser: (userId: string, userData: Record<string, any>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  toggleUserStatus: (userId: string) => Promise<boolean>;
  searchUsers: (query: string, filters?: UserFilters) => Promise<void>;
  getUsersByRole: (roleId: string, filters?: UserFilters) => Promise<void>;
  getUsersByStatus: (status: UserStatus, filters?: UserFilters) => Promise<void>;
  bulkUpdateUsers: (bulkData: UserBulkUpdate) => Promise<boolean>;
  bulkDeleteUsers: (bulkData: UserBulkDelete) => Promise<boolean>;
  importUsers: (importData: UserImport) => Promise<boolean>;
  exportUsers: (filters?: UserFilters) => Promise<boolean>;
  getUserById: (userId: string) => Promise<User | null>;
  refreshUsers: () => Promise<void>;
}

export interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: Record<string, any>) => Promise<boolean>;
  updatePassword: (passwordData: Record<string, any>) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<boolean>;
  refreshProfile: () => Promise<void>; }

export interface UseUserRolesReturn {
  roles: UserRole[];
  userRoles: UserRole[];
  loading: boolean;
  error: string | null;
  fetchRoles: () => Promise<void>;
  fetchUserRoles: (userId: string) => Promise<void>;
  assignRole: (userId: string, roleId: string) => Promise<boolean>;
  removeRole: (userId: string, roleId: string) => Promise<boolean>;
  refreshRoles: () => Promise<void>; }

export interface UseUserActivityReturn {
  activities: UserActivity[];
  stats: UserActivityStats | null;
  loading: boolean;
  error: string | null;
  fetchActivities: (userId: string, filters?: UserActivityFilters) => Promise<void>;
  fetchActivityStats: (userId: string, filters?: UserActivityFilters) => Promise<void>;
  refreshActivities: () => Promise<void>; }

export interface UseUserNotificationsReturn {
  notifications: UserNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: (filters?: UserNotificationFilters) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteNotification: (notificationId: string) => Promise<boolean>;
  refreshNotifications: () => Promise<void>; }

export interface UseUserStatsReturn {
  userStats: UserStats | null;
  systemStats: SystemStats | null;
  loading: boolean;
  error: string | null;
  fetchUserStats: (filters?: UserFilters) => Promise<void>;
  fetchSystemStats: () => Promise<void>;
  refreshStats: () => Promise<void>; }

export interface UseUserAuditReturn {
  auditLogs: UserAuditLog[];
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
  per_page: number;
  total: number;
  last_page: number; };

  fetchAuditLogs: (userId: string, filters?: Record<string, any>) => Promise<void>;
  refreshAuditLogs: () => Promise<void>;
}


// ===== ADDITIONAL USER TYPES =====

export interface UserRegistration {
  email: string;
  password: string;
  name: string;
  terms_accepted: boolean; }

export interface UserLogin {
  email: string;
  password: string;
  remember?: boolean; }

export interface UserLogout {
  user_id: number;
  session_id?: string; }

export interface UserPasswordChange {
  current_password: string;
  new_password: string;
  confirm_password: string; }

export interface UserEmailChange {
  new_email: string;
  password: string; }

export interface UserPhoneChange {
  new_phone: string;
  verification_code?: string; }

export interface UserAddressChange {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string; }

export interface UserSession {
  id: string;
  user_id: number;
  ip_address: string;
  user_agent: string;
  last_activity: string;
  status: UserSessionStatus; }

export type UserSessionStatus = 'active' | 'expired' | 'revoked';

export interface UserSettings {
  notifications: boolean;
  two_factor: boolean;
  language: string;
  timezone: string;
  [key: string]: unknown; }

export interface UserSecurity {
  two_factor_enabled: boolean;
  last_password_change: string;
  failed_login_attempts: number;
  locked_until?: string; }

export interface UserSubscription {
  id: number;
  user_id: number;
  type: UserSubscriptionType;
  status: UserSubscriptionStatus;
  starts_at: string;
  ends_at?: string;
  auto_renew: boolean; }

export type UserSubscriptionType = 'free' | 'basic' | 'pro' | 'enterprise';
export type UserSubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'suspended';

export interface UserPayment {
  id: number;
  user_id: number;
  amount: number;
  currency: string;
  status: UserPaymentStatus;
  method: UserPaymentMethod;
  created_at: string; }

export type UserPaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type UserPaymentMethod = 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';

export interface UserBilling {
  user_id: number;
  billing_address: UserBillingAddress;
  payment_methods: UserPaymentMethod[]; }

export interface UserBillingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string; }

export interface UserBillingInfo {
  name: string;
  email: string;
  address: UserBillingAddress; }

export interface UserInvoice {
  id: number;
  user_id: number;
  amount: number;
  status: UserInvoiceStatus;
  issued_at: string;
  due_at: string;
  paid_at?: string; }

export type UserInvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface UserDocument {
  id: number;
  user_id: number;
  type: UserDocumentType;
  status: UserDocumentStatus;
  file_path: string;
  uploaded_at: string; }

export type UserDocumentType = 'id' | 'passport' | 'driver_license' | 'proof_of_address';
export type UserDocumentStatus = 'pending' | 'approved' | 'rejected';

export interface UserAvatar {
  url: string;
  thumbnail_url: string;
  uploaded_at: string; }

export interface UserCover {
  url: string;
  uploaded_at: string; }

export interface UserMetrics {
  total_logins: number;
  last_login: string;
  total_sessions: number;
  active_sessions: number; }

export interface UserAnalytics {
  page_views: number;
  time_spent: number;
  actions_performed: number;
  period: string; }

export interface UserPerformance {
  tasks_completed: number;
  projects_created: number;
  collaboration_score: number; }

export interface UserHealth {
  account_status: 'healthy' | 'warning' | 'critical';
  security_score: number;
  activity_level: 'low' | 'medium' | 'high'; }

export interface UserAlert {
  id: number;
  user_id: number;
  type: 'info' | 'warning' | 'error';
  message: string;
  read: boolean;
  created_at: string; }

export interface UserLog {
  id: number;
  user_id: number;
  type: UserLogType;
  level: UserLogLevel;
  message: string;
  metadata?: Record<string, any>;
  created_at: string; }

export type UserLogType = 'auth' | 'action' | 'system' | 'security';
export type UserLogLevel = 'info' | 'warning' | 'error' | 'critical';
export type UserAuditType = 'create' | 'update' | 'delete' | 'login' | 'logout';

export interface UserAPI {
  api_key: string;
  api_secret: string;
  rate_limit: number;
  created_at: string; }

export interface UserIntegration {
  id: number;
  user_id: number;
  service: string;
  connected: boolean;
  credentials?: Record<string, any>; }

export interface UserWebhook {
  id: number;
  user_id: number;
  url: string;
  events: string[];
  active: boolean; }

export interface UserBackup {
  id: number;
  user_id: number;
  file_path: string;
  size: number;
  created_at: string; }

export interface UserRestore {
  backup_id: number;
  restore_point: string; }

export interface UserSync {
  last_sync: string;
  status: 'synced' | 'pending' | 'failed'; }

export interface UserUpgrade {
  from_plan: UserSubscriptionType;
  to_plan: UserSubscriptionType;
  effective_date: string; }

export interface UserDowngrade {
  from_plan: UserSubscriptionType;
  to_plan: UserSubscriptionType;
  effective_date: string; }

export interface UserMaintenance {
  scheduled_at: string;
  duration_minutes: number;
  affected_services: string[]; }

export interface UserCompliance {
  gdpr_consent: boolean;
  terms_accepted: boolean;
  privacy_policy_accepted: boolean;
  accepted_at: string; }

export interface UserMonitor {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_usage: number; }

export interface UserDashboard {
  widgets: string[];
  layout: Record<string, any>;
  preferences: Record<string, any>; }

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  pagination?: { page?: number;
  limit?: number;
  total?: number; };

  count?: number;
}
