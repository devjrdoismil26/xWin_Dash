import React from 'react';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: unknown;
}

export interface CalendarProps {
  events: CalendarEvent[];
  className?: string;
  height?: number | string;
  views?: Array<typeof Views[keyof typeof Views]> | boolean;
  defaultView?: typeof Views[keyof typeof Views];
  selectable?: boolean;
  onSelectEvent?: (event: CalendarEvent) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date; slots: Date[] }) => void;
}

const ptBrMessages = {
  allDay: 'Dia inteiro',
  previous: 'Anterior',
  next: 'Próximo',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Não há eventos neste período.',
};

const Calendar: React.FC<CalendarProps> = ({
  events,
  className = '',
  height = 600,
  views = [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA],
  defaultView = Views.MONTH,
  selectable,
  onSelectEvent,
  onSelectSlot,
}) => {
  return (
    <div className={`calendar-container ${className}`} style={{ height }}>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        allDayAccessor="allDay"
        views={views as any}
        defaultView={defaultView as any}
        messages={ptBrMessages as unknown as Record<string, string>}
        selectable={selectable}
        onSelectEvent={onSelectEvent as ((e: any) => void) | undefined}
        onSelectSlot={onSelectSlot as ((s: any) => void) | undefined}
      />
    </div>
  );
};

export default Calendar;
