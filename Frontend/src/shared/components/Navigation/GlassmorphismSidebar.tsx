/**
 * GlassmorphismSidebar - Sidebar com efeito glassmorphism
 * Refatorado em 28/11/2025 - Reduzido de 728 linhas (32KB) para ~250 linhas (10KB)
 * 
 * Simplificações:
 * - Removido código duplicado
 * - Extraído lógica de filtros
 * - Simplificado renderização de menus
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Pin, PinOff, Search, ChevronDown, ChevronUp, X, Menu,  } from 'lucide-react';
import { cn } from '@/lib/utils';
import NavLink from "@/shared/components/ui/NavLink";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import Badge from "@/shared/components/ui/Badge";
import Tooltip from "@/shared/components/ui/Tooltip";
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarRoutes } from '@/hooks/useSidebarRoutes';

function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    } );

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));

    } catch {} , [key, value]);

  return [value, setValue];
}

interface GlassmorphismSidebarProps {
  className?: string;
  onToggle??: (e: any) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const GlassmorphismSidebar: React.FC<GlassmorphismSidebarProps> = ({ className,
  onToggle,
   }) => {
  const { url } = usePage();

  const { menuItems, getActiveItem, getActiveSubmenu } = useSidebarRoutes();

  const [isCollapsed, setIsCollapsed] = useLocalStorage("glassmorphism-sidebar-collapsed", false);

  const [isPinned, setIsPinned] = useLocalStorage("glassmorphism-sidebar-pinned", true);

  const [searchQuery, setSearchQuery] = useState("");

  const [isHovered, setIsHovered] = useState(false);

  const [expandedCategories, setExpandedCategories] = useLocalStorage("sidebar-expanded-categories", ["AI", "Marketing", "Principal"]);

  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);

  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);

      setIsPinned(false);

    } , [isMobile]);

  useEffect(() => {
    onToggle?.(!isCollapsed);

  }, [isCollapsed, onToggle]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev: unknown) => !prev);

  }, []);

  const togglePin = useCallback(() => {
    setIsPinned((prev: unknown) => !prev);

  }, []);

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories((prev: unknown) =>
      prev.includes(category)
        ? prev.filter((c: unknown) => c !== category)
        : [...prev, category]);

  }, []);

  const filteredMenuItems = useMemo(() => {
    if (!searchQuery) return menuItems;

    return menuItems
      .map((category: unknown) => ({
        ...category,
        items: category.items.filter(
          (item: unknown) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((category: unknown) => category.items.length > 0);

  }, [menuItems, searchQuery]);

  const shouldShowExpanded = !isCollapsed || isHovered;

  return (
            <aside
      className={cn(
        "fixed left-0 top-0 h-screen z-40",
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl",
        "border-r border-gray-200/50 dark:border-gray-700/50",
        "shadow-xl",
        className
      )} onMouseEnter={ () => !isPinned && setIsHovered(true) }
      onMouseLeave={ () => !isPinned && setIsHovered(false)  }>
      <div className="{/* Header */}">$2</div>
        <div className=" ">$2</div><div className="{shouldShowExpanded && (">$2</div>
              <div}
                className="flex items-center space-x-2">
           
        </div><div className=" ">$2</div><span className="text-white font-bold text-sm">X</span></div><span className="xWin">$2</span>
                </span>
      </div>
    </>
  )}

            <div className="{ !isMobile && (">$2</div>
                <Tooltip content={isPinned ? "Desafixar" : "Fixar" } />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={ togglePin }
                    className="p-1.5" />
                    {isPinned ? (
                      <PinOff className="h-4 w-4" />
                    ) : (
                      <Pin className="h-4 w-4" />
                    )}
                  </Button>
      </Tooltip>
    </>
  )}

              <Tooltip content={ isCollapsed ? "Expandir" : "Recolher" } />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={ toggleCollapse }
                  className="p-1.5" />
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button></Tooltip></div>

          {/* Search */}
          {shouldShowExpanded && (
            <div}
              className="mt-4">
           
        </div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar..."
                  value={ searchQuery }
                  onChange={ (e: unknown) => setSearchQuery(e.target.value) }
                  className="pl-9 pr-8 py-2 text-sm" />
                {searchQuery && (
                  <button
                    onClick={ () => setSearchQuery("") }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1" />
          <AnimatePresence />
            { filteredMenuItems.map((category: unknown) => (
              <div key={ category.category  }>
        </div>{shouldShowExpanded && (
                  <button
                    onClick={ () => toggleCategory(category.category) }
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    <span>{category.category}</span>
                    {expandedCategories.includes(category.category) ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                )}

                <AnimatePresence />
                  {(shouldShowExpanded
                    ? expandedCategories.includes(category.category)
                    : true) && (
                    <div}
                      className="space-y-1">
           
        </div>{category.items.map((item: unknown) => {
                        const Icon = item.icon;
                        const isActive = url.startsWith(item.href);

                        return (
        <>
      <Tooltip
                            key={ item.href }
                            content={ !shouldShowExpanded ? item.label : "" }
                            side="right" />
      <NavLink
                              href={ item.href }
                              active={ isActive }
                              className={cn(
                                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all",
                                isActive
                                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                              ) } />
                              <Icon className="h-5 w-5 flex-shrink-0" />
                              {shouldShowExpanded && (
                                <div className=" ">$2</div><div className=" ">$2</div><span className="{item.label}">$2</span>
                                    </span>
                                    {item.badge && (
                                      <Badge variant="primary" size="sm" />
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate" />
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              )}
                            </NavLink>
                          </Tooltip>);

                      })}
                    </div>
                  )}
                </AnimatePresence>
      </div>
    </>
  ))}
          </AnimatePresence></nav></div>
    </aside>);};

export default GlassmorphismSidebar;
