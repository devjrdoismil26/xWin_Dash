// ========================================
// FILTROS MODERNOS - LEADS
// ========================================
import React, { useState, useCallback, useEffect } from 'react';
import {
  Search,
  Filter,
  X,
  Calendar,
  User,
  Tag,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Save,
  Download
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { LeadFilters, LEAD_STATUSES, LEAD_ORIGINS, DEFAULT_LEAD_FILTERS } from '../types';
interface ModernLeadFiltersProps {
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
  onClearFilters: () => void;
  onSaveFilters?: (name: string, filters: LeadFilters) => void;
  onLoadFilters?: () => LeadFilters[];
  className?: string;
  compact?: boolean;
}
interface SavedFilter {
  id: string;
  name: string;
  filters: LeadFilters;
  createdAt: string;
}
const ModernLeadFilters: React.FC<ModernLeadFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  onSaveFilters,
  onLoadFilters,
  className,
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(filters.status || []);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>(filters.origin || []);
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags || []);
  const [scoreRange, setScoreRange] = useState(filters.score_range || { min: 0, max: 100 });
  const [assignedUsers, setAssignedUsers] = useState<number[]>(filters.assigned_to || []);
  const [dateRange, setDateRange] = useState(filters.date_range);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');
  // Load saved filters on mount
  useEffect(() => {
    if (onLoadFilters) {
      const saved = onLoadFilters();
      setSavedFilters(saved.map((f, index) => ({
        id: `filter-${index}`,
        name: `Filtro ${index + 1}`,
        filters: f,
        createdAt: new Date().toISOString()
      })));
    }
  }, [onLoadFilters]);
  // Update filters when props change
  useEffect(() => {
    setSearchTerm(filters.search || '');
    setSelectedStatuses(filters.status || []);
    setSelectedOrigins(filters.origin || []);
    setSelectedTags(filters.tags || []);
    setScoreRange(filters.score_range || { min: 0, max: 100 });
    setAssignedUsers(filters.assigned_to || []);
    setDateRange(filters.date_range);
  }, [filters]);
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    onFiltersChange({ ...filters, search: value });
  }, [filters, onFiltersChange]);
  const handleStatusToggle = useCallback((status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    setSelectedStatuses(newStatuses);
    onFiltersChange({ ...filters, status: newStatuses });
  }, [selectedStatuses, filters, onFiltersChange]);
  const handleOriginToggle = useCallback((origin: string) => {
    const newOrigins = selectedOrigins.includes(origin)
      ? selectedOrigins.filter(o => o !== origin)
      : [...selectedOrigins, origin];
    setSelectedOrigins(newOrigins);
    onFiltersChange({ ...filters, origin: newOrigins });
  }, [selectedOrigins, filters, onFiltersChange]);
  const handleTagToggle = useCallback((tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    onFiltersChange({ ...filters, tags: newTags });
  }, [selectedTags, filters, onFiltersChange]);
  const handleScoreRangeChange = useCallback((field: 'min' | 'max', value: number) => {
    const newRange = { ...scoreRange, [field]: value };
    setScoreRange(newRange);
    onFiltersChange({ ...filters, score_range: newRange });
  }, [scoreRange, filters, onFiltersChange]);
  const handleDateRangeChange = useCallback((field: 'start' | 'end', value: string) => {
    const newDateRange = dateRange ? { ...dateRange, [field]: value } : {
      field: 'created_at' as const,
      start: field === 'start' ? value : '',
      end: field === 'end' ? value : ''
    };
    setDateRange(newDateRange);
    onFiltersChange({ ...filters, date_range: newDateRange });
  }, [dateRange, filters, onFiltersChange]);
  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedStatuses([]);
    setSelectedOrigins([]);
    setSelectedTags([]);
    setScoreRange({ min: 0, max: 100 });
    setAssignedUsers([]);
    setDateRange(undefined);
    onClearFilters();
  }, [onClearFilters]);
  const handleSaveFilter = useCallback(() => {
    if (filterName.trim() && onSaveFilters) {
      onSaveFilters(filterName.trim(), filters);
      setSavedFilters(prev => [...prev, {
        id: `filter-${Date.now()}`,
        name: filterName.trim(),
        filters,
        createdAt: new Date().toISOString()
      }]);
      setFilterName('');
      setShowSaveDialog(false);
    }
  }, [filterName, filters, onSaveFilters]);
  const handleLoadFilter = useCallback((savedFilter: SavedFilter) => {
    onFiltersChange(savedFilter.filters);
  }, [onFiltersChange]);
  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status && filters.status.length > 0) count++;
    if (filters.origin && filters.origin.length > 0) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    if (filters.score_range && (filters.score_range.min > 0 || filters.score_range.max < 100)) count++;
    if (filters.assigned_to && filters.assigned_to.length > 0) count++;
    if (filters.date_range) count++;
    return count;
  }, [filters]);
  const activeFiltersCount = getActiveFiltersCount();
  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar leads..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 text-xs p-0 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }
  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Quick Actions */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nome, email, empresa..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros Avançados
            {activeFiltersCount > 0 && (
              <Badge variant="destructive" className="ml-2 w-5 h-5 text-xs p-0 flex items-center justify-center">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          )}
          {onSaveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveDialog(true)}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          )}
        </div>
      </div>
      {/* Advanced Filters */}
      {isExpanded && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="space-y-2">
                {Object.entries(LEAD_STATUSES).map(([status, config]) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => handleStatusToggle(status)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{config.label}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Origin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origem
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {Object.entries(LEAD_ORIGINS).map(([origin, config]) => (
                  <label key={origin} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedOrigins.includes(origin)}
                      onChange={() => handleOriginToggle(origin)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {config.icon} {config.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {/* Score Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Score
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={scoreRange.min}
                    onChange={(e) => handleScoreRangeChange('min', parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                  <span className="text-gray-500">-</span>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={scoreRange.max}
                    onChange={(e) => handleScoreRangeChange('max', parseInt(e.target.value) || 100)}
                    className="w-20"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Range: {scoreRange.min} - {scoreRange.max}
                </div>
              </div>
            </div>
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Criação
              </label>
              <div className="space-y-2">
                <Input
                  type="date"
                  value={dateRange?.start || ''}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  placeholder="Data inicial"
                />
                <Input
                  type="date"
                  value={dateRange?.end || ''}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  placeholder="Data final"
                />
              </div>
            </div>
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {/* Mock tags - in real app, these would come from API */}
                {['vip', 'newsletter', 'interessado', 'qualificado', 'proposta'].map((tag) => (
                  <label key={tag} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Assigned Users */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsável
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {/* Mock users - in real app, these would come from API */}
                {[
                  { id: 1, name: 'João Silva' },
                  { id: 2, name: 'Maria Santos' },
                  { id: 3, name: 'Pedro Costa' }
                ].map((user) => (
                  <label key={user.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={assignedUsers.includes(user.id)}
                      onChange={(e) => {
                        const newUsers = e.target.checked
                          ? [...assignedUsers, user.id]
                          : assignedUsers.filter(id => id !== user.id);
                        setAssignedUsers(newUsers);
                        onFiltersChange({ ...filters, assigned_to: newUsers });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{user.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Search className="w-3 h-3" />
              &quot;{filters.search}&quot;
              <button
                onClick={() => handleSearchChange('')}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.status && filters.status.map((status) => (
            <Badge key={status} variant="secondary" className="flex items-center gap-1">
              Status: {LEAD_STATUSES[status as keyof typeof LEAD_STATUSES]?.label}
              <button
                onClick={() => handleStatusToggle(status)}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.origin && filters.origin.map((origin) => (
            <Badge key={origin} variant="secondary" className="flex items-center gap-1">
              Origem: {LEAD_ORIGINS[origin as keyof typeof LEAD_ORIGINS]?.label}
              <button
                onClick={() => handleOriginToggle(origin)}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.tags && filters.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              Tag: {tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.score_range && (filters.score_range.min > 0 || filters.score_range.max < 100) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Score: {filters.score_range.min}-{filters.score_range.max}
              <button
                onClick={() => handleScoreRangeChange('min', 0) && handleScoreRangeChange('max', 100)}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
      {/* Saved Filters */}
      {savedFilters.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtros Salvos
          </label>
          <div className="flex flex-wrap gap-2">
            {savedFilters.map((savedFilter) => (
              <Button
                key={savedFilter.id}
                variant="outline"
                size="sm"
                onClick={() => handleLoadFilter(savedFilter)}
              >
                {savedFilter.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Salvar Filtro</h3>
            <Input
              placeholder="Nome do filtro"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveFilter}
                disabled={!filterName.trim()}
              >
                Salvar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
export default ModernLeadFilters;
