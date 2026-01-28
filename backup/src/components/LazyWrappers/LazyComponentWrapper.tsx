import React, { Suspense, lazy, useMemo } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingStates';

/**
 * Wrapper para carregar um componente com React.lazy
 * Use passando uma função de import dinâmica via prop `loader`.
 * Exemplo: <LazyComponentWrapper loader={() => import('../pages/Dashboard')} />
 */
const LazyComponentWrapper = ({ loader, fallback = <LoadingSpinner />, ...props }) => {
  const LazyComponent = useMemo(() => lazy(loader), [loader]);
  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default LazyComponentWrapper;
