import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';

// Lazy loading de componentes pesados
const WorkflowsDashboard = lazy(() => import('./WorkflowsDashboard'));

const WorkflowsStats = lazy(() => import('./WorkflowsStats'));

const WorkflowsFilters = lazy(() => import('./WorkflowsFilters'));

const WorkflowsList = lazy(() => import('./WorkflowsList'));

const WorkflowsGrid = lazy(() => import('./WorkflowsGrid'));

const WorkflowsActions = lazy(() => import('./WorkflowsActions'));

const WorkflowsCreateModal = lazy(() => import('./WorkflowsCreateModal'));

const WorkflowsIntegrationTest = lazy(() => import('./WorkflowsIntegrationTest'));

// Componentes de fallback
const DashboardFallback = () => (
  <div className=" ">$2</div><LoadingSpinner size="lg" / />
  </div>);

const StatsFallback = () => (
  <div className="{Array.from({ length: 4 }).map((_: unknown, index: unknown) => (">$2</div>
      <div key={index} className="h-24 bg-muted animate-pulse rounded-lg">
    </>
  ))}
        </div>
  </div>);

const FiltersFallback = () => (
  <div className="h-32 bg-muted animate-pulse rounded-lg">);

        </div>

const ListFallback = () => (
  <div className="{Array.from({ length: 5 }).map((_: unknown, index: unknown) => (">$2</div>
      <div key={index} className="h-16 bg-muted animate-pulse rounded-lg">
    </>
  ))}
        </div>
  </div>);

const GridFallback = () => (
  <div className="{Array.from({ length: 6 }).map((_: unknown, index: unknown) => (">$2</div>
      <div key={index} className="h-48 bg-muted animate-pulse rounded-lg">
    </>
  ))}
        </div>
  </div>);

const ActionsFallback = () => (
  <div className="h-20 bg-muted animate-pulse rounded-lg">);

        </div>

const ModalFallback = () => (
  <div className=" ">$2</div><div className="bg-background rounded-lg shadow-lg max-w-md w-full mx-4 h-96 animate-pulse" / />);

        </div>

const TestFallback = () => (
  <div className=" ">$2</div><div className="h-8 bg-muted animate-pulse rounded-lg w-1/3">
           
        </div><div className="{Array.from({ length: 4 }).map((_: unknown, index: unknown) => (">$2</div>
      <div key={index} className="h-20 bg-muted animate-pulse rounded-lg">
    </>
  ))}
        </div>
    </div>);

// Componentes com lazy loading e error boundaries
export const LazyWorkflowsDashboard: React.FC<Record<string, any>> = (props: unknown) => (
  <Suspense fallback={ <DashboardFallback />  }>
    <WorkflowsDashboard {...props} / />
  </Suspense>);

export const LazyWorkflowsStats: React.FC<Record<string, any>> = (props: unknown) => (
  
    <Suspense fallback={ <StatsFallback />  }>
      <WorkflowsStats {...props} / />
    </Suspense>);

export const LazyWorkflowsFilters: React.FC<Record<string, any>> = (props: unknown) => (
  
    <Suspense fallback={ <FiltersFallback />  }>
      <WorkflowsFilters {...props} / />
    </Suspense>);

export const LazyWorkflowsList: React.FC<Record<string, any>> = (props: unknown) => (
  
    <Suspense fallback={ <ListFallback />  }>
      <WorkflowsList {...props} / />
    </Suspense>);

export const LazyWorkflowsGrid: React.FC<Record<string, any>> = (props: unknown) => (
  
    <Suspense fallback={ <GridFallback />  }>
      <WorkflowsGrid {...props} / />
    </Suspense>);

export const LazyWorkflowsActions: React.FC<Record<string, any>> = (props: unknown) => (
  
    <Suspense fallback={ <ActionsFallback />  }>
      <WorkflowsActions {...props} / />
    </Suspense>);

export const LazyWorkflowsCreateModal: React.FC<Record<string, any>> = (props: unknown) => (
  
    <Suspense fallback={ <ModalFallback />  }>
      <WorkflowsCreateModal {...props} / />
    </Suspense>);

export const LazyWorkflowsIntegrationTest: React.FC<Record<string, any>> = (props: unknown) => (
  
    <Suspense fallback={ <TestFallback />  }>
      <WorkflowsIntegrationTest {...props} / />
    </Suspense>);

// Hook para preload de componentes
export const useWorkflowsPreload = () => {
  const preloadDashboard = () => {
    import('./WorkflowsDashboard');};

  const preloadStats = () => {
    import('./WorkflowsStats');};

  const preloadFilters = () => {
    import('./WorkflowsFilters');};

  const preloadList = () => {
    import('./WorkflowsList');};

  const preloadGrid = () => {
    import('./WorkflowsGrid');};

  const preloadActions = () => {
    import('./WorkflowsActions');};

  const preloadCreateModal = () => {
    import('./WorkflowsCreateModal');};

  const preloadIntegrationTest = () => {
    import('./WorkflowsIntegrationTest');};

  const preloadAll = () => {
    preloadDashboard();

    preloadStats();

    preloadFilters();

    preloadList();

    preloadGrid();

    preloadActions();

    preloadCreateModal();

    preloadIntegrationTest();};

  return {
    preloadDashboard,
    preloadStats,
    preloadFilters,
    preloadList,
    preloadGrid,
    preloadActions,
    preloadCreateModal,
    preloadIntegrationTest,
    preloadAll};
};

export default {
  LazyWorkflowsDashboard,
  LazyWorkflowsStats,
  LazyWorkflowsFilters,
  LazyWorkflowsList,
  LazyWorkflowsGrid,
  LazyWorkflowsActions,
  LazyWorkflowsCreateModal,
  LazyWorkflowsIntegrationTest,
  useWorkflowsPreload};
