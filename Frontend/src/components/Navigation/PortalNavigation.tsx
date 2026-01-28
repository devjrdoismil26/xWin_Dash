import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  Home, 
  Sparkles, 
  LayoutGrid, 
  Users, 
  Mail, 
  Share2, 
  MessageCircle, 
  Target, 
  Brain, 
  BarChart3, 
  Image, 
  Package, 
  Activity,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProject } from '@/contexts/ProjectContext';

interface PortalNavigationProps {
  className?: string;
}

const PortalNavigation: React.FC<PortalNavigationProps> = ({ className }) => {
  const { activeProject, projectMode } = useProject();
  const { url } = usePage();

  const navigationItems = [
    {
      name: 'Portal Hub',
      href: '/portal',
      icon: Home,
      isPrimary: true,
      show: true
    },
    {
      name: 'Universe',
      href: '/universe',
      icon: Sparkles,
      isPrimary: true,
      show: true
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutGrid,
      show: activeProject && projectMode === 'normal'
    },
    {
      name: 'Leads',
      href: '/leads',
      icon: Users,
      show: activeProject
    },
    {
      name: 'Email Marketing',
      href: '/email-marketing',
      icon: Mail,
      show: activeProject
    },
    {
      name: 'Social Buffer',
      href: '/social-buffer',
      icon: Share2,
      show: activeProject
    },
    {
      name: 'Aura WhatsApp',
      href: '/aura',
      icon: MessageCircle,
      show: activeProject
    },
    {
      name: 'Ads Tool',
      href: '/adstool',
      icon: Target,
      show: activeProject
    },
    {
      name: 'AI Laboratory',
      href: '/ai',
      icon: Brain,
      show: activeProject
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      show: activeProject
    },
    {
      name: 'Mídia',
      href: '/media',
      icon: Image,
      show: activeProject
    },
    {
      name: 'Produtos',
      href: '/products',
      icon: Package,
      show: activeProject
    },
    {
      name: 'Workflows',
      href: '/workflows',
      icon: Activity,
      show: activeProject
    },
    {
      name: 'Configurações',
      href: '/settings',
      icon: Settings,
      show: true
    }
  ];

  const visibleItems = navigationItems.filter(item => item.show);

  return (
    <nav className={cn("space-y-1", className)}>
      {visibleItems.map((item) => {
        const isActive = url === item.href || url.startsWith(item.href + '/');
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? item.isPrimary
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                : item.isPrimary
                ? "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <Icon
              className={cn(
                "mr-3 h-5 w-5 flex-shrink-0",
                isActive
                  ? item.isPrimary
                    ? "text-white"
                    : "text-slate-500 dark:text-slate-400"
                  : "text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300"
              )}
            />
            {item.name}
            {item.isPrimary && (
              <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                {item.name === 'Portal Hub' ? 'Hub' : 'AI'}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default PortalNavigation;
