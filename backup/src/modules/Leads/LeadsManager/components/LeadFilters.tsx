import React from 'react';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import Button from '@/components/ui/Button';
import { LeadFiltersProps, LeadStatus, LeadOrigin } from '../types';
const LeadFilters: React.FC<LeadFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  segments, 
  tags 
}) => {
  const statusOptions = [
    { value: 'new', label: 'Novo' },
    { value: 'contacted', label: 'Contactado' },
    { value: 'qualified', label: 'Qualificado' },
    { value: 'proposal', label: 'Proposta' },
    { value: 'negotiation', label: 'Negociação' },
    { value: 'won', label: 'Ganho' },
    { value: 'lost', label: 'Perdido' }
  ];
  const originOptions = [
    { value: 'website', label: 'Website' },
    { value: 'social_media', label: 'Redes Sociais' },
    { value: 'email_marketing', label: 'Email Marketing' },
    { value: 'referral', label: 'Indicação' },
    { value: 'cold_call', label: 'Cold Call' },
    { value: 'event', label: 'Evento' },
    { value: 'partner', label: 'Parceiro' },
    { value: 'organic_search', label: 'Busca Orgânica' },
    { value: 'paid_ads', label: 'Anúncios Pagos' },
    { value: 'other', label: 'Outro' }
  ];
  const segmentOptions = segments.map(segment => ({
    value: segment.id.toString(),
    label: segment.name
  }));
  const tagOptions = tags.map(tag => ({
    value: tag.name,
    label: tag.name
  }));
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };
  const clearFilters = () => {
    onFiltersChange({});
  };
  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof typeof filters];
    return value !== undefined && value !== '' && 
           (Array.isArray(value) ? value.length > 0 : true);
  });
  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearFilters}
          >
            Limpar Filtros
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Busca */}
        <div>
          <Input
            label="Buscar"
            placeholder="Nome, email, telefone..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        {/* Status */}
        <div>
          <InputLabel>Status</InputLabel>
          <Select
            options={statusOptions}
            value={filters.status?.[0] || ''}
            onChange={(value) => handleFilterChange('status', value ? [value as LeadStatus] : [])}
            placeholder="Selecione o status"
          />
        </div>
        {/* Origem */}
        <div>
          <InputLabel>Origem</InputLabel>
          <Select
            options={originOptions}
            value={filters.origin?.[0] || ''}
            onChange={(value) => handleFilterChange('origin', value ? [value as LeadOrigin] : [])}
            placeholder="Selecione a origem"
          />
        </div>
        {/* Segmento */}
        <div>
          <InputLabel>Segmento</InputLabel>
          <Select
            options={segmentOptions}
            value={filters.segment_id?.toString() || ''}
            onChange={(value) => handleFilterChange('segment_id', value ? parseInt(value) : undefined)}
            placeholder="Selecione o segmento"
          />
        </div>
        {/* Tags */}
        <div>
          <InputLabel>Tags</InputLabel>
          <Select
            options={tagOptions}
            value={filters.tags?.[0] || ''}
            onChange={(value) => handleFilterChange('tags', value ? [value] : [])}
            placeholder="Selecione as tags"
          />
        </div>
        {/* Score Mínimo */}
        <div>
          <Input
            label="Score Mínimo"
            type="number"
            min="0"
            max="100"
            placeholder="0"
            value={filters.score_min || ''}
            onChange={(e) => handleFilterChange('score_min', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
        {/* Score Máximo */}
        <div>
          <Input
            label="Score Máximo"
            type="number"
            min="0"
            max="100"
            placeholder="100"
            value={filters.score_max || ''}
            onChange={(e) => handleFilterChange('score_max', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
        {/* Data Início */}
        <div>
          <Input
            label="Data Início"
            type="date"
            value={filters.date_from || ''}
            onChange={(e) => handleFilterChange('date_from', e.target.value || undefined)}
          />
        </div>
        {/* Data Fim */}
        <div>
          <Input
            label="Data Fim"
            type="date"
            value={filters.date_to || ''}
            onChange={(e) => handleFilterChange('date_to', e.target.value || undefined)}
          />
        </div>
      </div>
      {/* Filtros Ativos */}
      {hasActiveFilters && (
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Filtros Ativos:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Busca: {filters.search}
              </span>
            )}
            {filters.status && filters.status.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Status: {filters.status.join(', ')}
              </span>
            )}
            {filters.origin && filters.origin.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Origem: {filters.origin.join(', ')}
              </span>
            )}
            {filters.tags && filters.tags.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                Tags: {filters.tags.join(', ')}
              </span>
            )}
            {(filters.score_min !== undefined || filters.score_max !== undefined) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                Score: {filters.score_min || 0} - {filters.score_max || 100}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default LeadFilters;
