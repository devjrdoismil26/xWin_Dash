import React, { useCallback, useEffect } from 'react';
import { Package } from 'lucide-react';
import UniversalCalendar, { type CalendarEvent } from '@/components/calendar/UniversalCalendar.tsx';
import { useCalendarState, useCalendarAPI, useCalendarExport } from '@/hooks/useCalendar.tsx';

export interface ProductsCalendarAdapterProps {
  onCreateProduct?: () => void;
  onEditProduct?: (product: any) => void;
  refreshTrigger?: number;
}

const ProductsCalendarAdapter: React.FC<ProductsCalendarAdapterProps> = ({ onCreateProduct, onEditProduct, refreshTrigger }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();
  const { loading, fetchEvents, updateEvent: apiUpdateEvent, deleteEvent: apiDeleteEvent } = useCalendarAPI(
    '/api/products',
  );
  const { exportToCSV } = useCalendarExport();

  const transformProductToEvent = useCallback((product: any): CalendarEvent => {
    const date = product?.scheduled_for || product?.scheduled_at || product?.release_date || product?.date || Date.now();
    return {
      id: product.id,
      title: product.name || 'Produto',
      start: new Date(date),
      end: new Date(date),
      status: product.status,
      category: 'product',
      resource: product,
    };
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchEvents();
        const transformed = (data || []).map(transformProductToEvent);
        setEvents(transformed);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setEvents([]);
      }
    };
    loadProducts();
  }, [fetchEvents, transformProductToEvent, setEvents, refreshTrigger]);

  const productsConfig = {
    title: 'Calendário de Produtos',
    icon: Package,
    allowCreate: true,
    allowEdit: true,
    allowDragDrop: true,
  } as const;

  const handleEventSelect = useCallback((event: CalendarEvent) => onEditProduct?.(event.resource), [onEditProduct]);

  const handleEventDrop = useCallback(
    async (event: CalendarEvent, start: Date, end: Date) => {
      try {
        await apiUpdateEvent(event.resource.id, { scheduled_for: start });
        moveEvent(event.id, start, end);
      } catch (error) {
        console.error('Erro ao reagendar produto:', error);
      }
    },
    [apiUpdateEvent, moveEvent],
  );

  const handleEventDelete = useCallback(
    async (event: CalendarEvent) => {
      try {
        await apiDeleteEvent(event.resource.id);
        removeEvent(event.id);
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    },
    [apiDeleteEvent, removeEvent],
  );

  const handleCreate = useCallback(() => onCreateProduct?.(), [onCreateProduct]);
  const handleExport = useCallback((list: CalendarEvent[]) => exportToCSV(list, 'produtos.csv'), [exportToCSV]);

  return (
    <UniversalCalendar
      events={events}
      config={productsConfig}
      loading={loading}
      onEventSelect={handleEventSelect}
      onEventDrop={handleEventDrop}
      onCreate={handleCreate}
      onEdit={handleEventSelect}
      onDelete={handleEventDelete}
      onExport={handleExport}
    />
  );
};

export default ProductsCalendarAdapter;
