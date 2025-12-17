// =========================================
// PRODUCTS FILTERS - FILTROS
// =========================================
// Componente de filtros do módulo Products
// Máximo: 150 linhas

import React, { useState, useEffect } from 'react';
import { Input } from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Search, X, Filter, Search, Filter, X } from 'lucide-react';

interface ProductsFiltersProps {
  filters: unknown;
  onFiltersChange?: (e: any) => void;
  onReset???: (e: any) => void;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ProductsFilters: React.FC<ProductsFiltersProps> = ({ filters,
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

  const handleFilterChange = (key: string, value: unknown) => {
    const newFilters = { ...localFilters, [key]: value};

    setLocalFilters(newFilters);

    onFiltersChange(newFilters);};

  const handleReset = () => {
    const resetFilters = {} as any;
    setLocalFilters(resetFilters);

    onFiltersChange(resetFilters);

    onReset?.();};

  const removeFilter = (key: string) => {
    const newFilters = { ...localFilters};

    delete newFilters[key];
    setLocalFilters(newFilters);

    onFiltersChange(newFilters);};

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
        <>
      <div className={`products-filters ${className} `}>
      </div>{/* Filtros básicos */}
      <div className="{/* Busca */}">$2</div>
        <div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar produtos..."
              value={ localFilters.search || '' }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('search', e.target.value) }
              className="pl-10"
              disabled={ loading } />
          </div>

        {/* Status */}
        <Select
          value={ localFilters.status || '' }
          onChange={ (value: unknown) => handleFilterChange('status', value) }
          placeholder="Status"
          disabled={ loading }
          className="w-full sm:w-48"
        >
          <option value="">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="draft">Rascunho</option>
        </Select>

        {/* Categoria */}
        <Select
          value={ localFilters.category || '' }
          onChange={ (value: unknown) => handleFilterChange('category', value) }
          placeholder="Categoria"
          disabled={ loading }
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
          onClick={ () => setShowAdvanced(!showAdvanced) }
          disabled={ loading }
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge variant="primary" className="ml-1" />
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Botão de reset */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            onClick={ handleReset }
            disabled={ loading }
            className="flex items-center space-x-2" />
            <X className="h-4 w-4" />
            <span>Limpar</span>
      </Button>
    </>
  )}
      </div>

      {/* Filtros avançados */}
      {showAdvanced && (
        <div className=" ">$2</div><div className="{/* Preço mínimo */}">$2</div>
            <Input
              type="number"
              placeholder="Preço mínimo"
              value={ localFilters.minPrice || '' }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('minPrice', e.target.value) }
              disabled={ loading } />

            {/* Preço máximo */}
            <Input
              type="number"
              placeholder="Preço máximo"
              value={ localFilters.maxPrice || '' }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('maxPrice', e.target.value) }
              disabled={ loading } />

            {/* Estoque mínimo */}
            <Input
              type="number"
              placeholder="Estoque mínimo"
              value={ localFilters.minStock || '' }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('minStock', e.target.value) }
              disabled={ loading } />

            {/* Ordenação */}
            <Select
              value={ localFilters.sortBy || '' }
              onChange={ (value: unknown) => handleFilterChange('sortBy', value) }
              placeholder="Ordenar por"
              disabled={ loading  }>
              <option value="">Padrão</option>
              <option value="name">Nome</option>
              <option value="price">Preço</option>
              <option value="created_at">Data de criação</option>
              <option value="updated_at">Última atualização</option></Select></div>
      )}

      {/* Filtros ativos */}
      {activeFiltersCount > 0 && (
        <div className="{Object.entries(localFilters).map(([key, value]) => {">$2</div>
            if (value === undefined || value === null || value === '') return null;
            
            return (
        <>
      <Badge
                key={ key }
                variant="secondary"
                className="flex items-center space-x-1" />
      <span className="{key}: {String(value)}">$2</span>
                </span>
                <button
                  onClick={ () => removeFilter(key) }
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" /></button></Badge>);

          })}
        </div>
      )}
    </div>);};

export default ProductsFilters;
