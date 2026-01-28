// =========================================
// EXPORTS - COMPONENTES DO MÓDULO PRODUCTS
// =========================================

// Componentes principais
export { default as ProductsModule } from './ProductsModule';
export { default as ProductsHeader } from './ProductsHeader';
export { default as ProductsStats } from './ProductsStats';
export { default as ProductsFilters } from './ProductsFilters';
export { default as ProductsContent } from './ProductsContent';
export { default as ProductsActions } from './ProductsActions';

// Componentes de exibição
export { default as ProductsList } from './ProductsList';
export { default as ProductsGrid } from './ProductsGrid';

// Componentes de funcionalidades
export { default as ProductsForm } from './ProductsForm';
export { default as ProductsCard } from './ProductsCard';
export { default as VariationsManager } from './VariationsManager';
export { default as ImagesManager } from './ImagesManager';
export { default as ReviewsManager } from './ReviewsManager';
export { default as AnalyticsDashboard } from './AnalyticsDashboard';

// Sistema de Lazy Loading
export * from './LazyComponents';
