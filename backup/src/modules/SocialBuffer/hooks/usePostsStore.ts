import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { postsService } from '../services/postsService';
import { SocialPost, SocialPostStatus } from '../types/socialTypes';
import type {
  PostSearchParams,
  PostPaginatedResponse,
  CreatePostData,
  UpdatePostData,
  PostStats,
  PostAnalysis,
  PostOptimization
} from '../services/postsService';

interface PostsState {
  // Estado dos posts
  posts: SocialPost[];
  selectedPost: SocialPost | null;
  postsStats: PostStats | null;
  
  // Estado de paginação
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Estado de filtros
  filters: PostSearchParams;
  
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  
  // Estado de operações
  publishing: boolean;
  scheduling: boolean;
  analyzing: boolean;
  optimizing: boolean;
  
  // Estado de seleção múltipla
  selectedPosts: string[];
  bulkAction: string | null;
}

interface PostsActions {
  // Ações de busca e listagem
  fetchPosts: (params?: PostSearchParams) => Promise<void>;
  refreshPosts: () => Promise<void>;
  searchPosts: (query: string) => Promise<void>;
  
  // Ações de seleção
  selectPost: (post: SocialPost | null) => void;
  clearSelection: () => void;
  selectMultiplePosts: (postIds: string[]) => void;
  togglePostSelection: (postId: string) => void;
  clearMultipleSelection: () => void;
  
  // Ações de CRUD
  createPost: (postData: CreatePostData) => Promise<SocialPost>;
  updatePost: (id: string, postData: UpdatePostData) => Promise<SocialPost>;
  deletePost: (id: string) => Promise<void>;
  duplicatePost: (id: string) => Promise<SocialPost>;
  
  // Ações de publicação
  publishPost: (id: string) => Promise<SocialPost>;
  schedulePost: (id: string, scheduledAt: string) => Promise<SocialPost>;
  cancelSchedule: (id: string) => Promise<SocialPost>;
  
  // Ações de análise
  analyzePost: (id: string) => Promise<PostAnalysis>;
  optimizePost: (id: string) => Promise<PostOptimization>;
  
  // Ações de conteúdo
  generateContent: (prompt: string, options?: any) => Promise<string>;
  suggestHashtags: (content: string) => Promise<string[]>;
  suggestOptimalTime: (postId: string) => Promise<string[]>;
  
  // Ações de estatísticas
  fetchPostsStats: () => Promise<void>;
  
  // Ações de filtros
  setFilters: (filters: Partial<PostSearchParams>) => void;
  clearFilters: () => void;
  
  // Ações de paginação
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  
  // Ações de estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Ações de bulk
  setBulkAction: (action: string | null) => void;
  executeBulkAction: (action: string, postIds: string[]) => Promise<void>;
}

type PostsStore = PostsState & PostsActions;

const initialState: PostsState = {
  posts: [],
  selectedPost: null,
  postsStats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  filters: {},
  loading: false,
  error: null,
  publishing: false,
  scheduling: false,
  analyzing: false,
  optimizing: false,
  selectedPosts: [],
  bulkAction: null
};

export const usePostsStore = create<PostsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Ações de busca e listagem
        fetchPosts: async (params?: PostSearchParams) => {
          try {
            set({ loading: true, error: null });
            
            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params };
            
            const response: PostPaginatedResponse = await postsService.getPosts(searchParams);
            
            set({
              posts: response.data,
              pagination: {
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.total_pages
              },
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar posts',
              loading: false
            });
          }
        },

        refreshPosts: async () => {
          const { fetchPosts, filters, pagination } = get();
          await fetchPosts({
            ...filters,
            page: pagination.page,
            limit: pagination.limit
          });
        },

        searchPosts: async (query: string) => {
          const { fetchPosts } = get();
          await fetchPosts({ search: query });
        },

        // Ações de seleção
        selectPost: (post: SocialPost | null) => {
          set({ selectedPost: post });
        },

        clearSelection: () => {
          set({ selectedPost: null });
        },

        selectMultiplePosts: (postIds: string[]) => {
          set({ selectedPosts: postIds });
        },

        togglePostSelection: (postId: string) => {
          set((state) => ({
            selectedPosts: state.selectedPosts.includes(postId)
              ? state.selectedPosts.filter(id => id !== postId)
              : [...state.selectedPosts, postId]
          }));
        },

        clearMultipleSelection: () => {
          set({ selectedPosts: [] });
        },

        // Ações de CRUD
        createPost: async (postData: CreatePostData) => {
          try {
            set({ loading: true, error: null });
            
            const newPost = await postsService.createPost(postData);
            
            set((state) => ({
              posts: [newPost, ...state.posts],
              loading: false
            }));
            
            return newPost;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao criar post',
              loading: false
            });
            throw error;
          }
        },

        updatePost: async (id: string, postData: UpdatePostData) => {
          try {
            set({ loading: true, error: null });
            
            const updatedPost = await postsService.updatePost(id, postData);
            
            set((state) => ({
              posts: state.posts.map(post =>
                post.id === id ? updatedPost : post
              ),
              selectedPost: state.selectedPost?.id === id ? updatedPost : state.selectedPost,
              loading: false
            }));
            
            return updatedPost;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao atualizar post',
              loading: false
            });
            throw error;
          }
        },

        deletePost: async (id: string) => {
          try {
            set({ loading: true, error: null });
            
            await postsService.deletePost(id);
            
            set((state) => ({
              posts: state.posts.filter(post => post.id !== id),
              selectedPost: state.selectedPost?.id === id ? null : state.selectedPost,
              selectedPosts: state.selectedPosts.filter(postId => postId !== id),
              loading: false
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao remover post',
              loading: false
            });
            throw error;
          }
        },

        duplicatePost: async (id: string) => {
          try {
            set({ loading: true, error: null });
            
            const duplicatedPost = await postsService.duplicatePost(id);
            
            set((state) => ({
              posts: [duplicatedPost, ...state.posts],
              loading: false
            }));
            
            return duplicatedPost;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao duplicar post',
              loading: false
            });
            throw error;
          }
        },

        // Ações de publicação
        publishPost: async (id: string) => {
          try {
            set({ publishing: true, error: null });
            
            const publishedPost = await postsService.publishPost(id);
            
            set((state) => ({
              posts: state.posts.map(post =>
                post.id === id ? publishedPost : post
              ),
              selectedPost: state.selectedPost?.id === id ? publishedPost : state.selectedPost,
              publishing: false
            }));
            
            return publishedPost;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao publicar post',
              publishing: false
            });
            throw error;
          }
        },

        schedulePost: async (id: string, scheduledAt: string) => {
          try {
            set({ scheduling: true, error: null });
            
            const scheduledPost = await postsService.schedulePost(id, scheduledAt);
            
            set((state) => ({
              posts: state.posts.map(post =>
                post.id === id ? scheduledPost : post
              ),
              selectedPost: state.selectedPost?.id === id ? scheduledPost : state.selectedPost,
              scheduling: false
            }));
            
            return scheduledPost;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao agendar post',
              scheduling: false
            });
            throw error;
          }
        },

        cancelSchedule: async (id: string) => {
          try {
            set({ loading: true, error: null });
            
            const cancelledPost = await postsService.cancelSchedule(id);
            
            set((state) => ({
              posts: state.posts.map(post =>
                post.id === id ? cancelledPost : post
              ),
              selectedPost: state.selectedPost?.id === id ? cancelledPost : state.selectedPost,
              loading: false
            }));
            
            return cancelledPost;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao cancelar agendamento',
              loading: false
            });
            throw error;
          }
        },

        // Ações de análise
        analyzePost: async (id: string) => {
          try {
            set({ analyzing: true, error: null });
            
            const analysis = await postsService.analyzePost(id);
            
            set({ analyzing: false });
            return analysis;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao analisar post',
              analyzing: false
            });
            throw error;
          }
        },

        optimizePost: async (id: string) => {
          try {
            set({ optimizing: true, error: null });
            
            const optimization = await postsService.optimizePost(id);
            
            set({ optimizing: false });
            return optimization;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao otimizar post',
              optimizing: false
            });
            throw error;
          }
        },

        // Ações de conteúdo
        generateContent: async (prompt: string, options?: any) => {
          try {
            set({ loading: true, error: null });
            
            const content = await postsService.generateContent(prompt, options);
            
            set({ loading: false });
            return content;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao gerar conteúdo',
              loading: false
            });
            throw error;
          }
        },

        suggestHashtags: async (content: string) => {
          try {
            const hashtags = await postsService.suggestHashtags(content);
            return hashtags;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao sugerir hashtags'
            });
            throw error;
          }
        },

        suggestOptimalTime: async (postId: string) => {
          try {
            const times = await postsService.suggestOptimalTime(postId);
            return times;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao sugerir horário otimizado'
            });
            throw error;
          }
        },

        // Ações de estatísticas
        fetchPostsStats: async () => {
          try {
            const stats = await postsService.getPostsStats();
            set({ postsStats: stats });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar estatísticas'
            });
          }
        },

        // Ações de filtros
        setFilters: (filters: Partial<PostSearchParams>) => {
          set((state) => ({
            filters: { ...state.filters, ...filters },
            pagination: { ...state.pagination, page: 1 } // Reset para primeira página
          }));
        },

        clearFilters: () => {
          set({ filters: {}, pagination: { ...get().pagination, page: 1 } });
        },

        // Ações de paginação
        setPage: (page: number) => {
          set((state) => ({
            pagination: { ...state.pagination, page }
          }));
        },

        setLimit: (limit: number) => {
          set((state) => ({
            pagination: { ...state.pagination, limit, page: 1 } // Reset para primeira página
          }));
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

        // Ações de bulk
        setBulkAction: (action: string | null) => {
          set({ bulkAction: action });
        },

        executeBulkAction: async (action: string, postIds: string[]) => {
          try {
            set({ loading: true, error: null });
            
            switch (action) {
              case 'publish':
                await Promise.all(postIds.map(id => postsService.publishPost(id)));
                break;
              case 'delete':
                await Promise.all(postIds.map(id => postsService.deletePost(id)));
                break;
              case 'duplicate':
                await Promise.all(postIds.map(id => postsService.duplicatePost(id)));
                break;
              default:
                throw new Error('Ação em lote não suportada');
            }
            
            // Atualizar lista de posts
            const { refreshPosts } = get();
            await refreshPosts();
            
            set({ loading: false, selectedPosts: [] });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao executar ação em lote',
              loading: false
            });
            throw error;
          }
        }
      }),
      {
        name: 'socialbuffer-posts-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
          selectedPost: state.selectedPost
        })
      }
    ),
    {
      name: 'SocialBufferPostsStore'
    }
  )
);

export default usePostsStore;
