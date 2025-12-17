/**
 * Módulo principal da MediaLibrary
 * Orquestrador que coordena todos os componentes
 */

import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { PageTransition } from '@/shared/components/ui/AdvancedAnimations';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

// Lazy loading de componentes pesados
const MediaLibraryDashboard = React.lazy(() => import('./shared/components/MediaLibraryDashboard'));

const MediaLibraryHeader = React.lazy(() => import('./shared/components/MediaLibraryHeader'));

const MediaLibraryStats = React.lazy(() => import('./shared/components/MediaLibraryStats'));

const MediaLibraryContent = React.lazy(() => import('./shared/components/MediaLibraryContent'));

const MediaLibraryUploader = React.lazy(() => import('./shared/components/MediaLibraryUploader'));

interface MediaLibraryModuleProps {
  className?: string;
  auth?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const MediaLibraryModule: React.FC<MediaLibraryModuleProps> = ({ className = '',
  auth 
   }) => { return (
        <>
      <PageTransition type="fade" duration={500 } />
      <AppLayout user={ auth?.user } />
        <Head title="Media Library - xWin Dash" / />
        <ErrorBoundary />
          <div className={`media-library-module ${className} `}>
           
        </div><Suspense fallback={ <LoadingSpinner size="lg" />  }>
              <MediaLibraryHeader / />
              <MediaLibraryStats / />
              <MediaLibraryDashboard / />
              <MediaLibraryContent / />
              <MediaLibraryUploader / /></Suspense></div></ErrorBoundary></AppLayout></PageTransition>);};

export default MediaLibraryModule;
