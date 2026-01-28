/**
 * Entry point principal do módulo AuraChats
 * Sistema de chat WhatsApp
 */
import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import PageLayout from '@/layouts/PageLayout';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { PageTransition } from '@/components/ui/AdvancedAnimations';

// Lazy loading de componentes pesados
const ChatInterface = React.lazy(() => import('../Chats/components/AuraChatList'));
const MessageList = React.lazy(() => import('../Chats/components/AuraMessageBubble'));
const ChatMonitor = React.lazy(() => import('../Chats/components/AuraChatFilters'));

interface AuraChatsProps {
  auth?: {
    user?: {
      id: string;
      name: string;
      email: string;
    };
  };
  page?: 'index' | 'interface' | 'messages' | 'monitor';
  id?: string;
  className?: string;
}

const AuraChats: React.FC<AuraChatsProps> = ({ 
  auth, 
  page = 'index', 
  id,
  className 
}) => {
  const renderContent = () => {
    switch (page) {
      case 'interface':
        return id ? <ChatInterface chatId={id} className={className} /> : <ChatInterface className={className} />;
      case 'messages':
        return id ? <MessageList chatId={id} className={className} /> : <MessageList className={className} />;
      case 'monitor':
        return <ChatMonitor className={className} />;
      default:
        return <ChatInterface className={className} />;
    }
  };

  return (
    <PageTransition type="fade" duration={500}>
      <AuthenticatedLayout user={auth?.user}>
        <Head title="Aura Chats - xWin Dash" />
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

export default AuraChats;
export { AuraChats };
