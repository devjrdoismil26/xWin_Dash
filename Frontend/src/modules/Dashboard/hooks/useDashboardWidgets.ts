import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services';
import { WidgetConfig, WidgetData, DashboardLayout, UseDashboardWidgetsReturn } from '../types/dashboardTypes';

export const useDashboardWidgets = () => {
  const [layout, setLayout] = useState<DashboardLayout>({
    widgets: [],
    columns: 12,
    gap: 16,
  });

  const [widgetData, setWidgetData] = useState<WidgetData>({});

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const defaultWidgets: WidgetConfig[] = [
    {
      id: 'metrics-overview',
      type: 'metrics',
      title: 'Visão Geral',
      position: { x: 0, y: 0, w: 12, h: 2 },
      visible: true,
      settings: { showGrowth: true, showTrends: true },
    },
    {
      id: 'recent-activities',
      type: 'activities',
      title: 'Atividades Recentes',
      position: { x: 0, y: 2, w: 6, h: 4 },
      visible: true,
      settings: { limit: 10, showTimestamps: true },
    },
    {
      id: 'top-leads',
      type: 'leads',
      title: 'Top Leads',
      position: { x: 6, y: 2, w: 6, h: 4 },
      visible: true,
      settings: { limit: 5, sortBy: 'score' },
    },
    {
      id: 'projects-status',
      type: 'projects',
      title: 'Status dos Projetos',
      position: { x: 0, y: 6, w: 6, h: 3 },
      visible: true,
      settings: { showProgress: true, showDeadlines: true },
    },
    {
      id: 'conversion-funnel',
      type: 'funnel',
      title: 'Funil de Conversão',
      position: { x: 6, y: 6, w: 6, h: 3 },
      visible: true,
      settings: { showPercentages: true, showValues: true },
    },
  ];

  const fetchWidgetData = useCallback(async (widgetId: string) => {
    try {
      const data = await apiClient.get(`/api/v1/dashboard/widgets/${widgetId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);

      }

      const result = await response;
      
      if (result.success) {
        setWidgetData(prev => ({
          ...prev,
          [widgetId]: result.data,
        }));

      } catch (err) {
      console.error(`Erro ao buscar dados do widget ${widgetId}:`, err);

    } , []);

  const fetchAllWidgetData = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const visibleWidgets = layout.widgets.filter(widget => widget.visible);

      const promises = visibleWidgets.map(widget => fetchWidgetData(widget.id));

      await Promise.all(promises);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);

    } finally {
      setLoading(false);

    } , [layout.widgets, fetchWidgetData]);

  const updateWidgetConfig = useCallback(async (widgetId: string, config: Partial<WidgetConfig>) => {
    try {
      const data = await apiClient.get(`/api/v1/dashboard/widgets/${widgetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);

      }

      const result = await response;
      
      if (result.success) {
        setLayout(prev => ({
          ...prev,
          widgets: prev.widgets.map(widget =>
            widget.id === widgetId ? { ...widget, ...config } : widget
          ),
        }));

      } catch (err) {
      console.error(`Erro ao atualizar widget ${widgetId}:`, err);

    } , []);

  const updateWidgetPosition = useCallback((widgetId: string, position: { x: number; y: number; w: number; h: number }) => {
    setLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, position } : widget
      ),
    }));

  }, []);

  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
      ),
    }));

  }, []);

  const addWidget = useCallback((widget: Omit<WidgetConfig, 'id'>) => {
    const newWidget: WidgetConfig = {
      ...widget,
      id: `${widget.type}-${Date.now()}`,};

    setLayout(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget],
    }));

  }, []);

  const removeWidget = useCallback((widgetId: string) => {
    setLayout(prev => ({
      ...prev,
      widgets: prev.widgets.filter(widget => widget.id !== widgetId),
    }));

    setWidgetData(prev => {
      const newData = { ...prev};

      delete newData[widgetId];
      return newData;
    });

  }, []);

  const resetLayout = useCallback(() => {
    setLayout({
      widgets: defaultWidgets,
      columns: 12,
      gap: 16,
    });

  }, []);

  const saveLayout = useCallback(async () => {
    try {
      const data = await apiClient.get('/api/v1/dashboard/layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(layout),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);

      }

      const result = await response;
      return result.success;
    } catch (err) {
      console.error('Erro ao salvar layout:', err);

      return false;
    } , [layout]);

  const loadLayout = useCallback(async () => {
    try {
      const data = await apiClient.get('/api/v1/dashboard/layout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);

      }

      const result = await response;
      
      if (result.success && result.data) {
        setLayout(result.data);

      } else {
        // Usar layout padrão se não houver layout salvo
        setLayout({
          widgets: defaultWidgets,
          columns: 12,
          gap: 16,
        });

      } catch (err) {
      console.error('Erro ao carregar layout:', err);

      // Usar layout padrão em caso de erro
      setLayout({
        widgets: defaultWidgets,
        columns: 12,
        gap: 16,
      });

    } , [defaultWidgets]);

  const getWidgetById = useCallback((widgetId: string): WidgetConfig | undefined => {
    return layout.widgets.find(widget => widget.id === widgetId);

  }, [layout.widgets]);

  const getVisibleWidgets = useCallback((): WidgetConfig[] => {
    return layout.widgets.filter(widget => widget.visible);

  }, [layout.widgets]);

  const getWidgetData = useCallback((widgetId: string): Record<string, any> | null => {
    return (widgetData[widgetId] as Record<string, any>) || null;
  }, [widgetData]);

  const refreshWidget = useCallback(async (widgetId: string) => {
    await fetchWidgetData(widgetId);

  }, [fetchWidgetData]);

  const refreshAllWidgets = useCallback(async () => {
    await fetchAllWidgetData();

  }, [fetchAllWidgetData]);

  const exportWidgetData = useCallback((widgetId: string): string => {
    const data = widgetData[widgetId];
    if (!data) return '';

    return JSON.stringify(data, null, 2);

  }, [widgetData]);

  const exportAllWidgetData = useCallback((): string => {
    return JSON.stringify(widgetData, null, 2);

  }, [widgetData]);

  useEffect(() => {
    loadLayout();

  }, [loadLayout]);

  useEffect(() => {
    if (layout.widgets.length > 0) {
      fetchAllWidgetData();

    } , [layout.widgets, fetchAllWidgetData]);

  return {
    layout,
    widgetData,
    loading,
    error,
    fetchWidgetData,
    fetchAllWidgetData,
    updateWidgetConfig,
    updateWidgetPosition,
    toggleWidgetVisibility,
    addWidget,
    removeWidget,
    resetLayout,
    saveLayout,
    loadLayout,
    getWidgetById,
    getVisibleWidgets,
    getWidgetData,
    refreshWidget,
    refreshAllWidgets,
    exportWidgetData,
    exportAllWidgetData,};
};

export default useDashboardWidgets;
