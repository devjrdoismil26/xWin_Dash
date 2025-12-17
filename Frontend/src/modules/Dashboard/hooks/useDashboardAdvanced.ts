import { useState, useCallback, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import { getErrorMessage } from '@/utils/errorHelpers';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { DashboardLayoutItem, DashboardShare, DashboardSubscription, DashboardAlert, UniverseDashboardData, WidgetDataResponse } from '../types/dashboardTypes';

/**
 * @module modules/Dashboard/hooks/useDashboardAdvanced
 * @description
 * Hook avan?ado do Dashboard.
 * 
 * Fornece recursos avan?ados do dashboard:
 * - Gerenciamento de layouts (fetch, create, update, delete, setDefault)
 * - Gerenciamento de widgets (refresh, getData)
 * - Compartilhamento de dashboard (share, getShared)
 * - Assinaturas em notifica??es (subscribe, unsubscribe)
 * - Gerenciamento de alertas (fetch, markAsRead)
 * - Dados do Universe
 * 
 * @example
 * ```typescript
 * import { useDashboardAdvanced } from './hooks/useDashboardAdvanced';
 * 
 * const AdvancedComponent = () => {
 *   const {
 *     layouts,
 *     fetchLayouts,
 *     createLayout,
 *     alerts,
 *     fetchAlerts
 *   } = useDashboardAdvanced();

 * 
 *   return <div>...</div>;
 *};

 * ```
 * 
 * @since 1.0.0
 */

interface UseDashboardAdvancedReturn {
  // Layouts
  layouts: DashboardLayoutItem[];
  currentLayout: DashboardLayoutItem | null;
  layoutsLoading: boolean;
  layoutsError: string | null;
  fetchLayouts: () => Promise<void>;
  getLayoutById: (layoutId: string) => Promise<void>;
  createLayout: (layout: DashboardLayout) => Promise<boolean>;
  updateLayout: (layoutId: string, layout: Partial<DashboardLayout>) => Promise<boolean>;
  deleteLayout: (layoutId: string) => Promise<boolean>;
  setDefaultLayout: (layoutId: string) => Promise<boolean>;
  // Widgets
  widgetData: Record<string, WidgetDataResponse>;
  widgetLoading: Record<string, boolean>;
  refreshWidget: (widgetId: string) => Promise<void>;
  refreshAllWidgets: () => Promise<void>;
  getWidgetData: (widgetId: string) => Promise<void>;
  // Sharing
  shares: DashboardShare[];
  sharesLoading: boolean;
  sharesError: string | null;
  shareDashboard: (dashboardId: string, permissions: { view: boolean;
  edit: boolean;
  export: boolean;
}, expiresAt?: string) => Promise<boolean>;
  getSharedDashboard: (token: string) => Promise<DashboardData | null>;
  fetchShares: () => Promise<void>;

  // Subscriptions
  subscription: DashboardSubscription | null;
  subscriptionLoading: boolean;
  subscriptionError: string | null;
  subscribeToDashboard: (notificationTypes: string[], frequency: string) => Promise<boolean>;
  unsubscribeFromDashboard: () => Promise<boolean>;
  fetchSubscription: () => Promise<void>;

  // Alerts
  alerts: DashboardAlert[];
  alertsLoading: boolean;
  alertsError: string | null;
  unreadAlertsCount: number;
  fetchAlerts: () => Promise<void>;
  markAlertAsRead: (alertId: string) => Promise<boolean>;
  markAllAlertsAsRead: () => Promise<boolean>;

  // Universe
  universeData: UniverseDashboardData | null;
  universeLoading: boolean;
  universeError: string | null;
  fetchUniverseData: () => Promise<void>;

  // Utility
  refreshAll: () => Promise<void>;
}

export const useDashboardAdvanced = (): UseDashboardAdvancedReturn => {
  // Layouts State
  const [layouts, setLayouts] = useState<DashboardLayoutItem[]>([]);

  const [currentLayout, setCurrentLayout] = useState<DashboardLayoutItem | null>(null);

  const [layoutsLoading, setLayoutsLoading] = useState(false);

  const [layoutsError, setLayoutsError] = useState<string | null>(null);

  // Widgets State
  const [widgetData, setWidgetData] = useState<Record<string, WidgetDataResponse>>({});

  const [widgetLoading, setWidgetLoading] = useState<Record<string, boolean>>({});

  // Sharing State
  const [shares, setShares] = useState<DashboardShare[]>([]);

  const [sharesLoading, setSharesLoading] = useState(false);

  const [sharesError, setSharesError] = useState<string | null>(null);

  // Subscriptions State
  const [subscription, setSubscription] = useState<DashboardSubscription | null>(null);

  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  // Alerts State
  const [alerts, setAlerts] = useState<DashboardAlert[]>([]);

  const [alertsLoading, setAlertsLoading] = useState(false);

  const [alertsError, setAlertsError] = useState<string | null>(null);

  // Universe State
  const [universeData, setUniverseData] = useState<UniverseDashboardData | null>(null);

  const [universeLoading, setUniverseLoading] = useState(false);

  const [universeError, setUniverseError] = useState<string | null>(null);

  // ===== LAYOUTS =====
  const fetchLayouts = useCallback(async () => {
    setLayoutsLoading(true);

    setLayoutsError(null);

    try {
      const response = await dashboardService.getLayouts();

      if (response.success) {
        setLayouts(response.data || []);

      } else {
        setLayoutsError(response.error || 'Erro ao carregar layouts');

      } catch (error: unknown) {
      setLayoutsError(getErrorMessage(error));

    } finally {
      setLayoutsLoading(false);

    } , []);

  const getLayoutById = useCallback(async (layoutId: string) => {
    setLayoutsLoading(true);

    setLayoutsError(null);

    try {
      const response = await dashboardService.getLayoutById(layoutId);

      if (response.success) {
        setCurrentLayout(response.data);

      } else {
        setLayoutsError(response.error || 'Erro ao carregar layout');

      } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      setLayoutsError(errorMessage);

    } finally {
      setLayoutsLoading(false);

    } , []);

  const createLayout = useCallback(async (layout: DashboardLayout): Promise<boolean> => {
    try {
      const response = await dashboardService.createLayout(layout);

      if (response.success) {
        await fetchLayouts();

        return true;
      }
      return false;
    } catch (error) {
      return false;
    } , [fetchLayouts]);

  const updateLayout = useCallback(async (layoutId: string, layout: Partial<DashboardLayout>): Promise<boolean> => {
    try {
      const response = await dashboardService.updateLayoutById(layoutId, layout);

      if (response.success) {
        await fetchLayouts();

        return true;
      }
      return false;
    } catch (error) {
      return false;
    } , [fetchLayouts]);

  const deleteLayout = useCallback(async (layoutId: string): Promise<boolean> => {
    try {
      const response = await dashboardService.deleteLayoutById(layoutId);

      if (response.success) {
        await fetchLayouts();

        return true;
      }
      return false;
    } catch (error) {
      return false;
    } , [fetchLayouts]);

  const setDefaultLayout = useCallback(async (layoutId: string): Promise<boolean> => {
    try {
      const response = await dashboardService.setDefaultLayout(layoutId);

      if (response.success) {
        await fetchLayouts();

        return true;
      }
      return false;
    } catch (error) {
      return false;
    } , [fetchLayouts]);

  // ===== WIDGETS =====
  const getWidgetData = useCallback(async (widgetId: string) => {
    setWidgetLoading(prev => ({ ...prev, [widgetId]: true }));

    try {
      const response = await dashboardService.getWidgetData(widgetId);

      if (response.success) {
        setWidgetData(prev => ({
          ...prev,
          [widgetId]: (response as any).data
        }));

      } catch (error) {
      console.error(`Erro ao carregar dados do widget ${widgetId}:`, error);

    } finally {
      setWidgetLoading(prev => ({ ...prev, [widgetId]: false }));

    } , []);

  const refreshWidget = useCallback(async (widgetId: string) => {
    setWidgetLoading(prev => ({ ...prev, [widgetId]: true }));

    try {
      const response = await dashboardService.refreshWidget(widgetId);

      if (response.success) {
        setWidgetData(prev => ({
          ...prev,
          [widgetId]: (response as any).data
        }));

      } catch (error) {
      console.error(`Erro ao atualizar widget ${widgetId}:`, error);

    } finally {
      setWidgetLoading(prev => ({ ...prev, [widgetId]: false }));

    } , []);

  const refreshAllWidgets = useCallback(async () => {
    const widgetIds = Object.keys(widgetData);

    await Promise.all(widgetIds.map(widgetId => refreshWidget(widgetId)));

  }, [widgetData, refreshWidget]);

  // ===== SHARING =====
  const shareDashboard = useCallback(async (
    dashboardId: string, 
    permissions: { view: boolean; edit: boolean; export: boolean }, 
    expiresAt?: string
  ): Promise<boolean> => {
    try {
      const response = await dashboardService.shareDashboard(dashboardId, permissions, expiresAt);

      if (response.success) {
        await fetchShares();

        return true;
      }
      return false;
    } catch (error) {
      return false;
    } , []);

  const getSharedDashboard = useCallback(async (token: string) => {
    try {
      const response = await dashboardService.getSharedDashboard(token);

      return (response as any).success ? (response as any).data : null;
    } catch (error) {
      return null;
    } , []);

  const fetchShares = useCallback(async () => {
    setSharesLoading(true);

    setSharesError(null);

    try {
      // Note: This endpoint might need to be implemented in the backend
      // For now, we'll use a placeholder
      setShares([]);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      setSharesError(errorMessage);

    } finally {
      setSharesLoading(false);

    } , []);

  // ===== SUBSCRIPTIONS =====
  const subscribeToDashboard = useCallback(async (
    notificationTypes: string[], 
    frequency: string
  ): Promise<boolean> => {
    try {
      const response = await dashboardService.subscribeToDashboard(
        notificationTypes, 
        frequency as 'realtime' | 'hourly' | 'daily' | 'weekly');

      if (response.success) {
        await fetchSubscription();

        return true;
      }
      return false;
    } catch (error) {
      return false;
    } , []);

  const unsubscribeFromDashboard = useCallback(async (): Promise<boolean> => {
    try {
      const response = await dashboardService.unsubscribeFromDashboard();

      if (response.success) {
        setSubscription(null);

        return true;
      }
      return false;
    } catch (error) {
      return false;
    } , []);

  const fetchSubscription = useCallback(async () => {
    setSubscriptionLoading(true);

    setSubscriptionError(null);

    try {
      // Note: This endpoint might need to be implemented in the backend
      // For now, we'll use a placeholder
      setSubscription(null);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      setSubscriptionError(errorMessage);

    } finally {
      setSubscriptionLoading(false);

    } , []);

  // ===== ALERTS =====
  const fetchAlerts = useCallback(async () => {
    setAlertsLoading(true);

    setAlertsError(null);

    try {
      const response = await dashboardService.getAlerts();

      if (response.success) {
        setAlerts(response.data || []);

      } else {
        setAlertsError(response.error || 'Erro ao carregar alertas');

      } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      setAlertsError(errorMessage);

    } finally {
      setAlertsLoading(false);

    } , []);

  const markAlertAsRead = useCallback(async (alertId: string): Promise<boolean> => {
    try {
      const response = await dashboardService.markAlertAsRead(alertId);

      if (response.success) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId ? { ...alert, is_read: true, read_at: new Date().toISOString() } : alert
        ));

        return true;
      }
      return false;
    } catch (error) {
      return false;
    } , []);

  const markAllAlertsAsRead = useCallback(async (): Promise<boolean> => {
    try {
      const response = await dashboardService.markAllAlertsAsRead();

      if (response.success) {
        setAlerts(prev => prev.map(alert => ({ 
          ...alert, 
          is_read: true, 
          read_at: new Date().toISOString()
  })));

        return true;
      }
      return false;
    } catch (error) {
      return false;
    } , []);

  // ===== UNIVERSE =====
  const fetchUniverseData = useCallback(async () => {
    setUniverseLoading(true);

    setUniverseError(null);

    try {
      const response = await dashboardService.getUniverseData();

      if (response.success) {
        setUniverseData(response.data);

      } else {
        setUniverseError(response.error || 'Erro ao carregar dados do Universe');

      } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      setUniverseError(errorMessage);

    } finally {
      setUniverseLoading(false);

    } , []);

  // ===== UTILITY =====
  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchLayouts(),
      fetchAlerts(),
      fetchUniverseData(),
      refreshAllWidgets()
    ]);

  }, [fetchLayouts, fetchAlerts, fetchUniverseData, refreshAllWidgets]);

  // ===== EFFECTS =====
  useEffect(() => {
    fetchLayouts();

    fetchAlerts();

    fetchUniverseData();

  }, [fetchLayouts, fetchAlerts, fetchUniverseData]);

  // Calculate unread alerts count
  const unreadAlertsCount = alerts.filter(alert => !alert.is_read).length;

  return {
    // Layouts
    layouts,
    currentLayout,
    layoutsLoading,
    layoutsError,
    fetchLayouts,
    getLayoutById,
    createLayout,
    updateLayout,
    deleteLayout,
    setDefaultLayout,

    // Widgets
    widgetData,
    widgetLoading,
    refreshWidget,
    refreshAllWidgets,
    getWidgetData,

    // Sharing
    shares,
    sharesLoading,
    sharesError,
    shareDashboard,
    getSharedDashboard,
    fetchShares,

    // Subscriptions
    subscription,
    subscriptionLoading,
    subscriptionError,
    subscribeToDashboard,
    unsubscribeFromDashboard,
    fetchSubscription,

    // Alerts
    alerts,
    alertsLoading,
    alertsError,
    unreadAlertsCount,
    fetchAlerts,
    markAlertAsRead,
    markAllAlertsAsRead,

    // Universe
    universeData,
    universeLoading,
    universeError,
    fetchUniverseData,

    // Utility
    refreshAll};
};

export default useDashboardAdvanced;
