/**
 * Hook principal do módulo Products
 * Integração completa com backend Laravel
 * Suporte para produtos físicos/digitais, landing pages e captura de leads
 */

import { useState, useCallback } from 'react';
import { productsApiService } from '../services/productsApiService';
import {
  Product,
  LandingPage,
  LeadCaptureForm,
  Lead,
  CreateProductData,
  UpdateProductData,
  CreateLandingPageData,
  UpdateLandingPageData,
  CreateFormData,
  UpdateFormData,
  ProductsFilter,
  LandingPagesFilter,
  FormsFilter,
  LeadsFilter,
  ProductsStats,
  LandingPagesStats,
  FormsStats,
  LeadsStats
} from '../types';

interface UseProductsReturn {
  // Estado consolidado
  loading: boolean;
  error: string | null;
  
  // Produtos
  products: Product[];
  currentProduct: Product | null;
  loadProducts: (filters?: ProductsFilter) => Promise<void>;
  loadProduct: (id: number) => Promise<void>;
  createProduct: (data: CreateProductData) => Promise<Product>;
  updateProduct: (id: number, data: UpdateProductData) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
  duplicateProduct: (id: number, newName?: string) => Promise<Product>;
  updateProductStatus: (id: number, status: string) => Promise<void>;
  updateProductInventory: (id: number, inventory: any) => Promise<void>;
  
  // Landing Pages
  landingPages: LandingPage[];
  currentLandingPage: LandingPage | null;
  loadLandingPages: (filters?: LandingPagesFilter) => Promise<void>;
  loadLandingPage: (id: number) => Promise<void>;
  createLandingPage: (data: CreateLandingPageData) => Promise<LandingPage>;
  updateLandingPage: (id: number, data: UpdateLandingPageData) => Promise<LandingPage>;
  deleteLandingPage: (id: number) => Promise<void>;
  publishLandingPage: (id: number) => Promise<void>;
  unpublishLandingPage: (id: number) => Promise<void>;
  
  // Formulários de Captura
  forms: LeadCaptureForm[];
  currentForm: LeadCaptureForm | null;
  loadForms: (filters?: FormsFilter) => Promise<void>;
  loadForm: (id: number) => Promise<void>;
  createForm: (data: CreateFormData) => Promise<LeadCaptureForm>;
  updateForm: (id: number, data: UpdateFormData) => Promise<LeadCaptureForm>;
  deleteForm: (id: number) => Promise<void>;
  publishForm: (id: number) => Promise<void>;
  unpublishForm: (id: number) => Promise<void>;
  
  // Leads
  leads: Lead[];
  currentLead: Lead | null;
  loadLeads: (filters?: LeadsFilter) => Promise<void>;
  loadLead: (id: number) => Promise<void>;
  updateLead: (id: number, data: Partial<Lead>) => Promise<Lead>;
  updateLeadStatus: (id: number, status: string) => Promise<void>;
  updateLeadScore: (id: number, score: number) => Promise<void>;
  deleteLead: (id: number) => Promise<void>;
  
  // Estatísticas
  productsStats: ProductsStats | null;
  landingPagesStats: LandingPagesStats | null;
  formsStats: FormsStats | null;
  leadsStats: LeadsStats | null;
  loadProductsStats: (filters?: any) => Promise<void>;
  loadLandingPagesStats: (filters?: any) => Promise<void>;
  loadFormsStats: (filters?: any) => Promise<void>;
  loadLeadsStats: (filters?: any) => Promise<void>;
  
  // Operações em Lote
  bulkUpdateProducts: (ids: number[], updates: any) => Promise<void>;
  bulkDeleteProducts: (ids: number[]) => Promise<void>;
  bulkUpdateLeads: (ids: number[], updates: any) => Promise<void>;
  
  // Import/Export
  importProducts: (file: File, projectId?: number) => Promise<void>;
  exportProducts: (filters?: ProductsFilter) => Promise<void>;
  exportLeads: (filters?: LeadsFilter) => Promise<void>;
  
  // Utilitários
  clearError: () => void;
  clearCurrentProduct: () => void;
  clearCurrentLandingPage: () => void;
  clearCurrentForm: () => void;
  clearCurrentLead: () => void;
}

export const useProducts = (): UseProductsReturn => {
  // =========================================
  // ESTADO LOCAL
  // =========================================
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Produtos
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  // Landing Pages
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [currentLandingPage, setCurrentLandingPage] = useState<LandingPage | null>(null);
  
  // Formulários
  const [forms, setForms] = useState<LeadCaptureForm[]>([]);
  const [currentForm, setCurrentForm] = useState<LeadCaptureForm | null>(null);
  
  // Leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  
  // Estatísticas
  const [productsStats, setProductsStats] = useState<ProductsStats | null>(null);
  const [landingPagesStats, setLandingPagesStats] = useState<LandingPagesStats | null>(null);
  const [formsStats, setFormsStats] = useState<FormsStats | null>(null);
  const [leadsStats, setLeadsStats] = useState<LeadsStats | null>(null);

  // =========================================
  // FUNÇÕES DE PRODUTOS
  // =========================================
  
  const loadProducts = useCallback(async (filters: ProductsFilter = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.getProducts(filters);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load products');
      }

      setProducts(response.data?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProduct = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.getProduct(id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load product');
      }

      setCurrentProduct(response.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data: CreateProductData): Promise<Product> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.createProduct(data);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create product');
      }

      const newProduct = response.data!;
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: number, data: UpdateProductData): Promise<Product> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.updateProduct(id, data);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update product');
      }

      const updatedProduct = response.data!;
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      if (currentProduct?.id === id) {
        setCurrentProduct(updatedProduct);
      }
      return updatedProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProduct]);

  const deleteProduct = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.deleteProduct(id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete product');
      }

      setProducts(prev => prev.filter(p => p.id !== id));
      if (currentProduct?.id === id) {
        setCurrentProduct(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProduct]);

  const duplicateProduct = useCallback(async (id: number, newName?: string): Promise<Product> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.duplicateProduct(id, newName);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to duplicate product');
      }

      const duplicatedProduct = response.data!;
      setProducts(prev => [duplicatedProduct, ...prev]);
      return duplicatedProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProductStatus = useCallback(async (id: number, status: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.updateProductStatus(id, status);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update product status');
      }

      const updatedProduct = response.data!;
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      if (currentProduct?.id === id) {
        setCurrentProduct(updatedProduct);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProduct]);

  const updateProductInventory = useCallback(async (id: number, inventory: any): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.updateProductInventory(id, inventory);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update product inventory');
      }

      const updatedProduct = response.data!;
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      if (currentProduct?.id === id) {
        setCurrentProduct(updatedProduct);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product inventory');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProduct]);

  // =========================================
  // FUNÇÕES DE LANDING PAGES
  // =========================================
  
  const loadLandingPages = useCallback(async (filters: LandingPagesFilter = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.getLandingPages(filters);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load landing pages');
      }

      setLandingPages(response.data?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load landing pages');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLandingPage = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.getLandingPage(id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load landing page');
      }

      setCurrentLandingPage(response.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load landing page');
    } finally {
      setLoading(false);
    }
  }, []);

  const createLandingPage = useCallback(async (data: CreateLandingPageData): Promise<LandingPage> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.createLandingPage(data);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create landing page');
      }

      const newLandingPage = response.data!;
      setLandingPages(prev => [newLandingPage, ...prev]);
      return newLandingPage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create landing page');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLandingPage = useCallback(async (id: number, data: UpdateLandingPageData): Promise<LandingPage> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.updateLandingPage(id, data);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update landing page');
      }

      const updatedLandingPage = response.data!;
      setLandingPages(prev => prev.map(lp => lp.id === id ? updatedLandingPage : lp));
      if (currentLandingPage?.id === id) {
        setCurrentLandingPage(updatedLandingPage);
      }
      return updatedLandingPage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update landing page');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentLandingPage]);

  const deleteLandingPage = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.deleteLandingPage(id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete landing page');
      }

      setLandingPages(prev => prev.filter(lp => lp.id !== id));
      if (currentLandingPage?.id === id) {
        setCurrentLandingPage(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete landing page');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentLandingPage]);

  const publishLandingPage = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.publishLandingPage(id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to publish landing page');
      }

      const publishedLandingPage = response.data!;
      setLandingPages(prev => prev.map(lp => lp.id === id ? publishedLandingPage : lp));
      if (currentLandingPage?.id === id) {
        setCurrentLandingPage(publishedLandingPage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish landing page');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentLandingPage]);

  const unpublishLandingPage = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.unpublishLandingPage(id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to unpublish landing page');
      }

      const unpublishedLandingPage = response.data!;
      setLandingPages(prev => prev.map(lp => lp.id === id ? unpublishedLandingPage : lp));
      if (currentLandingPage?.id === id) {
        setCurrentLandingPage(unpublishedLandingPage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unpublish landing page');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentLandingPage]);

  // =========================================
  // FUNÇÕES DE FORMULÁRIOS
  // =========================================
  
  const loadForms = useCallback(async (filters: FormsFilter = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.getForms(filters);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load forms');
      }

      setForms(response.data?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load forms');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadForm = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.getForm(id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load form');
      }

      setCurrentForm(response.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load form');
    } finally {
      setLoading(false);
    }
  }, []);

  const createForm = useCallback(async (data: CreateFormData): Promise<LeadCaptureForm> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.createForm(data);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create form');
      }

      const newForm = response.data!;
      setForms(prev => [newForm, ...prev]);
      return newForm;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create form');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateForm = useCallback(async (id: number, data: UpdateFormData): Promise<LeadCaptureForm> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.updateForm(id, data);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update form');
      }

      const updatedForm = response.data!;
      setForms(prev => prev.map(f => f.id === id ? updatedForm : f));
      if (currentForm?.id === id) {
        setCurrentForm(updatedForm);
      }
      return updatedForm;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update form');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentForm]);

  const deleteForm = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.deleteForm(id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete form');
      }

      setForms(prev => prev.filter(f => f.id !== id));
      if (currentForm?.id === id) {
        setCurrentForm(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete form');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentForm]);

  const publishForm = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.publishForm(id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to publish form');
      }

      const publishedForm = response.data!;
      setForms(prev => prev.map(f => f.id === id ? publishedForm : f));
      if (currentForm?.id === id) {
        setCurrentForm(publishedForm);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish form');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentForm]);

  const unpublishForm = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.unpublishForm(id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to unpublish form');
      }

      const unpublishedForm = response.data!;
      setForms(prev => prev.map(f => f.id === id ? unpublishedForm : f));
      if (currentForm?.id === id) {
        setCurrentForm(unpublishedForm);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unpublish form');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentForm]);

  // =========================================
  // FUNÇÕES DE LEADS
  // =========================================
  
  const loadLeads = useCallback(async (filters: LeadsFilter = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.getLeads(filters);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load leads');
      }

      setLeads(response.data?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLead = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.getLead(id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load lead');
      }

      setCurrentLead(response.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lead');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLead = useCallback(async (id: number, data: Partial<Lead>): Promise<Lead> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.updateLead(id, data);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update lead');
      }

      const updatedLead = response.data!;
      setLeads(prev => prev.map(l => l.id === id ? updatedLead : l));
      if (currentLead?.id === id) {
        setCurrentLead(updatedLead);
      }
      return updatedLead;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentLead]);

  const updateLeadStatus = useCallback(async (id: number, status: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.updateLeadStatus(id, status);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update lead status');
      }

      const updatedLead = response.data!;
      setLeads(prev => prev.map(l => l.id === id ? updatedLead : l));
      if (currentLead?.id === id) {
        setCurrentLead(updatedLead);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentLead]);

  const updateLeadScore = useCallback(async (id: number, score: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.updateLeadScore(id, score);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update lead score');
      }

      const updatedLead = response.data!;
      setLeads(prev => prev.map(l => l.id === id ? updatedLead : l));
      if (currentLead?.id === id) {
        setCurrentLead(updatedLead);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead score');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentLead]);

  const deleteLead = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.deleteLead(id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete lead');
      }

      setLeads(prev => prev.filter(l => l.id !== id));
      if (currentLead?.id === id) {
        setCurrentLead(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete lead');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentLead]);

  // =========================================
  // FUNÇÕES DE ESTATÍSTICAS
  // =========================================
  
  const loadProductsStats = useCallback(async (filters: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.getProductsStats(filters);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load products stats');
      }

      setProductsStats(response.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLandingPagesStats = useCallback(async (filters: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.getLandingPagesStats(filters);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load landing pages stats');
      }

      setLandingPagesStats(response.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load landing pages stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFormsStats = useCallback(async (filters: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.getFormsStats(filters);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load forms stats');
      }

      setFormsStats(response.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load forms stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLeadsStats = useCallback(async (filters: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.getLeadsStats(filters);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load leads stats');
      }

      setLeadsStats(response.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads stats');
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // OPERAÇÕES EM LOTE
  // =========================================
  
  const bulkUpdateProducts = useCallback(async (ids: number[], updates: any): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.bulkUpdateProducts(ids, updates);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to bulk update products');
      }

      // Recarregar produtos após atualização em lote
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk update products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadProducts]);

  const bulkDeleteProducts = useCallback(async (ids: number[]): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.bulkDeleteProducts(ids);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to bulk delete products');
      }

      // Remover produtos deletados da lista
      setProducts(prev => prev.filter(p => !ids.includes(p.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk delete products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkUpdateLeads = useCallback(async (ids: number[], updates: any): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.bulkUpdateLeads(ids, updates);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to bulk update leads');
      }

      // Recarregar leads após atualização em lote
      await loadLeads();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk update leads');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadLeads]);

  // =========================================
  // IMPORT/EXPORT
  // =========================================
  
  const importProducts = useCallback(async (file: File, projectId?: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.importProducts(file, projectId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to import products');
      }

      // Recarregar produtos após importação
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadProducts]);

  const exportProducts = useCallback(async (filters: ProductsFilter = {}): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.exportProducts(filters);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to export products');
      }

      // Criar download do arquivo
      const blob = response.data as Blob;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportLeads = useCallback(async (filters: LeadsFilter = {}): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApiService.exportLeads(filters);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to export leads');
      }

      // Criar download do arquivo
      const blob = response.data as Blob;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export leads');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // UTILITÁRIOS
  // =========================================
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCurrentProduct = useCallback(() => {
    setCurrentProduct(null);
  }, []);

  const clearCurrentLandingPage = useCallback(() => {
    setCurrentLandingPage(null);
  }, []);

  const clearCurrentForm = useCallback(() => {
    setCurrentForm(null);
  }, []);

  const clearCurrentLead = useCallback(() => {
    setCurrentLead(null);
  }, []);

  // =========================================
  // RETORNO
  // =========================================

  return {
    // Estado consolidado
    loading,
    error,
    
    // Produtos
    products,
    currentProduct,
    loadProducts,
    loadProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    updateProductStatus,
    updateProductInventory,
    
    // Landing Pages
    landingPages,
    currentLandingPage,
    loadLandingPages,
    loadLandingPage,
    createLandingPage,
    updateLandingPage,
    deleteLandingPage,
    publishLandingPage,
    unpublishLandingPage,
    
    // Formulários de Captura
    forms,
    currentForm,
    loadForms,
    loadForm,
    createForm,
    updateForm,
    deleteForm,
    publishForm,
    unpublishForm,
    
    // Leads
    leads,
    currentLead,
    loadLeads,
    loadLead,
    updateLead,
    updateLeadStatus,
    updateLeadScore,
    deleteLead,
    
    // Estatísticas
    productsStats,
    landingPagesStats,
    formsStats,
    leadsStats,
    loadProductsStats,
    loadLandingPagesStats,
    loadFormsStats,
    loadLeadsStats,
    
    // Operações em Lote
    bulkUpdateProducts,
    bulkDeleteProducts,
    bulkUpdateLeads,
    
    // Import/Export
    importProducts,
    exportProducts,
    exportLeads,
    
    // Utilitários
    clearError,
    clearCurrentProduct,
    clearCurrentLandingPage,
    clearCurrentForm,
    clearCurrentLead
  };
};

export default useProducts;