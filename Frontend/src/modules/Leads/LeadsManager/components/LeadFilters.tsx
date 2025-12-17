import React from 'react';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import Button from '@/shared/components/ui/Button';
import { LeadFiltersProps, LeadStatus, LeadOrigin } from '../types';
const LeadFilters: React.FC<LeadFiltersProps> = ({ filters, 
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
  const segmentOptions = (segments || []).map(segment => ({
    value: segment.id.toString(),
    label: segment.name
  }));

  const tagOptions = (tags || []).map(tag => ({
    value: tag.name,
    label: tag.name
  }));

  const handleFilterChange = (key: string, value: unknown) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });};

  const clearFilters = () => {
    onFiltersChange({});};

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof typeof filters];
    return value !== undefined && value !== '' && 
           (Array.isArray(value) ? value.length > 0 : true);

  });

  return (
            <div className=" ">$2</div><div className=" ">$2</div><h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        { hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearFilters } />
            Limpar Filtros
          </Button>
        )}
      </div>
      <div className="{/* Busca */}">$2</div>
        <div>
           
        </div><Input
            label="Buscar"
            placeholder="Nome, email, telefone..."
            value={ filters.search || '' }
            onChange={ (e: unknown) => handleFilterChange('search', e.target.value) } />
        </div>
        {/* Status */}
        <div>
           
        </div><InputLabel>Status</InputLabel>
          <Select
            options={ statusOptions }
            value={ filters.status?.[0] || '' }
            onChange={ (value: unknown) => handleFilterChange('status', value ? [value as LeadStatus] : []) }
            placeholder="Selecione o status" />
        </div>
        {/* Origem */}
        <div>
           
        </div><InputLabel>Origem</InputLabel>
          <Select
            options={ originOptions }
            value={ filters.origin?.[0] || '' }
            onChange={ (value: unknown) => handleFilterChange('origin', value ? [value as LeadOrigin] : []) }
            placeholder="Selecione a origem" />
        </div>
        {/* Segmento */}
        <div>
           
        </div><InputLabel>Segmento</InputLabel>
          <Select
            options={ segmentOptions }
            value={ filters.segment_id?.toString() || '' }
            onChange={ (value: unknown) => handleFilterChange('segment_id', value ? parseInt(value) : undefined) }
            placeholder="Selecione o segmento" />
        </div>
        {/* Tags */}
        <div>
           
        </div><InputLabel>Tags</InputLabel>
          <Select
            options={ tagOptions }
            value={ filters.tags?.[0] || '' }
            onChange={ (value: unknown) => handleFilterChange('tags', value ? [value] : []) }
            placeholder="Selecione as tags" />
        </div>
        {/* Score Mínimo */}
        <div>
           
        </div><Input
            label="Score Mínimo"
            type="number"
            min="0"
            max="100"
            placeholder="0"
            value={ filters.score_min || '' }
            onChange={ (e: unknown) => handleFilterChange('score_min', e.target.value ? parseInt(e.target.value) : undefined) } />
        </div>
        {/* Score Máximo */}
        <div>
           
        </div><Input
            label="Score Máximo"
            type="number"
            min="0"
            max="100"
            placeholder="100"
            value={ filters.score_max || '' }
            onChange={ (e: unknown) => handleFilterChange('score_max', e.target.value ? parseInt(e.target.value) : undefined) } />
        </div>
        {/* Data Início */}
        <div>
           
        </div><Input
            label="Data Início"
            type="date"
            value={ filters.date_from || '' }
            onChange={ (e: unknown) => handleFilterChange('date_from', e.target.value || undefined) } />
        </div>
        {/* Data Fim */}
        <div>
           
        </div><Input
            label="Data Fim"
            type="date"
            value={ filters.date_to || '' }
            onChange={ (e: unknown) => handleFilterChange('date_to', e.target.value || undefined) } />
        </div>
      {/* Filtros Ativos */}
      {hasActiveFilters && (
        <div className=" ">$2</div><h4 className="text-sm font-medium text-gray-900 mb-2">Filtros Ativos:</h4>
          <div className="{filters.search && (">$2</div>
              <span className="Busca: {filters.search}">$2</span>
      </span>
    </>
  )}
            {filters.status && filters.status.length > 0 && (
              <span className="Status: {filters.status.join(', ')}">$2</span>
      </span>
    </>
  )}
            {filters.origin && filters.origin.length > 0 && (
              <span className="Origem: {filters.origin.join(', ')}">$2</span>
      </span>
    </>
  )}
            {filters.tags && filters.tags.length > 0 && (
              <span className="Tags: {filters.tags.join(', ')}">$2</span>
      </span>
    </>
  )}
            {(filters.score_min !== undefined || filters.score_max !== undefined) && (
              <span className="Score: {filters.score_min || 0} - {filters.score_max || 100}">$2</span>
      </span>
    </>
  )}
          </div>
      )}
    </div>);};

export default LeadFilters;
