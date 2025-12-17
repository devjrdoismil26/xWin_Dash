// =========================================
// SOCIAL BUFFER STORES INTEGRATION TESTS
// =========================================

import { renderHook, act } from '@testing-library/react';
import { useSocialBufferStore } from '../../hooks/useSocialBufferStore';
import { useAccountsStore } from '../../hooks/useAccountsStore';
import { usePostsStore } from '../../hooks/usePostsStore';
import { useSchedulesStore } from '../../hooks/useSchedulesStore';
import { useAnalyticsStore } from '../../hooks/analytics/useAnalyticsStore';
import { useSocialHashtagsStore } from '../../hooks/hashtags/useSocialHashtagsStore';
import { useSocialLinksStore } from '../../hooks/links/useSocialLinksStore';
import { useSocialMediaStore } from '../../hooks/media/useSocialMediaStore';
import { useSocialEngagementStore } from '../../hooks/engagement/useSocialEngagementStore';

// Mock dos services
jest.mock("../../services/accountsService");

jest.mock("../../services/postsService");

jest.mock("../../services/schedulesService");

jest.mock("../../services/analytics/analyticsService");

jest.mock("../../services/hashtagsService");

jest.mock("../../services/linksService");

jest.mock("../../services/mediaService");

jest.mock("../../services/engagement/engagementService");

jest.mock("../../services/socialCacheService");

// =========================================
// TESTES DE INTEGRAÇÃO DOS STORES
// =========================================

describe("SocialBuffer Stores Integration Tests", () => {
  beforeEach(() => {
    // Limpar todos os stores antes de cada teste
    act(() => {
      useSocialBufferStore.getState().clearAllCache();

      useAccountsStore.getState().clearCache();

      usePostsStore.getState().clearCache();

      useSchedulesStore.getState().clearCache();

      useAnalyticsStore().clearCache();

      useSocialHashtagsStore.getState().clearCache();

      useSocialLinksStore.getState().clearCache();

      useSocialMediaStore.getState().clearCache();

      useSocialEngagementStore.getState().clearCache();

    });

  });

  afterEach(() => {
    jest.clearAllMocks();

  });

  // ===== TESTES DO STORE ORQUESTRADOR =====

  describe("useSocialBufferStore - Store Orquestrador", () => {
    it("deve inicializar corretamente", () => {
      const { result } = renderHook(() => useSocialBufferStore());

      expect(result.current.isInitialized).toBe(false);

      expect(result.current.globalLoading).toBe(false);

      expect(result.current.globalError).toBeNull();

      expect(result.current.syncInProgress).toBe(false);

    });

    it("deve sincronizar todos os stores", async () => {
      const { result } = renderHook(() => useSocialBufferStore());

      await act(async () => {
        await result.current.syncAll();

      });

      expect(result.current.lastSync).toBeGreaterThan(0);

      expect(result.current.syncInProgress).toBe(false);

    });

    it("deve gerenciar operações em lote", () => {
      const { result } = renderHook(() => useSocialBufferStore());

      act(() => {
        result.current.startBulkOperation("delete", 10);

      });

      expect(result.current.bulkOperation.type).toBe("delete");

      expect(result.current.bulkOperation.total).toBe(10);

      expect(result.current.bulkOperation.progress).toBe(0);

      act(() => {
        result.current.updateBulkProgress(5, 1);

      });

      expect(result.current.bulkOperation.completed).toBe(5);

      expect(result.current.bulkOperation.failed).toBe(1);

      expect(result.current.bulkOperation.progress).toBe(60);

      act(() => {
        result.current.completeBulkOperation();

      });

      expect(result.current.bulkOperation.type).toBeNull();

      expect(result.current.bulkOperation.progress).toBe(100);

    });

    it("deve configurar auto-sync", () => {
      const { result } = renderHook(() => useSocialBufferStore());

      act(() => {
        result.current.setAutoSync(true, 5);

      });

      expect(result.current.syncStatus.autoSync).toBe(true);

      expect(result.current.syncStatus.syncInterval).toBe(5);

      expect(result.current.syncStatus.nextSync).toBeGreaterThan(Date.now());

    });

    it("deve limpar cache global", () => {
      const { result } = renderHook(() => useSocialBufferStore());

      act(() => {
        result.current.clearAllCache();

      });

      expect(result.current.cacheStatus.accounts).toBe(false);

      expect(result.current.cacheStatus.posts).toBe(false);

      expect(result.current.cacheStatus.schedules).toBe(false);

      expect(result.current.cacheStatus.analytics).toBe(false);

      expect(result.current.cacheStatus.hashtags).toBe(false);

      expect(result.current.cacheStatus.links).toBe(false);

      expect(result.current.cacheStatus.media).toBe(false);

      expect(result.current.cacheStatus.engagement).toBe(false);

    });

  });

  // ===== TESTES DE INTEGRAÇÃO ENTRE STORES =====

  describe("Stores Integration - Sincronização de Dados", () => {
    it("deve sincronizar contas com posts", async () => {
      const { result: accountsResult } = renderHook(() => useAccountsStore());

      const { result: postsResult } = renderHook(() => usePostsStore());

      const { result: bufferResult } = renderHook(() => useSocialBufferStore());

      // Mock de dados
      const mockAccount = {
        id: "1",
        name: "Test Account",
        platform: "facebook",
        is_connected: true,};

      const mockPost = {
        id: "1",
        account_id: "1",
        content: "Test post",
        platform: "facebook",};

      // Simular dados nos stores
      act(() => {
        accountsResult.current.setAccounts([mockAccount]);

        postsResult.current.setPosts([mockPost]);

      });

      // Sincronizar
      await act(async () => {
        await bufferResult.current.syncAccountsWithPosts();

      });

      // Verificar se os posts foram atualizados com informações da conta
      const updatedPosts = postsResult.current.posts;
      expect(updatedPosts[0].account_name).toBe("Test Account");

      expect(updatedPosts[0].account_platform).toBe("facebook");

    });

    it("deve sincronizar posts com agendamentos", async () => {
      const { result: postsResult } = renderHook(() => usePostsStore());

      const { result: schedulesResult } = renderHook(() => useSchedulesStore());

      const { result: bufferResult } = renderHook(() => useSocialBufferStore());

      // Mock de dados
      const mockPost = {
        id: "1",
        title: "Test Post",
        content: "Test content",};

      const mockSchedule = {
        id: "1",
        post_id: "1",
        scheduled_at: "2024-01-01T10:00:00Z",};

      // Simular dados nos stores
      act(() => {
        postsResult.current.setPosts([mockPost]);

        schedulesResult.current.setSchedules([mockSchedule]);

      });

      // Sincronizar
      await act(async () => {
        await bufferResult.current.syncPostsWithSchedules();

      });

      // Verificar se os agendamentos foram atualizados com informações do post
      const updatedSchedules = schedulesResult.current.schedules;
      expect(updatedSchedules[0].post_title).toBe("Test Post");

      expect(updatedSchedules[0].post_content).toBe("Test content");

    });

    it("deve sincronizar hashtags com posts", async () => {
      const { result: hashtagsResult } = renderHook(() =>
        useSocialHashtagsStore(),);

      const { result: postsResult } = renderHook(() => usePostsStore());

      const { result: bufferResult } = renderHook(() => useSocialBufferStore());

      // Mock de dados
      const mockHashtag = {
        id: "1",
        name: "test",
        usage_count: 0,};

      const mockPost = {
        id: "1",
        content: "This is a #test post",};

      // Simular dados nos stores
      act(() => {
        hashtagsResult.current.setHashtags([mockHashtag]);

        postsResult.current.setPosts([mockPost]);

      });

      // Sincronizar
      await act(async () => {
        await bufferResult.current.syncHashtagsWithPosts();

      });

      // Verificar se as hashtags foram atualizadas com contagem de uso
      const updatedHashtags = hashtagsResult.current.hashtags;
      expect(updatedHashtags[0].usage_count).toBe(1);

    });

  });

  // ===== TESTES DE PERFORMANCE =====

  describe("Performance Tests", () => {
    it("deve lidar com grandes volumes de dados", async () => {
      const { result: postsResult } = renderHook(() => usePostsStore());

      // Simular 1000 posts
      const mockPosts = Array.from({ length: 1000 }, (_, index) => ({
        id: index.toString(),
        title: `Post ${index}`,
        content: `Content ${index}`,
        platform: "facebook",
        status: "published",
      }));

      const startTime = performance.now();

      act(() => {
        postsResult.current.setPosts(mockPosts);

      });

      const endTime = performance.now();

      const executionTime = endTime - startTime;

      // Deve ser executado em menos de 100ms
      expect(executionTime).toBeLessThan(100);

      expect(postsResult.current.posts).toHaveLength(1000);

    });

    it("deve otimizar re-renders com memoização", () => {
      const { result: bufferResult } = renderHook(() => useSocialBufferStore());

      let renderCount = 0;
      const { result: statsResult } = renderHook(() => {
        renderCount++;
        return bufferResult.current.getCombinedStats();

      });

      // Primeira renderização
      expect(renderCount).toBe(1);

      // Atualizar estado não relacionado
      act(() => {
        bufferResult.current.setGlobalLoading(true);

      });

      // Não deve re-renderizar se os stats não mudaram
      expect(renderCount).toBe(1);

      // Atualizar dados que afetam os stats
      act(() => {
        bufferResult.current.setGlobalLoading(false);

      });

      // Deve re-renderizar apenas quando necessário
      expect(renderCount).toBe(1);

    });

  });

  // ===== TESTES DE CACHE =====

  describe("Cache Integration Tests", () => {
    it("deve invalidar cache corretamente", () => {
      const { result: bufferResult } = renderHook(() => useSocialBufferStore());

      act(() => {
        bufferResult.current.invalidateAllCache("posts");

      });

      // Verificar se o cache foi invalidado
      expect(result.current.cacheStatus.posts).toBe(false);

    });

    it("deve manter cache entre operações", async () => {
      const { result: postsResult } = renderHook(() => usePostsStore());

      const mockPost = {
        id: "1",
        title: "Test Post",
        content: "Test content",};

      act(() => {
        postsResult.current.setPosts([mockPost]);

      });

      // Simular operação que não afeta os posts
      act(() => {
        postsResult.current.setLoading(true);

        postsResult.current.setLoading(false);

      });

      // Posts devem permanecer no cache
      expect(postsResult.current.posts).toHaveLength(1);

      expect(postsResult.current.posts[0].title).toBe("Test Post");

    });

  });

  // ===== TESTES DE ESTADO GLOBAL =====

  describe("Global State Management", () => {
    it("deve gerenciar estado de loading global", () => {
      const { result: bufferResult } = renderHook(() => useSocialBufferStore());

      act(() => {
        bufferResult.current.setGlobalLoading(true);

      });

      expect(bufferResult.current.globalLoading).toBe(true);

      act(() => {
        bufferResult.current.setGlobalLoading(false);

      });

      expect(bufferResult.current.globalLoading).toBe(false);

    });

    it("deve gerenciar erros globais", () => {
      const { result: bufferResult } = renderHook(() => useSocialBufferStore());

      const errorMessage = "Test error";

      act(() => {
        bufferResult.current.setGlobalError(errorMessage);

      });

      expect(bufferResult.current.globalError).toBe(errorMessage);

      act(() => {
        bufferResult.current.clearGlobalError();

      });

      expect(bufferResult.current.globalError).toBeNull();

    });

    it("deve sincronizar estado entre stores", async () => {
      const { result: bufferResult } = renderHook(() => useSocialBufferStore());

      const { result: postsResult } = renderHook(() => usePostsStore());

      // Simular erro no store de posts
      act(() => {
        postsResult.current.setError("Posts error");

      });

      // O erro deve ser propagado para o store global
      expect(bufferResult.current.globalError).toBe("Posts error");

    });

  });

  // ===== TESTES DE DADOS COMBINADOS =====

  describe("Combined Data Tests", () => {
    it("deve combinar estatísticas de todos os stores", () => {
      const { result: bufferResult } = renderHook(() => useSocialBufferStore());

      const stats = bufferResult.current.getCombinedStats();

      expect(stats).toHaveProperty("accounts");

      expect(stats).toHaveProperty("posts");

      expect(stats).toHaveProperty("schedules");

      expect(stats).toHaveProperty("hashtags");

      expect(stats).toHaveProperty("links");

      expect(stats).toHaveProperty("media");

      expect(stats).toHaveProperty("engagement");

      expect(stats.accounts).toHaveProperty("total");

      expect(stats.accounts).toHaveProperty("connected");

      expect(stats.posts).toHaveProperty("total");

      expect(stats.posts).toHaveProperty("published");

    });

    it("deve combinar analytics de todos os stores", () => {
      const { result: bufferResult } = renderHook(() => useSocialBufferStore());

      const analytics = bufferResult.current.getCombinedAnalytics();

      expect(analytics).toHaveProperty("basic");

      expect(analytics).toHaveProperty("platform");

      expect(analytics).toHaveProperty("timeseries");

      expect(analytics).toHaveProperty("content");

      expect(analytics).toHaveProperty("hashtags");

      expect(analytics).toHaveProperty("links");

      expect(analytics).toHaveProperty("engagement");

      expect(analytics).toHaveProperty("audience");

    });

    it("deve combinar insights de todos os stores", () => {
      const { result: bufferResult } = renderHook(() => useSocialBufferStore());

      const insights = bufferResult.current.getCombinedInsights();

      expect(insights).toHaveProperty("analytics");

      expect(insights).toHaveProperty("engagement");

      expect(insights).toHaveProperty("combined");

      expect(insights.combined).toHaveProperty("total_insights");

      expect(insights.combined).toHaveProperty("recommendations");

      expect(insights.combined).toHaveProperty("trends");

    });

  });

});
