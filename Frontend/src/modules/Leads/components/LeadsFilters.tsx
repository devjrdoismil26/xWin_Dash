// ========================================
// LEADS FILTERS COMPONENT
// ========================================
// Componente para filtros de leads
// Máximo: 150 linhas

import React, { useState } from 'react';
import { Search, Filter, X, RotateCcw } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import { Badge } from '@/shared/components/ui/Badge';
import { LeadFilters } from '../types';

// ========================================
// INTERFACES
// ========================================

interface LeadsFiltersProps {
  filters: LeadFilters;
  onFiltersChange?: (e: any) => void;
  onReset???: (e: any) => void;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

// ========================================
// COMPONENTE
// ========================================

export const LeadsFilters: React.FC<LeadsFiltersProps> = ({ filters,
  onFiltersChange,
  onReset,
  loading = false,
  className = ''
   }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ========================================
  // HANDLERS
  // ========================================
  
  const handleFilterChange = (field: string, value: string | number | boolean | string[] | null | undefined) => {
    onFiltersChange({
      ...filters,
      [field]: value,
      page: 1 // Reset to first page when filters change
    });};

  const handleSearch = (value: string) => {
    handleFilterChange('search', value);};

  const handleStatusChange = (statuses: string[]) => {
    handleFilterChange('status', statuses);};

  const handleOriginChange = (origins: string[]) => {
    handleFilterChange('origin', origins);};

  const handleSortChange = (sortBy: string) => {
    handleFilterChange('sort_by', sortBy);};

  const handleSortOrderChange = (sortOrder: 'asc' | 'desc') => {
    handleFilterChange('sort_order', sortOrder);};

  const handleReset = () => {
    if (onReset) {
      onReset();

    } else {
      onFiltersChange({
        page: 1,
        per_page: 10,
        sort_by: 'created_at',
        sort_order: 'desc'
      });

    } ;

  const clearFilter = (field: string) => {
    const newFilters = { ...filters};

    delete newFilters[field as keyof LeadFilters];
    onFiltersChange(newFilters);};

  // ========================================
  // OPTIONS
  // ========================================
  
  const statusOptions = [
    { value: 'new', label: 'Novo' },
    { value: 'contacted', label: 'Contatado' },
    { value: 'qualified', label: 'Qualificado' },
    { value: 'proposal', label: 'Proposta' },
    { value: 'negotiation', label: 'Negociação' },
    { value: 'closed_won', label: 'Fechado - Ganho' },
    { value: 'closed_lost', label: 'Fechado - Perdido' },
    { value: 'nurturing', label: 'Nutrição' },
    { value: 'unqualified', label: 'Não Qualificado' }
  ];

  const originOptions = [
    { value: 'website', label: 'Website' },
    { value: 'social_media', label: 'Redes Sociais' },
    { value: 'email_campaign', label: 'Campanha de Email' },
    { value: 'referral', label: 'Indicação' },
    { value: 'cold_call', label: 'Ligação Fria' },
    { value: 'event', label: 'Evento' },
    { value: 'advertisement', label: 'Publicidade' },
    { value: 'search_engine', label: 'Motor de Busca' },
    { value: 'other', label: 'Outro' }
  ];

  const sortOptions = [
    { value: 'created_at', label: 'Data de Criação' },
    { value: 'updated_at', label: 'Última Atualização' },
    { value: 'name', label: 'Nome' },
    { value: 'email', label: 'Email' },
    { value: 'score', label: 'Score' },
    { value: 'status', label: 'Status' }
  ];

  // ========================================
  // RENDER
  // ========================================
  
  return (
        <>
      <div className={`space-y-4 ${className} `}>
      </div>{/* Search and Basic Filters */}
      <div className="{/* Search */}">$2</div>
        <div className=" ">$2</div><Input
            type="text"
            placeholder="Buscar leads..."
            value={ filters.search || '' }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value) }
            icon={ Search }
            loading={ loading } />
        </div>

        {/* Sort */}
        <div className=" ">$2</div><Select
            value={ filters.sort_by || 'created_at' }
            onChange={ handleSortChange }
            options={ sortOptions }
            placeholder="Ordenar por"
            disabled={ loading }
          / />
          <Select
            value={ filters.sort_order || 'desc' }
            onChange={ handleSortOrderChange }
            options={[
              { value: 'asc', label: 'Crescente' },
              { value: 'desc', label: 'Decrescente' }
            ]}
            disabled={ loading }
          / />
        </div>

        {/* Actions */}
        <div className=" ">$2</div><Button
            onClick={ () => setShowAdvanced(!showAdvanced) }
            variant="secondary"
            size="sm"
            disabled={ loading  }>
            <Filter className="w-4 h-4 mr-2" />
            {showAdvanced ? 'Ocultar' : 'Filtros'}
          </Button>
          <Button
            onClick={ handleReset }
            variant="secondary"
            size="sm"
            disabled={ loading } />
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        </div>

      {/* Active Filters */}
      {(filters.status?.length || filters.origin?.length || filters.search) && (
        <div className="{filters.search && (">$2</div>
            <Badge variant="secondary" className="flex items-center gap-1" />
              Busca: {filters.search}
              <button
                onClick={ () => clearFilter('search') }
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" /></button></Badge>
          )}
          {filters.status?.map(status => (
            <Badge key={status} variant="secondary" className="flex items-center gap-1" />
              Status: {statusOptions.find(opt => opt.value === status)?.label}
              <button
                onClick={ () => clearFilter('status') }
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" /></button></Badge>
          ))}
          {filters.origin?.map(origin => (
            <Badge key={origin} variant="secondary" className="flex items-center gap-1" />
              Origem: {originOptions.find(opt => opt.value === origin)?.label}
              <button
                onClick={ () => clearFilter('origin') }
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" /></button></Badge>
          ))}
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card className="p-4" />
          <div className="{/* Status Filter */}">$2</div>
            <div>
           
        </div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
                Status
              </label>
              <Select
                value={ filters.status || [] }
                onChange={ handleStatusChange }
                options={ statusOptions }
                placeholder="Selecionar status"
                multiple
                disabled={ loading }
              / />
            </div>

            {/* Origin Filter */}
            <div>
           
        </div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
                Origem
              </label>
              <Select
                value={ filters.origin || [] }
                onChange={ handleOriginChange }
                options={ originOptions }
                placeholder="Selecionar origem"
                multiple
                disabled={ loading }
              / />
            </div>

            {/* Score Range */}
            <div>
           
        </div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
                Score
              </label>
              <div className=" ">$2</div><Input
                  type="number"
                  placeholder="Min"
                  value={ filters.score_range?.min || '' }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('score_range', {
                    ...filters.score_range,
                    min: parseInt(e.target.value) || undefined
                  })}
                  disabled={ loading } />
                <Input
                  type="number"
                  placeholder="Max"
                  value={ filters.score_range?.max || '' }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('score_range', {
                    ...filters.score_range,
                    max: parseInt(e.target.value) || undefined
                  })}
                  disabled={ loading } /></div></div>
      </Card>
    </>
  )}
    </div>);};

export default LeadsFilters;
