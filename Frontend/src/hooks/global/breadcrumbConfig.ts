/**
 * Configuração central para breadcrumbs
 *
 * @description
 * Mapeia padrões de rota para os itens de breadcrumb correspondentes.
 * Suporta parâmetros dinâmicos do tipo ":id" nas rotas.
 *
 * @module hooks/global/breadcrumbConfig
 * @since 1.0.0
 */

/**
 * Item individual de breadcrumb
 *
 * @interface BreadcrumbItem
 * @property {string} label - Texto exibido no breadcrumb
 * @property {string} [href] - URL opcional para o link do breadcrumb (omitido para o item atual)
 */
export interface BreadcrumbItem {
  label: string;
  href?: string; }

/**
 * Configuração de breadcrumb para uma rota específica
 *
 * @interface BreadcrumbConfig
 * @property {string} path - Padrão de rota (ex: "/users/:id/edit")
 * @property {BreadcrumbItem[]} breadcrumbs - Lista de itens do breadcrumb em ordem hierárquica
 */
export interface BreadcrumbConfig {
  path: string;
  breadcrumbs: BreadcrumbItem[];
  [key: string]: unknown; }

export const breadcrumbConfig: BreadcrumbConfig[] = [
  {
    path: "/dashboard",
    breadcrumbs: [{ label: "Dashboard" }],
  },
  {
    path: "/users",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Usuários" },
    ],
  },
  {
    path: "/users/create",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Usuários", href: "/users" },
      { label: "Criar Novo Usuário" },
    ],
  },
  {
    path: "/users/:id/edit",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Usuários", href: "/users" },
      { label: "Editar Usuário" },
    ],
  },
  {
    path: "/projects",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Projetos" },
    ],
  },
  {
    path: "/projects/create",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Projetos", href: "/projects" },
      { label: "Criar Novo Projeto" },
    ],
  },
  {
    path: "/projects/:id/edit",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Projetos", href: "/projects" },
      { label: "Editar Projeto" },
    ],
  },
  {
    path: "/workflows",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Workflows" },
    ],
  },
  {
    path: "/workflows/create",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Workflows", href: "/workflows" },
      { label: "Criar Novo Workflow" },
    ],
  },
  {
    path: "/workflows/:id/edit",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Workflows", href: "/workflows" },
      { label: "Editar Workflow" },
    ],
  },
  {
    path: "/leads",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Leads" },
    ],
  },
  {
    path: "/leads/create",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Leads", href: "/leads" },
      { label: "Criar Novo Lead" },
    ],
  },
  {
    path: "/leads/:id/edit",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Leads", href: "/leads" },
      { label: "Editar Lead" },
    ],
  },
  {
    path: "/products",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Produtos" },
    ],
  },
  {
    path: "/products/create",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Produtos", href: "/products" },
      { label: "Criar Novo Produto" },
    ],
  },
  {
    path: "/products/:id/edit",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Produtos", href: "/products" },
      { label: "Editar Produto" },
    ],
  },
  {
    path: "/media",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Biblioteca de Mídia" },
    ],
  },
  {
    path: "/settings",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Configurações" },
    ],
  },
  {
    path: "/settings/profile",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Configurações", href: "/settings" },
      { label: "Perfil" },
    ],
  },
  {
    path: "/settings/account",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Configurações", href: "/settings" },
      { label: "Conta" },
    ],
  },
  {
    path: "/settings/security",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Configurações", href: "/settings" },
      { label: "Segurança" },
    ],
  },
  // Adicione outras rotas conforme necessário...
];

/**
 * Configuração de breadcrumbs exportada
 *
 * @type {BreadcrumbConfig[]}
 * @constant
 */

export default breadcrumbConfig;
