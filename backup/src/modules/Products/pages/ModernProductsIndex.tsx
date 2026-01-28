// ========================================
// PRODUCTS MODULE - MODERN PRODUCTS INDEX
// ========================================
import React, { useState, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  MoreVertical, 
  Download, 
  Upload,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Eye,
  Edit,
  Trash2,
  Copy,
  Archive,
  RefreshCw
} from 'lucide-react';
import { 
  Product, 
  ProductStatus, 
  ProductCategory,
  ProductsFilter,
  ProductsStats
} from '../types/products';
import { useProducts } from '../hooks/useProducts';
import { ModernProductCard } from '../components/ModernProductCard';
import { ModernFilters } from '../components/ModernFilters';
import { ModernAnalytics } from '../components/ModernAnalytics';
import { cn } from '@/lib/utils';
interface ModernProductsIndexProps {
  className?: string;
}
export const ModernProductsIndex: React.FC<ModernProductsIndexProps> = ({
  className
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    products,
    stats,
    loading,
    error,
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    createProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    bulkUpdate,
    bulkDelete,
    bulkStatusUpdate,
    refresh,
    pagination
  } = useProducts({
    autoRefresh: true,
    refreshInterval: 30000
  });
  // Handle product actions
  const handleCreateProduct = useCallback(async () => {
    try {
      await createProduct({
        name: 'New Product',
        description: 'Product description',
        price: 0,
        currency: 'USD',
        category: ProductCategory.DIGITAL,
        tags: [],
        images: [],
        dimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
        weight: 0,
        sku: `SKU-${Date.now()}`,
        inventory: { quantity: 0, lowStockThreshold: 10, trackInventory: true, allowBackorder: false },
        seo: { title: '', description: '', keywords: [], canonicalUrl: '', ogImage: '', structuredData: {} }
      });
    } catch (err) {
      console.error('Erro ao criar produto:', err);
    }
  }, [createProduct]);
  const handleEditProduct = useCallback((product: Product) => {
    // Navigate to edit page or open modal
  }, []);
  const handleDeleteProduct = useCallback(async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProduct(product.id);
      } catch (err) {
        console.error('Erro ao deletar produto:', err);
      }
    }
  }, [deleteProduct]);
  const handleDuplicateProduct = useCallback(async (product: Product) => {
    try {
      await duplicateProduct(product.id);
    } catch (err) {
      console.error('Erro ao duplicar produto:', err);
    }
  }, [duplicateProduct]);
  const handleViewProduct = useCallback((product: Product) => {
    // Navigate to product view page
  }, []);
  // Handle bulk actions
  const handleBulkDelete = useCallback(async () => {
    if (selectedProducts.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      try {
        await bulkDelete(selectedProducts);
        setSelectedProducts([]);
      } catch (err) {
        console.error('Erro ao deletar produtos em lote:', err);
      }
    }
  }, [selectedProducts, bulkDelete]);
  const handleBulkStatusUpdate = useCallback(async (status: ProductStatus) => {
    if (selectedProducts.length === 0) return;
    try {
      await bulkStatusUpdate(selectedProducts, status);
      setSelectedProducts([]);
    } catch (err) {
      console.error('Erro ao atualizar status em lote:', err);
    }
  }, [selectedProducts, bulkStatusUpdate]);
  // Handle selection
  const handleSelectProduct = useCallback((productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);
  const handleSelectAll = useCallback(() => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  }, [selectedProducts.length, products]);
  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    updateFilter('search', query);
  }, [updateFilter]);
  // Handle export
  const handleExport = useCallback(() => {
    // Implement export functionality
  }, []);
  // Handle import
  const handleImport = useCallback(() => {
    // Implement import functionality
  }, []);
  // Filter products based on search
  const filteredProducts = products.filter(product => 
    !searchQuery || 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleImport}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateProduct}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+12% from last month</span>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+8% from last month</span>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.revenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+15% from last month</span>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Conversion</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats.avgConversionRate * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+5% from last month</span>
            </div>
          </Card>
        </div>
      )}
      {/* Analytics Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={showAnalytics ? 'default' : 'outline'}
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
            <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>
      {/* Analytics */}
      {showAnalytics && (
        <ModernAnalytics
          type="products"
          data={stats}
          loading={loading}
          onRefresh={refresh}
          onExport={handleExport}
        />
      )}
      {/* Filters */}
      {showFilters && (
        <ModernFilters
          type="products"
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />
      )}
      {/* Main Content */}
      <div className="flex gap-6">
        {/* Products List */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {/* View Mode */}
              <div className="flex items-center gap-1 border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Bulk Actions */}
              {selectedProducts.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedProducts.length} selected
                  </span>
                  <Button variant="outline" size="sm" onClick={() => handleBulkStatusUpdate(ProductStatus.ACTIVE)}>
                    Activate
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkStatusUpdate(ProductStatus.INACTIVE)}>
                    Deactivate
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkStatusUpdate(ProductStatus.ARCHIVED)}>
                    Archive
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
              {/* Select All */}
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedProducts.length === products.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>
          {/* Products Grid/List */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <Card className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={refresh}>Try Again</Button>
            </Card>
          ) : filteredProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? 'Try adjusting your search or filters' : 'Get started by creating your first product'}
              </p>
              <Button onClick={handleCreateProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Card>
          ) : (
            <div className={cn(
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            )}>
              {filteredProducts.map((product) => (
                <div key={product.id} className="relative">
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <ModernProductCard
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onDuplicate={handleDuplicateProduct}
                    onView={handleViewProduct}
                    showActions={true}
                    showMetrics={true}
                    showPricing={true}
                    showInventory={true}
                    showSEO={false}
                  />
                </div>
              ))}
            </div>
          )}
          {/* Pagination */}
          {pagination.total > pagination.perPage && (
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-gray-600">
                Showing {pagination.from} to {pagination.to} of {pagination.total} products
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={pagination.prevPage}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.lastPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={pagination.nextPage}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
