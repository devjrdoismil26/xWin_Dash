import React from 'react';
import { Menu, X } from 'lucide-react';
import NavLink from '@/components/ui/NavLink';
import ProjectSelector from '../ProjectSelector';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  navigation: any[];
  isActiveRoute: (route: string, href: string) => boolean;
  showProjectSelector: boolean;
  projectsList: any[];
  activeProject: any;
  className?: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onToggle,
  navigation,
  isActiveRoute,
  showProjectSelector,
  projectsList,
  activeProject,
  className = ''
}) => {
  return (
    <>
      {/* Mobile menu button */}
      <div className={`flex items-center sm:hidden ${className}`}>
        <button
          onClick={onToggle}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
        >
          <span className="sr-only">Abrir menu principal</span>
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu content */}
      {isOpen && (
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = isActiveRoute(item.route, item.href);
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  active={isActive}
                  className={cn(
                    "flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Mobile Project Selector */}
          {showProjectSelector && (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="px-4">
                <ProjectSelector
                  projects={projectsList}
                  activeProject={activeProject}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MobileMenu;