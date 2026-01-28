/**
* Exportações otimizadas do módulo Products
* Entry point principal com lazy loading
*/
import React from 'react';

// Products Module Exports - Otimizado com lazy loading inteligente

// Main Products Module - No lazy loading for main component
export { default } from './components/ProductsModule';

// Core Components - Direct imports (no lazy loading for frequently used components)
export { default as ProductsModule } from './components/ProductsModule';
export { default as ProductsDashboard } from './components/ProductsDashboard';
export { default as ProductsHeader } from './components/ProductsHeader';
export { default as ProductsStats } from './components/ProductsStats';
export { default as ProductsFilters } from './components/ProductsFilters';
export { default as ProductsContent } from './components/ProductsContent';
export { default as ProductsActions } from './components/ProductsActions';
export { default as ProductsList } from './components/ProductsList';
export { default as ProductsForm } from './components/ProductsForm';
export { default as ProductsCard } from './components/ProductsCard';

// Core Hooks - Direct imports
export { useProducts } from './hooks/useProducts';
export { useProductsStore } from './hooks/useProductsStore';
export { useProductsOptimization } from './hooks/useProductsOptimization';

// Core Services - Direct imports
export { default as productsService } from './services/productsService';
export { productsApiService } from './services/productsApiService';

// Core Types - Direct imports
export * from './types/index';

// Lazy loading only for heavy components that are not frequently used
export const AdvancedProductCatalogDashboard = React.lazy(() => import('./components/AdvancedProductCatalogDashboard'));
export const EnhancedProductForm = React.lazy(() => import('./components/EnhancedProductForm'));
export const ModernAnalytics = React.lazy(() => import('./components/ModernAnalytics'));
export const ModernFilters = React.lazy(() => import('./components/ModernFilters'));

// Builders - Lazy loaded (heavy components)
export const LandingPageBuilder = React.lazy(() => import('./components/Builder/LandingPageBuilder'));
export const FormBuilder = React.lazy(() => import('./components/Builder/FormBuilder'));

// Managers - Lazy loaded (heavy components)
export const VariationsManager = React.lazy(() => import('./components/VariationsManager'));
export const ImagesManager = React.lazy(() => import('./components/ImagesManager'));
export const ReviewsManager = React.lazy(() => import('./components/ReviewsManager'));
export const AnalyticsDashboard = React.lazy(() => import('./components/AnalyticsDashboard'));

// Landing Pages Components - Lazy loaded
export const ModernLandingPageCard = React.lazy(() => import('./components/ModernLandingPageCard'));
export const LandingPagesComponents = React.lazy(() => import('./LandingPages'));

// Lead Capture Forms Components - Lazy loaded
export const ModernFormCard = React.lazy(() => import('./components/ModernFormCard'));
export const LeadCaptureFormsComponents = React.lazy(() => import('./LeadCaptureForms'));

// Pages - Lazy loaded
export const ModernProductsIndex = React.lazy(() => import('./pages/ModernProductsIndex'));
export const ProductsIndexPage = React.lazy(() => import('./pages/Index'));
export const ProductsDetailPage = React.lazy(() => import('./Show'));
export const ProductsCreatePage = React.lazy(() => import('./CreateEdit'));

// Legacy exports (preserved for compatibility) - Lazy loaded
export const ProductForm = React.lazy(() => import('./components/ProductForm'));
export const Show = React.lazy(() => import('./Show'));
export const CreateEdit = React.lazy(() => import('./CreateEdit'));

// Lazy Components - Lazy loaded (very heavy components)
export const LazyComponents = React.lazy(() => import('./components/LazyComponents'));
