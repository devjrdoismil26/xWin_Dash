import React, { useCallback, useMemo, useState } from 'react';

import { Clock, Plus, Filter, Download } from 'lucide-react';
import Calendar, { CalendarEvent as _CalendarEvent } from '@/shared/components/ui/Calendar';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import ConfirmationModal from '@/shared/components/ui/ConfirmationModal';

/**
 * Interface de evento de calendário
 *
 * @description
 * Estrutura completa de um evento que pode ser exibido no calendário.
 *
 * @example
 * ```ts
 * const event: CalendarEvent = {
 *   id: 'event-1',
 *   title: 'Reunião',
 *   start: new Date('2024-01-01T10:00:00'),
 *   end: new Date('2024-01-01T11:00:00'),
 *   status: 'confirmed',
 *   priority: 'high'
 *};

 * ```
 */
export interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  status?: string;
  platform?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  resource?: string; }

export interface UniversalCalendarConfig {
  title?: string;
  height?: number;
  defaultView?: 'month' | 'week' | 'day' | 'agenda';
  filterOptions?: Array<{ label: string;
  value: string;
  type: 'status' | 'platform' | 'category' | 'priority';
}>;
  allowCreate?: boolean;
  allowEdit?: boolean;
  allowDragDrop?: boolean;
  showLegend?: boolean;
  legendItems?: Array<{ label: string; color: string }>;
  eventComponent?: React.ComponentType<{ event: CalendarEvent }>;
  eventStyleGetter?: (event: CalendarEvent) => React.CSSProperties;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface UniversalCalendarProps {
  events: CalendarEvent[];
  config: UniversalCalendarConfig;
  loading?: boolean;
  onCreate???: (e: any) => void;
  onEdit??: (e: any) => void;
  onDelete?: (event: CalendarEvent) => Promise<void> | void;
  onExport??: (e: any) => void;
  onEventSelect??: (e: any) => void;
  onEventDrop?: (event: CalendarEvent, start: Date, end: Date) => Promise<void> | void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const UniversalCalendar: React.FC<UniversalCalendarProps> = ({ events,
  config,
  loading = false,
  onCreate,
  onEdit,
  onDelete,
  onExport,
  onEventSelect,
  onEventDrop,
   }) => {
  const [view, setView] = useState(config.defaultView || 'month');

  const [filters, setFilters] = useState<Record<string, string>>({});

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deleteEvent, setDeleteEvent] = useState<CalendarEvent | null>(null);

  const filteredEvents = useMemo(() => {
    return (events || []).filter((e: unknown) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const eventObj = e as Record<string, any>;
        return String(eventObj[key]) === value;
      }),);

  }, [events, filters]);

  const totals = useMemo(() => {
    const today = moment().startOf('day');

    const thisWeek = moment().startOf('week');

    const thisMonth = moment().startOf('month');

    return {
      total: filteredEvents.length,
      today: (filteredEvents || []).filter((e: unknown) => moment(e.start).isSame(today, 'day')).length,
      thisWeek: (filteredEvents || []).filter((e: unknown) => moment(e.start).isSame(thisWeek, 'week')).length,
      thisMonth: (filteredEvents || []).filter((e: unknown) => moment(e.start).isSame(thisMonth, 'month')).length,};

  }, [filteredEvents]);

  const defaultEventStyleGetter = useCallback((event: CalendarEvent): React.CSSProperties => {
    let backgroundColor = '#3b82f6';
    let borderColor = '#2563eb';

    if (event.category === 'post') {
      backgroundColor = '#10b981';
      borderColor = '#059669';
    } else if (event.category === 'ads') {
      backgroundColor = '#f59e0b';
      borderColor = '#d97706';
    } else if (event.category === 'email') {
      backgroundColor = '#8b5cf6';
      borderColor = '#7c3aed';
    } else if (event.category === 'workflow') {
      backgroundColor = '#ef4444';
      borderColor = '#dc2626';
    }

    if (event.status === 'completed') {
      backgroundColor = '#6b7280';
      borderColor = '#4b5563';
    } else if (event.status === 'failed') {
      backgroundColor = '#ef4444';
      borderColor = '#dc2626';
    }

    return { backgroundColor, borderColor, borderRadius: '6px', color: 'white', fontSize: '11px', padding: '2px 4px', fontWeight: '500'};

  }, []);

  const DefaultEventComponent = useCallback(({ event }: { event: CalendarEvent }) => (
    <div className=" ">$2</div><div className="font-medium truncate">{event.title}</div>
      <div className="{event.category && (">$2</div>
          <Badge variant="secondary" className="text-xs px-1" />
            {event.category}
          </Badge>
        )}
        {event.status && <span className="text-xs">{event.status}</span>}
      </div>
  ), []);

  const handleEventSelect = useCallback(
    (event: CalendarEvent) => {
      onEventSelect?.(event);

    },
    [onEventSelect],);

  const handleSlotSelect = useCallback(() => {
    onCreate?.();

  }, [onCreate]);

  const handleEventDrop = useCallback(
    async (event: CalendarEvent, start: Date, end: Date) => {
      await onEventDrop?.(event, start, end);

    },
    [onEventDrop],);

  const handleFilterChange = (key: string, value: string) => setFilters((prev: unknown) => ({ ...prev, [key]: value }));

  return (
        <>
      <Card />
      <div className=" ">$2</div><div className="{config.icon && ">$2</div><config.icon className="w-5 h-5 text-blue-600" />}
          <h2 className="text-lg font-semibold">{config.title || 'Calendário'}</h2></div><div className=" ">$2</div><div className=" ">$2</div><Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{totals.total} itens</span>
          </div>
          { onExport && (
            <Button variant="outline" size="sm" onClick={ () => onExport(filteredEvents)  }>
              <Download className="w-4 h-4 mr-1" /> Exportar
            </Button>
          )}
          {onCreate && (
            <Button onClick={onCreate} size="sm" />
              <Plus className="w-4 h-4 mr-1" /> Novo
            </Button>
          )}
        </div>

      <div className="{config.filterOptions && config.filterOptions.length > 0 && (">$2</div>
          <div className=" ">$2</div><Filter className="w-4 h-4 text-gray-500 mt-1" />
            {(config.filterOptions || []).map((filter: unknown) => (
              <select
                key={ filter.value }
                value={ filters[filter.value] || '' }
                onChange={ (e: unknown) => handleFilterChange(filter.value, e.target.value) }
                className="text-sm border rounded px-2 py-1"
              >
                <option value="">Todos {filter.label}</option>
      </select>
    </>
  ))}
          </div>
        )}
      </div>

      <div className="{loading ? (">$2</div>
          <div className=" ">$2</div><div className=" ">$2</div><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto">
           
        </div><p className="mt-2 text-sm text-gray-500">Carregando eventos...</p>
      </div>
    </>
  ) ?: (e: any) => void}
            selectable={ config.allowCreate }
            views={ ['month', 'week', 'day', 'agenda'] }
            defaultView={ view as 'month' | 'week' | 'day' | 'agenda' }
            eventPropGetter={ config.eventStyleGetter || defaultEventStyleGetter }
            components={ event: config.eventComponent || DefaultEventComponent } />
        )}
      </div>

      <ConfirmationModal
        isOpen={ isDeleteModalOpen }
        onConfirm={async () => {
          if (deleteEvent && onDelete) await onDelete(deleteEvent);

          setIsDeleteModalOpen(false);

          setDeleteEvent(null);

        } onClose={ () => setIsDeleteModalOpen(false) }
        title="Confirmar Exclusão"
        text={deleteEvent ? `Deseja excluir "${deleteEvent.title}"? Esta ação não pode ser desfeita.` : ''}
        type="danger"
        confirmText="Excluir"
        cancelText="Cancelar" />
    </Card>);};

export default UniversalCalendar;
