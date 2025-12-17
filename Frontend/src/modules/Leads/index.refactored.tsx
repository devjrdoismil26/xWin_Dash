/**
 * Módulo Leads - Entry Point Refatorado
 * 
 * @version 2.0.0
 * @description Entry point modernizado do módulo Leads com lazy loading e error boundaries
 */

import React, { lazy, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { Users } from 'lucide-react';

// Lazy load das páginas principais
const LeadsListPage = lazy(() => import('./pages/LeadsListPage').then(m => ({ default: m.LeadsListPage })));

const LeadDetailPage = lazy(() => import('./pages/LeadDetailPage').then(m => ({ default: m.LeadDetailPage })));

const LeadsAnalyticsPage = lazy(() => import('./pages/LeadsAnalyticsPage').then(m => ({ default: m.LeadsAnalyticsPage })));

// Loading component
const LoadingFallback: React.FC = () => (
  <div className=" ">$2</div><div className=" ">$2</div><Users className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Carregando Leads</h2>
      <p className="text-gray-600">Preparando sua gestão de leads...</p>
    </div>);

// Error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error; }

class LeadsErrorBoundary extends React.Component<
  React.PropsWithChildren<Record<string, never>>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<Record<string, never>>) {
    super(props);

    this.state = { hasError: false};

  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error};

  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Leads Module Error:', error, errorInfo);

  }

  render() {
    if (this.state.hasError) {
      return (
                <div className=" ">$2</div><div className=" ">$2</div><Users className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar Leads</h2>
            <p className="text-gray-600 mb-4" />
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            <button
              onClick={ () => window.location.reload() }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Recarregar Página
            </button>
          </div>);

    }

    return this.props.children;
  } // Main Leads component
const LeadsModule: React.FC = () => { return (
            <>
      <Head title="Leads - xWin Dash" / />
      <LeadsErrorBoundary />
        <Suspense fallback={ <LoadingFallback />  }>
          <LeadsListPage / /></Suspense></LeadsErrorBoundary>
    </>);};

export default LeadsModule;

// Named exports para uso direto
export { LeadsListPage, LeadDetailPage, LeadsAnalyticsPage };

export * from './components';
export * from './hooks';
export * from './types';
