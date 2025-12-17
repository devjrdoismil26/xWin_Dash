/**
 * Configura??o de Rotas - routes.ts
 *
 * @description
 * Configura??o centralizada de rotas da aplica??o com lazy loading
 * e metadados de rota (autentica??o, permiss?es, ?cones).
 * Define todas as rotas principais da aplica??o com seus componentes
 * lazy-loaded para otimiza??o de performance.
 *
 * Funcionalidades principais:
 * - Lazy loading de componentes de m?dulos
 * - Configura??o de metadados de rota (nome, ?cone, autentica??o)
 * - Sistema de permiss?es por rota
 * - Type-safe route configuration
 *
 * @module config/routes
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { routesConfig } from '@/config/routes';
 *
 * // Usar rotas configuradas
 * routesConfig.forEach(route => {
 *   if (route.requiresAuth && isAuthenticated) {
 *     // Renderizar rota
 *   }
 * });

 * ```
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';

/**
 * Tipo de componente lazy
 */
type LazyComponent = LazyExoticComponent<ComponentType<any>>;

// =========================================
// IMPORTS LAZY DE M?DULOS
// =========================================

const Dashboard = lazy(() => import("@/modules/Dashboard")) as LazyComponent;
const Projects = lazy(() => import("@/modules/Projects")) as LazyComponent;
const Users = lazy(() => import("@/modules/Users")) as LazyComponent;
const Leads = lazy(() => import("@/modules/Leads")) as LazyComponent;
const Products = lazy(() => import("@/modules/Products")) as LazyComponent;
const Workflows = lazy(() => import("@/modules/Workflows")) as LazyComponent;
const EmailMarketing = lazy(
  () => import("@/modules/EmailMarketing"),
) as LazyComponent;
const ADStool = lazy(() => import("@/modules/ADStool")) as LazyComponent;
const Analytics = lazy(() => import("@/modules/Analytics")) as LazyComponent;
const AI = lazy(() => import("@/modules/AI")) as LazyComponent;
const Aura = lazy(() => import("@/modules/Aura")) as LazyComponent;
const SocialBuffer = lazy(
  () => import("@/modules/SocialBuffer"),
) as LazyComponent;
const MediaLibrary = lazy(
  () => import("@/modules/MediaLibrary"),
) as LazyComponent;
const Settings = lazy(() => import("@/modules/Settings")) as LazyComponent;

/**
 * Interface de Configura??o de Rota
 *
 * @description
 * Define a estrutura de configura??o de uma rota da aplica??o,
 * incluindo componente lazy-loaded, metadados e requisitos de acesso.
 *
 * @interface RouteConfig
 * @property {string} path - Caminho da rota (ex: '/dashboard', '/leads')
 * @property {LazyComponent} component - Componente lazy-loaded da rota
 * @property {string} name - Nome exibido da rota (usado em navega??o)
 * @property {string} icon - Nome do ?cone (usado para exibi??o em menus)
 * @property {boolean} [requiresAuth] - Se requer autentica??o (opcional, padr?o: false)
 * @property {string[]} [requiredPermissions] - Permiss?es necess?rias para acessar a rota (opcional)
 *
 * @example
 * ```ts
 * const route: RouteConfig = {
 *   path: '/dashboard',
 *   component: Dashboard,
 *   name: 'Dashboard',
 *   icon: 'dashboard',
 *   requiresAuth: true,
 *   requiredPermissions: ['view_dashboard']
 *};

 * ```
 */
export interface RouteConfig {
  path: string;
  component: LazyComponent;
  name: string;
  icon: string;
  requiresAuth?: boolean;
  requiredPermissions?: string[];
  [key: string]: unknown; }

/**
 * Configura??o de Rotas da Aplica??o
 *
 * @description
 * Array com todas as rotas configuradas da aplica??o, incluindo
 * componentes lazy-loaded, metadados de autentica??o e permiss?es.
 * Cada rota ? carregada sob demanda para otimizar o bundle inicial.
 *
 * Rotas principais:
 * - Dashboard: Vis?o geral do sistema
 * - Projects: Gerenciamento de projetos
 * - Users: Administra??o de usu?rios (requer permiss?o)
 * - Leads: Gest?o de leads e contatos
 * - Products: Cat?logo de produtos
 * - Workflows: Designer de processos
 * - Email Marketing: Campanhas de email
 * - ADStool: Gest?o de campanhas publicit?rias
 * - Analytics: Relat?rios e an?lises
 * - AI: Assistente de IA
 * - Aura: WhatsApp Business
 * - Social Buffer: Gest?o de redes sociais
 * - Media Library: Biblioteca de m?dia
 * - Settings: Configura??es do sistema
 *
 * @type {RouteConfig[]}
 * @constant
 */
export const routesConfig: RouteConfig[] = [
  {
    path: "/dashboard",
    component: Dashboard,
    name: "Dashboard",
    icon: "dashboard",
    requiresAuth: true,
  },
  {
    path: "/projects",
    component: Projects,
    name: "Projetos",
    icon: "folder",
    requiresAuth: true,
  },
  {
    path: "/users",
    component: Users,
    name: "Usu?rios",
    icon: "users",
    requiresAuth: true,
    requiredPermissions: ["manage_users"],
  },
  {
    path: "/leads",
    component: Leads,
    name: "Leads",
    icon: "contact",
    requiresAuth: true,
  },
  {
    path: "/products",
    component: Products,
    name: "Produtos",
    icon: "package",
    requiresAuth: true,
  },
  {
    path: "/workflows",
    component: Workflows,
    name: "Workflows",
    icon: "workflow",
    requiresAuth: true,
  },
  {
    path: "/email-marketing",
    component: EmailMarketing,
    name: "Email Marketing",
    icon: "mail",
    requiresAuth: true,
  },
  {
    path: "/ads",
    component: ADStool,
    name: "An?ncios",
    icon: "megaphone",
    requiresAuth: true,
  },
  {
    path: "/analytics",
    component: Analytics,
    name: "Analytics",
    icon: "chart",
    requiresAuth: true,
  },
  {
    path: "/ai",
    component: AI,
    name: "IA",
    icon: "brain",
    requiresAuth: true,
  },
  {
    path: "/aura",
    component: Aura,
    name: "Aura",
    icon: "message-circle",
    requiresAuth: true,
  },
  {
    path: "/social",
    component: SocialBuffer,
    name: "Social Media",
    icon: "share",
    requiresAuth: true,
  },
  {
    path: "/media",
    component: MediaLibrary,
    name: "Biblioteca",
    icon: "image",
    requiresAuth: true,
  },
  {
    path: "/settings",
    component: Settings,
    name: "Configura??es",
    icon: "settings",
    requiresAuth: true,
  },
];

export default routesConfig;
