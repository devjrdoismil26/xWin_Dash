/**
 * Filtros do módulo Activity
 *
 * @description
 * Componente para filtrar e buscar atividades por múltiplos critérios:
 * busca por texto, tipo de atividade, usuário e período de datas.
 * Permite limpar filtros e aplicar múltiplos filtros simultaneamente.
 *
 * @module modules/Activity/components/ActivityFilters
 * @since 1.0.0
 */

import React, { useState } from 'react';
import { useActivity } from '../hooks';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import Select, { SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/Select';
import { Search, Filter, Clock, RefreshCw } from 'lucide-react';
import { ActivityFilters as ActivityFiltersType } from '../types';

/**
 * Props do componente ActivityFilters
 *
 * @interface ActivityFiltersProps
 * @property {ActivityFiltersType} filters - Objeto com filtros atuais
 * @property {(filters: Partial<ActivityFiltersType>) => void} onFiltersChange - Callback quando filtros mudam
 * @property {() => void} onClearFilters - Callback para limpar filtros
 * @property {string} [className] - Classes CSS adicionais
 */
interface ActivityFiltersProps {
  filters: ActivityFiltersType;
  onFiltersChange?: (e: any) => void;
  onClearFilters??: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente ActivityFilters
 *
 * @description
 * Renderiza painel de filtros com campos de busca, seletores de tipo,
 * usuário e período. Exibe botões para aplicar e limpar filtros.
 *
 * @param {ActivityFiltersProps} props - Props do componente
 * @returns {JSX.Element} Painel de filtros
 */
export const ActivityFilters: React.FC<ActivityFiltersProps> = ({ filters,
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
    });};

  const handleClear = () => {
    setSearchTerm('');

    setTypeFilter('all');

    setUserFilter('all');

    setDateFilter('all');

    onClearFilters();};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();

    } ;

  return (
        <>
      <Card className={`backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 ${className} `} />
      <Card.Content className="p-6" />
        <div className="{/* Search Input */}">$2</div>
          <div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar atividades..."
                value={ searchTerm }
                onChange={ (e: unknown) => setSearchTerm(e.target.value) }
                onKeyPress={ handleKeyPress }
                className="pl-10 backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30" />
            </div>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={ setTypeFilter } />
            <SelectTrigger className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30" />
              <SelectValue placeholder="Todos os Tipos" / /></SelectTrigger><SelectContent />
              {(TYPE_FILTER_OPTIONS || []).map((option: unknown) => (
                <SelectItem key={option.value} value={ option.value } />
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* User Filter */}
          <Select value={userFilter} onValueChange={ setUserFilter } />
            <SelectTrigger className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30" />
              <SelectValue placeholder="Todos os Usuários" / /></SelectTrigger><SelectContent />
              {(USER_FILTER_OPTIONS || []).map((option: unknown) => (
                <SelectItem key={option.value} value={ option.value } />
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Select value={dateFilter} onValueChange={ setDateFilter } />
            <SelectTrigger className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30" />
              <SelectValue placeholder="Todo o Período" / /></SelectTrigger><SelectContent />
              {(DATE_RANGE_OPTIONS || []).map((option: unknown) => (
                <SelectItem key={option.value} value={ option.value } />
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent></Select></div>

        {/* Action Buttons */}
        <div className=" ">$2</div><div className=" ">$2</div><Button 
              onClick={ handleSearch }
              className="backdrop-blur-sm bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-600" />
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button 
              onClick={ handleClear }
              variant="outline"
              className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20" />
              <RefreshCw className="h-4 w-4 mr-2" />
              Limpar
            </Button></div><div className=" ">$2</div><Clock className="h-4 w-4" />
            <span>Filtros aplicados</span></div></Card.Content>
    </Card>);};

export default ActivityFilters;
