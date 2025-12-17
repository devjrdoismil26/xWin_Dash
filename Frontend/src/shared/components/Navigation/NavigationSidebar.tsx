/**
 * ModernSidebar - Sidebar Moderna
 * Refatorado em 28/11/2025 - Reduzido de 639 linhas (28KB) para ~200 linhas (7KB)
 */

import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import NavLink from '@/shared/components/ui/NavLink';
import { useSidebarRoutes } from '@/hooks/useSidebarRoutes';

interface ModernSidebarProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const ModernSidebar: React.FC<ModernSidebarProps> = ({ className    }) => {
  const { url } = usePage();

  const { menuItems } = useSidebarRoutes();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
            <>
      {/* Mobile Toggle */}
      <button
        onClick={ () => setIsMobileOpen(!isMobileOpen) }
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside}
        className={cn(
          'fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40',
          'hidden lg:block',
          className
        ) } />
        <div className="{/* Header */}">$2</div>
          <div className="{!isCollapsed && (">$2</div>
              <div className=" ">$2</div><div className=" ">$2</div><span className="text-white font-bold">X</span></div><span className="font-bold text-lg">xWin</span>
      </div>
    </>
  )}
            <button
              onClick={ () => setIsCollapsed(!isCollapsed) }
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto" />
            {menuItems.map((category: unknown) => (
              <div key={category.category} className="mb-4">
           
        </div>{!isCollapsed && (
                  <p className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2" />
                    {category.category}
                  </p>
                )}
                {category.items.map((item: unknown) => {
                  const Icon = item.icon;
                  const isActive = url.startsWith(item.href);

                  return (
        <>
      <NavLink
                      key={ item.href }
                      href={ item.href }
                      active={ isActive }
                      className={cn(
                        'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      ) } />
      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </NavLink>);

                })}
              </div>
            ))}
          </nav></div></aside>

      {/* Mobile Sidebar */}
      <AnimatePresence />
        {isMobileOpen && (
          <>
            <div}
              onClick={ () => setIsMobileOpen(false) }
              className="lg:hidden fixed inset-0 bg-black/50 z-40" />
            <aside}
              className="lg:hidden fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 z-50 p-4" />
              <nav className="space-y-1" />
                {menuItems.map((category: unknown) => (
                  <div key={category.category} className="mb-4">
           
        </div><p className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2" />
                      {category.category}
                    </p>
                    {category.items.map((item: unknown) => {
                      const Icon = item.icon;
                      const isActive = url.startsWith(item.href);

                      return (
                                <NavLink
                          key={ item.href }
                          href={ item.href }
                          active={ isActive }
                          onClick={ () => setIsMobileOpen(false) }
                          className={cn(
                            'flex items-center space-x-3 px-3 py-2 rounded-lg',
                            isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                          )  }>
                          <Icon className="h-5 w-5" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </NavLink>);

                    })}
                  </div>
                ))}
              </nav></aside></>
        )}
      </AnimatePresence>
    </>);};

export default ModernSidebar;
