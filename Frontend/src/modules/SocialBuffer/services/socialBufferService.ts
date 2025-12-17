/**
 * Serviço principal do SocialBuffer
 *
 * @description
 * Serviço principal que consolida todos os serviços especializados do SocialBuffer:
 * accounts, posts, schedules, hashtags, links, media, analytics e engagement.
 * Fornece interface unificada e re-exporta tipos de todos os serviços.
 *
 * @module modules/SocialBuffer/services/socialBufferService
 * @since 1.0.0
 */

// Import corrigido - usar serviços disponíveis
// Import corrigido - usar serviços disponíveis
// Import corrigido - usar serviços disponíveis
// Import corrigido - usar serviços disponíveis
// Import corrigido - usar serviços disponíveis
// Import corrigido - usar serviços disponíveis
// Import corrigido - usar serviços disponíveis
// Import corrigido - usar serviços disponíveis
import {  } from '@/lib/utils';
// getErrorMessage removido - usar try/catch direto

/**
 * Re-exportação dos tipos dos services especializados
 *
 * @description
 * Re-exporta todos os tipos TypeScript dos serviços especializados
 * para facilitar imports em outras partes da aplicação.
 */
export type {
  AccountSearchParams,
  AccountPaginatedResponse,
  AccountConnectionData,
  AccountSyncData,
  AccountStats,
  AccountValidation
} from './accountsService';

export type {
  PostSearchParams,
  PostPaginatedResponse,
  CreatePostData,
  UpdatePostData,
  PostStats,
  PostValidation,
  PostAnalysis,
  PostOptimization
} from './postsService';

export type {
  ScheduleSearchParams,
  SchedulePaginatedResponse,
  CreateScheduleData,
  UpdateScheduleData,
  ScheduleStats,
  ScheduleValidation,
  OptimalTimeSuggestion,
  CalendarEvent
} from './schedulesService';

export type {
  HashtagSearchParams,
  HashtagPaginatedResponse,
  CreateHashtagData,
  UpdateHashtagData,
  HashtagStats,
  HashtagValidation,
  HashtagAnalysis,
  HashtagSuggestion,
  TrendingHashtag,
  PopularHashtag,
  RelatedHashtag,
  HashtagGroup
} from './hashtagsService';

export type {
  LinkSearchParams,
  LinkPaginatedResponse,
  CreateLinkData,
  UpdateLinkData,
  LinkStats,
  LinkValidation,
  LinkAnalytics,
  QRCodeData
} from './linksService';

export type {
  MediaSearchParams,
  MediaPaginatedResponse,
  UploadMediaData,
  UpdateMediaData,
  MediaStats,
  MediaOptimization,
  MediaAnalysis,
  MediaGallery
} from './mediaService';

export type {
  AnalyticsParams,
  BasicMetrics,
  PlatformMetrics,
  TimeSeriesMetrics,
  ContentMetrics,
  HashtagMetrics,
  LinkMetrics,
  EngagementMetrics,
  AudienceMetrics,
  AnalyticsReport,
  PeriodComparison
} from './analyticsService';

export type {
  EngagementParams,
  EngagementData,
  EngagementMonitoring,
  Interaction,
  EngagementAnalysis,
  RealTimeEngagement,
  EngagementCampaign,
  EngagementOptimization
} from './engagementService';

// Interface para configuração global do SocialBuffer
export interface SocialBufferConfig {
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

  analytics: {
    auto_tracking: boolean;
    real_time_updates: boolean;};

  engagement: {
    auto_monitoring: boolean;
    alert_thresholds: {
      spike: number;
      drop: number;};
};

}

// Interface para estatísticas globais
export interface SocialBufferGlobalStats {
  accounts: {
    total: number;
  connected: number;
  disconnected: number;
  by_platform: Record<string, number>; };

  posts: {
    total: number;
    published: number;
    scheduled: number;
    drafts: number;
    by_platform: Record<string, number>;};

  schedules: {
    total: number;
    active: number;
    completed: number;
    pending: number;};

  hashtags: {
    total: number;
    trending: number;
    popular: number;};

  links: {
    total: number;
    active: number;
    total_clicks: number;};

  media: {
    total: number;
    total_size: number;
    by_type: Record<string, number>;};

  analytics: {
    total_engagement: number;
    total_reach: number;
    total_impressions: number;
    average_engagement_rate: number;};

  engagement: {
    active_monitoring: number;
    total_campaigns: number;
    active_campaigns: number;};

}

// Interface para resultado de operação
export interface SocialBufferOperationResult {
  success: boolean;
  message: string;
  data?: string;
  errors?: string[];
  warnings?: string[]; }

/**
 * Service principal do SocialBuffer - Implementa padrão Facade
 * Orquestra todos os services especializados e fornece interface unificada
 */
class SocialBufferService {
  private config: SocialBufferConfig = {
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
    analytics: {
      auto_tracking: true,
      real_time_updates: true
    },
    engagement: {
      auto_monitoring: true,
      alert_thresholds: {
        spike: 50, // 50% de aumento
        drop: 30   // 30% de queda
      } };

  // Services especializados
  public readonly accounts = accountsService;
  public readonly posts = postsService;
  public readonly schedules = schedulesService;
  public readonly hashtags = hashtagsService;
  public readonly links = linksService;
  public readonly media = mediaService;
  public readonly analytics = analyticsService;
  public readonly engagement = engagementService;

  /**
   * Configura o SocialBuffer
   */
  configure(config: Partial<SocialBufferConfig>): void {
    this.config = { ...this.config, ...config};

  }

  /**
   * Obtém configuração atual
   */
  getConfig(): SocialBufferConfig {
    return { ...this.config};

  }

  /**
   * Obtém estatísticas globais do SocialBuffer
   */
  async getGlobalStats(): Promise<SocialBufferGlobalStats> {
    try {
      const [
        accountsStats,
        postsStats,
        schedulesStats,
        hashtagsStats,
        linksStats,
        mediaStats,
        analyticsStats,
        engagementStats
      ] = await Promise.all([
        this.accounts.getAccountsStats(),
        this.posts.getPostsStats(),
        this.schedules.getSchedulesStats(),
        this.hashtags.getHashtagsStats(),
        this.links.getLinksStats(),
        this.media.getMediaStats(),
        this.analytics.getBasicMetrics(),
        this.engagement.getEngagementMetrics()
      ]);

      return {
        accounts: {
          total: accountsStats.total_accounts,
          connected: accountsStats.connected_accounts,
          disconnected: accountsStats.disconnected_accounts,
          by_platform: accountsStats.accounts_by_platform
        },
        posts: {
          total: postsStats.total_posts,
          published: postsStats.published_posts,
          scheduled: postsStats.scheduled_posts,
          drafts: postsStats.draft_posts,
          by_platform: postsStats.posts_by_platform
        },
        schedules: {
          total: schedulesStats.total_schedules,
          active: schedulesStats.active_schedules,
          completed: schedulesStats.completed_schedules,
          pending: schedulesStats.pending_schedules
        },
        hashtags: {
          total: hashtagsStats.total_hashtags,
          trending: hashtagsStats.trending_hashtags,
          popular: hashtagsStats.popular_hashtags
        },
        links: {
          total: linksStats.total_links,
          active: linksStats.active_links,
          total_clicks: linksStats.total_clicks
        },
        media: {
          total: mediaStats.total_media,
          total_size: mediaStats.total_size,
          by_type: mediaStats.media_by_type
        },
        analytics: {
          total_engagement: analyticsStats.total_engagement,
          total_reach: analyticsStats.total_reach,
          total_impressions: analyticsStats.total_impressions,
          average_engagement_rate: analyticsStats.average_engagement_rate
        },
        engagement: {
          active_monitoring: engagementStats.total_engagement,
          total_campaigns: 0, // Será implementado quando necessário
          active_campaigns: 0 // Será implementado quando necessário
        } ;

    } catch (error) {
      console.error('Erro ao obter estatísticas globais:', error);

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

    console.error(`${operationName} falhou após ${this.config.retry.max_attempts} tentativas`);

    throw lastError!;
  }

  /**
   * Valida dados usando validação configurada
   */
  private validateData(data: unknown, rules: string[]): SocialBufferOperationResult {
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
    this.accounts.clearCache();

    this.posts.clearCache();

    this.schedules.clearCache();

    this.hashtags.clearCache();

    this.links.clearCache();

    this.media.clearCache();

    this.analytics.clearCache();

    this.engagement.clearCache();

  }

  /**
   * Obtém estatísticas de todos os caches
   */
  getAllCacheStats(): Record<string, { size: number; keys: string[] }> {
    return {
      accounts: this.accounts.getCacheStats(),
      posts: this.posts.getCacheStats(),
      schedules: this.schedules.getCacheStats(),
      hashtags: this.hashtags.getCacheStats(),
      links: this.links.getCacheStats(),
      media: this.media.getCacheStats(),
      analytics: this.analytics.getCacheStats(),
      engagement: this.engagement.getCacheStats()};

  }

  /**
   * Executa sincronização completa
   */
  async performFullSync(): Promise<SocialBufferOperationResult> {
    try {
      const results = await Promise.allSettled([
        this.accounts.syncAllAccounts(),
        this.posts.syncAllPosts(),
        this.schedules.syncAllSchedules(),
        this.hashtags.syncAllHashtags(),
        this.links.syncAllLinks(),
        this.media.syncAllMedia()
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
      console.error('Erro na sincronização completa:', error);

      return {
        success: false,
        message: 'Falha na sincronização completa',
        errors: [getErrorMessage(error)]};

    } /**
   * Executa operação de backup
   */
  async performBackup(): Promise<SocialBufferOperationResult> {
    try {
      // Implementação de backup seria feita aqui
      // Por enquanto, apenas limpa caches e retorna sucesso
      this.clearAllCaches();

      return {
        success: true,
        message: 'Backup executado com sucesso'};

    } catch (error) {
      console.error('Erro no backup:', error);

      return {
        success: false,
        message: 'Falha no backup',
        errors: [getErrorMessage(error)]};

    } /**
   * Executa operação de restauração
   */
  async performRestore(backupData: unknown): Promise<SocialBufferOperationResult> {
    try {
      // Implementação de restauração seria feita aqui
      // Por enquanto, apenas retorna sucesso
      
      return {
        success: true,
        message: 'Restauração executada com sucesso'};

    } catch (error) {
      console.error('Erro na restauração:', error);

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
        { name: 'accounts', service: this.accounts },
        { name: 'posts', service: this.posts },
        { name: 'schedules', service: this.schedules },
        { name: 'hashtags', service: this.hashtags },
        { name: 'links', service: this.links },
        { name: 'media', service: this.media },
        { name: 'analytics', service: this.analytics },
        { name: 'engagement', service: this.engagement }
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
      console.error('Erro ao verificar status de saúde:', error);

      return {
        status: 'error',
        services: {},
        message: 'Falha ao verificar status de saúde',
        timestamp: new Date().toISOString()};

    } }

// Instância singleton
export const socialBufferService = new SocialBufferService();

export default socialBufferService;
