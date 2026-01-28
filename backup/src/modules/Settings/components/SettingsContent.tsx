import React, { Suspense, lazy } from 'react';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTransition, Animated } from '@/components/ui/AdvancedAnimations';
import { ResponsiveContainer } from '@/components/ui/ResponsiveSystem';
import { Settings, AlertTriangle } from 'lucide-react';

// =========================================
// INTERFACES
// =========================================

export interface SettingsContentProps {
  activeCategory: string;
  loading?: boolean;
  error?: string | null;
  onError?: (error: string) => void;
  className?: string;
}

// =========================================
// LAZY LOADING DOS COMPONENTES
// =========================================

const GeneralSettings = lazy(() => import('./GeneralSettings'));
const AuthSettings = lazy(() => import('./AuthSettings'));
const UserSettings = lazy(() => import('./UserSettings'));
const DatabaseSettings = lazy(() => import('./DatabaseSettings'));
const EmailSettings = lazy(() => import('./EmailSettings'));
const IntegrationSettings = lazy(() => import('./AdvancedSettingsPanel'));
const AISettings = lazy(() => import('./AISettings'));
const APISettings = lazy(() => import('./ApiTokens'));

// =========================================
// COMPONENTE DE LOADING
// =========================================

const SettingsLoadingSkeleton: React.FC = () => (
  <div className="space-y-6">
    <Card className="p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    </Card>
    
    <Card className="p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
        </div>
      </div>
    </Card>
  </div>
);

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

const SettingsContent: React.FC<SettingsContentProps> = ({
  activeCategory,
  loading = false,
  error = null,
  onError,
  className = ''
}) => {
  // ===== HANDLERS =====

  const handleError = (errorMessage: string) => {
    if (onError) {
      onError(errorMessage);
    }
  };

  // ===== RENDERIZAÇÃO DE COMPONENTES =====

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'general':
        return <GeneralSettings onError={handleError} />;
      
      case 'auth':
      case 'auth-password':
      case 'auth-session':
      case 'auth-2fa':
      case 'auth-oauth':
        return <AuthSettings activeSubcategory={activeCategory} onError={handleError} />;
      
      case 'users':
        return <UserSettings onError={handleError} />;
      
      case 'database':
        return <DatabaseSettings onError={handleError} />;
      
      case 'email':
        return <EmailSettings onError={handleError} />;
      
      case 'integrations':
        return <IntegrationSettings onError={handleError} />;
      
      case 'ai':
        return <AISettings onError={handleError} />;
      
      case 'api':
        return <APISettings onError={handleError} />;
      
      default:
        return (
          <EmptyState
            title="Categoria não encontrada"
            message={`A categoria "${activeCategory}" não foi encontrada.`}
            icon={Settings}
          />
        );
    }
  };

  // ===== RENDERIZAÇÃO DE ESTADOS =====

  if (loading) {
    return (
      <PageTransition type="fade" duration={300}>
        <div className={`p-6 ${className}`}>
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <LoadingSpinner size="large" />
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Carregando configurações...
              </p>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition type="fade" duration={300}>
        <div className={`p-6 ${className}`}>
          <ErrorState
            title="Erro ao carregar configurações"
            message={error}
            icon={AlertTriangle}
            onRetry={() => window.location.reload()}
          />
        </div>
      </PageTransition>
    );
  }

  // ===== RENDERIZAÇÃO PRINCIPAL =====

  return (
    <PageTransition type="fade" duration={300}>
      <div className={`p-6 ${className}`}>
        <ResponsiveContainer>
          <Animated type="slideUp" delay={100}>
            <Suspense fallback={<SettingsLoadingSkeleton />}>
              {renderCategoryContent()}
            </Suspense>
          </Animated>
        </ResponsiveContainer>
      </div>
    </PageTransition>
  );
};

// =========================================
// EXPORTS
// =========================================

export default SettingsContent;
