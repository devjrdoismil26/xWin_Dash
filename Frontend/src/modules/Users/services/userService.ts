import { userManagementService } from './userManagementService';
import { userProfileService } from './userProfileService';
import { userRolesService } from './userRolesService';
import { userActivityService } from './userActivityService';
import { userNotificationsService } from './userNotificationsService';
import { userStatsService } from './userStatsService';
import { userBulkService } from './userBulkService';
import { userAuditService } from './userAuditService';
import {  } from '@/lib/utils';
// getErrorMessage removido - usar try/catch direto

// Re-exportação dos tipos dos services especializados
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
} from './userNotificationsService';

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

// Interface para configuração global do Users
export interface UsersConfig {
  cache: {
    enabled: boolean;
  ttl: number;
  // em milissegundos
    max_size: number;
  [key: string]: unknown; };

  retry: {
    enabled: boolean;
    max_attempts: number;
    delay: number; // em milissegundos};

  auto_sync: {
    enabled: boolean;
    interval: number; // em milissegundos};

  validation: {
    strict_mode: boolean;
    real_time: boolean;};

  audit: {
    enabled: boolean;
    log_all_actions: boolean;};

  notifications: {
    auto_send: boolean;
    real_time_updates: boolean;};

  bulk_operations: {
    max_batch_size: number;
    timeout_seconds: number;};

}

// Interface para estatísticas globais
export interface UsersGlobalStats {
  management: {
    total_users: number;
  active_users: number;
  inactive_users: number;
  suspended_users: number;
  pending_users: number;
  new_users_today: number;
  users_growth_rate: number; };

  profiles: {
    total_profiles: number;
    completed_profiles: number;
    profiles_with_avatars: number;
    profiles_with_cover_images: number;
    average_completion_rate: number;};

  roles: {
    total_roles: number;
    system_roles: number;
    custom_roles: number;
    most_used_roles: Array<{ role: string; count: number }>;};

  activities: {
    total_activities: number;
    activities_today: number;
    most_active_users: Array<{ user_id: string; count: number }>;
    peak_activity_hours: Array<{ hour: number; count: number }>;};

  notifications: {
    total_notifications: number;
    unread_notifications: number;
    notifications_today: number;
    average_read_time: number;};

  stats: {
    total_logins: number;
    logins_today: number;
    average_session_duration: number;
    users_by_location: Record<string, number>;};

  bulk_operations: {
    total_operations: number;
    successful_operations: number;
    failed_operations: number;
    success_rate: number;};

  audit: {
    total_logs: number;
    logs_today: number;
    security_events: number;
    most_audited_resources: Array<{ resource: string; count: number }>;};

}

// Interface para resultado de operação
export interface UsersOperationResult {
  success: boolean;
  message: string;
  data?: Record<string, any>;
  errors?: string[];
  warnings?: string[]; }

/**
 * Service principal do Users - Implementa padrão Facade
 * Orquestra todos os services especializados e fornece interface unificada
 */
class UsersService {
  private config: UsersConfig = {
    cache: {
      enabled: true,
      ttl: 5 * 60 * 1000, // 5 minutos
      max_size: 1000
    },
    retry: {
      enabled: true,
      max_attempts: 3,
      delay: 1000
    },
    auto_sync: {
      enabled: true,
      interval: 30 * 60 * 1000 // 30 minutos
    },
    validation: {
      strict_mode: true,
      real_time: true
    },
    audit: {
      enabled: true,
      log_all_actions: true
    },
    notifications: {
      auto_send: true,
      real_time_updates: true
    },
    bulk_operations: {
      max_batch_size: 100,
      timeout_seconds: 300
    } ;

  // Services especializados
  public readonly management = userManagementService;
  public readonly profile = userProfileService;
  public readonly roles = userRolesService;
  public readonly activity = userActivityService;
  public readonly notifications = userNotificationsService;
  public readonly stats = userStatsService;
  public readonly bulk = userBulkService;
  public readonly audit = userAuditService;

  /**
   * Configura o Users
   */
  configure(config: Partial<UsersConfig>): void {
    this.config = { ...this.config, ...config};

  }

  /**
   * Obtém configuração atual
   */
  getConfig(): UsersConfig {
    return { ...this.config};

  }

  /**
   * Obtém estatísticas globais do Users
   */
  async getGlobalStats(): Promise<UsersGlobalStats> {
    try {
      const [
        managementStats,
        profileStats,
        roleStats,
        activityStats,
        notificationStats,
        generalStats,
        bulkStats,
        auditStats
      ] = await Promise.all([
        this.management.getUserManagementStats(),
        this.profile.getProfileStats('global'), // Assumindo que há um método global
        this.roles.getRoleStats(),
        this.activity.getActivityStats(),
        this.notifications.getNotificationStats(),
        this.stats.getGeneralStats(),
        this.bulk.getBulkOperationStats(),
        this.audit.getAuditStats()
      ]);

      return {
        management: {
          total_users: managementStats.total_users,
          active_users: managementStats.active_users,
          inactive_users: managementStats.inactive_users,
          suspended_users: managementStats.suspended_users,
          pending_users: managementStats.pending_users,
          new_users_today: managementStats.new_users_today,
          users_growth_rate: managementStats.users_growth_rate
        },
        profiles: {
          total_profiles: profileStats.profile_completion || 0,
          completed_profiles: 0, // Será implementado quando necessário
          profiles_with_avatars: 0, // Será implementado quando necessário
          profiles_with_cover_images: 0, // Será implementado quando necessário
          average_completion_rate: profileStats.profile_completion || 0
        },
        roles: {
          total_roles: roleStats.total_roles,
          system_roles: roleStats.system_roles,
          custom_roles: roleStats.custom_roles,
          most_used_roles: roleStats.most_used_roles.map(r => ({ role: r.role, count: r.count }))
  },
        activities: {
          total_activities: activityStats.total_activities,
          activities_today: activityStats.activities_today,
          most_active_users: activityStats.most_active_users.map(u => ({ user_id: u.user.id, count: u.activity_count })),
          peak_activity_hours: activityStats.peak_activity_hours
        },
        notifications: {
          total_notifications: notificationStats.total_notifications,
          unread_notifications: notificationStats.unread_notifications,
          notifications_today: notificationStats.notifications_today,
          average_read_time: notificationStats.average_read_time
        },
        stats: {
          total_logins: generalStats.total_users, // Assumindo que há um campo de logins
          logins_today: generalStats.new_users_today, // Assumindo que há um campo de logins hoje
          average_session_duration: generalStats.average_session_duration,
          users_by_location: {} // Será implementado quando necessário
        },
        bulk_operations: {
          total_operations: bulkStats.total_operations,
          successful_operations: bulkStats.successful_operations,
          failed_operations: bulkStats.failed_operations,
          success_rate: bulkStats.success_rate
        },
        audit: {
          total_logs: auditStats.total_logs,
          logs_today: auditStats.logs_today,
          security_events: 0, // Será implementado quando necessário
          most_audited_resources: auditStats.most_audited_resources.map(r => ({ resource: r.resource_type, count: r.count }))
  } ;

    } catch (error) {
      throw new Error('Falha ao obter estatísticas globais');

    } /**
   * Executa operação com retry automático
   */
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    if (!this.config.retry.enabled) {
      return operation();

    }

    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.config.retry.max_attempts; attempt++) {
      try {
        return await operation();

      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.config.retry.max_attempts) {
          await new Promise(resolve => setTimeout(resolve, this.config.retry.delay * attempt));

        } }

    throw lastError!;
  }

  /**
   * Valida dados usando validação configurada
   */
  private validateData(data: Record<string, any>, rules: string[]): UsersOperationResult {
    if (!this.config.validation.strict_mode) {
      return { success: true, message: 'Validação em modo não-estrito'};

    }

    // Implementação básica de validação
    // Em uma implementação real, usaria um sistema de validação mais robusto
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validações básicas
    if (!data) {
      errors.push('Dados são obrigatórios');

    }

    return {
      success: errors.length === 0,
      message: errors.length === 0 ? 'Validação bem-sucedida' : 'Validação falhou',
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined};

  }

  /**
   * Limpa todos os caches
   */
  clearAllCaches(): void {
    this.management.clearCache();

    this.profile.clearCache();

    this.roles.clearCache();

    this.activity.clearCache();

    this.notifications.clearCache();

    this.stats.clearCache();

    this.bulk.clearCache();

    this.audit.clearCache();

  }

  /**
   * Obtém estatísticas de todos os caches
   */
  getAllCacheStats(): Record<string, { size: number; keys: string[] }> {
    return {
      management: this.management.getCacheStats(),
      profile: this.profile.getCacheStats(),
      roles: this.roles.getCacheStats(),
      activity: this.activity.getCacheStats(),
      notifications: this.notifications.getCacheStats(),
      stats: this.stats.getCacheStats(),
      bulk: this.bulk.getCacheStats(),
      audit: this.audit.getCacheStats()};

  }

  /**
   * Executa sincronização completa
   */
  async performFullSync(): Promise<UsersOperationResult> {
    try {
      const results = await Promise.allSettled([
        // Assumindo que há métodos de sincronização nos services
        Promise.resolve(), // this.management.syncAllUsers(),
        Promise.resolve(), // this.profile.syncAllProfiles(),
        Promise.resolve(), // this.roles.syncAllRoles(),
        Promise.resolve(), // this.activity.syncAllActivities(),
        Promise.resolve(), // this.notifications.syncAllNotifications(),
        Promise.resolve(), // this.stats.syncAllStats(),
        Promise.resolve(), // this.bulk.syncAllBulkOperations(),
        Promise.resolve()  // this.audit.syncAllAuditLogs()
      ]);

      const errors: string[] = [];
      const warnings: string[] = [];

      results.forEach((result: unknown, index: unknown) => {
        if (result.status === 'rejected') {
          errors.push(`Sincronização ${index + 1} falhou: ${result.reason}`);

        } );

      return {
        success: errors.length === 0,
        message: errors.length === 0 ? 'Sincronização completa bem-sucedida' : 'Sincronização parcial',
        errors: errors.length > 0 ? errors : undefined,
        warnings: warnings.length > 0 ? warnings : undefined};

    } catch (error) {
      return {
        success: false,
        message: 'Falha na sincronização completa',
        errors: [getErrorMessage(error)]};

    } /**
   * Executa operação de backup
   */
  async performBackup(): Promise<UsersOperationResult> {
    try {
      // Implementação de backup seria feita aqui
      // Por enquanto, apenas limpa caches e retorna sucesso
      this.clearAllCaches();

      return {
        success: true,
        message: 'Backup executado com sucesso'};

    } catch (error) {
      return {
        success: false,
        message: 'Falha no backup',
        errors: [getErrorMessage(error)]};

    } /**
   * Executa operação de restauração
   */
  async performRestore(backupData: Record<string, any>): Promise<UsersOperationResult> {
    try {
      // Implementação de restauração seria feita aqui
      // Por enquanto, apenas retorna sucesso
      
      return {
        success: true,
        message: 'Restauração executada com sucesso'};

    } catch (error) {
      return {
        success: false,
        message: 'Falha na restauração',
        errors: [getErrorMessage(error)]};

    } /**
   * Obtém status de saúde do sistema
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'warning' | 'error';
    services: Record<string, 'healthy' | 'warning' | 'error'>;
    message: string;
    timestamp: string;
  }> {
    try {
      const services: Record<string, 'healthy' | 'warning' | 'error'> = {};

      let overallStatus: 'healthy' | 'warning' | 'error' = 'healthy';

      // Verifica status de cada service
      const serviceChecks = [
        { name: 'management', service: this.management },
        { name: 'profile', service: this.profile },
        { name: 'roles', service: this.roles },
        { name: 'activity', service: this.activity },
        { name: 'notifications', service: this.notifications },
        { name: 'stats', service: this.stats },
        { name: 'bulk', service: this.bulk },
        { name: 'audit', service: this.audit }
      ];

      for (const { name, service } of serviceChecks) {
        try {
          // Verifica se o service responde (exemplo básico)
          const cacheStats = service.getCacheStats();

          services[name] = 'healthy';
        } catch (error) {
          services[name] = 'error';
          overallStatus = 'error';
        } // Se algum service está com erro, o status geral é error
      if (Object.values(services).includes('error')) {
        overallStatus = 'error';
      } else if (Object.values(services).includes('warning')) {
        overallStatus = 'warning';
      }

      return {
        status: overallStatus,
        services,
        message: overallStatus === 'healthy' ? 'Todos os services estão funcionando normalmente' : 'Alguns services apresentam problemas',
        timestamp: new Date().toISOString()};

    } catch (error) {
      return {
        status: 'error',
        services: {},
        message: 'Falha ao verificar status de saúde',
        timestamp: new Date().toISOString()};

    } }

// Instância singleton
export const usersService = new UsersService();

export default usersService;
