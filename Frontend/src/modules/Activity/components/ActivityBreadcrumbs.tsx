/**
 * Breadcrumbs do módulo Activity
 *
 * @description
 * Componente de breadcrumbs para navegação hierárquica no módulo Activity.
 * Exibe links para Dashboard e Atividades com ícones e separadores.
 *
 * @module modules/Activity/components/ActivityBreadcrumbs
 * @since 1.0.0
 */

import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, Home, Activity } from 'lucide-react';

/**
 * Props do componente ActivityBreadcrumbs
 *
 * @interface ActivityBreadcrumbsProps
 * @property {string} [className] - Classes CSS adicionais
 */
interface ActivityBreadcrumbsProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente ActivityBreadcrumbs
 *
 * @description
 * Renderiza breadcrumbs com links para Dashboard e Atividades.
 * Exibe ícones e separadores entre os itens.
 *
 * @param {ActivityBreadcrumbsProps} props - Props do componente
 * @returns {JSX.Element} Breadcrumbs de atividade
 */
export const ActivityBreadcrumbs: React.FC<ActivityBreadcrumbsProps> = ({ className    }) => {
  const breadcrumbs = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home
    },
    {
      name: 'Atividades',
      href: '/activity',
      icon: Activity,
      current: true
    }
  ];

  return (
            <nav className={`flex items-center space-x-2 text-sm ${className} `} />
      { (breadcrumbs || []).map((breadcrumb: unknown, index: unknown) => {
        const Icon = breadcrumb.icon;
        const isLast = index === breadcrumbs.length - 1;
        
        return (
                  <React.Fragment key={breadcrumb.name } />
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
            
            {isLast ? (
              <div className=" ">$2</div><Icon className="h-4 w-4" />
                <span className="font-medium">{breadcrumb.name}</span>
      </div>
    </>
  ) : (
              <Link
                href={ breadcrumb.href }
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" />
                <Icon className="h-4 w-4" />
                <span>{breadcrumb.name}</span>
      </Link>
    </>
  )}
          </React.Fragment>);

      })}
    </nav>);};

export default ActivityBreadcrumbs;
