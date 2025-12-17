/**
 * Configuração de Navegação - xWin Dash
 *
 * @description
 * Configuração centralizada de navegação que define os itens do menu
 * principal, sincronizada com as rotas do backend. Fornece interface
 * para itens de navegação com suporte a ícones, badges, descrições e permissões.
 *
 * Funcionalidades principais:
 * - Configuração de itens de navegação principal
 * - Sincronização com rotas do backend
 * - Suporte a categorias e badges
 * - Descrições para acessibilidade
 * - Sistema de permissões
 *
 * @module config/navigation
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { MAIN_NAVIGATION, NavigationItem } from '@/config/navigation';
 *
 * // Usar navegação
 * (MAIN_NAVIGATION || []).map(item => (
 *   <NavLink key={item.route} href={ item.href } />
 *     {item.name}
 *   </NavLink>
 * ));

 * ```
 */

import React from 'react';
import { LayoutDashboard, FolderOpen, Users, Mail, Share2, Workflow, Target, Brain, MessageCircle, BarChart3, Image, Settings, Tag, Package, Activity, UserCheck, Hash, Link, Calendar, Zap, Globe } from 'lucide-react';

/**
 * Props do item de navegação
 *
 * @description
 * Interface que define a estrutura de um item de navegação.
 *
 * @interface NavigationItem
 * @property {string} name - Nome do item de navegação
 * @property {string} href - URL do item
 * @property {React.ReactNode} icon - Ícone do item
 * @property {string} route - Nome da rota (para Inertia.js)
 * @property {string} [category] - Categoria do item (opcional)
 * @property {string} [badge] - Badge a ser exibido (opcional)
 * @property {string} [description] - Descrição do item (opcional)
 * @property {string[]} [permissions] - Permissões necessárias (opcional)
 */
export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  route: string;
  category?: string;
  badge?: string;
  description?: string;
  permissions?: string[]; }

/**
 * Configuração de navegação principal sincronizada com as rotas do backend
 * Baseada nas rotas definidas em Backend/routes/web.php
 */
export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-4 h-4" />,
    route: 'dashboard',
    category: 'Principal',
    description: 'Visão geral do sistema'
  },
  {
    name: 'Projetos',
    href: '/projects',
    icon: <FolderOpen className="w-4 h-4" />,
    route: 'projects.index',
    category: 'Principal',
    description: 'Gerenciamento de projetos'
  },
  {
    name: 'Leads',
    href: '/leads',
    icon: <Users className="w-4 h-4" />,
    route: 'leads.index',
    category: 'CRM',
    description: 'Gestão de leads e contatos'
  },
  {
    name: 'Email Marketing',
    href: '/email-marketing/campaigns',
    icon: <Mail className="w-4 h-4" />,
    route: 'email-marketing.campaigns.index',
    category: 'Marketing',
    description: 'Campanhas de email marketing'
  },
  {
    name: 'Social Buffer',
    href: '/social-buffer/posts',
    icon: <Share2 className="w-4 h-4" />,
    route: 'social-buffer.posts.index',
    category: 'Marketing',
    description: 'Gestão de redes sociais'
  },
  {
    name: 'Workflows',
    href: '/workflows/nodered',
    icon: <Workflow className="w-4 h-4" />,
    route: 'workflows.nodered.index',
    category: 'Automação',
    description: 'Designer de processos'
  },
  {
    name: 'Anúncios',
    href: '/adstool',
    icon: <Target className="w-4 h-4" />,
    route: 'adstool.index',
    category: 'Marketing',
    description: 'Gestão de campanhas publicitárias'
  },
  {
    name: 'Aura',
    href: '/aura/chats',
    icon: <MessageCircle className="w-4 h-4" />,
    route: 'aura.chats.index',
    category: 'Comunicação',
    description: 'WhatsApp Business'
  },
  {
    name: 'Analytics',
    href: '/analytics/reports',
    icon: <BarChart3 className="w-4 h-4" />,
    route: 'analytics.reports.index',
    category: 'Relatórios',
    description: 'Relatórios e análises'
  },
  {
    name: 'Mídia',
    href: '/media',
    icon: <Image className="w-4 h-4" />,
    route: 'media.library.index',
    category: 'Conteúdo',
    description: 'Biblioteca de mídia'
  },
];

/**
 * Navegação secundária para módulos específicos
 */
export const MODULE_NAVIGATION = {
  // Social Buffer
  socialBuffer: [
    {
      name: 'Posts',
      route: 'social-buffer.posts.index',
      category: 'Conteúdo',
      icon: <Share2 className="w-4 h-4" />
  },
    {
      name: 'Contas',
      route: 'social-buffer.accounts.index',
      category: 'Configuração',
      icon: <UserCheck className="w-4 h-4" />
  },
    {
      name: 'Agendamentos',
      route: 'social-buffer.schedules.index',
      category: 'Planejamento',
      icon: <Calendar className="w-4 h-4" />
  },
    {
      name: 'Hashtags',
      route: 'social-buffer.hashtags.index',
      category: 'Conteúdo',
      icon: <Hash className="w-4 h-4" />
  },
    {
      name: 'Encurtador',
      route: 'social-buffer.link-shortener.index',
      category: 'Ferramentas',
      icon: <Link className="w-4 h-4" />
  },
    {
      name: 'Mídia',
      route: 'social-buffer.media.index',
      category: 'Conteúdo',
      icon: <Image className="w-4 h-4" />
  },
    {
      name: 'Engajamento',
      route: 'social-buffer.engagement.index',
      category: 'Análise',
      icon: <Zap className="w-4 h-4" />
  },
  ],

  // Aura (WhatsApp)
  aura: [
    {
      name: 'Chats',
      route: 'aura.chats.index',
      category: 'Conversas',
      icon: <MessageCircle className="w-4 h-4" />
  },
    {
      name: 'Conexões',
      route: 'aura.connections.index',
      category: 'Configuração',
      icon: <Globe className="w-4 h-4" />
  },
    {
      name: 'Fluxos',
      route: 'aura.flows.index',
      category: 'Automação',
      icon: <Workflow className="w-4 h-4" />
  },
    {
      name: 'Estatísticas',
      route: 'aura.stats.index',
      category: 'Análise',
      icon: <BarChart3 className="w-4 h-4" />
  },
  ],

  // Email Marketing
  emailMarketing: [
    {
      name: 'Campanhas',
      route: 'email-marketing.campaigns.index',
      category: 'Campanhas',
      icon: <Mail className="w-4 h-4" />
  },
  ],

  // Configurações e Administração
  admin: [
    {
      name: 'Usuários',
      route: 'users.index',
      category: 'Administração',
      icon: <Users className="w-4 h-4" />
  },
    {
      name: 'Configurações',
      route: 'settings.index',
      category: 'Sistema',
      icon: <Settings className="w-4 h-4" />
  },
    {
      name: 'Logs de Atividade',
      route: 'activity-logs.index',
      category: 'Monitoramento',
      icon: <Activity className="w-4 h-4" />
  },
    {
      name: 'Categorização',
      route: 'categorization.index',
      category: 'Organização',
      icon: <Tag className="w-4 h-4" />
  },
    {
      name: 'Produtos',
      route: 'products.index',
      category: 'Catálogo',
      icon: <Package className="w-4 h-4" />
  },
  ],};

/**
 * Função para obter navegação baseada na rota atual
 */
/**
 * Função para verificar permissões de navegação
 */
export const filterNavigationByPermissions = (
  navigation: NavigationItem[], 
  userPermissions: string[] = [] as unknown[]
): NavigationItem[] => {
  return (navigation || []).filter(item => {
    if (!item.permissions || item.permissions.length === 0) {
      return true; // Item público
    }
    
    return item.permissions.some(permission => 
      userPermissions.includes(permission));

  });};
