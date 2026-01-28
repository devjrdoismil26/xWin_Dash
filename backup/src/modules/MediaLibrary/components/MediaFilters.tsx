// =========================================
// MEDIA FILTERS COMPONENT
// =========================================
// Componente para filtros de mídia
// Máximo: 150 linhas

import React, { useState } from 'react';
import { Search, Filter, X, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { MediaSearchFilters } from '../types';

interface MediaFiltersProps {
  filters: MediaSearchFilters;
  onFiltersChange: (filters: MediaSearchFilters) => void;
  onReset: () => void;
  loading?: boolean;
  className?: string;
}

export const MediaFilters: React.FC<MediaFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  loading = false,
  className = ''
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // =========================================
  // HANDLERS
  // =========================================

  const handleSearch = (value: string) => {
    onFiltersChange({ ...filters, query: value });
  };

  const handleTypeChange = (value: string) => {
    onFiltersChange({ ...filters, type: value === 'all' ? undefined : value as any });
  };

  const handleFolderChange = (value: string) => {
    onFiltersChange({ ...filters, folder_id: value === 'all' ? undefined : value });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({ ...filters, sort_by: value as any });
  };

  const handleSortOrderChange = (value: string) => {
    onFiltersChange({ ...filters, sort_order: value as any });
  };

  const handleDateFromChange = (value: string) => {
    onFiltersChange({ ...filters, date_range: { ...filters.date_range, start: value } });
  };

  const handleDateToChange = (value: string) => {
    onFiltersChange({ ...filters, date_range: { ...filters.date_range, end: value } });
  };

  const handleSizeMinChange = (value: string) => {
    const numValue = parseInt(value);
    onFiltersChange({ ...filters, size_range: { ...filters.size_range, min: isNaN(numValue) ? undefined : numValue } });
  };

  const handleSizeMaxChange = (value: string) => {
    const numValue = parseInt(value);
    onFiltersChange({ ...filters, size_range: { ...filters.size_range, max: isNaN(numValue) ? undefined : numValue } });
  };

  const handleTagAdd = (tag: string) => {
    const currentTags = filters.tags || [];
    if (!currentTags.includes(tag)) {
      onFiltersChange({ ...filters, tags: [...currentTags, tag] });
    }
  };

  const handleTagRemove = (tag: string) => {
    const currentTags = filters.tags || [];
    onFiltersChange({ ...filters, tags: currentTags.filter(t => t !== tag) });
  };

  const handleReset = () => {
    onReset();
    setShowAdvanced(false);
  };

  // =========================================
  // OPTIONS
  // =========================================

  const typeOptions = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'image', label: 'Imagens' },
    { value: 'video', label: 'Vídeos' },
    { value: 'audio', label: 'Áudio' },
    { value: 'document', label: 'Documentos' },
    { value: 'archive', label: 'Arquivos' },
    { value: 'other', label: 'Outros' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'size', label: 'Tamanho' },
    { value: 'date', label: 'Data' },
    { value: 'type', label: 'Tipo' },
    { value: 'downloads', label: 'Downloads' },
    { value: 'views', label: 'Visualizações' }
  ];

  const sortOrderOptions = [
    { value: 'asc', label: 'Crescente' },
    { value: 'desc', label: 'Decrescente' }
  ];

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Buscar arquivos..."
            value={filters.query || ''}
            onChange={(e) => handleSearch(e.target.value)}
            icon={Search}
            loading={loading}
          />
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          <Select
            value={filters.sort_by || 'date'}
            onChange={handleSortChange}
            options={sortOptions}
            placeholder="Ordenar por"
            disabled={loading}
          />
          <Select
            value={filters.sort_order || 'desc'}
            onChange={handleSortOrderChange}
            options={sortOrderOptions}
            disabled={loading}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="secondary"
            size="sm"
            disabled={loading}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showAdvanced ? 'Ocultar' : 'Filtros'}
          </Button>
          <Button
            onClick={handleReset}
            variant="secondary"
            size="sm"
            disabled={loading}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {(filters.type || filters.folder_id || filters.query || (filters.tags && filters.tags.length > 0)) && (
        <div className="flex flex-wrap gap-2">
          {filters.query && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Busca: {filters.query}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleSearch('')}
              />
            </Badge>
          )}
          {filters.type && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Tipo: {typeOptions.find(opt => opt.value === filters.type)?.label}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleTypeChange('all')}
              />
            </Badge>
          )}
          {filters.folder_id && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Pasta: {filters.folder_id}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFolderChange('all')}
              />
            </Badge>
          )}
          {filters.tags && filters.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleTagRemove(tag)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Arquivo
              </label>
              <Select
                value={filters.type || 'all'}
                onChange={handleTypeChange}
                options={typeOptions}
                disabled={loading}
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Inicial
              </label>
              <Input
                type="date"
                value={filters.date_range?.start || ''}
                onChange={(e) => handleDateFromChange(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Final
              </label>
              <Input
                type="date"
                value={filters.date_range?.end || ''}
                onChange={(e) => handleDateToChange(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Size Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tamanho Mínimo (MB)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={filters.size_range?.min || ''}
                onChange={(e) => handleSizeMinChange(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tamanho Máximo (MB)
              </label>
              <Input
                type="number"
                placeholder="1000"
                value={filters.size_range?.max || ''}
                onChange={(e) => handleSizeMaxChange(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Public/Featured */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <Select
                value={filters.is_public ? 'public' : filters.is_featured ? 'featured' : 'all'}
                onChange={(value) => {
                  if (value === 'public') {
                    onFiltersChange({ ...filters, is_public: true, is_featured: undefined });
                  } else if (value === 'featured') {
                    onFiltersChange({ ...filters, is_featured: true, is_public: undefined });
                  } else {
                    onFiltersChange({ ...filters, is_public: undefined, is_featured: undefined });
                  }
                }}
                options={[
                  { value: 'all', label: 'Todos' },
                  { value: 'public', label: 'Públicos' },
                  { value: 'featured', label: 'Destacados' }
                ]}
                disabled={loading}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MediaFilters;
