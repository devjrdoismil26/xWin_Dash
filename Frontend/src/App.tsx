import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';
import ErrorBoundaryComponent from './shared/components/ErrorBoundary/ErrorBoundary';
import ThemeProvider from './shared/components/ThemeProvider';

/**
 * Componente de Loading para Suspense
 */
const LoadingFallback: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
      </div>
    </div>
  );
};

/**
 * Props do componente App
 */
interface AppProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * Componente principal da aplicação
 */
const App: React.FC<AppProps> = ({ children, title = 'xWin Dash' }) => {
  return (
    <ThemeProvider>
      <Head title={title} />
      <ErrorBoundaryComponent>
        <Suspense fallback={<LoadingFallback />}>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {children}
          </div>
        </Suspense>
      </ErrorBoundaryComponent>
    </ThemeProvider>
  );
};

export default App;
