/**
 * Componente de filtros do módulo Activity
 * Interface para filtrar e buscar atividades
 */

import React, { useState } from 'react';
import { useActivity } from '../hooks';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  Search, 
  Filter, 
  Clock,
  RefreshCw
} from 'lucide-react';
import { ActivityFilters as ActivityFiltersType } from '../types';

interface ActivityFiltersProps {
  filters: ActivityFiltersType;
  onFiltersChange: (filters: Partial<ActivityFiltersType>) => void;
  onClearFilters: () => void;
  className?: string;
}

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [typeFilter, setTypeFilter] = useState(filters.type || 'all');
  const [userFilter, setUserFilter] = useState(filters.user || 'all');
  const [dateFilter, setDateFilter] = useState(filters.date || 'all');

  const handleSearch = () => {
    onFiltersChange({
      search: searchTerm,
      type: typeFilter,
      user: userFilter,
      date: dateFilter
    });
  };

  const handleClear = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setUserFilter('all');
    setDateFilter('all');
    onClearFilters();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className={`backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 ${className}`}>
      <Card.Content className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar atividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
              />
            </div>
          </div>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <Select.Trigger className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30">
              <Select.Value placeholder="Todos os Tipos" />
            </Select.Trigger>
            <Select.Content>
              {TYPE_FILTER_OPTIONS.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>

          {/* User Filter */}
          <Select value={userFilter} onValueChange={setUserFilter}>
            <Select.Trigger className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30">
              <Select.Value placeholder="Todos os Usuários" />
            </Select.Trigger>
            <Select.Content>
              {USER_FILTER_OPTIONS.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>

          {/* Date Filter */}
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <Select.Trigger className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30">
              <Select.Value placeholder="Todo o Período" />
            </Select.Trigger>
            <Select.Content>
              {DATE_RANGE_OPTIONS.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleSearch}
              className="backdrop-blur-sm bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-600"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button 
              onClick={handleClear}
              variant="outline"
              className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Clock className="h-4 w-4" />
            <span>Filtros aplicados</span>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default ActivityFilters;
