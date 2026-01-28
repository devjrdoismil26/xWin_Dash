import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Animated } from '@/components/ui/AdvancedAnimations';
import { 
  Settings, 
  Shield, 
  Users, 
  Database, 
  Mail, 
  Zap, 
  Globe, 
  Key,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

// =========================================
// INTERFACES
// =========================================

export interface SettingsCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  count?: number;
  status?: 'active' | 'warning' | 'error';
  subcategories?: SettingsSubcategory[];
}

export interface SettingsSubcategory {
  id: string;
  name: string;
  count?: number;
  status?: 'active' | 'warning' | 'error';
}

export interface SettingsSidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  collapsed?: boolean;
  stats?: {
    totalSettings: number;
    totalCategories: number;
    lastUpdated: string | null;
    systemHealth: 'healthy' | 'warning' | 'error';
  };
  className?: string;
}

// =========================================
// DADOS DAS CATEGORIAS
// =========================================

const settingsCategories: SettingsCategory[] = [
  {
    id: 'general',
    name: 'Geral',
    description: 'Configurações básicas do sistema',
    icon: Settings,
    color: 'blue',
    count: 12,
    status: 'active'
  },
  {
    id: 'auth',
    name: 'Autenticação',
    description: 'Configurações de segurança e login',
    icon: Shield,
    color: 'red',
    count: 8,
    status: 'active',
    subcategories: [
      { id: 'auth-password', name: 'Senhas', count: 3, status: 'active' },
      { id: 'auth-session', name: 'Sessões', count: 2, status: 'active' },
      { id: 'auth-2fa', name: '2FA', count: 2, status: 'warning' },
      { id: 'auth-oauth', name: 'OAuth', count: 1, status: 'active' }
    ]
  },
  {
    id: 'users',
    name: 'Usuários',
    description: 'Gestão de usuários e permissões',
    icon: Users,
    color: 'green',
    count: 6,
    status: 'active'
  },
  {
    id: 'database',
    name: 'Banco de Dados',
    description: 'Configurações do banco de dados',
    icon: Database,
    color: 'purple',
    count: 4,
    status: 'active'
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Configurações de email e SMTP',
    icon: Mail,
    color: 'orange',
    count: 5,
    status: 'warning'
  },
  {
    id: 'integrations',
    name: 'Integrações',
    description: 'APIs e integrações externas',
    icon: Zap,
    color: 'yellow',
    count: 3,
    status: 'active'
  },
  {
    id: 'ai',
    name: 'IA',
    description: 'Configurações de inteligência artificial',
    icon: Globe,
    color: 'indigo',
    count: 2,
    status: 'active'
  },
  {
    id: 'api',
    name: 'API',
    description: 'Tokens e configurações de API',
    icon: Key,
    color: 'gray',
    count: 4,
    status: 'active'
  }
];

// =========================================
// COMPONENTE
// =========================================

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeCategory,
  onCategoryChange,
  collapsed = false,
  stats,
  className = ''
}) => {
  // ===== ESTADO LOCAL =====
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set(['auth']));

  // ===== HANDLERS =====

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange(categoryId);
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    onCategoryChange(subcategoryId);
  };

  const handleToggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // ===== RENDERIZAÇÃO =====

  if (collapsed) {
    return (
      <aside className={`fixed left-0 top-0 h-full w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 ${className}`}>
        <div className="p-2">
          {settingsCategories.map((category, index) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <Animated key={category.id} type="fade" delay={index * 50}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full h-12 mb-2 relative ${
                    isActive 
                      ? `bg-${category.color}-500 text-white` 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  {category.status === 'warning' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full" />
                  )}
                  {category.status === 'error' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </Button>
              </Animated>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <aside className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 overflow-y-auto ${className}`}>
      <div className="p-4">
        {/* Header da Sidebar */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Configurações
          </h2>
          {stats && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p>{stats.totalSettings} configurações em {stats.totalCategories} categorias</p>
              {stats.lastUpdated && (
                <p className="text-xs mt-1">
                  Atualizado em {new Date(stats.lastUpdated).toLocaleTimeString('pt-BR')}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Lista de Categorias */}
        <div className="space-y-2">
          {settingsCategories.map((category, index) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === category.id;
            const isExpanded = expandedCategories.has(category.id);
            const hasSubcategories = category.subcategories && category.subcategories.length > 0;
            
            return (
              <Animated key={category.id} type="slideRight" delay={index * 100}>
                <Card className={`overflow-hidden ${
                  isActive 
                    ? `border-${category.color}-500 bg-${category.color}-50 dark:bg-${category.color}-900/20` 
                    : 'hover:shadow-md transition-shadow'
                }`}>
                  {/* Categoria Principal */}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (hasSubcategories) {
                        handleToggleExpanded(category.id);
                      } else {
                        handleCategoryClick(category.id);
                      }
                    }}
                    className={`w-full justify-start p-3 h-auto ${
                      isActive 
                        ? `text-${category.color}-700 dark:text-${category.color}-300` 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center w-full">
                      <IconComponent className={`h-5 w-5 mr-3 ${
                        isActive 
                          ? `text-${category.color}-600 dark:text-${category.color}-400` 
                          : 'text-gray-500'
                      }`} />
                      
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{category.name}</span>
                          <div className="flex items-center gap-2">
                            {category.count && (
                              <Badge variant="secondary" size="sm">
                                {category.count}
                              </Badge>
                            )}
                            {category.status === 'warning' && (
                              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                            )}
                            {category.status === 'error' && (
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {category.description}
                        </p>
                      </div>
                      
                      {hasSubcategories && (
                        <div className="ml-2">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      )}
                    </div>
                  </Button>

                  {/* Subcategorias */}
                  {hasSubcategories && isExpanded && (
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      {category.subcategories!.map((subcategory) => {
                        const isSubActive = activeCategory === subcategory.id;
                        
                        return (
                          <Button
                            key={subcategory.id}
                            variant="ghost"
                            onClick={() => handleSubcategoryClick(subcategory.id)}
                            className={`w-full justify-start p-2 pl-12 h-auto text-sm ${
                              isSubActive 
                                ? `text-${category.color}-700 dark:text-${category.color}-300 bg-${category.color}-100 dark:bg-${category.color}-900/30` 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{subcategory.name}</span>
                              <div className="flex items-center gap-2">
                                {subcategory.count && (
                                  <Badge variant="outline" size="sm">
                                    {subcategory.count}
                                  </Badge>
                                )}
                                {subcategory.status === 'warning' && (
                                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                                )}
                                {subcategory.status === 'error' && (
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                )}
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </Animated>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

// =========================================
// EXPORTS
// =========================================

export default SettingsSidebar;
