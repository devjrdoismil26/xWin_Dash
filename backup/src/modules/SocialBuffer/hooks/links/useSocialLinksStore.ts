// =========================================
// SOCIAL LINKS STORE - SOCIAL BUFFER
// =========================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { linksService } from '../../services/linksService';
import { SocialLink } from '../../types/socialTypes';
import type {
  LinkSearchParams,
  LinkPaginatedResponse,
  CreateLinkData,
  UpdateLinkData,
  LinkStats,
  LinkValidation,
  LinkAnalytics,
  QRCodeData
} from '../../services/linksService';

interface SocialLinksState {
  // Estado dos links
  links: SocialLink[];
  selectedLink: SocialLink | null;
  linksStats: LinkStats | null;
  
  // Estado de paginação
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Estado de filtros
  filters: LinkSearchParams;
  
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  
  // Estado de operações
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  generatingQR: boolean;
  
  // Estado de analytics
  linkAnalytics: Record<string, LinkAnalytics>;
  qrCodes: Record<string, QRCodeData>;
  
  // Estado de seleção múltipla
  selectedLinks: string[];
  bulkAction: string | null;
  
  // Estado de cache
  lastFetch: {
    links: number | null;
    analytics: number | null;
    qrCodes: number | null;
  };
}

interface SocialLinksActions {
  // Ações de busca e listagem
  fetchLinks: (params?: LinkSearchParams) => Promise<void>;
  refreshLinks: () => Promise<void>;
  searchLinks: (query: string) => Promise<void>;
  
  // Ações de seleção
  selectLink: (link: SocialLink | null) => void;
  clearSelection: () => void;
  selectMultipleLinks: (linkIds: string[]) => void;
  toggleLinkSelection: (linkId: string) => void;
  clearMultipleSelection: () => void;
  
  // Ações de CRUD
  createLink: (linkData: CreateLinkData) => Promise<SocialLink>;
  updateLink: (id: string, linkData: UpdateLinkData) => Promise<SocialLink>;
  deleteLink: (id: string) => Promise<void>;
  duplicateLink: (id: string) => Promise<SocialLink>;
  
  // Ações de encurtamento
  shortenUrl: (url: string, customAlias?: string) => Promise<SocialLink>;
  bulkShortenUrls: (urls: string[]) => Promise<SocialLink[]>;
  
  // Ações de analytics
  getLinkAnalytics: (linkId: string) => Promise<void>;
  getLinkAnalyticsData: (linkId: string) => LinkAnalytics | null;
  
  // Ações de QR Code
  generateQRCode: (linkId: string, options?: any) => Promise<void>;
  getQRCode: (linkId: string) => QRCodeData | null;
  
  // Ações de estatísticas
  fetchLinksStats: () => Promise<void>;
  
  // Ações de filtros
  setFilters: (filters: Partial<LinkSearchParams>) => void;
  clearFilters: () => void;
  
  // Ações de paginação
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  
  // Ações de estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Ações de cache
  clearCache: () => void;
  invalidateCache: (pattern: string) => void;
}

// =========================================
// STORE DE LINKS SOCIAIS
// =========================================

export const useSocialLinksStore = create<SocialLinksState & SocialLinksActions>()(
  devtools(
    persist(
      (set, get) => ({
        // ===== ESTADO INICIAL =====
        
        // Estado dos links
        links: [],
        selectedLink: null,
        linksStats: null,
        
        // Estado de paginação
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        },
        
        // Estado de filtros
        filters: {},
        
        // Estado de loading e erro
        loading: false,
        error: null,
        
        // Estado de operações
        creating: false,
        updating: false,
        deleting: false,
        generatingQR: false,
        
        // Estado de analytics
        linkAnalytics: {},
        qrCodes: {},
        
        // Estado de seleção múltipla
        selectedLinks: [],
        bulkAction: null,
        
        // Estado de cache
        lastFetch: {
          links: null,
          analytics: null,
          qrCodes: null
        },
        
        // ===== AÇÕES DE BUSCA E LISTAGEM =====
        
        fetchLinks: async (params?: LinkSearchParams) => {
          const { filters, pagination } = get();
          const finalParams = { 
            ...filters, 
            ...params,
            page: pagination.page,
            limit: pagination.limit
          };
          
          set({ loading: true, error: null });
          
          try {
            const response: LinkPaginatedResponse = await linksService.getLinks(finalParams);
            set({
              links: response.data,
              pagination: {
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.total_pages
              },
              loading: false,
              lastFetch: { ...get().lastFetch, links: Date.now() }
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar links',
              loading: false
            });
          }
        },
        
        refreshLinks: async () => {
          const { fetchLinks } = get();
          await fetchLinks();
        },
        
        searchLinks: async (query: string) => {
          const { fetchLinks } = get();
          await fetchLinks({ search: query });
        },
        
        // ===== AÇÕES DE SELEÇÃO =====
        
        selectLink: (link: SocialLink | null) => {
          set({ selectedLink: link });
        },
        
        clearSelection: () => {
          set({ selectedLink: null });
        },
        
        selectMultipleLinks: (linkIds: string[]) => {
          set({ selectedLinks: linkIds });
        },
        
        toggleLinkSelection: (linkId: string) => {
          const { selectedLinks } = get();
          const isSelected = selectedLinks.includes(linkId);
          
          if (isSelected) {
            set({ selectedLinks: selectedLinks.filter(id => id !== linkId) });
          } else {
            set({ selectedLinks: [...selectedLinks, linkId] });
          }
        },
        
        clearMultipleSelection: () => {
          set({ selectedLinks: [], bulkAction: null });
        },
        
        // ===== AÇÕES DE CRUD =====
        
        createLink: async (linkData: CreateLinkData) => {
          set({ creating: true, error: null });
          
          try {
            const newLink = await linksService.createLink(linkData);
            set(state => ({
              links: [newLink, ...state.links],
              creating: false
            }));
            return newLink;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao criar link',
              creating: false
            });
            throw error;
          }
        },
        
        updateLink: async (id: string, linkData: UpdateLinkData) => {
          set({ updating: true, error: null });
          
          try {
            const updatedLink = await linksService.updateLink(id, linkData);
            set(state => ({
              links: state.links.map(link => 
                link.id === id ? updatedLink : link
              ),
              selectedLink: state.selectedLink?.id === id ? updatedLink : state.selectedLink,
              updating: false
            }));
            return updatedLink;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao atualizar link',
              updating: false
            });
            throw error;
          }
        },
        
        deleteLink: async (id: string) => {
          set({ deleting: true, error: null });
          
          try {
            await linksService.deleteLink(id);
            set(state => ({
              links: state.links.filter(link => link.id !== id),
              selectedLink: state.selectedLink?.id === id ? null : state.selectedLink,
              selectedLinks: state.selectedLinks.filter(linkId => linkId !== id),
              deleting: false
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao deletar link',
              deleting: false
            });
            throw error;
          }
        },
        
        duplicateLink: async (id: string) => {
          set({ creating: true, error: null });
          
          try {
            const duplicatedLink = await linksService.duplicateLink(id);
            set(state => ({
              links: [duplicatedLink, ...state.links],
              creating: false
            }));
            return duplicatedLink;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao duplicar link',
              creating: false
            });
            throw error;
          }
        },
        
        // ===== AÇÕES DE ENCURTAMENTO =====
        
        shortenUrl: async (url: string, customAlias?: string) => {
          set({ creating: true, error: null });
          
          try {
            const newLink = await linksService.shortenUrl(url, customAlias);
            set(state => ({
              links: [newLink, ...state.links],
              creating: false
            }));
            return newLink;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao encurtar URL',
              creating: false
            });
            throw error;
          }
        },
        
        bulkShortenUrls: async (urls: string[]) => {
          set({ creating: true, error: null });
          
          try {
            const newLinks = await linksService.bulkShortenUrls(urls);
            set(state => ({
              links: [...newLinks, ...state.links],
              creating: false
            }));
            return newLinks;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao encurtar URLs em lote',
              creating: false
            });
            throw error;
          }
        },
        
        // ===== AÇÕES DE ANALYTICS =====
        
        getLinkAnalytics: async (linkId: string) => {
          set({ loading: true, error: null });
          
          try {
            const analytics = await linksService.getLinkAnalytics(linkId);
            set(state => ({
              linkAnalytics: { ...state.linkAnalytics, [linkId]: analytics },
              loading: false,
              lastFetch: { ...state.lastFetch, analytics: Date.now() }
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar analytics do link',
              loading: false
            });
          }
        },
        
        getLinkAnalyticsData: (linkId: string) => {
          const { linkAnalytics } = get();
          return linkAnalytics[linkId] || null;
        },
        
        // ===== AÇÕES DE QR CODE =====
        
        generateQRCode: async (linkId: string, options?: any) => {
          set({ generatingQR: true, error: null });
          
          try {
            const qrCode = await linksService.generateQRCode(linkId, options);
            set(state => ({
              qrCodes: { ...state.qrCodes, [linkId]: qrCode },
              generatingQR: false,
              lastFetch: { ...state.lastFetch, qrCodes: Date.now() }
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao gerar QR Code',
              generatingQR: false
            });
          }
        },
        
        getQRCode: (linkId: string) => {
          const { qrCodes } = get();
          return qrCodes[linkId] || null;
        },
        
        // ===== AÇÕES DE ESTATÍSTICAS =====
        
        fetchLinksStats: async () => {
          set({ loading: true, error: null });
          
          try {
            const stats = await linksService.getLinksStats();
            set({
              linksStats: stats,
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar estatísticas de links',
              loading: false
            });
          }
        },
        
        // ===== AÇÕES DE FILTROS =====
        
        setFilters: (filters: Partial<LinkSearchParams>) => {
          set(state => ({
            filters: { ...state.filters, ...filters }
          }));
        },
        
        clearFilters: () => {
          set({ filters: {} });
        },
        
        // ===== AÇÕES DE PAGINAÇÃO =====
        
        setPage: (page: number) => {
          set(state => ({
            pagination: { ...state.pagination, page }
          }));
        },
        
        setLimit: (limit: number) => {
          set(state => ({
            pagination: { ...state.pagination, limit, page: 1 }
          }));
        },
        
        // ===== AÇÕES DE ESTADO =====
        
        setLoading: (loading: boolean) => {
          set({ loading });
        },
        
        setError: (error: string | null) => {
          set({ error });
        },
        
        clearError: () => {
          set({ error: null });
        },
        
        // ===== AÇÕES DE CACHE =====
        
        clearCache: () => {
          linksService.clearCache();
          set({
            links: [],
            linkAnalytics: {},
            qrCodes: {},
            lastFetch: {
              links: null,
              analytics: null,
              qrCodes: null
            }
          });
        },
        
        invalidateCache: (pattern: string) => {
          linksService.invalidateCache(pattern);
        }
      }),
      {
        name: 'social-buffer-links-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
          lastFetch: state.lastFetch,
          linkAnalytics: state.linkAnalytics,
          qrCodes: state.qrCodes
        })
      }
    ),
    {
      name: 'SocialBufferLinksStore'
    }
  )
);

export default useSocialLinksStore;
