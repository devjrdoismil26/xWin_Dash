import React, { useCallback, useMemo, useState } from 'react';

import { Clock, Plus, Filter, Download } from 'lucide-react';
import Calendar, { CalendarEvent as _CalendarEvent } from '@/components/ui/Calendar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  status?: string;
  platform?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  resource?: any;
}

export interface UniversalCalendarConfig {
  title?: string;
  height?: number;
  defaultView?: 'month' | 'week' | 'day' | 'agenda';
  filterOptions?: Array<{ label: string; value: string; type: 'status' | 'platform' | 'category' | 'priority' }>;
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
  onCreate?: () => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (event: CalendarEvent) => Promise<void> | void;
  onExport?: (events: CalendarEvent[]) => void;
  onEventSelect?: (event: CalendarEvent) => void;
  onEventDrop?: (event: CalendarEvent, start: Date, end: Date) => Promise<void> | void;
}

const UniversalCalendar: React.FC<UniversalCalendarProps> = ({
  events,
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
    return events.filter((e) =>
      Object.entries(filters).every(([key, value]) => (value ? String((e as any)[key]) === value : true)),
    );
  }, [events, filters]);

  const totals = useMemo(() => {
    const today = moment().startOf('day');
    const thisWeek = moment().startOf('week');
    const thisMonth = moment().startOf('month');
    return {
      total: filteredEvents.length,
      today: filteredEvents.filter((e) => moment(e.start).isSame(today, 'day')).length,
      thisWeek: filteredEvents.filter((e) => moment(e.start).isSame(thisWeek, 'week')).length,
      thisMonth: filteredEvents.filter((e) => moment(e.start).isSame(thisMonth, 'month')).length,
    };
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

    return { backgroundColor, borderColor, borderRadius: '6px', color: 'white', fontSize: '11px', padding: '2px 4px', fontWeight: '500' };
  }, []);

  const DefaultEventComponent = useCallback(({ event }: { event: CalendarEvent }) => (
    <div className="text-xs">
      <div className="font-medium truncate">{event.title}</div>
      <div className="text-xs opacity-75 flex items-center gap-1">
        {event.category && (
          <Badge variant="secondary" className="text-xs px-1">
            {event.category}
          </Badge>
        )}
        {event.status && <span className="text-xs">{event.status}</span>}
      </div>
    </div>
  ), []);

  const handleEventSelect = useCallback(
    (event: CalendarEvent) => {
      onEventSelect?.(event);
    },
    [onEventSelect],
  );

  const handleSlotSelect = useCallback(() => {
    onCreate?.();
  }, [onCreate]);

  const handleEventDrop = useCallback(
    async (event: CalendarEvent, start: Date, end: Date) => {
      await onEventDrop?.(event, start, end);
    },
    [onEventDrop],
  );

  const handleFilterChange = (key: string, value: string) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <Card>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {config.icon && <config.icon className="w-5 h-5 text-blue-600" />}
          <h2 className="text-lg font-semibold">{config.title || 'Calendário'}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{totals.total} itens</span>
          </div>
          {onExport && (
            <Button variant="outline" size="sm" onClick={() => onExport(filteredEvents)}>
              <Download className="w-4 h-4 mr-1" /> Exportar
            </Button>
          )}
          {onCreate && (
            <Button onClick={onCreate} size="sm">
              <Plus className="w-4 h-4 mr-1" /> Novo
            </Button>
          )}
        </div>
      </div>

      <div className="px-4">
        {config.filterOptions && config.filterOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            <Filter className="w-4 h-4 text-gray-500 mt-1" />
            {config.filterOptions.map((filter) => (
              <select
                key={filter.value}
                value={filters[filter.value] || ''}
                onChange={(e) => handleFilterChange(filter.value, e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="">Todos {filter.label}</option>
              </select>
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">Carregando eventos...</p>
            </div>
          </div>
        ) : (
          <Calendar
            events={filteredEvents}
            height={config.height || 600}
            onSelectEvent={handleEventSelect}
            onSelectSlot={handleSlotSelect as any}
            selectable={config.allowCreate}
            views={['month', 'week', 'day', 'agenda']}
            defaultView={view as any}
            eventPropGetter={config.eventStyleGetter || defaultEventStyleGetter}
            components={{ event: config.eventComponent || (DefaultEventComponent as any) }}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={async () => {
          if (deleteEvent && onDelete) await onDelete(deleteEvent);
          setIsDeleteModalOpen(false);
          setDeleteEvent(null);
        }}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        text={deleteEvent ? `Deseja excluir "${deleteEvent.title}"? Esta ação não pode ser desfeita.` : ''}
        type="danger"
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </Card>
  );
};

export default UniversalCalendar;
