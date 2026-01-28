import React, { useCallback, useEffect } from 'react';
import { Share } from 'lucide-react';
import UniversalCalendar, { type CalendarEvent } from '@/components/calendar/UniversalCalendar.tsx';
import { useCalendarState, useCalendarAPI, useCalendarExport } from '@/hooks/useCalendar.tsx';

export interface SocialBufferCalendarAdapterProps {
  onCreatePost?: () => void;
  onEditPost?: (post: any) => void;
  refreshTrigger?: number;
}

const SocialBufferCalendarAdapter: React.FC<SocialBufferCalendarAdapterProps> = ({ onCreatePost, onEditPost, refreshTrigger }) => {
  const { events, setEvents, moveEvent, removeEvent } = useCalendarState();
  const { loading, fetchEvents, updateEvent: apiUpdateEvent, deleteEvent: apiDeleteEvent } = useCalendarAPI(
    '/api/social-buffer/schedules',
  );
  const { exportToCSV } = useCalendarExport();

  const transformPostToEvent = useCallback((post: any): CalendarEvent => {
    const date = post?.scheduled_for || post?.scheduled_at || post?.date || Date.now();
    return {
      id: post.id,
      title: (post.content?.substring(0, 50) || 'Post') + (post.content?.length > 50 ? '...' : ''),
      start: new Date(date),
      end: new Date(date),
      status: post.status,
      category: 'post',
      platform: post.platform,
      resource: post,
    };
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchEvents();
        const transformed = (data || []).map(transformPostToEvent);
        setEvents(transformed);
      } catch (error) {
        console.error('Erro ao carregar posts agendados:', error);
        setEvents([]);
      }
    };
    loadPosts();
  }, [fetchEvents, transformPostToEvent, setEvents, refreshTrigger]);

  const socialBufferConfig = {
    title: 'Agendamento de Posts',
    icon: Share,
    allowCreate: true,
    allowEdit: true,
    allowDragDrop: true,
  } as const;

  const handleEventSelect = useCallback((event: CalendarEvent) => onEditPost?.(event.resource), [onEditPost]);

  const handleEventDrop = useCallback(
    async (event: CalendarEvent, start: Date, end: Date) => {
      try {
        await apiUpdateEvent(event.resource.id, { scheduled_for: start });
        moveEvent(event.id, start, end);
      } catch (error) {
        console.error('Erro ao reagendar post:', error);
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
        console.error('Erro ao excluir post:', error);
      }
    },
    [apiDeleteEvent, removeEvent],
  );

  const handleCreate = useCallback(() => onCreatePost?.(), [onCreatePost]);
  const handleExport = useCallback((list: CalendarEvent[]) => exportToCSV(list, 'posts-sociais.csv'), [exportToCSV]);

  return (
    <UniversalCalendar
      events={events}
      config={socialBufferConfig}
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

export default SocialBufferCalendarAdapter;
