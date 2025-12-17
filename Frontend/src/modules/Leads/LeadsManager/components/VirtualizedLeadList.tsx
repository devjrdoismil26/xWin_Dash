// ========================================
// LISTA VIRTUALIZADA - LEADS
// ========================================
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { User, Mail, Phone, Star, Tag, Calendar, MoreVertical, Eye, Edit, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { cn } from '@/lib/utils';
import { Lead, LEAD_STATUSES, LEAD_ORIGINS } from '../types';
interface VirtualizedLeadListProps {
  leads: Lead[];
  onView??: (e: any) => void;
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  onUpdateScore??: (e: any) => void;
  onUpdateStatus??: (e: any) => void;
  onRecordActivity??: (e: any) => void;
  className?: string;
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const VirtualizedLeadList: React.FC<VirtualizedLeadListProps> = ({ leads,
  onView,
  onEdit,
  onDelete,
  onUpdateScore,
  onUpdateStatus,
  onRecordActivity,
  className,
  itemHeight = 80,
  containerHeight = 600,
  overscan = 5
   }) => {
  const [scrollTop, setScrollTop] = useState(0);

  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());

  const [hoveredLead, setHoveredLead] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const virtualScrollConfig: VirtualScrollConfig = {
    itemHeight,
    containerHeight,
    overscan};

  const virtualScrollResult = useMemo(() => {
    return calculateVirtualScroll(scrollTop, leads.length, virtualScrollConfig);

  }, [scrollTop, leads.length, virtualScrollConfig]);

  const visibleLeads = useMemo(() => {
    return leads.slice(virtualScrollResult.startIndex, virtualScrollResult.endIndex + 1);

  }, [leads, virtualScrollResult.startIndex, virtualScrollResult.endIndex]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);

  }, []);

  const handleSelectLead = useCallback((leadId: number, selected: boolean) => {
    setSelectedLeads(prev => {
      const newSet = new Set(prev);

      if (selected) {
        newSet.add(leadId);

      } else {
        newSet.delete(leadId);

      }
      return newSet;
    });

  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedLeads(new Set((leads || []).map(lead => lead.id)));

    } else {
      setSelectedLeads(new Set());

    } , [leads]);

  const getStatusConfig = useCallback((status: string) => {
    return LEAD_STATUSES[status as keyof typeof LEAD_STATUSES] || {
      label: status,
      color: 'gray',
      description: ''};

  }, []);

  const getOriginConfig = useCallback((origin: string) => {
    return LEAD_ORIGINS[origin as keyof typeof LEAD_ORIGINS] || {
      label: origin,
      icon: '❓',
      description: ''};

  }, []);

  const getScoreColor = useCallback((score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 20) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);

    const now = new Date();

    const diffTime = Math.abs(now.getTime() - date.getTime());

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} semanas atrás`;
    return date.toLocaleDateString('pt-BR');

  }, []);

  const renderLeadItem = useCallback((lead: Lead, index: number) => {
    const actualIndex = virtualScrollResult.startIndex + index;
    const statusConfig = getStatusConfig(lead.status);

    const originConfig = getOriginConfig(lead.origin);

    const scoreColor = getScoreColor(lead.score);

    const isSelected = selectedLeads.has(lead.id);

    const isHovered = hoveredLead === lead.id;
    return (
              <div
        key={ lead.id }
        className={cn(
          "flex items-center gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors",
          isSelected && "bg-blue-50 border-blue-200",
          isHovered && "bg-gray-50"
        )} style={height: itemHeight,
          position: 'absolute',
          top: (actualIndex * itemHeight) - virtualScrollResult.offsetY,
          left: 0,
          right: 0
        } onMouseEnter={ () => setHoveredLead(lead.id) }
        onMouseLeave={ () => setHoveredLead(null)  }>
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={ isSelected }
          onChange={ (e: unknown) => handleSelectLead(lead.id, e.target.checked) }
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
        {/* Avatar */}
        <div className=" ">$2</div><span className="{lead.name.split(' ').map(n => n[0]).join('').substring(0, 2)}">$2</span>
          </span>
        </div>
        {/* Lead Info */}
        <div className=" ">$2</div><div className=" ">$2</div><h3 className="font-semibold text-gray-900 truncate" />
              {lead.name}
            </h3>
            {lead.company && (
              <span className="• {lead.company}">$2</span>
      </span>
    </>
  )}
          </div>
          <div className=" ">$2</div><div className=" ">$2</div><Mail className="w-3 h-3" />
              <span className="truncate">{lead.email}</span>
            </div>
            {lead.phone && (
              <div className=" ">$2</div><Phone className="w-3 h-3" />
                <span>{lead.phone}</span>
      </div>
    </>
  )}
          </div>
        {/* Status and Score */}
        <div className=" ">$2</div><Badge
            variant="secondary"
            className={cn(
              "text-xs",
              statusConfig.color === 'blue' && 'bg-blue-100 text-blue-700',
              statusConfig.color === 'yellow' && 'bg-yellow-100 text-yellow-700',
              statusConfig.color === 'green' && 'bg-green-100 text-green-700',
              statusConfig.color === 'orange' && 'bg-orange-100 text-orange-700',
              statusConfig.color === 'purple' && 'bg-purple-100 text-purple-700',
              statusConfig.color === 'emerald' && 'bg-emerald-100 text-emerald-700',
              statusConfig.color === 'red' && 'bg-red-100 text-red-700',
              statusConfig.color === 'gray' && 'bg-gray-100 text-gray-700'
            ) } />
            {statusConfig.label}
          </Badge>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
            scoreColor
          )  }>
        </div><Star className="w-3 h-3" />
            <span>{lead.score}</span></div><Badge variant="outline" className="text-xs" />
            {originConfig.icon} {originConfig.label}
          </Badge>
        </div>
        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div className="{lead.tags.slice(0, 2).map((tag: unknown, tagIndex: unknown) => (">$2</div>
              <Badge key={tagIndex} variant="outline" className="text-xs" />
                <Tag className="w-2 h-2 mr-1" />
                {tag.name}
              </Badge>
            ))}
            {lead.tags.length > 2 && (
              <Badge variant="outline" className="text-xs" />
                +{lead.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
        {/* Date */}
        <div className=" ">$2</div><Calendar className="w-3 h-3" />
          <span>{formatDate(lead.created_at)}</span>
        </div>
        {/* Actions */}
        <div className=" ">$2</div><Button
            variant="ghost"
            size="sm"
            onClick={ () => onView?.(lead) }
            className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="w-4 h-4" /></Button><Button
            variant="ghost"
            size="sm"
            onClick={ () => onEdit?.(lead) }
            className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit className="w-4 h-4" /></Button><Button
            variant="ghost"
            size="sm"
            onClick={ () => onDelete?.(lead) }
            className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" /></Button></div>);

  }, [
    virtualScrollResult.startIndex,
    virtualScrollResult.offsetY,
    selectedLeads,
    hoveredLead,
    itemHeight,
    handleSelectLead,
    getStatusConfig,
    getOriginConfig,
    getScoreColor,
    formatDate,
    onView,
    onEdit,
    onDelete
  ]);

  return (
        <>
      <div className={cn("relative", className)  }>
      </div>{/* Header */}
      <div className=" ">$2</div><input
          type="checkbox"
          checked={ selectedLeads.size === leads.length && leads.length > 0 }
          onChange={ (e: unknown) => handleSelectAll(e.target.checked) }
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
        <div className="{selectedLeads.size > 0 ? `${selectedLeads.size} selecionados` : 'Selecionar todos'}">$2</div>
        </div>
        <div className="{leads.length} leads">$2</div>
        </div>
      {/* Virtual List Container */}
      <div
        ref={ containerRef }
        className="relative overflow-auto"
        style={height: containerHeight } onScroll={ handleScroll  }>
        </div>{/* Virtual Spacer */}
        <div style={height: virtualScrollResult.totalHeight } >
           
        </div>{/* Visible Items */}
          <div
            style={transform: `translateY(${virtualScrollResult.offsetY} px)`,
              position: 'relative'
            } >
           
        </div>{(visibleLeads || []).map((lead: unknown, index: unknown) => renderLeadItem(lead, index))}
          </div>
      </div>
      {/* Footer */}
      <div className=" ">$2</div><div className="Mostrando {virtualScrollResult.startIndex + 1} a {Math.min(virtualScrollResult.endIndex + 1, leads.length)} de {leads.length} leads">$2</div>
        </div>
        <div className=" ">$2</div><div className="Altura do item: {itemHeight}px">$2</div>
          </div>
          <div className="Altura total: {virtualScrollResult.totalHeight}px">$2</div>
          </div>
      </div>);};

export default VirtualizedLeadList;
