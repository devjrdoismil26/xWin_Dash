/**
 * Dashboard principal do módulo Activity
 *
 * @description
 * Componente principal que integra todos os subcomponentes do módulo Activity:
 * estatísticas, filtros, lista de atividades e ações. Gerencia estados de loading
 * e erro, e coordena interações entre componentes.
 *
 * @module modules/Activity/components/ActivityDashboard
 * @since 1.0.0
 */

import React from 'react';
import { useActivity } from '../hooks';
import { ActivityStats } from './ActivityStats';
import { ActivityFilters } from './ActivityFilters';
import { ActivityList } from './ActivityList';
import { ActivityActions } from './ActivityActions';
import { ActivityBreadcrumbs } from './ActivityBreadcrumbs';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { Activity } from 'lucide-react';

interface ActivityDashboardProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ActivityDashboard: React.FC<ActivityDashboardProps> = ({ className    }) => {
  const {
    logs,
    loading,
    error,
    filters,
    selectedIds,
    hasSelection,
    totalLogs,
    hasEntities,
    fetchEntities,
    setFilters,
    clearFilters,
    handleSelectAll,
    handleClearSelection
  } = useActivity();

  if (loading && !hasEntities) {
    return (
              <div className=" ">$2</div><LoadingSpinner size="lg" / />
      </div>);

  }

  if (error) {
    return (
              <ErrorState
        title="Erro ao carregar atividades"
        description={ error }
        onRetry={ fetchEntities }
      / />);

  }

  return (
        <>
      <div className={`activity-dashboard space-y-6 ${className || ''} `}>
      </div>{/* Breadcrumbs */}
      <ActivityBreadcrumbs>
          {/* Stats */}
      <ActivityStats>
          {/* Filters */}
      <ActivityFilters
        filters={ filters }
        onFiltersChange={ setFilters }
        onClearFilters={ clearFilters  }>
          {/* Bulk Actions */}
      {hasSelection && (
        <ActivityActions
          selectedCount={ selectedIds.length }
          onSelectAll={ handleSelectAll }
          onClearSelection={ handleClearSelection }
        / />
      )}
      
      {/* Content */}
      {!hasEntities ? (
        <EmptyState
          title="Nenhuma atividade encontrada"
          description="As atividades aparecerão aqui conforme forem executadas"
          actionLabel="Recarregar"
          onAction={ fetchEntities }
          icon={ <Activity className="h-16 w-16 text-gray-300" /> } />
      ) : (
        <ActivityList
          logs={ logs }
          loading={ loading }
          selectedIds={ selectedIds }
          onLogSelect={ handleEntitySelect }
        / />
      )}
    </div>);};

export default ActivityDashboard;
