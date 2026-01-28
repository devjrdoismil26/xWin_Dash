// =========================================
// SOCIAL BUFFER STORE ORQUESTRADOR - SOCIAL BUFFER
// =========================================

import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Importar todos os stores especializados
import { useAccountsStore } from './useAccountsStore';
import { usePostsStore } from './usePostsStore';
import { useSchedulesStore } from './useSchedulesStore';
import { useAnalyticsStore } from './analytics/useAnalyticsStore';
import { useSocialHashtagsStore } from './hashtags/useSocialHashtagsStore';
import { useSocialLinksStore } from './links/useSocialLinksStore';
import { useSocialMediaStore } from './media/useSocialMediaStore';
import { useSocialEngagementStore } from './engagement/useSocialEngagementStore';

// Importar cache service
import { socialCacheService } from '../services/socialCacheService';

// =========================================
// INTERFACES DO STORE ORQUESTRADOR
// =========================================

interface SocialBufferState {
  // Estado global
  isInitialized: boolean;
  lastSync: number | null;
  syncInProgress: boolean;
  
  // Estado de loading e erro global
  globalLoading: boolean;
  globalError: string | null;
  
  // Estado de operações globais
  bulkOperation: {
    type: string | null;
    progress: number;
    total: number;
    completed: number;
    failed: number;
  };
  
  // Estado de cache global
  cacheStatus: {
    accounts: boolean;
    posts: boolean;
    schedules: boolean;
    analytics: boolean;
    hashtags: boolean;
    links: boolean;
    media: boolean;
    engagement: boolean;
  };
  
  // Estado de sincronização
  syncStatus: {
    lastSync: number | null;
    nextSync: number | null;
    autoSync: boolean;
    syncInterval: number; // em minutos
  };
}

interface SocialBufferActions {
  // Ações de inicialização
  initialize: () => Promise<void>;
  reinitialize: () => Promise<void>;
  
  // Ações de sincronização
  syncAll: () => Promise<void>;
  syncStore: (storeName: string) => Promise<void>;
  setAutoSync: (enabled: boolean, interval?: number) => void;
  
  // Ações de cache
  clearAllCache: () => void;
  invalidateAllCache: (pattern: string) => void;
  refreshAllCache: () => Promise<void>;
  
  // Ações de operações em lote
  startBulkOperation: (type: string, total: number) => void;
  updateBulkProgress: (completed: number, failed: number) => void;
  completeBulkOperation: () => void;
  cancelBulkOperation: () => void;
  
  // Ações de estado global
  setGlobalLoading: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;
  clearGlobalError: () => void;
  
  // Ações de integração entre stores
  syncAccountsWithPosts: () => Promise<void>;
  syncPostsWithSchedules: () => Promise<void>;
  syncHashtagsWithPosts: () => Promise<void>;
  syncMediaWithPosts: () => Promise<void>;
  syncLinksWithPosts: () => Promise<void>;
  syncEngagementWithPosts: () => Promise<void>;
  
  // Ações de dados combinados
  getCombinedStats: () => any;
  getCombinedAnalytics: () => any;
  getCombinedInsights: () => any;
}

// =========================================
// STORE ORQUESTRADOR PRINCIPAL
// =========================================

export const useSocialBufferStore = create<SocialBufferState & SocialBufferActions>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // ===== ESTADO INICIAL =====
          
          // Estado global
          isInitialized: false,
          lastSync: null,
          syncInProgress: false,
          
          // Estado de loading e erro global
          globalLoading: false,
          globalError: null,
          
          // Estado de operações globais
          bulkOperation: {
            type: null,
            progress: 0,
            total: 0,
            completed: 0,
            failed: 0
          },
          
          // Estado de cache global
          cacheStatus: {
            accounts: false,
            posts: false,
            schedules: false,
            analytics: false,
            hashtags: false,
            links: false,
            media: false,
            engagement: false
          },
          
          // Estado de sincronização
          syncStatus: {
            lastSync: null,
            nextSync: null,
            autoSync: true,
            syncInterval: 15 // 15 minutos
          },
          
          // ===== AÇÕES DE INICIALIZAÇÃO =====
          
          initialize: async () => {
            set(state => {
              state.globalLoading = true;
              state.globalError = null;
            });
            
            try {
              // Inicializar cache service
              await socialCacheService.initialize();
              
              // Inicializar todos os stores
              const accountsStore = useAccountsStore.getState();
              const postsStore = usePostsStore.getState();
              const schedulesStore = useSchedulesStore.getState();
              const analyticsStore = useAnalyticsStore();
              const hashtagsStore = useSocialHashtagsStore.getState();
              const linksStore = useSocialLinksStore.getState();
              const mediaStore = useSocialMediaStore.getState();
              const engagementStore = useSocialEngagementStore.getState();
              
              // Carregar dados iniciais
              await Promise.all([
                accountsStore.fetchAccounts(),
                postsStore.fetchPosts(),
                schedulesStore.fetchSchedules(),
                hashtagsStore.fetchHashtags(),
                linksStore.fetchLinks(),
                mediaStore.fetchMedia(),
                engagementStore.listMonitoredPosts()
              ]);
              
              set(state => {
                state.isInitialized = true;
                state.globalLoading = false;
                state.lastSync = Date.now();
                state.cacheStatus = {
                  accounts: true,
                  posts: true,
                  schedules: true,
                  analytics: true,
                  hashtags: true,
                  links: true,
                  media: true,
                  engagement: true
                };
              });
              
              // Configurar auto-sync se habilitado
              const { syncStatus } = get();
              if (syncStatus.autoSync) {
                get().setAutoSync(true, syncStatus.syncInterval);
              }
              
            } catch (error) {
              set(state => {
                state.globalError = error instanceof Error ? error.message : 'Erro na inicialização';
                state.globalLoading = false;
              });
            }
          },
          
          reinitialize: async () => {
            set(state => {
              state.isInitialized = false;
              state.lastSync = null;
              state.cacheStatus = {
                accounts: false,
                posts: false,
                schedules: false,
                analytics: false,
                hashtags: false,
                links: false,
                media: false,
                engagement: false
              };
            });
            
            await get().initialize();
          },
          
          // ===== AÇÕES DE SINCRONIZAÇÃO =====
          
          syncAll: async () => {
            set(state => {
              state.syncInProgress = true;
              state.globalLoading = true;
            });
            
            try {
              const accountsStore = useAccountsStore.getState();
              const postsStore = usePostsStore.getState();
              const schedulesStore = useSchedulesStore.getState();
              const analyticsStore = useAnalyticsStore();
              const hashtagsStore = useSocialHashtagsStore.getState();
              const linksStore = useSocialLinksStore.getState();
              const mediaStore = useSocialMediaStore.getState();
              const engagementStore = useSocialEngagementStore.getState();
              
              // Sincronizar todos os stores
              await Promise.all([
                accountsStore.refreshAccounts(),
                postsStore.refreshPosts(),
                schedulesStore.refreshSchedules(),
                hashtagsStore.refreshHashtags(),
                linksStore.refreshLinks(),
                mediaStore.refreshMedia(),
                engagementStore.listMonitoredPosts()
              ]);
              
              // Sincronizar dados entre stores
              await Promise.all([
                get().syncAccountsWithPosts(),
                get().syncPostsWithSchedules(),
                get().syncHashtagsWithPosts(),
                get().syncMediaWithPosts(),
                get().syncLinksWithPosts(),
                get().syncEngagementWithPosts()
              ]);
              
              set(state => {
                state.syncInProgress = false;
                state.globalLoading = false;
                state.lastSync = Date.now();
                state.syncStatus.lastSync = Date.now();
                state.syncStatus.nextSync = Date.now() + (state.syncStatus.syncInterval * 60 * 1000);
              });
              
            } catch (error) {
              set(state => {
                state.syncInProgress = false;
                state.globalLoading = false;
                state.globalError = error instanceof Error ? error.message : 'Erro na sincronização';
              });
            }
          },
          
          syncStore: async (storeName: string) => {
            set(state => {
              state.globalLoading = true;
            });
            
            try {
              switch (storeName) {
                case 'accounts':
                  await useAccountsStore.getState().refreshAccounts();
                  break;
                case 'posts':
                  await usePostsStore.getState().refreshPosts();
                  break;
                case 'schedules':
                  await useSchedulesStore.getState().refreshSchedules();
                  break;
                case 'analytics':
                  await useAnalyticsStore().clearCache();
                  break;
                case 'hashtags':
                  await useSocialHashtagsStore.getState().refreshHashtags();
                  break;
                case 'links':
                  await useSocialLinksStore.getState().refreshLinks();
                  break;
                case 'media':
                  await useSocialMediaStore.getState().refreshMedia();
                  break;
                case 'engagement':
                  await useSocialEngagementStore.getState().listMonitoredPosts();
                  break;
                default:
                  throw new Error(`Store desconhecido: ${storeName}`);
              }
              
              set(state => {
                state.globalLoading = false;
                state.cacheStatus[storeName as keyof typeof state.cacheStatus] = true;
              });
              
            } catch (error) {
              set(state => {
                state.globalLoading = false;
                state.globalError = error instanceof Error ? error.message : `Erro ao sincronizar ${storeName}`;
              });
            }
          },
          
          setAutoSync: (enabled: boolean, interval: number = 15) => {
            set(state => {
              state.syncStatus.autoSync = enabled;
              state.syncStatus.syncInterval = interval;
              
              if (enabled) {
                state.syncStatus.nextSync = Date.now() + (interval * 60 * 1000);
              } else {
                state.syncStatus.nextSync = null;
              }
            });
            
            if (enabled) {
              // Configurar timer para auto-sync
              const timer = setInterval(() => {
                const { syncStatus } = get();
                if (syncStatus.autoSync && syncStatus.nextSync && Date.now() >= syncStatus.nextSync) {
                  get().syncAll();
                }
              }, 60000); // Verificar a cada minuto
              
              // Limpar timer anterior se existir
              if ((window as any).socialBufferSyncTimer) {
                clearInterval((window as any).socialBufferSyncTimer);
              }
              (window as any).socialBufferSyncTimer = timer;
            } else {
              // Limpar timer
              if ((window as any).socialBufferSyncTimer) {
                clearInterval((window as any).socialBufferSyncTimer);
                (window as any).socialBufferSyncTimer = null;
              }
            }
          },
          
          // ===== AÇÕES DE CACHE =====
          
          clearAllCache: () => {
            // Limpar cache de todos os stores
            useAccountsStore.getState().clearCache();
            usePostsStore.getState().clearCache();
            useSchedulesStore.getState().clearCache();
            useAnalyticsStore().clearCache();
            useSocialHashtagsStore.getState().clearCache();
            useSocialLinksStore.getState().clearCache();
            useSocialMediaStore.getState().clearCache();
            useSocialEngagementStore.getState().clearCache();
            
            // Limpar cache global
            socialCacheService.clearAll();
            
            set(state => {
              state.cacheStatus = {
                accounts: false,
                posts: false,
                schedules: false,
                analytics: false,
                hashtags: false,
                links: false,
                media: false,
                engagement: false
              };
            });
          },
          
          invalidateAllCache: (pattern: string) => {
            // Invalidar cache de todos os stores
            useAccountsStore.getState().invalidateCache(pattern);
            usePostsStore.getState().invalidateCache(pattern);
            useSchedulesStore.getState().invalidateCache(pattern);
            useAnalyticsStore().invalidateCache(pattern);
            useSocialHashtagsStore.getState().invalidateCache(pattern);
            useSocialLinksStore.getState().invalidateCache(pattern);
            useSocialMediaStore.getState().invalidateCache(pattern);
            useSocialEngagementStore.getState().invalidateCache(pattern);
            
            // Invalidar cache global
            socialCacheService.invalidate(pattern);
          },
          
          refreshAllCache: async () => {
            set(state => {
              state.globalLoading = true;
            });
            
            try {
              // Recarregar dados de todos os stores
              await get().syncAll();
              
              set(state => {
                state.globalLoading = false;
                state.cacheStatus = {
                  accounts: true,
                  posts: true,
                  schedules: true,
                  analytics: true,
                  hashtags: true,
                  links: true,
                  media: true,
                  engagement: true
                };
              });
              
            } catch (error) {
              set(state => {
                state.globalLoading = false;
                state.globalError = error instanceof Error ? error.message : 'Erro ao atualizar cache';
              });
            }
          },
          
          // ===== AÇÕES DE OPERAÇÕES EM LOTE =====
          
          startBulkOperation: (type: string, total: number) => {
            set(state => {
              state.bulkOperation = {
                type,
                progress: 0,
                total,
                completed: 0,
                failed: 0
              };
            });
          },
          
          updateBulkProgress: (completed: number, failed: number) => {
            set(state => {
              state.bulkOperation.completed = completed;
              state.bulkOperation.failed = failed;
              state.bulkOperation.progress = ((completed + failed) / state.bulkOperation.total) * 100;
            });
          },
          
          completeBulkOperation: () => {
            set(state => {
              state.bulkOperation = {
                type: null,
                progress: 100,
                total: 0,
                completed: 0,
                failed: 0
              };
            });
          },
          
          cancelBulkOperation: () => {
            set(state => {
              state.bulkOperation = {
                type: null,
                progress: 0,
                total: 0,
                completed: 0,
                failed: 0
              };
            });
          },
          
          // ===== AÇÕES DE ESTADO GLOBAL =====
          
          setGlobalLoading: (loading: boolean) => {
            set(state => {
              state.globalLoading = loading;
            });
          },
          
          setGlobalError: (error: string | null) => {
            set(state => {
              state.globalError = error;
            });
          },
          
          clearGlobalError: () => {
            set(state => {
              state.globalError = null;
            });
          },
          
          // ===== AÇÕES DE INTEGRAÇÃO ENTRE STORES =====
          
          syncAccountsWithPosts: async () => {
            try {
              const accountsStore = useAccountsStore.getState();
              const postsStore = usePostsStore.getState();
              
              // Sincronizar contas com posts
              const accounts = accountsStore.accounts;
              const posts = postsStore.posts;
              
              // Atualizar posts com informações das contas
              const updatedPosts = posts.map(post => {
                const account = accounts.find(acc => acc.id === post.account_id);
                return {
                  ...post,
                  account_name: account?.name || post.account_name,
                  account_platform: account?.platform || post.account_platform
                };
              });
              
              postsStore.setPosts(updatedPosts);
              
            } catch (error) {
              console.error('Erro ao sincronizar contas com posts:', error);
            }
          },
          
          syncPostsWithSchedules: async () => {
            try {
              const postsStore = usePostsStore.getState();
              const schedulesStore = useSchedulesStore.getState();
              
              // Sincronizar posts com agendamentos
              const posts = postsStore.posts;
              const schedules = schedulesStore.schedules;
              
              // Atualizar agendamentos com informações dos posts
              const updatedSchedules = schedules.map(schedule => {
                const post = posts.find(p => p.id === schedule.post_id);
                return {
                  ...schedule,
                  post_title: post?.title || schedule.post_title,
                  post_content: post?.content || schedule.post_content
                };
              });
              
              schedulesStore.setSchedules(updatedSchedules);
              
            } catch (error) {
              console.error('Erro ao sincronizar posts com agendamentos:', error);
            }
          },
          
          syncHashtagsWithPosts: async () => {
            try {
              const hashtagsStore = useSocialHashtagsStore.getState();
              const postsStore = usePostsStore.getState();
              
              // Sincronizar hashtags com posts
              const hashtags = hashtagsStore.hashtags;
              const posts = postsStore.posts;
              
              // Atualizar estatísticas de hashtags baseadas nos posts
              const updatedHashtags = hashtags.map(hashtag => {
                const postsWithHashtag = posts.filter(post => 
                  post.content?.includes(`#${hashtag.name}`)
                );
                
                return {
                  ...hashtag,
                  usage_count: postsWithHashtag.length,
                  last_used: postsWithHashtag.length > 0 
                    ? Math.max(...postsWithHashtag.map(p => new Date(p.created_at).getTime()))
                    : hashtag.last_used
                };
              });
              
              hashtagsStore.setHashtags(updatedHashtags);
              
            } catch (error) {
              console.error('Erro ao sincronizar hashtags com posts:', error);
            }
          },
          
          syncMediaWithPosts: async () => {
            try {
              const mediaStore = useSocialMediaStore.getState();
              const postsStore = usePostsStore.getState();
              
              // Sincronizar mídia com posts
              const media = mediaStore.media;
              const posts = postsStore.posts;
              
              // Atualizar posts com informações da mídia
              const updatedPosts = posts.map(post => {
                const postMedia = media.filter(m => m.post_id === post.id);
                return {
                  ...post,
                  media_count: postMedia.length,
                  media_types: [...new Set(postMedia.map(m => m.type))]
                };
              });
              
              postsStore.setPosts(updatedPosts);
              
            } catch (error) {
              console.error('Erro ao sincronizar mídia com posts:', error);
            }
          },
          
          syncLinksWithPosts: async () => {
            try {
              const linksStore = useSocialLinksStore.getState();
              const postsStore = usePostsStore.getState();
              
              // Sincronizar links com posts
              const links = linksStore.links;
              const posts = postsStore.posts;
              
              // Atualizar posts com informações dos links
              const updatedPosts = posts.map(post => {
                const postLinks = links.filter(l => l.post_id === post.id);
                return {
                  ...post,
                  links_count: postLinks.length,
                  total_clicks: postLinks.reduce((sum, link) => sum + link.clicks, 0)
                };
              });
              
              postsStore.setPosts(updatedPosts);
              
            } catch (error) {
              console.error('Erro ao sincronizar links com posts:', error);
            }
          },
          
          syncEngagementWithPosts: async () => {
            try {
              const engagementStore = useSocialEngagementStore.getState();
              const postsStore = usePostsStore.getState();
              
              // Sincronizar engajamento com posts
              const monitoredPosts = engagementStore.monitoredPosts;
              const posts = postsStore.posts;
              
              // Atualizar posts com informações de engajamento
              const updatedPosts = posts.map(post => {
                const monitoring = monitoredPosts.find(mp => mp.post_id === post.id);
                return {
                  ...post,
                  is_monitored: !!monitoring,
                  engagement_score: monitoring?.current_engagement?.engagement_rate || post.engagement_score
                };
              });
              
              postsStore.setPosts(updatedPosts);
              
            } catch (error) {
              console.error('Erro ao sincronizar engajamento com posts:', error);
            }
          },
          
          // ===== AÇÕES DE DADOS COMBINADOS =====
          
          getCombinedStats: () => {
            const accountsStore = useAccountsStore.getState();
            const postsStore = usePostsStore.getState();
            const schedulesStore = useSchedulesStore.getState();
            const hashtagsStore = useSocialHashtagsStore.getState();
            const linksStore = useSocialLinksStore.getState();
            const mediaStore = useSocialMediaStore.getState();
            const engagementStore = useSocialEngagementStore.getState();
            
            return {
              accounts: {
                total: accountsStore.accounts.length,
                connected: accountsStore.accounts.filter(acc => acc.is_connected).length,
                by_platform: accountsStore.accounts.reduce((acc, account) => {
                  acc[account.platform] = (acc[account.platform] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              },
              posts: {
                total: postsStore.posts.length,
                published: postsStore.posts.filter(post => post.status === 'published').length,
                scheduled: postsStore.posts.filter(post => post.status === 'scheduled').length,
                draft: postsStore.posts.filter(post => post.status === 'draft').length
              },
              schedules: {
                total: schedulesStore.schedules.length,
                active: schedulesStore.schedules.filter(schedule => schedule.status === 'active').length,
                completed: schedulesStore.schedules.filter(schedule => schedule.status === 'completed').length
              },
              hashtags: {
                total: hashtagsStore.hashtags.length,
                trending: hashtagsStore.trendingHashtags.length,
                popular: hashtagsStore.popularHashtags.length
              },
              links: {
                total: linksStore.links.length,
                total_clicks: linksStore.links.reduce((sum, link) => sum + link.clicks, 0),
                total_unique_clicks: linksStore.links.reduce((sum, link) => sum + link.unique_clicks, 0)
              },
              media: {
                total: mediaStore.media.length,
                by_type: mediaStore.media.reduce((acc, media) => {
                  acc[media.type] = (acc[media.type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              },
              engagement: {
                monitored_posts: engagementStore.monitoredPosts.length,
                total_alerts: engagementStore.engagementAlerts.length,
                unread_alerts: engagementStore.engagementAlerts.filter(alert => !alert.is_read).length
              }
            };
          },
          
          getCombinedAnalytics: () => {
            const analyticsStore = useAnalyticsStore();
            
            return {
              basic: analyticsStore.basicMetrics,
              platform: analyticsStore.platformMetrics,
              timeseries: analyticsStore.timeSeriesMetrics,
              content: analyticsStore.contentMetrics,
              hashtags: analyticsStore.hashtagMetrics,
              links: analyticsStore.linkMetrics,
              engagement: analyticsStore.engagementMetrics,
              audience: analyticsStore.audienceMetrics
            };
          },
          
          getCombinedInsights: () => {
            const analyticsStore = useAnalyticsStore();
            const engagementStore = useSocialEngagementStore.getState();
            
            return {
              analytics: analyticsStore.insights,
              engagement: engagementStore.engagementInsights,
              combined: {
                total_insights: (analyticsStore.insights?.insights.length || 0) + 
                              (engagementStore.engagementInsights?.insights.length || 0),
                recommendations: [
                  ...(analyticsStore.insights?.recommendations || []),
                  ...(engagementStore.engagementInsights?.opportunities.map(opp => opp.description) || [])
                ],
                trends: [
                  ...(analyticsStore.insights?.trends || []),
                  ...(engagementStore.engagementInsights?.trends || [])
                ]
              }
            };
          }
        }))
      ),
      {
        name: 'social-buffer-main-store',
        partialize: (state) => ({
          isInitialized: state.isInitialized,
          lastSync: state.lastSync,
          syncStatus: state.syncStatus,
          cacheStatus: state.cacheStatus
        })
      }
    ),
    {
      name: 'SocialBufferMainStore'
    }
  )
);

export default useSocialBufferStore;
