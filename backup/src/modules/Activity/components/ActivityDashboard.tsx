/**
 * Dashboard principal do módulo Activity
 * Layout principal que integra todos os subcomponentes
 */

import React from 'react';
import { useActivity } from '../hooks';
import { ActivityStats } from './ActivityStats';
import { ActivityFilters } from './ActivityFilters';
import { ActivityList } from './ActivityList';
import { ActivityActions } from './ActivityActions';
import { ActivityBreadcrumbs } from './ActivityBreadcrumbs';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Activity } from 'lucide-react';

interface ActivityDashboardProps {
  className?: string;
}

export const ActivityDashboard: React.FC<ActivityDashboardProps> = ({ className }) => {
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
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar atividades"
        description={error}
        onRetry={fetchEntities}
      />
    );
  }

  return (
    <div className={`activity-dashboard space-y-6 ${className || ''}`}>
      {/* Breadcrumbs */}
      <ActivityBreadcrumbs />
      
      {/* Stats */}
      <ActivityStats />
      
      {/* Filters */}
      <ActivityFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />
      
      {/* Bulk Actions */}
      {hasSelection && (
        <ActivityActions
          selectedCount={selectedIds.length}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
        />
      )}
      
      {/* Content */}
      {!hasEntities ? (
        <EmptyState
          title="Nenhuma atividade encontrada"
          description="As atividades aparecerão aqui conforme forem executadas"
          actionLabel="Recarregar"
          onAction={fetchEntities}
          icon={<Activity className="h-16 w-16 text-gray-300" />}
        />
      ) : (
        <ActivityList
          logs={logs}
          loading={loading}
          selectedIds={selectedIds}
          onLogSelect={handleEntitySelect}
        />
      )}
    </div>
  );
};

export default ActivityDashboard;
