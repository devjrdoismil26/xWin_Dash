/**
 * Hook useSocialLinksStore - Store de Links
 *
 * @description
 * Store Zustand para gerenciamento de estado de links encurtados do SocialBuffer.
 * Gerencia CRUD de links, rastreamento, analytics, geração de QR codes e estatísticas.
 *
 * @module modules/SocialBuffer/hooks/links/useSocialLinksStore
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { linksService } from '@/services/linksService';
import { SocialLink } from '@/types/socialTypes';
import { getErrorMessage } from '@/utils/errorHelpers';
import type {
  LinkSearchParams,
  LinkPaginatedResponse,
  CreateLinkData,
  UpdateLinkData,
  LinkStats,
  LinkValidation,
  LinkAnalytics,
  QRCodeData
} from '@/services/linksService';

/**
 * Estado de links
 *
 * @interface SocialLinksState
 * @property {SocialLink[]} links - Lista de links
 * @property {SocialLink | null} selectedLink - Link selecionado
 * @property {LinkStats | null} linksStats - Estatísticas de links
 * @property {Object} pagination - Dados de paginação
 * @property {LinkSearchParams} filters - Filtros de busca
 * @property {boolean} loading - Se está carregando
 * @property {string | null} error - Mensagem de erro
 * @property {boolean} creating - Se está criando
 * @property {boolean} updating - Se está atualizando
 * @property {boolean} deleting - Se está excluindo
 * @property {boolean} generatingQR - Se está gerando QR code
 * @property {Record<string, LinkAnalytics>} linkAnalytics - Analytics por link
 * @property {Record<string, QRCodeData>} qrCodes - QR codes por link
 */
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
  totalPages: number; };

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
    qrCodes: number | null;};

}

interface SocialLinksActions {
  // Ações de busca e listagem
  fetchLinks: (params?: LinkSearchParams) => Promise<void>;
  refreshLinks: () => Promise<void>;
  searchLinks: (query: string) => Promise<void>;
  // Ações de seleção
  selectLink?: (e: any) => void;
  clearSelection??: (e: any) => void;
  selectMultipleLinks?: (e: any) => void;
  toggleLinkSelection?: (e: any) => void;
  clearMultipleSelection??: (e: any) => void;
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
  generateQRCode: (linkId: string, options?: string) => Promise<void>;
  getQRCode: (linkId: string) => QRCodeData | null;
  // Ações de estatísticas
  fetchLinksStats: () => Promise<void>;
  // Ações de filtros
  setFilters?: (e: any) => void;
  clearFilters??: (e: any) => void;
  // Ações de paginação
  setPage?: (e: any) => void;
  setLimit?: (e: any) => void;
  // Ações de estado
  setLoading?: (e: any) => void;
  setError?: (e: any) => void;
  clearError??: (e: any) => void;
  // Ações de cache
  clearCache??: (e: any) => void;
  invalidateCache?: (e: any) => void; }

// =========================================
// STORE DE LINKS SOCIAIS
// =========================================

export const useSocialLinksStore = create<SocialLinksState & SocialLinksActions>()(
  devtools(
    persist(
      (set: unknown, get: unknown) => ({
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
            limit: pagination.limit};

          set({ loading: true, error: null });

          try {
            const response: LinkPaginatedResponse = await linksService.getLinks(finalParams);

            set({
              links: (response as any).data,
              pagination: {
                page: (response as any).page,
                limit: (response as any).limit,
                total: (response as any).total,
                totalPages: (response as any).total_pages
              },
              loading: false,
              lastFetch: { ...get().lastFetch, links: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
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

          } ,
        
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
              error: getErrorMessage(error),
              creating: false
            });

            throw error;
          } ,
        
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
              error: getErrorMessage(error),
              updating: false
            });

            throw error;
          } ,
        
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
              error: getErrorMessage(error),
              deleting: false
            });

            throw error;
          } ,
        
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
              error: getErrorMessage(error),
              creating: false
            });

            throw error;
          } ,
        
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
              error: getErrorMessage(error),
              creating: false
            });

            throw error;
          } ,
        
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
              error: getErrorMessage(error),
              creating: false
            });

            throw error;
          } ,
        
        // ===== AÇÕES DE ANALYTICS =====
        
        getLinkAnalytics: async (linkId: string) => {
          set({ loading: true, error: null });

          try {
            const analytics = await linksService.getLinkAnalytics(linkId);

            set(state => ({
              linkAnalytics: { ...state.linkAnalytics, [linkId]: analytics },
              loading: false,
              lastFetch: { ...state.lastFetch, analytics: Date.now() } ));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        getLinkAnalyticsData: (linkId: string) => {
          const { linkAnalytics } = get();

          return linkAnalytics[linkId] || null;
        },
        
        // ===== AÇÕES DE QR CODE =====
        
        generateQRCode: async (linkId: string, options?: string) => {
          set({ generatingQR: true, error: null });

          try {
            const qrCode = await linksService.generateQRCode(linkId, options);

            set(state => ({
              qrCodes: { ...state.qrCodes, [linkId]: qrCode },
              generatingQR: false,
              lastFetch: { ...state.lastFetch, qrCodes: Date.now() } ));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              generatingQR: false
            });

          } ,
        
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
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        // ===== AÇÕES DE FILTROS =====
        
        setFilters: (filters: Partial<LinkSearchParams>) => {
          set(state => ({
            filters: { ...state.filters, ...filters } ));

        },
        
        clearFilters: () => {
          set({ filters: {} );

        },
        
        // ===== AÇÕES DE PAGINAÇÃO =====
        
        setPage: (page: number) => {
          set(state => ({
            pagination: { ...state.pagination, page } ));

        },
        
        setLimit: (limit: number) => {
          set(state => ({
            pagination: { ...state.pagination, limit, page: 1 } ));

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
            } );

        },
        
        invalidateCache: (pattern: string) => {
          linksService.invalidateCache(pattern);

        } ),
      {
        name: 'social-buffer-links-store',
        partialize: (state: unknown) => ({
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
  ));

export default useSocialLinksStore;
