// ========================================
// PRODUCTS MODULE - MODERN FILTERS
// ========================================
import React, { useState, useCallback } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Badge from '@/shared/components/ui/Badge';
import { Search, Filter, X, ChevronDown, ChevronUp, Calendar, Tag, DollarSign, BarChart3, Users, Globe, Edit, FileText, Target, Zap, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { ProductsFilter, LandingPagesFilter, FormsFilter, ProductStatus, ProductCategory, LandingPageStatus, FormStatus } from '../types/products';
import { cn } from '@/lib/utils';
interface ModernFiltersProps {
  type: 'products' | 'landing-pages' | 'forms';
  filters: ProductsFilter | LandingPagesFilter | FormsFilter;
  onFiltersChange?: (e: any) => void;
  onClearFilters??: (e: any) => void;
  className?: string;
  showSearch?: boolean;
  showStatusFilter?: boolean;
  showCategoryFilter?: boolean;
  showDateFilter?: boolean;
  showPriceFilter?: boolean;
  showSortFilter?: boolean;
  showAdvancedFilters?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
export const ModernFilters: React.FC<ModernFiltersProps> = ({ type,
  filters,
  onFiltersChange,
  onClearFilters,
  className,
  showSearch = true,
  showStatusFilter = true,
  showCategoryFilter = true,
  showDateFilter = true,
  showPriceFilter = true,
  showSortFilter = true,
  showAdvancedFilters = true
   }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);

    onFiltersChange({ ...filters, search: value });

  }, [filters, onFiltersChange]);

  const handleStatusChange = useCallback((status: unknown) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? (currentStatuses || []).filter((s: unknown) => s !== status)
      : [...currentStatuses, status];
    onFiltersChange({ ...filters, status: newStatuses.length > 0 ? newStatuses : undefined });

  }, [filters, onFiltersChange]);

  const handleCategoryChange = useCallback((category: unknown) => {
    const currentCategories = (filters as ProductsFilter).category || [];
    const newCategories = currentCategories.includes(category)
      ? (currentCategories || []).filter((c: unknown) => c !== category)
      : [...currentCategories, category];
    onFiltersChange({ ...filters, category: newCategories.length > 0 ? newCategories : undefined });

  }, [filters, onFiltersChange]);

  const handlePriceRangeChange = useCallback((field: 'min' | 'max', value: number) => {
    const currentRange = (filters as ProductsFilter).priceRange || [0, 1000];
    const newRange = field === 'min' ? [value, currentRange[1]] : [currentRange[0], value];
    onFiltersChange({ ...filters, priceRange: newRange });

  }, [filters, onFiltersChange]);

  const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    onFiltersChange({ ...filters, sortBy, sortOrder });

  }, [filters, onFiltersChange]);

  const getStatusOptions = () => {
    switch (type) {
      case 'products':
        return Object.values(ProductStatus);

      case 'landing-pages':
        return Object.values(LandingPageStatus);

      case 'forms':
        return Object.values(FormStatus);

      default:
        return [];
    } ;

  const getCategoryOptions = () => {
    if (type === 'products') {
      return Object.values(ProductCategory);

    }
    return [];};

  const getSortOptions = () => {
    switch (type) {
      case 'products':
        return [
          { value: 'name', label: 'Name' },
          { value: 'price', label: 'Price' },
          { value: 'created_at', label: 'Created Date' },
          { value: 'updated_at', label: 'Updated Date' }
        ];
      case 'landing-pages':
        return [
          { value: 'name', label: 'Name' },
          { value: 'created_at', label: 'Created Date' },
          { value: 'updated_at', label: 'Updated Date' },
          { value: 'conversion_rate', label: 'Conversion Rate' }
        ];
      case 'forms':
        return [
          { value: 'name', label: 'Name' },
          { value: 'created_at', label: 'Created Date' },
          { value: 'updated_at', label: 'Updated Date' },
          { value: 'conversion_rate', label: 'Conversion Rate' }
        ];
      default:
        return [];
    } ;

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status && filters.status.length > 0) count++;
    if ((filters as ProductsFilter).category && (filters as ProductsFilter).category!.length > 0) count++;
    if ((filters as ProductsFilter).priceRange) count++;
    if (filters.sortBy) count++;
    return count;};

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'published':
        return <CheckCircle className="w-4 h-4" />;
      case 'draft':
        return <Edit className="w-4 h-4" />;
      case 'inactive':
      case 'archived':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    } ;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'digital':
        return <FileText className="w-4 h-4" />;
      case 'physical':
        return <Target className="w-4 h-4" />;
      case 'service':
        return <Users className="w-4 h-4" />;
      case 'subscription':
        return <Zap className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    } ;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
      case 'archived':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    } ;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'digital':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'physical':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'service':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'subscription':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    } ;

  return (
            <Card className={cn('backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-4 space-y-4', className) } />
      {/* Header */}
      <div className=" ">$2</div><div className=" ">$2</div><Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-2" />
              {getActiveFiltersCount()}
            </Badge>
          )}
        </div>
        <div className="{getActiveFiltersCount() > 0 && (">$2</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={ onClearFilters }
              className="text-gray-500 hover:text-gray-700" />
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
          {showAdvancedFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={ () => setIsExpanded(!isExpanded) }
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  More
                </>
              )}
            </Button>
          )}
        </div>
      {/* Search */}
      {showSearch && (
        <div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={`Search ${type.replace('-', ' ')}...`}
            value={ searchQuery }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value) }
            className="pl-10" />
        </div>
      )}
      {/* Status Filter */}
      {showStatusFilter && (
        <div className=" ">$2</div><label className="text-sm font-medium text-gray-700">Status</label>
          <div className="{getStatusOptions().map((status: unknown) => (">$2</div>
              <Badge
                key={ status }
                variant={ filters.status?.includes(status) ? 'default' : 'outline' }
                className={cn(
                  'cursor-pointer transition-colors',
                  filters.status?.includes(status) ? getStatusColor(status) : 'hover:bg-gray-50'
                )} onClick={ () => handleStatusChange(status)  }>
                {getStatusIcon(status)}
                <span className="ml-1 capitalize">{status}</span>
      </Badge>
    </>
  ))}
          </div>
      )}
      {/* Category Filter (Products only) */}
      {showCategoryFilter && type === 'products' && (
        <div className=" ">$2</div><label className="text-sm font-medium text-gray-700">Category</label>
          <div className="{getCategoryOptions().map((category: unknown) => (">$2</div>
              <Badge
                key={ category }
                variant={ (filters as ProductsFilter).category?.includes(category) ? 'default' : 'outline' }
                className={cn(
                  'cursor-pointer transition-colors',
                  (filters as ProductsFilter).category?.includes(category) ? getCategoryColor(category) : 'hover:bg-gray-50'
                )} onClick={ () => handleCategoryChange(category)  }>
                {getCategoryIcon(category)}
                <span className="ml-1 capitalize">{category}</span>
      </Badge>
    </>
  ))}
          </div>
      )}
      {/* Price Range Filter (Products only) */}
      {showPriceFilter && type === 'products' && (
        <div className=" ">$2</div><label className="text-sm font-medium text-gray-700">Price Range</label>
          <div className=" ">$2</div><DollarSign className="w-4 h-4 text-gray-500" />
            <Input
              type="number"
              placeholder="Min"
              value={ (filters as ProductsFilter).priceRange?.[0] || '' }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handlePriceRangeChange('min', Number(e.target.value)) }
              className="w-24" />
            <span className="text-gray-500">to</span>
            <Input
              type="number"
              placeholder="Max"
              value={ (filters as ProductsFilter).priceRange?.[1] || '' }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handlePriceRangeChange('max', Number(e.target.value)) }
              className="w-24" />
          </div>
      )}
      {/* Sort Filter */}
      {showSortFilter && (
        <div className=" ">$2</div><label className="text-sm font-medium text-gray-700">Sort By</label>
          <div className=" ">$2</div><select
              value={ filters.sortBy || '' }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleSortChange(e.target.value, filters.sortOrder || 'asc') }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Default</option>
              {getSortOptions().map((option: unknown) => (
                <option key={option.value} value={ option.value } />
                  {option.label}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={ () => handleSortChange(filters.sortBy || 'name', filters.sortOrder === 'asc' ? 'desc' : 'asc') }
              className="px-3"
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
      </div>
    </>
  )}
      {/* Advanced Filters */}
      {showAdvancedFilters && isExpanded && (
        <div className="{/* Date Filter */}">$2</div>
          {showDateFilter && (
            <div className=" ">$2</div><label className="text-sm font-medium text-gray-700">Date Range</label>
              <div className=" ">$2</div><Calendar className="w-4 h-4 text-gray-500" />
                <Input
                  type="date"
                  placeholder="From"
                  className="flex-1"
                / />
                <span className="text-gray-500">to</span>
                <Input
                  type="date"
                  placeholder="To"
                  className="flex-1"
                / />
              </div>
          )}
          {/* Additional Filters based on type */}
          {type === 'products' && (
            <div className=" ">$2</div><label className="text-sm font-medium text-gray-700">Inventory</label>
              <div className=" ">$2</div><Badge variant="outline" className="cursor-pointer hover:bg-gray-50" />
                  In Stock
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-50" />
                  Low Stock
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-50" />
                  Out of Stock
                </Badge>
      </div>
    </>
  )}
          {type === 'landing-pages' && (
            <div className=" ">$2</div><label className="text-sm font-medium text-gray-700">Performance</label>
              <div className=" ">$2</div><Badge variant="outline" className="cursor-pointer hover:bg-gray-50" />
                  High Converting
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-50" />
                  Low Bounce Rate
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-50" />
                  High Traffic
                </Badge>
      </div>
    </>
  )}
          {type === 'forms' && (
            <div className=" ">$2</div><label className="text-sm font-medium text-gray-700">Form Features</label>
              <div className=" ">$2</div><Badge variant="outline" className="cursor-pointer hover:bg-gray-50" />
                  Auto Responder
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-50" />
                  Spam Protection
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-50" />
                  Double Opt-in
                </Badge>
      </div>
    </>
  )}
        </div>
      )}
      {/* Active Filters Summary */}
      {getActiveFiltersCount() > 0 && (
        <div className=" ">$2</div><div className=" ">$2</div><span className="text-sm font-medium text-gray-700">Active Filters:</span>
            <div className="{filters.search && (">$2</div>
                <Badge variant="secondary" className="text-xs" />
                  Search: &quot;{filters.search}&quot;
                </Badge>
              )}
              {filters.status && filters.status.length > 0 && (
                <Badge variant="secondary" className="text-xs" />
                  Status: {filters.status.join(', ')}
                </Badge>
              )}
              {(filters as ProductsFilter).category && (filters as ProductsFilter).category!.length > 0 && (
                <Badge variant="secondary" className="text-xs" />
                  Category: {(filters as ProductsFilter).category!.join(', ')}
                </Badge>
              )}
              {(filters as ProductsFilter).priceRange && (
                <Badge variant="secondary" className="text-xs" />
                  Price: ${(filters as ProductsFilter).priceRange![0]} - ${(filters as ProductsFilter).priceRange![1]}
                </Badge>
              )}
              {filters.sortBy && (
                <Badge variant="secondary" className="text-xs" />
                  Sort: {filters.sortBy} ({filters.sortOrder})
                </Badge>
              )}
            </div>
    </div>
  )}
    </Card>);};
