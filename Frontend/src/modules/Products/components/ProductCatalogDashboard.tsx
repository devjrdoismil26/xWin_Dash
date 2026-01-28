import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../../hooks/useTranslation';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useAdvancedNotifications } from '../../../hooks/useAdvancedNotifications';
import { useLoadingStates } from '../../../hooks/useLoadingStates';
import {
  ShoppingBag, Plus, Search, Filter, Grid, List, Eye, Edit2, Trash2,
  BarChart3, TrendingUp, Users, Package, Star, Heart, Share2,
  Wand2, Palette, Code, Zap, Globe, Mobile, Tablet, Monitor,
  DollarSign, Percent, Target, Calendar, Clock, Award,
  Play, Square, RotateCcw, Download, Upload, Copy, Settings,
  ChevronDown, ChevronRight, ExternalLink, Image, Video,
  FileText, Camera, Layers, Maximize2, Minimize2
} from 'lucide-react';
// Design System
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from '@/components/ui/design-tokens';
// Interfaces
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  status: 'draft' | 'published' | 'archived';
  images: string[];
  videos?: string[];
  tags: string[];
  variants?: ProductVariant[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  performance: {
    views: number;
    conversions: number;
    revenue: number;
    rating: number;
    reviewCount: number;
  };
  createdAt: string;
  updatedAt: string;
  landingPage?: {
    id: string;
    url: string;
    conversionRate: number;
    visits: number;
  };
}
interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
  attributes: Record<string, string>;
}
interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  color: string;
}
interface ProductAnalytics {
  totalProducts: number;
  totalRevenue: number;
  averageConversion: number;
  topCategory: string;
  recentActivity: ActivityEvent[];
  performanceMetrics: {
    views: number;
    conversionRate: number;
    averageOrderValue: number;
    returnCustomerRate: number;
  };
}
interface ActivityEvent {
  id: string;
  type: 'product_created' | 'product_updated' | 'product_published' | 'sale_made';
  message: string;
  timestamp: string;
  metadata: Record<string, any>;
}
interface LandingPageTemplate {
  id: string;
  name: string;
  preview: string;
  category: string;
  features: string[];
  conversionOptimized: boolean;
}
const AdvancedProductCatalogDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { showNotification, showError, showSuccess } = useAdvancedNotifications();
  const { isLoading, setLoading, getOperationState } = useLoadingStates();
  // Estados principais
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'performance' | 'date'>('date');
  const [isCreating, setIsCreating] = useState(false);
  const [showLandingPageBuilder, setShowLandingPageBuilder] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<LandingPageTemplate | null>(null);
  // Templates de Landing Page
  const landingPageTemplates: LandingPageTemplate[] = [
    {
      id: 'minimal',
      name: 'Minimal Product',
      preview: '/templates/minimal-product.jpg',
      category: 'E-commerce',
      features: ['Clean Design', 'Mobile Optimized', 'Fast Loading'],
      conversionOptimized: true
    },
    {
      id: 'luxury',
      name: 'Luxury Brand',
      preview: '/templates/luxury-brand.jpg',
      category: 'Premium',
      features: ['Premium Feel', 'Video Background', 'Testimonials'],
      conversionOptimized: true
    },
    {
      id: 'tech',
      name: 'Tech Product',
      preview: '/templates/tech-product.jpg',
      category: 'Technology',
      features: ['Feature Comparison', 'Specifications', 'Demo Videos'],
      conversionOptimized: true
    },
    {
      id: 'service',
      name: 'Service Landing',
      preview: '/templates/service-landing.jpg',
      category: 'Services',
      features: ['Service Benefits', 'Pricing Table', 'Contact Form'],
      conversionOptimized: true
    }
  ];
  // Validação de formulário
  const { validateField, getFieldError, isFormValid } = useFormValidation({
    name: { required: true, minLength: 2 },
    price: { required: true, min: 0 },
    description: { required: true, minLength: 10 },
    category: { required: true }
  });
  // Dados simulados
  useEffect(() => {
    const loadData = async () => {
      setLoading('products', true);
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts([
        {
          id: '1',
          name: 'Curso de Marketing Digital Avançado',
          description: 'Complete sua jornada no marketing digital com estratégias avançadas',
          price: 497,
          originalPrice: 997,
          category: 'education',
          status: 'published',
          images: ['/products/marketing-course.jpg'],
          tags: ['marketing', 'digital', 'advanced'],
          seo: {
            title: 'Curso de Marketing Digital Avançado - Transforme sua Carreira',
            description: 'Aprenda as estratégias mais avançadas do marketing digital',
            keywords: ['marketing digital', 'curso online', 'estratégias']
          },
          performance: {
            views: 15420,
            conversions: 234,
            revenue: 116298,
            rating: 4.8,
            reviewCount: 89
          },
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20',
          landingPage: {
            id: 'lp-1',
            url: 'https://exemplo.com/marketing-course',
            conversionRate: 12.5,
            visits: 1870
          }
        },
        {
          id: '2',
          name: 'E-book: Growth Hacking Essentials',
          description: 'Estratégias comprovadas para crescimento exponencial',
          price: 97,
          category: 'digital-products',
          status: 'published',
          images: ['/products/growth-ebook.jpg'],
          tags: ['growth', 'hacking', 'startup'],
          seo: {
            title: 'Growth Hacking Essentials - E-book Completo',
            description: 'Descubra as estratégias de growth hacking mais eficazes',
            keywords: ['growth hacking', 'ebook', 'crescimento']
          },
          performance: {
            views: 8930,
            conversions: 145,
            revenue: 14065,
            rating: 4.6,
            reviewCount: 43
          },
          createdAt: '2024-01-10',
          updatedAt: '2024-01-18'
        }
      ]);
      setCategories([
        { id: 'education', name: 'Educação', slug: 'education', productCount: 12, color: '#3B82F6' },
        { id: 'digital-products', name: 'Produtos Digitais', slug: 'digital-products', productCount: 8, color: '#10B981' },
        { id: 'consulting', name: 'Consultoria', slug: 'consulting', productCount: 5, color: '#F59E0B' },
        { id: 'software', name: 'Software', slug: 'software', productCount: 3, color: '#8B5CF6' }
      ]);
      setAnalytics({
        totalProducts: 28,
        totalRevenue: 187350,
        averageConversion: 8.7,
        topCategory: 'Educação',
        recentActivity: [
          {
            id: '1',
            type: 'sale_made',
            message: 'Nova venda: Curso de Marketing Digital',
            timestamp: '2024-01-20T10:30:00Z',
            metadata: { amount: 497, customer: 'João Silva' }
          },
          {
            id: '2',
            type: 'product_published',
            message: 'Produto publicado: E-book Growth Hacking',
            timestamp: '2024-01-20T09:15:00Z',
            metadata: { productId: '2' }
          }
        ],
        performanceMetrics: {
          views: 45230,
          conversionRate: 8.7,
          averageOrderValue: 324,
          returnCustomerRate: 23.4
        }
      });
      setLoading('products', false);
    };
    loadData();
  }, [setLoading]);
  // Filtros e ordenação
  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.price - a.price;
        case 'performance':
          return b.performance.conversions - a.performance.conversions;
        case 'date':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
  }, [products, filterCategory, searchQuery, sortBy]);
  // Handlers
  const handleCreateProduct = useCallback(async () => {
    setIsCreating(true);
    // Lógica de criação
  }, []);
  const handleEditProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);
  const handleDeleteProduct = useCallback(async (productId: string) => {
    if (window.confirm(t('products.confirmDelete'))) {
      setLoading('delete', true);
      // Simular exclusão
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(prev => prev.filter(p => p.id !== productId));
      showSuccess(t('products.deleteSuccess'));
      setLoading('delete', false);
    }
  }, [setLoading, showSuccess, t]);
  const handleGenerateLandingPage = useCallback((product: Product) => {
    setSelectedProduct(product);
    setShowLandingPageBuilder(true);
  }, []);
  const handleTemplateSelect = useCallback((template: LandingPageTemplate) => {
    setSelectedTemplate(template);
    showSuccess(`Template "${template.name}" selecionado! Iniciando criação da landing page...`);
    // Aqui seria implementada a lógica de criação da landing page
  }, [showSuccess]);
  if (isLoading.products) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">{t('common.loading')}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 p-6">
      {/* Header com Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('products.totalProducts')}</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.totalProducts}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('products.totalRevenue')}</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {analytics?.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('products.conversionRate')}</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.averageConversion}%</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('products.topCategory')}</p>
              <p className="text-lg font-semibold text-gray-900">{analytics?.topCategory}</p>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Controles e Filtros */}
      <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('products.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('products.allCategories')}</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.productCount})
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">{t('products.sortByDate')}</option>
              <option value="name">{t('products.sortByName')}</option>
              <option value="price">{t('products.sortByPrice')}</option>
              <option value="performance">{t('products.sortByPerformance')}</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleCreateProduct}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>{t('products.createProduct')}</span>
            </button>
          </div>
        </div>
      </div>
      {/* Lista/Grid de Produtos */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
      }>
        <AnimatePresence>
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={viewMode === 'grid' 
                ? 'backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 overflow-hidden'
                : 'backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6'
              }
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Grid View */}
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 relative">
                    <img
                      src={product.images[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'published' 
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {t(`products.status.${product.status}`)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-1 ml-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{product.performance.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                          R$ {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            R$ {product.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {product.performance.conversions} vendas
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleGenerateLandingPage(product)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <Wand2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {product.landingPage && (
                        <a
                          href={product.landingPage.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Landing Page</span>
                        </a>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* List View */}
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.images[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">
                              R$ {product.price}
                            </div>
                            <div className="text-sm text-gray-600">
                              {product.performance.conversions} vendas
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleGenerateLandingPage(product)}
                              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            >
                              <Wand2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.status === 'published' 
                              ? 'bg-green-100 text-green-800'
                              : product.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {t(`products.status.${product.status}`)}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">
                              {product.performance.rating} ({product.performance.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                        {product.landingPage && (
                          <a
                            href={product.landingPage.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>Landing Page ({product.landingPage.conversionRate}% conversão)</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* Landing Page Builder Modal */}
      <AnimatePresence>
        {showLandingPageBuilder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Criar Landing Page: {selectedProduct?.name}
                </h2>
                <button
                  onClick={() => setShowLandingPageBuilder(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <Minimize2 className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {landingPageTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50">
                      <img
                        src={template.preview}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        {template.conversionOptimized && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Otimizado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.category}</p>
                      <div className="space-y-1">
                        {template.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            <span className="text-xs text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Loading States */}
      {(isLoading.delete) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">
              {isLoading.delete && t('products.deletingProduct')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdvancedProductCatalogDashboard;
