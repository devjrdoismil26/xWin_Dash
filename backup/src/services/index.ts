// ========================================
// SERVIÇOS GLOBAIS - ENTRY POINT
// ========================================

// ========================================
// CLIENTE HTTP
// ========================================
export { apiClient, ApiClient } from './http/apiClient';
export { BaseService } from './http/baseService';
export * from './http/types';

// ========================================
// SERVIÇOS GLOBAIS
// ========================================
export { authService, AuthService } from './global/authService';
// export { projectsService, ProjectsService } from './global/projectsService';
// export { dashboardService, DashboardService } from './global/dashboardService';

// ========================================
// SERVIÇOS REAL-TIME
// ========================================
export { realTimeService, RealTimeService } from './realtime/realTimeService';
export { echo, echoConfig, getEchoConfig, updateEchoConfig, isEchoConnected, getEchoConnectionStatus } from './realtime/echoConfig';
export * from './realtime/types';

// ========================================
// EXPORTS PADRÃO
// ========================================
export { apiClient as default } from './http/apiClient';
