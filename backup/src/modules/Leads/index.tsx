// ========================================
// ENTRY POINT MODERNIZADO - LEADS
// ========================================
import React, { lazy, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { Users, RefreshCw } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { LoadingSpinner, LoadingSkeleton, TableLoadingSkeleton } from '@/components/ui/LoadingStates';
import { AnimatedCounter, PageTransition, Animated } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid, ResponsiveContainer, ShowOn } from '@/components/ui/ResponsiveSystem';
import { ProgressBar, CircularProgress, OperationProgress } from '@/components/ui/AdvancedProgress';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import Tooltip from '@/components/ui/Tooltip';
// Lazy load the main Leads component
const ModernLeadsIndex = lazy(() => import('./pages/ModernLeadsIndex'));
// Loading component
const LeadsLoading: React.FC = () => (
  <PageTransition type="fade" duration={500}>
    <AppLayout>
      <Head title="Leads - xWin-Dash" />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-2 mt-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Carregando Leads</h2>
          <p className="text-gray-600">Preparando sua gestão de leads...</p>
        </div>
      </div>
    </AppLayout>
  </PageTransition>
);
// Error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
class LeadsErrorBoundary extends React.Component<
  React.PropsWithChildren<Record<string, never>>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<Record<string, never>>) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  }
  render() {
    if (this.state.hasError) {
      return (
        <PageTransition type="fade" duration={500}>
          <AppLayout>
            <Head title="Erro - Leads" />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <ErrorState
                icon={Users}
                title="Erro ao carregar Leads"
                description="Ocorreu um erro inesperado. Tente recarregar a página."
                actions={[
                  {
                    label: "Recarregar Página",
                    onClick: () => window.location.reload(),
                    variant: "default",
                    icon: RefreshCw
                  }
                ]}
              />
            </div>
          </AppLayout>
        </PageTransition>
      );
    }
    return this.props.children;
  }
}
// Main Leads component
const Leads: React.FC = () => {
  return (
    <PageTransition type="fade" duration={500}>
      <LeadsErrorBoundary>
        <Suspense fallback={<LeadsLoading />}>
          <ModernLeadsIndex />
        </Suspense>
      </LeadsErrorBoundary>
    </PageTransition>
  );
};
export default Leads;
