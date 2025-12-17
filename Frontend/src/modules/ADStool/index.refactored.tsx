import { lazy } from 'react';

export const ADSToolListPage = lazy(() => 
  import('./pages/ADSToolListPage').then(m => ({ default: m.ADSToolListPage })));

export const ADSToolDetailPage = lazy(() => 
  import('./pages/ADSToolDetailPage').then(m => ({ default: m.ADSToolDetailPage })));

export const ADSToolAnalyticsPage = lazy(() => 
  import('./pages/ADSToolAnalyticsPage').then(m => ({ default: m.ADSToolAnalyticsPage })));

export { ADSToolMetricsCards } from './components/ADSToolMetricsCards';
export { ADSToolTable } from './components/ADSToolTable';
export { ADSToolFiltersPanel } from './components/ADSToolFiltersPanel';
export { ADSToolFormModal } from './components/ADSToolFormModal';

export { useADSToolRefactored } from './hooks/useADSToolRefactored';

export { default as adsService } from './services/adsService';

export type {
  AdsAccount,
  AdsCampaign,
  AdsCreative,
  AdsTemplate,
} from './types';

export const ADSTOOL_MODULE_INFO = {
  name: 'ADStool',
  version: '2.0.0',
  refactored: true,
  pages: ['ADSToolListPage', 'ADSToolDetailPage', 'ADSToolAnalyticsPage'],
  components: ['ADSToolMetricsCards', 'ADSToolTable', 'ADSToolFiltersPanel', 'ADSToolFormModal'],
  hooks: ['useADSToolRefactored'],};

export default {
  ADSToolListPage,
  ADSToolDetailPage,
  ADSToolAnalyticsPage,
  useADSToolRefactored,
  adsService,
  ADSTOOL_MODULE_INFO,};
