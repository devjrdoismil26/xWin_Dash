// ========================================
// EXPORTS - PÁGINAS DO MÓDULO LEADS
// ========================================

// Páginas refatoradas (novo padrão)
export { LeadsListPage } from './LeadsListPage';
export { LeadDetailPage } from './LeadDetailPage';
export { LeadsAnalyticsPage } from './LeadsAnalyticsPage';

// Páginas principais refatoradas (legado)
export { default as LeadsIndexPage } from './LeadsIndexPage';
export { default as LeadsDetailPageLegacy } from './LeadsDetailPage';
export { default as LeadsCreatePage } from './LeadsCreatePage';
export { default as LeadsEditPage } from './LeadsEditPage';

// Páginas legadas (para compatibilidade)
export { default as Index } from './Index';
export { default as LeadsScheduler } from './LeadsScheduler';
export { default as ModernLeadsIndex } from './ModernLeadsIndex';
export { default as TagsIndex } from './TagsIndex';
