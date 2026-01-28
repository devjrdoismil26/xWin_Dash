// ========================================
// LEADS SERVICE - ORQUESTRADOR PRINCIPAL
// ========================================
// Serviço principal que orquestra todos os serviços especializados
// Máximo: 200 linhas

// ========================================
// IMPORTS DOS SERVIÇOS ESPECIALIZADOS
// ========================================

// Core Services
import {
  fetchLeads,
  fetchLeadById,
  createLead,
  updateLead,
  deleteLead,
  bulkUpdateLeads,
  bulkDeleteLeads,
  fetchLeadActivities,
  createLeadActivity,
  checkProjectStatus,
  getProjectSettings
} from '../LeadsCore/services/leadsCoreService';

// Manager Services
import {
  updateLeadStatus,
  updateLeadScore,
  assignLead,
  unassignLead,
  duplicateLead,
  mergeLeads,
  createLeadNote,
  fetchLeadNotes,
  createLeadTask,
  fetchLeadTasks,
  uploadLeadDocument,
  fetchLeadDocuments,
  deleteLeadDocument,
  searchLeadsAdvanced,
  findDuplicateLeads
} from '../LeadsManager/services/leadsManagerService';

// Segments Services
import {
  fetchSegments,
  fetchSegmentById,
  createSegment,
  updateSegment,
  deleteSegment,
  calculateSegment,
  previewSegment,
  validateSegmentCriteria,
  fetchSegmentRules,
  createSegmentRule,
  updateSegmentRule,
  deleteSegmentRule,
  fetchSegmentLeads,
  addLeadsToSegment,
  removeLeadsFromSegment
} from '../LeadsSegments/services/leadsSegmentsService';

// Analytics Services
import {
  fetchLeadMetrics,
  fetchMetricsByPeriod,
  fetchLeadAnalytics,
  fetchLeadPerformance,
  fetchLeadEngagement,
  fetchLeadHealthScores,
  calculateLeadHealthScore,
  fetchLeadAttribution,
  fetchLeadAttributionById,
  fetchLeadForecasts,
  generateLeadForecast,
  fetchLeadSources,
  fetchLeadROI,
  calculateLeadROI
} from '../LeadsAnalytics/services/leadsAnalyticsService';

// Custom Fields Services
import {
  fetchCustomFields,
  fetchCustomFieldById,
  createCustomField,
  updateCustomField,
  deleteCustomField,
  validateCustomField,
  testCustomField,
  updateLeadCustomFieldValue,
  fetchLeadCustomFieldValues,
  updateLeadCustomFields,
  importCustomFieldsFromTemplate,
  exportCustomFieldsToTemplate,
  fetchCustomFieldStats,
  fetchLeadsUsingCustomField
} from '../LeadsCustomFields/services/leadsCustomFieldsService';

// ========================================
// RE-EXPORTS ORGANIZADOS
// ========================================

// Core Operations
export {
  fetchLeads,
  fetchLeadById,
  createLead,
  updateLead,
  deleteLead,
  bulkUpdateLeads,
  bulkDeleteLeads,
  fetchLeadActivities,
  createLeadActivity,
  checkProjectStatus,
  getProjectSettings
};

// Manager Operations
export {
  updateLeadStatus,
  updateLeadScore,
  assignLead,
  unassignLead,
  duplicateLead,
  mergeLeads,
  createLeadNote,
  fetchLeadNotes,
  createLeadTask,
  fetchLeadTasks,
  uploadLeadDocument,
  fetchLeadDocuments,
  deleteLeadDocument,
  searchLeadsAdvanced,
  findDuplicateLeads
};

// Segments Operations
export {
  fetchSegments,
  fetchSegmentById,
  createSegment,
  updateSegment,
  deleteSegment,
  calculateSegment,
  previewSegment,
  validateSegmentCriteria,
  fetchSegmentRules,
  createSegmentRule,
  updateSegmentRule,
  deleteSegmentRule,
  fetchSegmentLeads,
  addLeadsToSegment,
  removeLeadsFromSegment
};

// Analytics Operations
export {
  fetchLeadMetrics,
  fetchMetricsByPeriod,
  fetchLeadAnalytics,
  fetchLeadPerformance,
  fetchLeadEngagement,
  fetchLeadHealthScores,
  calculateLeadHealthScore,
  fetchLeadAttribution,
  fetchLeadAttributionById,
  fetchLeadForecasts,
  generateLeadForecast,
  fetchLeadSources,
  fetchLeadROI,
  calculateLeadROI
};

// Custom Fields Operations
export {
  fetchCustomFields,
  fetchCustomFieldById,
  createCustomField,
  updateCustomField,
  deleteCustomField,
  validateCustomField,
  testCustomField,
  updateLeadCustomFieldValue,
  fetchLeadCustomFieldValues,
  updateLeadCustomFields,
  importCustomFieldsFromTemplate,
  exportCustomFieldsToTemplate,
  fetchCustomFieldStats,
  fetchLeadsUsingCustomField
};

// ========================================
// UTILITÁRIOS GLOBAIS
// ========================================

/**
 * Obter ID do projeto atual
 */
export const getCurrentProjectId = (): string | null => {
  return localStorage.getItem('current_project_id');
};

/**
 * Obter headers de autenticação
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Verificar se o usuário está autenticado
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

/**
 * Obter informações do usuário atual
 */
export const getCurrentUser = (): any => {
  const userStr = localStorage.getItem('current_user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Limpar dados de autenticação
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('current_user');
  localStorage.removeItem('current_project_id');
};

// ========================================
// CONFIGURAÇÕES GLOBAIS
// ========================================

/**
 * Configurações padrão do serviço
 */
export const DEFAULT_CONFIG = {
  API_BASE_URL: process.env.REACT_APP_API_URL || '/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

/**
 * Headers padrão para requisições
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
