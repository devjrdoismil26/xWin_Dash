/**
 * Componente ScheduleCalendar
 *
 * @description
 * Componente de calendário para visualizar e gerenciar agendamentos de posts sociais.
 * Exibe eventos agendados em uma visualização mensal interativa.
 *
 * @module modules/SocialBuffer/Schedules/components/ScheduleCalendar
 * @since 1.0.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useSchedulesStore } from '@/hooks/useSchedulesStore';
import { CalendarEvent } from '@/services/schedulesService';
import { SocialPlatform } from '@/types/socialTypes';
import { cn } from '@/lib/utils';

/**
 * Props do componente ScheduleCalendar
 *
 * @interface ScheduleCalendarProps
 * @property {string} [className] - Classes CSS adicionais (opcional)
 */
interface ScheduleCalendarProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Nomes dos meses em português
 */
const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

/**
 * Nomes dos dias da semana em português
 */
const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/**
 * Cores por plataforma
 */
const PLATFORM_COLORS: Record<SocialPlatform, string> = {
  facebook: 'bg-blue-500',
  instagram: 'bg-pink-500',
  twitter: 'bg-sky-500',
  linkedin: 'bg-blue-600',
  youtube: 'bg-red-500',
  tiktok: 'bg-black',
  pinterest: 'bg-red-600'};

/**
 * Componente ScheduleCalendar
 *
 * @description
 * Renderiza um calendário mensal com eventos agendados de posts sociais.
 *
 * @param {ScheduleCalendarProps} props - Props do componente
 * @returns {JSX.Element} Componente de calendário
 *
 * @example
 * ```tsx
 * <ScheduleCalendar / />
 * ```
 */
const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ className = ''    }) => {
  const { calendarEvents, fetchCalendarEvents, loading } = useSchedulesStore();

  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Calcular primeiro e último dia do mês atual
  const monthStart = useMemo(() => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    return date;
  }, [currentDate]);

  const monthEnd = useMemo(() => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    return date;
  }, [currentDate]);

  // Buscar eventos do calendário quando o mês muda
  useEffect(() => {
    const dateFrom = monthStart.toISOString().split('T')[0];
    const dateTo = monthEnd.toISOString().split('T')[0];
    fetchCalendarEvents(dateFrom, dateTo);

  }, [monthStart, monthEnd, fetchCalendarEvents]);

  // Gerar dias do calendário
  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = [] as unknown[];
    const startDate = new Date(monthStart);

    startDate.setDate(startDate.getDate() - startDate.getDay()); // Começar no domingo

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);

      date.setDate(startDate.getDate() + i);

      days.push(date);

    }

    return days;
  }, [monthStart]);

  // Agrupar eventos por data
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {} as any;
    calendarEvents.forEach((event: unknown) => {
      const dateKey = event.start.split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [] as unknown[];
      }
      grouped[dateKey].push(event);

    });

    return grouped;
  }, [calendarEvents]);

  // Navegação
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));};

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));};

  const goToToday = () => {
    setCurrentDate(new Date());

    setSelectedDate(null);};

  // Verificar se uma data está no mês atual
  const isCurrentMonth = (date: Date | null): boolean => {
    if (!date) return false;
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();};

  // Verificar se uma data é hoje
  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();

    return (
              date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear());};

  // Verificar se uma data está selecionada
  const isSelected = (date: Date | null): boolean => {
    if (!date || !selectedDate) return false;
    return (
              date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear());};

  // Obter eventos de uma data
  const getDateEvents = (date: Date | null): CalendarEvent[] => {
    if (!date) return [];
    const dateKey = date.toISOString().split('T')[0];
    return eventsByDate[dateKey] || [];};

  // Obter eventos da data selecionada
  const selectedDateEvents = selectedDate ? getDateEvents(selectedDate) : [];

  return (
        <>
      <Card className={cn('p-6', className) } />
      <Card.Header />
        <div className=" ">$2</div><Card.Title className="flex items-center" />
            <CalendarIcon className="w-5 h-5 mr-2" />
            Calendário de Agendamentos
          </Card.Title>
          <div className=" ">$2</div><Button onClick={goToToday} variant="secondary" size="sm" />
              Hoje
            </Button>
            <Button onClick={goToPreviousMonth} variant="secondary" size="sm" />
              <ChevronLeft className="w-4 h-4" /></Button><Button onClick={goToNextMonth} variant="secondary" size="sm" />
              <ChevronRight className="w-4 h-4" /></Button></div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2" />
          {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
        </p>
      </Card.Header>

      <Card.Content />
        {loading ? (
          <div className=" ">$2</div><LoadingSpinner size="md" / />
          </div>
        ) : (
          <>
            {/* Cabeçalho dos dias da semana */}
            <div className="{(WEEK_DAYS || []).map((day: unknown) => (">$2</div>
                <div
                  key={ day }
                  className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
            {day}
          </div>
              ))}
            </div>

            {/* Grid do calendário */}
            <div className="{(calendarDays || []).map((date: unknown, index: unknown) => {">$2</div>
                const events = getDateEvents(date);

                const inCurrentMonth = isCurrentMonth(date);

                const isTodayDate = isToday(date);

                const isSelectedDate = isSelected(date);

                return (
                          <button
                    key={ index }
                    onClick={ () => date && setSelectedDate(date) }
                    className={cn(
                      'relative min-h-[80px] p-2 rounded-lg border transition-colors text-left',
                      'hover:bg-gray-50 dark:hover:bg-gray-800',
                      !inCurrentMonth && 'opacity-40',
                      isTodayDate && 'ring-2 ring-blue-500',
                      isSelectedDate && 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                    )} disabled={ !date  }>
                    { date && (
                      <>
                        <div
                          className={cn(
                            'text-sm font-medium mb-1',
                            isTodayDate && 'text-blue-600 dark:text-blue-400',
                            !inCurrentMonth && 'text-gray-400'
                          )  }>
        </div>{date.getDate()}
                        </div>
                        <div className="{events.slice(0, 2).map((event: unknown) => (">$2</div>
                            <div
                              key={ event.id }
                              className={cn(
                                'text-xs px-1.5 py-0.5 rounded truncate',
                                PLATFORM_COLORS[event.platform] || 'bg-gray-500',
                                'text-white'
                              )} title={`${event.title} - ${new Date(event.start).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}`}>
           
        </div>{new Date(event.start).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          ))}
                          {events.length > 2 && (
                            <div className="+{events.length - 2} mais">$2</div>
    </div>
  )}
                        </div>
      </>
    </>
  )}
                  </button>);

              })}
            </div>

            {/* Eventos da data selecionada */}
            {selectedDate && (
              <div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4" />
                  Eventos em {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
                {selectedDateEvents.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4" />
                    Nenhum evento agendado para esta data
                  </p>
                ) : (
                  <div className="{(selectedDateEvents || []).map((event: unknown) => (">$2</div>
                      <div
                        key={ event.id }
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
           
        </div><div className=" ">$2</div><div className=" ">$2</div><div
                              className={cn(
                                'w-3 h-3 rounded-full',
                                PLATFORM_COLORS[event.platform] || 'bg-gray-500'
                              ) } />
           
        </div><h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4></div><span
                            className={cn(
                              'text-xs px-2 py-1 rounded',
                              event.status === 'published'
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                : event.status === 'failed'
                                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            )  }>
        </span>{event.status === 'published'
                              ? 'Publicado'
                              : event.status === 'failed'
                              ? 'Falhou'
                              : 'Agendado'}
                          </span></div><div className=" ">$2</div><div className=" ">$2</div><Clock className="w-4 h-4 mr-1" />
                            {new Date(event.start).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <span>{event.account_name}</span>
                        </div>
                        {event.content_preview && (
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2" />
                            {event.content_preview}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Card.Content>
    </Card>);};

export default ScheduleCalendar;
