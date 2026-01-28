// =========================================
// PRODUCTS FILTERS - FILTROS
// =========================================
// Componente de filtros do módulo Products
// Máximo: 150 linhas

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Search,
  X,
  Filter,
  Search,
  Filter,
  X
} from 'lucide-react';

interface ProductsFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  onReset?: () => void;
  loading?: boolean;
  className?: string;
}

export const ProductsFilters: React.FC<ProductsFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  loading = false,
  className = ''
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // =========================================
  // EFEITOS
  // =========================================

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // =========================================
  // HANDLERS
  // =========================================

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {};
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onReset?.();
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...localFilters };
    delete newFilters[key];
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // =========================================
  // CONTADOR DE FILTROS ATIVOS
  // =========================================

  const activeFiltersCount = Object.keys(localFilters).filter(key => {
    const value = localFilters[key];
    return value !== undefined && value !== null && value !== '';
  }).length;

  // =========================================
  // RENDERIZAÇÃO
  // =========================================

  return (
    <div className={`products-filters ${className}`}>
      {/* Filtros básicos */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Busca */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar produtos..."
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
        </div>

        {/* Status */}
        <Select
          value={localFilters.status || ''}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="Status"
          disabled={loading}
          className="w-full sm:w-48"
        >
          <option value="">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="draft">Rascunho</option>
        </Select>

        {/* Categoria */}
        <Select
          value={localFilters.category || ''}
          onChange={(value) => handleFilterChange('category', value)}
          placeholder="Categoria"
          disabled={loading}
          className="w-full sm:w-48"
        >
          <option value="">Todas as categorias</option>
          <option value="electronics">Eletrônicos</option>
          <option value="clothing">Roupas</option>
          <option value="books">Livros</option>
          <option value="home">Casa</option>
        </Select>

        {/* Botão de filtros avançados */}
        <Button
          variant="secondary"
          onClick={() => setShowAdvanced(!showAdvanced)}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge variant="primary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Botão de reset */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Limpar</span>
          </Button>
        )}
      </div>

      {/* Filtros avançados */}
      {showAdvanced && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Preço mínimo */}
            <Input
              type="number"
              placeholder="Preço mínimo"
              value={localFilters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              disabled={loading}
            />

            {/* Preço máximo */}
            <Input
              type="number"
              placeholder="Preço máximo"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              disabled={loading}
            />

            {/* Estoque mínimo */}
            <Input
              type="number"
              placeholder="Estoque mínimo"
              value={localFilters.minStock || ''}
              onChange={(e) => handleFilterChange('minStock', e.target.value)}
              disabled={loading}
            />

            {/* Ordenação */}
            <Select
              value={localFilters.sortBy || ''}
              onChange={(value) => handleFilterChange('sortBy', value)}
              placeholder="Ordenar por"
              disabled={loading}
            >
              <option value="">Padrão</option>
              <option value="name">Nome</option>
              <option value="price">Preço</option>
              <option value="created_at">Data de criação</option>
              <option value="updated_at">Última atualização</option>
            </Select>
          </div>
        </div>
      )}

      {/* Filtros ativos */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(localFilters).map(([key, value]) => {
            if (value === undefined || value === null || value === '') return null;
            
            return (
              <Badge
                key={key}
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <span className="text-xs">
                  {key}: {String(value)}
                </span>
                <button
                  onClick={() => removeFilter(key)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductsFilters;
