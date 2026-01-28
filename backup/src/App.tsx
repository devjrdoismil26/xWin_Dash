
import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { ErrorBoundary as ErrorBoundaryComponent } from '@/components/ErrorBoundary/ErrorBoundary';
import { ThemeProvider } from '@/components/ThemeProvider';

// Componente de Loading
const LoadingFallback: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
};

// Interface para props do Inertia
interface AppProps {
  children: React.ReactNode;
  title?: string;
  [key: string]: any;
}

// Componente Principal da Aplicação
const App: React.FC<AppProps> = ({ children, title }) => {
  return (
    <ErrorBoundaryComponent>
      <ThemeProvider>
        <Head title={title} />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          {/* Conteúdo Principal */}
          <Suspense fallback={<LoadingFallback />}>
            {children}
          </Suspense>
        </div>
      </ThemeProvider>
    </ErrorBoundaryComponent>
  );
};

export default App;
