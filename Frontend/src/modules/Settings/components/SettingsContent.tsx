import React, { Suspense, lazy } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { PageTransition, Animated } from '@/shared/components/ui/AdvancedAnimations';
import { ResponsiveContainer } from '@/shared/components/ui/ResponsiveSystem';
import { Settings, AlertTriangle } from 'lucide-react';

// =========================================
// INTERFACES
// =========================================

export interface SettingsContentProps {
  activeCategory: string;
  loading?: boolean;
  error?: string | null;
  onError??: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

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
  <div className=" ">$2</div><Card className="p-6" />
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" /></div></Card>
    
    <Card className="p-6" />
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/5" /></div></Card>
  </div>);

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

const SettingsContent: React.FC<SettingsContentProps> = ({ activeCategory,
  loading = false,
  error = null,
  onError,
  className = ''
   }) => {
  // ===== HANDLERS =====

  const handleError = (errorMessage: string) => {
    if (onError) {
      onError(errorMessage);

    } ;

  // ===== RENDERIZAÇÃO DE COMPONENTES =====

  const renderCategoryContent = () => { switch (activeCategory) {
      case 'general':
        return <GeneralSettings onError={handleError } />;
      
      case 'auth':
      case 'auth-password':
      case 'auth-session':
      case 'auth-2fa':
      case 'auth-oauth':
        return <AuthSettings activeSubcategory={activeCategory} onError={ handleError } />;
      
      case 'users':
        return <UserSettings onError={ handleError } />;
      
      case 'database':
        return <DatabaseSettings onError={ handleError } />;
      
      case 'email':
        return <EmailSettings onError={ handleError } />;
      
      case 'integrations':
        return <IntegrationSettings onError={ handleError } />;
      
      case 'ai':
        return <AISettings onError={ handleError } />;
      
      case 'api':
        return <APISettings onError={ handleError } />;
      
      default:
        return (
                  <EmptyState
            title="Categoria não encontrada"
            message={`A categoria "${activeCategory}" não foi encontrada.`}
            icon={ Settings }
          / />);

    } ;

  // ===== RENDERIZAÇÃO DE ESTADOS =====

  if (loading) { return (
        <>
      <PageTransition type="fade" duration={300 } />
      <div className={`p-6 ${className} `}>
           
        </div><div className=" ">$2</div><div className=" ">$2</div><LoadingSpinner size="large" / />
              <p className="mt-4 text-gray-600 dark:text-gray-300" />
                Carregando configurações...
              </p></div></div>
      </PageTransition>);

  }

  if (error) { return (
        <>
      <PageTransition type="fade" duration={300 } />
      <div className={`p-6 ${className} `}>
           
        </div><ErrorState
            title="Erro ao carregar configurações"
            message={ error }
            icon={ AlertTriangle }
            onRetry={ () => window.location.reload() } /></div></PageTransition>);

  }

  // ===== RENDERIZAÇÃO PRINCIPAL =====

  return (
        <>
      <PageTransition type="fade" duration={ 300 } />
      <div className={`p-6 ${className} `}>
           
        </div><ResponsiveContainer />
          <Animated type="slideUp" />
            <Suspense fallback={ <SettingsLoadingSkeleton />  }>
              {renderCategoryContent()}
            </Suspense></Animated></ResponsiveContainer></div></PageTransition>);};

// =========================================
// EXPORTS
// =========================================

export default SettingsContent;
