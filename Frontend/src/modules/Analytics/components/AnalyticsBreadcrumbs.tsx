// ========================================
// COMPONENTE BREADCRUMBS - ANALYTICS
// ========================================
// Componente de navegação breadcrumb para o módulo Analytics

import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { cn } from '@/lib/utils';
import { ChevronRight, Home, BarChart3, FileText, Settings, Users, Eye, Target, Calendar, Filter } from 'lucide-react';

interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<any>;
  current?: boolean; }

interface AnalyticsBreadcrumbsProps {
  items?: BreadcrumbItem[];
  onNavigate??: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const AnalyticsBreadcrumbs: React.FC<AnalyticsBreadcrumbsProps> = ({ items = [] as unknown[],
  onNavigate,
  className
   }) => {
  // Breadcrumbs padrão baseados na rota atual
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    {
      id: 'home',
      label: 'Dashboard',
      href: '/dashboard',
      icon: Home
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      current: true
    }
  ];

  // Breadcrumbs específicos baseados no contexto
  const contextBreadcrumbs: Record<string, BreadcrumbItem[]> = {
    'dashboard': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3, current: true }
    ],
    'reports': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'reports', label: 'Relatórios', href: '/analytics/reports', icon: FileText, current: true }
    ],
    'reports-detail': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'reports', label: 'Relatórios', href: '/analytics/reports', icon: FileText },
      { id: 'report-detail', label: 'Detalhes do Relatório', icon: Eye, current: true }
    ],
    'reports-create': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'reports', label: 'Relatórios', href: '/analytics/reports', icon: FileText },
      { id: 'report-create', label: 'Criar Relatório', icon: Target, current: true }
    ],
    'insights': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'insights', label: 'Insights', href: '/analytics/insights', icon: Target, current: true }
    ],
    'real-time': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'real-time', label: 'Tempo Real', href: '/analytics/real-time', icon: Eye, current: true }
    ],
    'settings': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'settings', label: 'Configurações', href: '/analytics/settings', icon: Settings, current: true }
    ],
    'filters': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'filters', label: 'Filtros', href: '/analytics/filters', icon: Filter, current: true }
    ],
    'schedule': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'schedule', label: 'Agendamentos', href: '/analytics/schedule', icon: Calendar, current: true }
    ]};

  const displayItems = items.length > 0 ? items : defaultBreadcrumbs;

  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.href && !item.current) {
      onNavigate?.(item);

    } ;

  const getItemIcon = (item: BreadcrumbItem) => {
    if (item.icon) {
      const IconComponent = item.icon;
      return <IconComponent className="h-4 w-4" />;
    }
    return null;};

  return (
        <>
      <nav className={cn("flex items-center space-x-1 text-sm", className)} aria-label="Breadcrumb" />
      <ol className="flex items-center space-x-1" />
        {(displayItems || []).map((item: unknown, index: number) => (
          <li key={item.id} className="flex items-center" />
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-1 px-2 py-1 h-auto",
                item.current 
                  ? "text-gray-900 font-medium cursor-default" 
                  : "text-gray-600 hover:text-gray-900 cursor-pointer"
              )} onClick={ () => handleItemClick(item) }
              disabled={ item.current  }>
              {getItemIcon(item)}
              <span>{item.label}</span></Button></li>
        ))}
      </ol>
    </nav>);};

// Hook para gerenciar breadcrumbs dinâmicos
export const useAnalyticsBreadcrumbs = (context: string, customItems?: BreadcrumbItem[]) => {
  const contextBreadcrumbs: Record<string, BreadcrumbItem[]> = {
    'dashboard': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3, current: true }
    ],
    'reports': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'reports', label: 'Relatórios', href: '/analytics/reports', icon: FileText, current: true }
    ],
    'reports-detail': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'reports', label: 'Relatórios', href: '/analytics/reports', icon: FileText },
      { id: 'report-detail', label: 'Detalhes do Relatório', icon: Eye, current: true }
    ],
    'reports-create': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'reports', label: 'Relatórios', href: '/analytics/reports', icon: FileText },
      { id: 'report-create', label: 'Criar Relatório', icon: Target, current: true }
    ],
    'insights': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'insights', label: 'Insights', href: '/analytics/insights', icon: Target, current: true }
    ],
    'real-time': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'real-time', label: 'Tempo Real', href: '/analytics/real-time', icon: Eye, current: true }
    ],
    'settings': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'settings', label: 'Configurações', href: '/analytics/settings', icon: Settings, current: true }
    ],
    'filters': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'filters', label: 'Filtros', href: '/analytics/filters', icon: Filter, current: true }
    ],
    'schedule': [
      { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'schedule', label: 'Agendamentos', href: '/analytics/schedule', icon: Calendar, current: true }
    ]};

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems && customItems.length > 0) {
      return customItems;
    }
    
    return contextBreadcrumbs[context] || contextBreadcrumbs['dashboard'];};

  const addBreadcrumb = (item: BreadcrumbItem): BreadcrumbItem[] => {
    const currentBreadcrumbs = getBreadcrumbs();

    const updatedBreadcrumbs = (currentBreadcrumbs || []).map(bc => ({ ...bc, current: false }));

    return [...updatedBreadcrumbs, { ...item, current: true }];};

  const removeBreadcrumb = (itemId: string): BreadcrumbItem[] => {
    const currentBreadcrumbs = getBreadcrumbs();

    return (currentBreadcrumbs || []).filter(bc => bc.id !== itemId);};

  const updateBreadcrumb = (itemId: string, updates: Partial<BreadcrumbItem>): BreadcrumbItem[] => {
    const currentBreadcrumbs = getBreadcrumbs();

    return (currentBreadcrumbs || []).map(bc => 
      bc.id === itemId ? { ...bc, ...updates } : bc);};

  return {
    breadcrumbs: getBreadcrumbs(),
    addBreadcrumb,
    removeBreadcrumb,
    updateBreadcrumb};
};

export default AnalyticsBreadcrumbs;