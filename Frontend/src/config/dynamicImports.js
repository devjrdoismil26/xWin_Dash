// Configuração de dynamic imports para code splitting
export const dynamicImports = {
  // Módulos principais com lazy loading
  Dashboard: () => import('@/modules/Dashboard'),
  Projects: () => import('@/modules/Projects'),
  Users: () => import('@/modules/Users'),
  Leads: () => import('@/modules/Leads'),
  Products: () => import('@/modules/Products'),
  Workflows: () => import('@/modules/Workflows'),
  EmailMarketing: () => import('@/modules/EmailMarketing'),
  ADStool: () => import('@/modules/ADStool'),
  Analytics: () => import('@/modules/Analytics'),
  AI: () => import('@/modules/AI'),
  Aura: () => import('@/modules/Aura'),
  SocialBuffer: () => import('@/modules/SocialBuffer'),
  Media: () => import('@/modules/Media'),
  Settings: () => import('@/modules/Settings'),

  // Componentes pesados
  EmailEditor: () => import('@/modules/EmailMarketing/Templates/components/EmailEditor/EmailEditor'),
  WorkflowBuilder: () => import('@/modules/Workflows/components/WorkflowBuilder'),
  GeminiCanvas: () => import('@/modules/AI/Canvas/components/GeminiCanvas'),
  FlowBuilder: () => import('@/modules/Aura/Flows/components/FlowBuilder'),

  // Bibliotecas pesadas (lazy)
  ChartLibrary: () => import('recharts'),
  ReactFlow: () => import('reactflow'),
  TinyMCE: () => import('@tinymce/tinymce-react'),
  Monaco: () => import('react-monaco-editor'),
};

export default dynamicImports;
