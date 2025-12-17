// =========================================
// LAZY COMPONENTS - CARREGAMENTO OTIMIZADO
// =========================================
// Componentes carregados sob demanda para otimizar performance
// Máximo: 150 linhas

import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { Card } from '@/shared/components/ui/Card';

// =========================================
// COMPONENTES LAZY-LOADED
// =========================================

// Dashboard e Analytics
export const MediaDashboard = lazy(() => import('./MediaLibraryDashboard'));

export const MediaAnalytics = lazy(() => import('./MediaLibraryStats'));

// AI Components
export const MediaAI = lazy(() => import('./IntelligentMediaLibrary'));

export const MediaAutoTag = lazy(() => import('./MediaMetrics'));

export const MediaSimilarity = lazy(() => import('./MediaFilters'));

// Advanced Components
export const MediaAdvancedEditor = lazy(() => import('./MediaUploader'));

export const MediaBatchProcessor = lazy(() => import('./MediaGrid'));

export const MediaWorkflowBuilder = lazy(() => import('./MediaLibraryContent'));

// Integration Components
export const MediaCloudSync = lazy(() => import('./MediaLibraryUploader'));

export const MediaAPIIntegration = lazy(() => import('./MediaLibraryIntegrationTest'));

export const MediaWebhookManager = lazy(() => import('./MediaLibraryHeader'));

// Template and Import Components
export const MediaTemplateSelector = lazy(() => import('./MediaFilters'));

export const MediaImportWizard = lazy(() => import('./MediaLibraryUploader'));

export const MediaExportWizard = lazy(() => import('./MediaLibraryStats'));

// Version and History Components
export const MediaVersionHistory = lazy(() => import('./MediaLibraryStats'));

export const MediaAuditLog = lazy(() => import('./MediaLibraryStats'));

// Advanced UI Components
export const MediaAdvancedFilters = lazy(() => import('./MediaFilters'));

export const MediaBulkEditor = lazy(() => import('./MediaGrid'));

export const MediaMetadataEditor = lazy(() => import('./MediaMetrics'));

// =========================================
// LOADING COMPONENTS
// =========================================

interface LazyLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const LazyLoading: React.FC<LazyLoadingProps> = ({ size = 'md',
  className = '',
  message = 'Carregando...'
   }) => (
  <Card className={`p-6 ${className} `} />
    <div className=" ">$2</div><div className=" ">$2</div><LoadingSpinner size={size} / />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300" />
          {message}
        </p></div></Card>);

// =========================================
// LAZY WRAPPER COMPONENT
// =========================================

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string; }

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ children,
  fallback,
  size = 'md',
  message = 'Carregando...',
  className = ''
   }) => (
  <Suspense fallback={fallback || <LazyLoading size={size} message={message} className={className } />}>
    {children}
  </Suspense>);

// =========================================
// PRELOAD FUNCTIONS
// =========================================

// Preload components for better UX
export const preloadMediaDashboard = () => {
  import('./MediaLibraryDashboard');};

export const preloadMediaAnalytics = () => {
  import('./MediaLibraryStats');};

export const preloadMediaAI = () => {
  import('./IntelligentMediaLibrary');};

export const preloadMediaAdvancedEditor = () => {
  import('./MediaUploader');};

export const preloadMediaBatchProcessor = () => {
  import('./MediaGrid');};

// =========================================
// LAZY COMPONENT EXPORTS
// =========================================

// Dashboard Components
export const LazyMediaDashboard: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando dashboard..." />
    <MediaDashboard {...props} / />
  </LazyWrapper>);

export const LazyMediaAnalytics: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando análises..." />
    <MediaAnalytics {...props} / />
  </LazyWrapper>);

// AI Components
export const LazyMediaAI: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando IA..." />
    <MediaAI {...props} / />
  </LazyWrapper>);

export const LazyMediaAutoTag: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando auto-tag..." />
    <MediaAutoTag {...props} / />
  </LazyWrapper>);

export const LazyMediaSimilarity: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando similaridade..." />
    <MediaSimilarity {...props} / />
  </LazyWrapper>);

// Advanced Components
export const LazyMediaAdvancedEditor: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando editor avançado..." />
    <MediaAdvancedEditor {...props} / />
  </LazyWrapper>);

export const LazyMediaBatchProcessor: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando processador em lote..." />
    <MediaBatchProcessor {...props} / />
  </LazyWrapper>);

export const LazyMediaWorkflowBuilder: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando construtor de workflow..." />
    <MediaWorkflowBuilder {...props} / />
  </LazyWrapper>);

// Integration Components
export const LazyMediaCloudSync: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando sincronização..." />
    <MediaCloudSync {...props} / />
  </LazyWrapper>);

export const LazyMediaAPIIntegration: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando integração..." />
    <MediaAPIIntegration {...props} / />
  </LazyWrapper>);

export const LazyMediaWebhookManager: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando webhooks..." />
    <MediaWebhookManager {...props} / />
  </LazyWrapper>);

// Template and Import Components
export const LazyMediaTemplateSelector: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando templates..." />
    <MediaTemplateSelector {...props} / />
  </LazyWrapper>);

export const LazyMediaImportWizard: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando assistente de importação..." />
    <MediaImportWizard {...props} / />
  </LazyWrapper>);

export const LazyMediaExportWizard: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando assistente de exportação..." />
    <MediaExportWizard {...props} / />
  </LazyWrapper>);

// Version and History Components
export const LazyMediaVersionHistory: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando histórico..." />
    <MediaVersionHistory {...props} / />
  </LazyWrapper>);

export const LazyMediaAuditLog: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando log de auditoria..." />
    <MediaAuditLog {...props} / />
  </LazyWrapper>);

// Advanced UI Components
export const LazyMediaAdvancedFilters: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando filtros avançados..." />
    <MediaAdvancedFilters {...props} / />
  </LazyWrapper>);

export const LazyMediaBulkEditor: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando editor em lote..." />
    <MediaBulkEditor {...props} / />
  </LazyWrapper>);

export const LazyMediaMetadataEditor: React.FC<any> = (props: unknown) => (
  <LazyWrapper message="Carregando editor de metadados..." />
    <MediaMetadataEditor {...props} / />
  </LazyWrapper>);
