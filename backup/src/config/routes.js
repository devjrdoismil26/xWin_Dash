import { lazy } from 'react';

const Dashboard = lazy(() => import('@/modules/Dashboard'));
const Projects = lazy(() => import('@/modules/Projects'));
const Users = lazy(() => import('@/modules/Users'));
const Leads = lazy(() => import('@/modules/Leads'));
const Products = lazy(() => import('@/modules/Products'));
const Workflows = lazy(() => import('@/modules/Workflows'));
const EmailMarketing = lazy(() => import('@/modules/EmailMarketing'));
const ADStool = lazy(() => import('@/modules/ADStool'));
const Analytics = lazy(() => import('@/modules/Analytics'));
const AI = lazy(() => import('@/modules/AI'));
const Aura = lazy(() => import('@/modules/Aura'));
const SocialBuffer = lazy(() => import('@/modules/SocialBuffer'));
const MediaLibrary = lazy(() => import('@/modules/MediaLibrary'));
const Settings = lazy(() => import('@/modules/Settings'));

export const routesConfig = [
  { path: '/dashboard', component: Dashboard, name: 'Dashboard', icon: 'dashboard', requiresAuth: true },
  { path: '/projects', component: Projects, name: 'Projetos', icon: 'folder', requiresAuth: true },
  { path: '/users', component: Users, name: 'Usuários', icon: 'users', requiresAuth: true, requiredPermissions: ['manage_users'] },
  { path: '/leads', component: Leads, name: 'Leads', icon: 'contact', requiresAuth: true },
  { path: '/products', component: Products, name: 'Produtos', icon: 'package', requiresAuth: true },
  { path: '/workflows', component: Workflows, name: 'Workflows', icon: 'workflow', requiresAuth: true },
  { path: '/email-marketing', component: EmailMarketing, name: 'Email Marketing', icon: 'mail', requiresAuth: true },
  { path: '/ads', component: ADStool, name: 'Anúncios', icon: 'megaphone', requiresAuth: true },
  { path: '/analytics', component: Analytics, name: 'Analytics', icon: 'chart', requiresAuth: true },
  { path: '/ai', component: AI, name: 'IA', icon: 'brain', requiresAuth: true },
  { path: '/aura', component: Aura, name: 'Aura', icon: 'message-circle', requiresAuth: true },
  { path: '/social', component: SocialBuffer, name: 'Social Media', icon: 'share', requiresAuth: true },
  { path: '/media', component: MediaLibrary, name: 'Biblioteca', icon: 'image', requiresAuth: true },
  { path: '/settings', component: Settings, name: 'Configurações', icon: 'settings', requiresAuth: true },
];

export default routesConfig;
