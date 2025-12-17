/**
 * Adapter de Calendário - Produtos
 *
 * @description
 * Componente adapter que conecta o calendário universal com dados de produtos.
 *
 * @module components/calendar/adapters/ProductsCalendarAdapter
 * @since 1.0.0
 */

import React, { useCallback, useEffect } from "react";
import { Package } from 'lucide-react';
import UniversalCalendar, {
  type CalendarEvent,
} from "@/shared/components/calendar/UniversalCalendar";
import { useCalendarState, useCalendarAPI, useCalendarExport,  } from '@/hooks/useCalendar';

/**
 * Interface de produto para transformação
 */
interface ProductData {
  id: string | number;
  name?: string;
  scheduled_for?: string;
  scheduled_at?: string;
  release_date?: string;
  date?: string | number;
  status?: string;
  [key: string]: unknown; }

/**
 * Interface de props do adapter de produtos
 */
export interface ProductsCalendarAdapterProps {
  onCreateProduct???: (e: any) => void;
  onEditProduct??: (e: any) => void;
  refreshTrigger?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente adapter de calendário para produtos
 */
const ProductsCalendarAdapter: React.FC<ProductsCalendarAdapterProps> = ({ onCreateProduct,
  onEditProduct,
  refreshTrigger,
   }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();

  const {
    loading,
    fetchEvents,
    updateEvent: apiUpdateEvent,
    deleteEvent: apiDeleteEvent,
  } = useCalendarAPI("/api/products");

  const { exportToCSV } = useCalendarExport();

  /**
   * Transforma um produto em evento de calendário
   *
   * @private
   * @param {ProductData} product - Produto a ser transformado
   * @returns {CalendarEvent} Evento de calendário transformado
   */
  const transformProductToEvent = useCallback(
    (product: ProductData): CalendarEvent => {
      const date =
        product?.scheduled_for ||
        product?.scheduled_at ||
        product?.release_date ||
        product?.date ||
        Date.now();

      return {
        id: product.id,
        title: String(product.name || "Produto"),
        start: new Date(String(date)),
        end: new Date(String(date)),
        status: product.status as string | undefined,
        category: "product",
        resource: product as any,};

    },
    [],);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchEvents();

        const transformed = (data || []).map(transformProductToEvent);

        setEvents(transformed);

      } catch (error) {
        setEvents([]);

      } ;

    loadProducts();

  }, [fetchEvents, transformProductToEvent, setEvents, refreshTrigger]);

  const productsConfig = {
    title: "Calendário de Produtos",
    icon: Package,
    allowCreate: true,
    allowEdit: true,
    allowDragDrop: true,
  } as const;

  /**
   * Handler para seleção de evento
   *
   * @private
   * @param {CalendarEvent} event - Evento selecionado
   */
  const handleEventSelect = useCallback(
    (event: CalendarEvent) => {
      if (event.resource && onEditProduct) {
        onEditProduct(event.resource as ProductData);

      } ,
    [onEditProduct],);

  /**
   * Handler para drag & drop de evento
   *
   * @private
   * @param {CalendarEvent} event - Evento movido
   * @param {Date} start - Nova data de início
   * @param {Date} end - Nova data de fim
   */
  const handleEventDrop = useCallback(
    async (event: CalendarEvent, start: Date, end: Date) => {
      try {
        const resource = event.resource as ProductData;
        if (resource && "id" in resource) {
          await apiUpdateEvent(resource.id, { scheduled_for: start });

          moveEvent(event.id, start, end);

        } catch (error) {
      } ,
    [apiUpdateEvent, moveEvent],);

  /**
   * Handler para deleção de evento
   *
   * @private
   * @param {CalendarEvent} event - Evento a ser deletado
   */
  const handleEventDelete = useCallback(
    async (event: CalendarEvent) => {
      try {
        const resource = event.resource as ProductData;
        if (resource && "id" in resource) {
          await apiDeleteEvent(resource.id);

          removeEvent(event.id);

        } catch (error) {
      } ,
    [apiDeleteEvent, removeEvent],);

  const handleCreate = useCallback(
    () => onCreateProduct?.(),
    [onCreateProduct],);

  const handleExport = useCallback(
    (list: CalendarEvent[]) => exportToCSV(list, "produtos.csv"),
    [exportToCSV],);

  return (
            <UniversalCalendar
      events={ events }
      config={ productsConfig }
      loading={ loading }
      onEventSelect={ handleEventSelect }
      onEventDrop={ handleEventDrop }
      onCreate={ handleCreate }
      onEdit={ handleEventSelect }
      onDelete={ handleEventDelete }
      onExport={ handleExport }
    / />);};

export default ProductsCalendarAdapter;
