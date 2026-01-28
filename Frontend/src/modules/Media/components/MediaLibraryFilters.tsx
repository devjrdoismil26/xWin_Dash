import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Calendar, FileType, Image, Video, FileText, Music, Folder } from 'lucide-react';
import { useMediaLibrarySimple } from '../hooks/useMediaLibrarySimple';
import { MediaType, MediaSortBy, MediaSortOrder } from '../types';

interface MediaLibraryFiltersProps {
  className?: string;
  onFiltersChange?: (filters: MediaFilters) => void;
}

interface MediaFilters {
  search: string;
  type: MediaType | 'all';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  sortBy: MediaSortBy;
  sortOrder: MediaSortOrder;
  sizeRange: {
    min: number;
    max: number;
  };
  tags: string[];
}

const MediaLibraryFilters: React.FC<MediaLibraryFiltersProps> = ({
  className = '',
  onFiltersChange
}) => {
  const { searchQuery, setSearchQuery } = useMediaLibrarySimple();
  
  const [filters, setFilters] = useState<MediaFilters>({
    search: searchQuery,
    type: 'all',
    dateRange: {
      start: null,
      end: null
    },
    sortBy: 'createdAt',
    sortOrder: 'desc',
    sizeRange: {
      min: 0,
      max: 1000000000 // 1GB
    },
    tags: []
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const mediaTypes = [
    { value: 'all', label: 'Todos os tipos', icon: FileType },
    { value: 'image', label: 'Imagens', icon: Image },
    { value: 'video', label: 'Vídeos', icon: Video },
    { value: 'document', label: 'Documentos', icon: FileText },
    { value: 'audio', label: 'Áudio', icon: Music },
    { value: 'folder', label: 'Pastas', icon: Folder }
  ] as const;

  const sortOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'createdAt', label: 'Data de criação' },
    { value: 'updatedAt', label: 'Data de modificação' },
    { value: 'size', label: 'Tamanho' },
    { value: 'type', label: 'Tipo' }
  ] as const;

  const sortOrders = [
    { value: 'asc', label: 'Crescente' },
    { value: 'desc', label: 'Decrescente' }
  ] as const;

  const handleFilterChange = (key: keyof MediaFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    handleFilterChange('search', value);
  };

  const clearFilters = () => {
    const defaultFilters: MediaFilters = {
      search: '',
      type: 'all',
      dateRange: { start: null, end: null },
      sortBy: 'createdAt',
      sortOrder: 'desc',
      sizeRange: { min: 0, max: 1000000000 },
      tags: []
    };
    setFilters(defaultFilters);
    setSearchQuery('');
    onFiltersChange?.(defaultFilters);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search ||
      filters.type !== 'all' ||
      filters.dateRange.start ||
      filters.dateRange.end ||
      filters.tags.length > 0 ||
      filters.sizeRange.min > 0 ||
      filters.sizeRange.max < 1000000000
    );
  }, [filters]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filtros
            </h3>
            {hasActiveFilters && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Ativo
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {isExpanded ? (
                <X className="w-4 h-4" />
              ) : (
                <Filter className="w-4 h-4" />
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Busca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Buscar por nome, tags ou descrição..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Tipo de mídia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de mídia
            </label>
            <div className="grid grid-cols-2 gap-2">
              {mediaTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => handleFilterChange('type', type.value)}
                    className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                      filters.type === type.value
                        ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ordenação */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ordenar por
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as MediaSortBy)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ordem
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value as MediaSortOrder)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {sortOrders.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtros avançados */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Filtros avançados</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {/* Intervalo de datas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data inicial
                    </label>
                    <input
                      type="date"
                      value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
                      onChange={(e) => handleFilterChange('dateRange', {
                        ...filters.dateRange,
                        start: e.target.value ? new Date(e.target.value) : null
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data final
                    </label>
                    <input
                      type="date"
                      value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
                      onChange={(e) => handleFilterChange('dateRange', {
                        ...filters.dateRange,
                        end: e.target.value ? new Date(e.target.value) : null
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                {/* Intervalo de tamanho */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tamanho do arquivo
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
                      <input
                        type="number"
                        value={filters.sizeRange.min}
                        onChange={(e) => handleFilterChange('sizeRange', {
                          ...filters.sizeRange,
                          min: parseInt(e.target.value) || 0
                        })}
                        placeholder="0 B"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Máximo</label>
                      <input
                        type="number"
                        value={filters.sizeRange.max}
                        onChange={(e) => handleFilterChange('sizeRange', {
                          ...filters.sizeRange,
                          max: parseInt(e.target.value) || 1000000000
                        })}
                        placeholder="1 GB"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {formatFileSize(filters.sizeRange.min)} - {formatFileSize(filters.sizeRange.max)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibraryFilters;