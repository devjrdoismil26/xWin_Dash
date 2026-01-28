/**
 * Entry point principal do módulo AuraCore
 * Orquestrador que coordena diferentes páginas e componentes
 */
import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import PageLayout from '@/layouts/PageLayout';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { PageTransition } from '@/components/ui/AdvancedAnimations';

// Lazy loading de componentes pesados
const AuraDashboard = React.lazy(() => import('./components/AuraDashboard'));
const AuraFlows = React.lazy(() => import('../Flows/components/FlowBuilder'));
const AuraChats = React.lazy(() => import('../Chats/components/AuraChatList'));
const AuraConnections = React.lazy(() => import('../components/ConnectionManager'));

interface AuraCoreProps {
  auth?: {
    user?: {
      id: string;
      name: string;
      email: string;
    };
  };
  page?: 'index' | 'dashboard' | 'flows' | 'chats' | 'connections';
  id?: string;
  className?: string;
}

const AuraCore: React.FC<AuraCoreProps> = ({ 
  auth, 
  page = 'index', 
  id,
  className 
}) => {
  const renderContent = () => {
    switch (page) {
      case 'dashboard':
        return <AuraDashboard className={className} />;
      case 'flows':
        return id ? <AuraFlows flowId={id} className={className} /> : <AuraFlows className={className} />;
      case 'chats':
        return id ? <AuraChats chatId={id} className={className} /> : <AuraChats className={className} />;
      case 'connections':
        return id ? <AuraConnections connectionId={id} className={className} /> : <AuraConnections className={className} />;
      default:
        return <AuraDashboard className={className} />;
    }
  };

  return (
    <PageTransition type="fade" duration={500}>
      <AuthenticatedLayout user={auth?.user}>
        <Head title="Aura Core - xWin Dash" />
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

// Componente de compatibilidade para o nome antigo
const AuraCoreIndex: React.FC<{ auth?: any }> = ({ auth }) => {
  return <AuraCore auth={auth} page="index" />;
};

export default AuraCoreIndex;
export { AuraCore };
