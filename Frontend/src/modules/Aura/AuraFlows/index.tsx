/**
 * Entry point principal do módulo AuraFlows
 * Sistema de fluxos de automação
 */
import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary';
import PageLayout from '@/layouts/PageLayout';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { PageTransition } from '@/shared/components/ui/AdvancedAnimations';

// Lazy loading de componentes pesados
const FlowCanvas = React.lazy(() => import('../Flows/components/FlowBuilder'));

const FlowBuilder = React.lazy(() => import('../Flows/components/ModernFlowBuilder'));

const FlowMonitor = React.lazy(() => import('../Flows/ExecutionLogs'));

interface AuraFlowsProps {
  auth?: {
user?: {
id: string;
  name: string;
  email: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };
};

  page?: 'index' | 'canvas' | 'builder' | 'monitor';
  id?: string;
  className?: string;
}

const AuraFlows: React.FC<AuraFlowsProps> = ({ auth, 
  page = 'index', 
  id,
  className 
   }) => {
  const renderContent = () => {
    switch (page) {
      case 'canvas':
        return id ? <FlowCanvas flowId={id} className={className } /> : <FlowCanvas className={className } />;
      case 'builder':
        return id ? <FlowBuilder flowId={id} className={className } /> : <FlowBuilder className={className } />;
      case 'monitor':
        return <FlowMonitor className={className } />;
      default:
        return <FlowCanvas className={className } />;
    } ;

  return (
        <>
      <PageTransition type="fade" duration={ 500 } />
      <AuthenticatedLayout user={ auth?.user } />
        <Head title="Aura Flows - xWin Dash" / />
        <PageLayout />
          <ErrorBoundary />
            <Suspense fallback={ <LoadingSpinner size="lg" />  }>
              {renderContent()}
            </Suspense></ErrorBoundary></PageLayout></AuthenticatedLayout></PageTransition>);};

export default AuraFlows;
export { AuraFlows };
