/**
 * Entry point principal do módulo AuraConnections
 * Gerenciamento de conexões WhatsApp Business
 */
import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import PageLayout from '@/layouts/PageLayout';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { PageTransition } from '@/components/ui/AdvancedAnimations';

// Lazy loading de componentes pesados
const ConnectionManager = React.lazy(() => import('../components/ConnectionManager'));
const ConnectionStatus = React.lazy(() => import('../Connections/components/ConnectionStatusIndicator'));
const ConnectionSetup = React.lazy(() => import('../Connections/components/ConnectionForm'));

interface AuraConnectionsProps {
  auth?: {
    user?: {
      id: string;
      name: string;
      email: string;
    };
  };
  page?: 'index' | 'manager' | 'status' | 'setup';
  id?: string;
  className?: string;
}

const AuraConnections: React.FC<AuraConnectionsProps> = ({ 
  auth, 
  page = 'index', 
  id,
  className 
}) => {
  const renderContent = () => {
    switch (page) {
      case 'manager':
        return id ? <ConnectionManager connectionId={id} className={className} /> : <ConnectionManager className={className} />;
      case 'status':
        return <ConnectionStatus className={className} />;
      case 'setup':
        return <ConnectionSetup className={className} />;
      default:
        return <ConnectionManager className={className} />;
    }
  };

  return (
    <PageTransition type="fade" duration={500}>
      <AuthenticatedLayout user={auth?.user}>
        <Head title="Aura Connections - xWin Dash" />
        <PageLayout>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              {renderContent()}
            </Suspense>
          </ErrorBoundary>
        </PageLayout>
      </AuthenticatedLayout>
    </PageTransition>
  );
};

export default AuraConnections;
export { AuraConnections };
