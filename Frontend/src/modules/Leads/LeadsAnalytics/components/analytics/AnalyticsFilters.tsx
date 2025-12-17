// ========================================
// ANALYTICS FILTERS - FILTROS E CONTROLES
// ========================================
import React, { useState } from 'react';
import { Filter, Calendar, Users, Target, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import { cn } from '@/lib/utils';

interface AnalyticsFiltersProps {
  onFiltersChange??: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({ onFiltersChange,
  className
   }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['period', 'status']));

  const [filters, setFilters] = useState({
    period: '30d',
    status: [] as string[],
    origin: [] as string[],
    scoreRange: { min: 0, max: 100 },
    dateRange: { start: '', end: '' },
    assignedTo: [] as number[],
    tags: [] as string[]
  });

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);

    if (newExpanded.has(section)) {
      newExpanded.delete(section);

    } else {
      newExpanded.add(section);

    }
    setExpandedSections(newExpanded);};

  const updateFilter = (key: string, value: unknown) => {
    const newFilters = { ...filters, [key]: value};

    setFilters(newFilters);

    onFiltersChange?.(newFilters);};

  const resetFilters = () => {
    const defaultFilters = {
      period: '30d',
      status: [],
      origin: [],
      scoreRange: { min: 0, max: 100 },
      dateRange: { start: '', end: '' },
      assignedTo: [],
      tags: []};

    setFilters(defaultFilters);

    onFiltersChange?.(defaultFilters);};

  return (
        <>
      <Card className={cn("p-6", className) } />
      <div className=" ">$2</div><div className=" ">$2</div><Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros Avançados</h3></div><Button variant="outline" size="sm" onClick={ resetFilters } />
          Limpar Filtros
        </Button></div><div className="{/* Period Filter */}">$2</div>
        <div>
           
        </div><Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto"
            onClick={ () => toggleSection('period')  }>
            <div className=" ">$2</div><Calendar className="w-4 h-4" />
              <span className="font-medium">Período</span>
            </div>
            {expandedSections.has('period') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          {expandedSections.has('period') && (
            <div className=" ">$2</div><select
                value={ filters.period }
                onChange={ (e: unknown) => updateFilter('period', e.target.value) }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="1y">Último ano</option>
                <option value="custom">Período personalizado</option>
              </select>
              {filters.period === 'custom' && (
                <div className=" ">$2</div><input
                    type="date"
                    value={ filters.dateRange.start }
                    onChange={(e: unknown) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Data inicial" />
                  <input
                    type="date"
                    value={ filters.dateRange.end }
                    onChange={(e: unknown) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Data final" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div>
           
        </div><Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto"
            onClick={ () => toggleSection('status')  }>
            <div className=" ">$2</div><Users className="w-4 h-4" />
              <span className="font-medium">Status</span>
            </div>
            {expandedSections.has('status') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          {expandedSections.has('status') && (
            <div className="{['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'].map((status: unknown) => (">$2</div>
                <label key={status} className="flex items-center gap-2" />
                  <input
                    type="checkbox"
                    checked={ filters.status.includes(status) }
                    onChange={(e: unknown) => {
                      const newStatus = e.target.checked
                        ? [...filters.status, status]
                        : (filters.status || []).filter(s => s !== status);

                      updateFilter('status', newStatus);

                    } className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 capitalize">{status.replace('_', ' ')}</span>
      </label>
    </>
  ))}
            </div>
          )}
        </div>

        {/* Origin Filter */}
        <div>
           
        </div><Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto"
            onClick={ () => toggleSection('origin')  }>
            <div className=" ">$2</div><Target className="w-4 h-4" />
              <span className="font-medium">Origem</span>
            </div>
            {expandedSections.has('origin') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          {expandedSections.has('origin') && (
            <div className="{['website', 'social_media', 'email_campaign', 'referral', 'cold_call', 'event'].map((origin: unknown) => (">$2</div>
                <label key={origin} className="flex items-center gap-2" />
                  <input
                    type="checkbox"
                    checked={ filters.origin.includes(origin) }
                    onChange={(e: unknown) => {
                      const newOrigin = e.target.checked
                        ? [...filters.origin, origin]
                        : (filters.origin || []).filter(o => o !== origin);

                      updateFilter('origin', newOrigin);

                    } className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 capitalize">{origin.replace('_', ' ')}</span>
      </label>
    </>
  ))}
            </div>
          )}
        </div>

        {/* Score Range Filter */}
        <div>
           
        </div><Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto"
            onClick={ () => toggleSection('score')  }>
            <div className=" ">$2</div><MapPin className="w-4 h-4" />
              <span className="font-medium">Range de Score</span>
            </div>
            {expandedSections.has('score') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          {expandedSections.has('score') && (
            <div className=" ">$2</div><div className=" ">$2</div><input
                  type="number"
                  min="0"
                  max="100"
                  value={ filters.scoreRange.min }
                  onChange={(e: unknown) => updateFilter('scoreRange', { ...filters.scoreRange, min: parseInt(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mínimo" />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={ filters.scoreRange.max }
                  onChange={(e: unknown) => updateFilter('scoreRange', { ...filters.scoreRange, max: parseInt(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Máximo" /></div><div className="Range: {filters.scoreRange.min} - {filters.scoreRange.max}">$2</div>
    </div>
  )}
        </div>
    </Card>);};

export default AnalyticsFilters;