import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pin, 
  PinOff, 
  Search, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Menu,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import NavLink from '@/components/ui/NavLink';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Tooltip from '@/components/ui/Tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarRoutes } from '@/hooks/useSidebarRoutes';

// Hook para localStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });
  
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // ignore storage errors (private mode, etc.)
    }
  }, [key, value]);
  
  return [value, setValue] as const;
}

interface GlassmorphismSidebarProps {
  className?: string;
  onToggle?: (isOpen: boolean) => void;
}

const GlassmorphismSidebar: React.FC<GlassmorphismSidebarProps> = ({ 
  className,
  onToggle 
}) => {
  const { url } = usePage();
  const { menuItems, getActiveItem, getActiveSubmenu } = useSidebarRoutes();
  
  // Estados do sidebar
  const [isCollapsed, setIsCollapsed] = useLocalStorage('glassmorphism-sidebar-collapsed', false);
  const [isPinned, setIsPinned] = useLocalStorage('glassmorphism-sidebar-pinned', true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [expandedCategories, setExpandedCategories] = useLocalStorage('sidebar-expanded-categories', ['AI', 'Marketing', 'Principal']);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filtrar itens baseado na busca
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return menuItems;
    
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.subItems?.some(sub => 
        sub.name.toLowerCase().includes(query) ||
        sub.description?.toLowerCase().includes(query)
      )
    );
  }, [menuItems, searchQuery]);

  // Agrupar por categoria
  const categorizedItems = useMemo(() => {
    const categories = new Map<string, typeof menuItems>();
    filteredItems.forEach(item => {
      const category = item.category;
      categories.set(category, [...(categories.get(category) || []), item]);
    });
    return Array.from(categories.entries());
  }, [filteredItems]);

  // Handlers
  const toggleCollapse = useCallback(() => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onToggle?.(!newCollapsed);
  }, [isCollapsed, onToggle]);

  const togglePin = useCallback(() => setIsPinned(v => !v), []);
  const clearSearch = useCallback(() => setSearchQuery(''), []);

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

  const handleSubmenuToggle = useCallback((itemName: string) => {
    setActiveSubmenu(prev => prev === itemName ? null : itemName);
  }, []);

  // Auto-expandir categoria do item ativo
  useEffect(() => {
    if (getActiveItem && !expandedCategories.includes(getActiveItem.category)) {
      setExpandedCategories(prev => [...prev, getActiveItem.category]);
    }
  }, [getActiveItem, expandedCategories]);

  // Estilos dinâmicos
  const sidebarWidth = isCollapsed ? 'w-16' : 'w-80';
  const contentPadding = isCollapsed ? 'px-2' : 'px-4';

  return (
    <>
      {/* Overlay para mobile */}
      <AnimatePresence>
        {isMobile && !isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" 
            onClick={toggleCollapse} 
          />
        )}
      </AnimatePresence>

      {/* Sidebar Principal */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ 
          x: 0, 
          opacity: 1,
          width: isCollapsed ? 64 : 320
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          'fixed left-4 top-20 bottom-4 z-50 transition-all duration-300 ease-out rounded-3xl',
          // Glassmorphism effect
          'backdrop-blur-2xl bg-white/10 dark:bg-gray-900/10',
          'border border-white/20 dark:border-gray-700/30',
          'shadow-2xl shadow-black/10',
          'hover:bg-white/20 dark:hover:bg-gray-900/20',
          'hover:shadow-3xl hover:shadow-black/20',
          'hover:border-white/30 dark:hover:border-gray-600/40',
          // Responsive behavior
          !isPinned && !isHovered && 'translate-x-[-100%] opacity-0',
          !isPinned && isHovered && 'translate-x-0 opacity-100',
          isMobile && !isCollapsed && 'left-0 top-0 bottom-0 rounded-none',
          sidebarWidth,
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header do Sidebar */}
        <div className={cn(
          'flex items-center justify-between border-b border-white/10 dark:border-gray-700/30',
          contentPadding, 
          'py-4'
        )}>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 min-w-0 flex-1"
            >
              <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl backdrop-blur-sm border border-white/20">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                  xWin Dash
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'}
                </p>
              </div>
            </motion.div>
          )}
          
          <div className="flex items-center gap-1">
            {isMobile && (
              <Tooltip content="Fechar">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={toggleCollapse} 
                  className="w-8 h-8 p-0 hover:bg-white/20 dark:hover:bg-gray-800/50 backdrop-blur-sm"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Tooltip>
            )}
            
            <Tooltip content={isPinned ? 'Soltar' : 'Fixar'}>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={togglePin} 
                className="w-8 h-8 p-0 hover:bg-white/20 dark:hover:bg-gray-800/50 backdrop-blur-sm"
              >
                {isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
              </Button>
            </Tooltip>
            
            <Tooltip content={isCollapsed ? 'Expandir' : 'Recolher'}>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={toggleCollapse} 
                className="w-8 h-8 p-0 hover:bg-white/20 dark:hover:bg-gray-800/50 backdrop-blur-sm"
              >
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* Barra de Busca */}
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'border-b border-white/10 dark:border-gray-700/30', 
              contentPadding, 
              'py-3'
            )}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar funcionalidades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'pl-10 pr-4 py-2 text-sm',
                  'bg-white/20 dark:bg-gray-800/20',
                  'border-white/30 dark:border-gray-600/30',
                  'focus:bg-white/40 dark:focus:bg-gray-800/40',
                  'focus:border-primary/50 dark:focus:border-primary/50',
                  'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                  'backdrop-blur-sm transition-all duration-200',
                  'rounded-xl'
                )}
              />
              {searchQuery && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={clearSearch} 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 hover:bg-white/30 rounded-full"
                >
                  ×
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* Navegação */}
        <nav className={cn(
          'flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 dark:scrollbar-thumb-gray-600/20', 
          contentPadding, 
          'py-2'
        )}>
          {isCollapsed ? (
            // Modo colapsado
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const isActive = url.includes(item.route.split('/')[1]);
                return (
                  <Tooltip key={index} content={item.name} placement="right">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NavLink 
                        href={item.route} 
                        active={isActive} 
                        className={cn(
                          'flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200',
                          'hover:bg-white/30 dark:hover:bg-gray-800/60',
                          'hover:scale-110 hover:shadow-lg',
                          'backdrop-blur-sm border border-white/20',
                          isActive && 'bg-gradient-to-br from-primary/20 to-secondary/20 text-primary shadow-lg scale-110 border-primary/30'
                        )}
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          {item.icon}
                        </div>
                        {item.badge && (
                          <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center bg-red-500 text-white">
                            {item.badge}
                          </Badge>
                        )}
                        {item.isNew && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        )}
                      </NavLink>
                    </motion.div>
                  </Tooltip>
                );
              })}
            </div>
          ) : (
            // Modo expandido
            <div className="space-y-2">
              {categorizedItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <Search className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum item encontrado</p>
                  <Button size="sm" variant="outline" onClick={clearSearch} className="mt-2">
                    Limpar busca
                  </Button>
                </motion.div>
              ) : (
                categorizedItems.map(([category, categoryItems], categoryIndex) => {
                  const isExpanded = expandedCategories.includes(category);
                  
                  return (
                    <motion.div 
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: categoryIndex * 0.1 }}
                      className="space-y-1"
                    >
                      {/* Cabeçalho da Categoria */}
                      <button
                        onClick={() => toggleCategory(category)}
                        className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-white/10"
                      >
                        <span>{category}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {/* Itens da Categoria */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-1"
                          >
                            {categoryItems.map((item, itemIndex) => {
                              const isActive = url.includes(item.route.split('/')[1]);
                              const hasSubItems = item.subItems && item.subItems.length > 0;
                              const isSubmenuOpen = activeSubmenu === item.name;
                              
                              return (
                                <motion.div
                                  key={item.name}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: itemIndex * 0.05 }}
                                >
                                  <div className="relative">
                                    {/* Item Principal */}
                                    <NavLink
                                      href={item.route}
                                      active={isActive}
                                      className={cn(
                                        'group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative overflow-hidden',
                                        'hover:bg-white/30 dark:hover:bg-gray-800/60 hover:shadow-lg hover:scale-[1.02]',
                                        'backdrop-blur-sm border border-white/10',
                                        isActive && [
                                          'bg-gradient-to-r from-primary/20 to-secondary/10',
                                          'text-primary dark:text-primary-300',
                                          'shadow-lg shadow-primary/20 border-primary/30',
                                        ],
                                        item.isPrimary && 'bg-gradient-to-r from-primary/10 to-secondary/5 border-primary/20'
                                      )}
                                    >
                                      {/* Ícone com gradiente */}
                                      <div className={cn(
                                        'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
                                        'bg-white/30 dark:bg-gray-800/30',
                                        'group-hover:bg-white/50 dark:group-hover:bg-gray-700/50',
                                        'backdrop-blur-sm border border-white/20',
                                        isActive && 'bg-primary/20 text-primary border-primary/30',
                                        item.color && `bg-gradient-to-br ${item.color} text-white border-white/30`
                                      )}>
                                        {item.icon}
                                      </div>
                                      
                                      {/* Conteúdo */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <span className="font-medium text-sm truncate">{item.name}</span>
                                          <div className="flex items-center gap-1">
                                            {item.isNew && (
                                              <Badge className="bg-green-500 text-white text-xs px-1.5 py-0.5">
                                                Novo
                                              </Badge>
                                            )}
                                            {item.isPro && (
                                              <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0.5">
                                                Pro
                                              </Badge>
                                            )}
                                            {item.isBeta && (
                                              <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0.5">
                                                Beta
                                              </Badge>
                                            )}
                                            {item.badge && (
                                              <Badge variant="secondary" className="text-xs">
                                                {item.badge}
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                          {item.description}
                                        </p>
                                      </div>

                                      {/* Indicador de submenu */}
                                      {hasSubItems && (
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleSubmenuToggle(item.name);
                                          }}
                                          className="p-1 hover:bg-white/20 rounded backdrop-blur-sm"
                                        >
                                          {isSubmenuOpen ? 
                                            <ChevronUp className="w-4 h-4" /> : 
                                            <ChevronDown className="w-4 h-4" />
                                          }
                                        </button>
                                      )}

                                      {/* Barra lateral ativa */}
                                      {isActive && (
                                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-r-full" />
                                      )}
                                    </NavLink>

                                    {/* Submenu */}
                                    {hasSubItems && (
                                      <AnimatePresence>
                                        {isSubmenuOpen && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="ml-4 mt-1 space-y-1"
                                          >
                                            {item.subItems!.map((subItem, subIndex) => {
                                              const isSubActive = url.includes(subItem.route.split('/')[1]);
                                              
                                              return (
                                                <motion.div
                                                  key={subItem.name}
                                                  initial={{ opacity: 0, x: -10 }}
                                                  animate={{ opacity: 1, x: 0 }}
                                                  transition={{ delay: subIndex * 0.05 }}
                                                >
                                                  <NavLink
                                                    href={subItem.route}
                                                    active={isSubActive}
                                                    className={cn(
                                                      'group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
                                                      'hover:bg-white/20 dark:hover:bg-gray-800/40',
                                                      'text-sm backdrop-blur-sm border border-white/10',
                                                      isSubActive && 'bg-primary/10 text-primary border-primary/20'
                                                    )}
                                                  >
                                                    <div className="w-4 h-4 flex items-center justify-center text-gray-400 group-hover:text-gray-600">
                                                      {subItem.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                      <div className="flex items-center gap-2">
                                                        <span className="truncate">{subItem.name}</span>
                                                        {subItem.isNew && (
                                                          <Badge className="bg-green-500 text-white text-xs px-1 py-0">
                                                            Novo
                                                          </Badge>
                                                        )}
                                                        {subItem.isPro && (
                                                          <Badge className="bg-yellow-500 text-white text-xs px-1 py-0">
                                                            Pro
                                                          </Badge>
                                                        )}
                                                        {subItem.isBeta && (
                                                          <Badge className="bg-blue-500 text-white text-xs px-1 py-0">
                                                            Beta
                                                          </Badge>
                                                        )}
                                                      </div>
                                                      {subItem.description && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                          {subItem.description}
                                                        </p>
                                                      )}
                                                    </div>
                                                  </NavLink>
                                                </motion.div>
                                              );
                                            })}
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </nav>

        {/* Footer do Sidebar */}
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'border-t border-white/10 dark:border-gray-700/30',
              contentPadding,
              'py-3'
            )}
          >
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Zap className="w-3 h-3" />
              <span>Powered by xWin Dash</span>
            </div>
          </motion.div>
        )}
      </motion.aside>

      {/* Espaçador para o conteúdo */}
      <div className={cn(
        'transition-all duration-300 lg:block hidden', 
        isPinned && !isCollapsed ? (isCollapsed ? 'ml-20' : 'ml-84') : 'ml-0'
      )} />
    </>
  );
};

export default GlassmorphismSidebar;
