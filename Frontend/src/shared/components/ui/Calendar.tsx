/**
 * Componente Calendar - Calendário Interativo
 *
 * @description
 * Componente de calendário completo baseado em react-big-calendar que exibe
 * eventos em múltiplas visualizações (mês, semana, dia, agenda). Suporta
 * interações como seleção de eventos, seleção de slots temporais e
 * customização de visualizações.
 *
 * Funcionalidades principais:
 * - Múltiplas visualizações (mês, semana, dia, agenda)
 * - Suporte a eventos com recurso customizado
 * - Seleção de eventos e slots
 * - Internacionalização em português brasileiro
 * - Customização de altura e classes CSS
 *
 * @module components/ui/Calendar
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import Calendar, { CalendarEvent } from '@/shared/components/ui/Calendar';
 *
 * const events: CalendarEvent[] = [
 *   {
 *     title: 'Reunião',
 *     start: new Date(2024, 0, 1, 10, 0),
 *     end: new Date(2024, 0, 1, 11, 0),
 *     resource: { id: 1, type: 'meeting' }
 *   }
 * ];
 *
 * <Calendar
 *   events={ events }
 *   defaultView={ Views.MONTH }
 *   selectable
 * / />
 * ```
 */

import React from "react";
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar as BigCalendar, dateFnsLocalizer, Views,  } from 'react-big-calendar';

/**
 * Configuração de locales para date-fns
 *
 * @constant
 * @type {Record<string, Locale>}
 */
const locales = {
  "pt-BR": ptBR,};

/**
 * Localizador para react-big-calendar usando date-fns
 *
 * @constant
 * @type {DateLocalizer}
 */
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

/**
 * Interface de evento de calendário
 *
 * @description
 * Estrutura de um evento que pode ser exibido no calendário.
 *
 * @interface CalendarEvent
 * @property {string} title - Título do evento
 * @property {Date} start - Data/hora de início
 * @property {Date} end - Data/hora de término
 * @property {boolean} [allDay] - Se o evento é de dia inteiro (opcional)
 * @property {any} [resource] - Recurso customizado associado ao evento (opcional)
 *
 * @example
 * ```ts
 * const event: CalendarEvent ={ *   title: 'Reunião',
 *   start: new Date('2024-01-01T10:00:00'),
 *   end: new Date('2024-01-01T11:00:00'),
 *   allDay: false,
 *   resource: { id: 1, type: 'meeting'  }
 *};

 * ```
 */
export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: string; }

/**
 * Props do componente Calendar
 *
 * @description
 * Propriedades que podem ser passadas para o componente Calendar.
 *
 * @interface CalendarProps
 * @property {CalendarEvent[]} events - Array de eventos a serem exibidos
 * @property {string} [className] - Classes CSS adicionais (opcional)
 * @property {number | string} [height] - Altura do calendário em pixels ou CSS (opcional, padrão: 600)
 * @property {Array<typeof Views[keyof typeof Views]> | boolean} [views] - Visualizações disponíveis (opcional)
 * @property {typeof Views[keyof typeof Views]} [defaultView] - Visualização padrão (opcional)
 * @property {boolean} [selectable] - Se permite seleção de slots temporais (opcional)
 * @property {(event: CalendarEvent) => void} [onSelectEvent] - Callback ao selecionar evento (opcional)
 * @property {(slotInfo: { start: Date; end: Date; slots: Date[] }) => void} [onSelectSlot] - Callback ao selecionar slot (opcional)
 *
 * @example
 * ```tsx
 * const props: CalendarProps = {
 *   events: myEvents,
 *   defaultView: Views.MONTH,
 *   selectable: true,
 *   onSelectEvent: (event: unknown) => handleEventClick(event)
 *};

 * ```
 */
export interface CalendarProps {
  events: CalendarEvent[];
  className?: string;
  height?: number | string;
  views?: Array<(typeof Views)[keyof typeof Views]> | boolean;
  defaultView?: (typeof Views)[keyof typeof Views];
  selectable?: boolean;
  onSelectEvent??: (e: any) => void;
  onSelectSlot??: (e: any) => void;
  onChange?: (e: any) => void; }) => void;
}

/**
 * Mensagens em português brasileiro para o calendário
 *
 * @constant
 * @type {Record<string, string>}
 */
const ptBrMessages = {
  allDay: "Dia inteiro",
  previous: "Anterior",
  next: "Próximo",
  today: "Hoje",
  month: "Mês",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  date: "Data",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Não há eventos neste período.",};

/**
 * Componente Calendar
 *
 * @description
 * Renderiza um calendário interativo com múltiplas visualizações e suporte
 * a eventos customizados. Utiliza react-big-calendar como base com
 * localização em português brasileiro.
 *
 * @param {CalendarProps} props - Props do componente
 * @param {CalendarEvent[]} props.events - Eventos a serem exibidos
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {number | string} [props.height=600] - Altura do calendário
 * @param {Array<typeof Views[keyof typeof Views]> | boolean} [props.views] - Visualizações disponíveis
 * @param {typeof Views[keyof typeof Views]} [props.defaultView] - Visualização padrão
 * @param {boolean} [props.selectable] - Se permite seleção de slots
 * @param {(event: CalendarEvent) => void} [props.onSelectEvent] - Callback ao selecionar evento
 * @param {(slotInfo: { start: Date; end: Date; slots: Date[] }) => void} [props.onSelectSlot] - Callback ao selecionar slot
 * @returns {JSX.Element} Componente de calendário
 *
 * @example
 * ```tsx
 * <Calendar
 *   events={ events }
 *   defaultView={ Views.MONTH }
 *   selectable
 *   onSelectEvent={ (event: unknown) => openEventDetails(event) }
 * />
 * ```
 */
const Calendar: React.FC<CalendarProps> = ({ events,
  className = "",
  height = 600,
  views = [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA],
  defaultView = Views.MONTH,
  selectable,
  onSelectEvent,
  onSelectSlot,
   }) => {
  return (
        <>
      <div className={`calendar-container ${className} `} style={height } >
      </div><BigCalendar
        localizer={ localizer }
        events={ events }
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        allDayAccessor="allDay"
        views={ views as typeof Views }
        defaultView={ defaultView }
        messages={ ptBrMessages as Record<string, string> }
        selectable={ selectable }
        onSelectEvent={ onSelectEvent }
        onSelectSlot={ onSelectSlot } />
    </div>);};

export default Calendar;
