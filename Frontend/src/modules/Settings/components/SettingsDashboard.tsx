import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { LoadingSpinner, LoadingSkeleton } from '@/shared/components/ui/LoadingStates';
import { PageTransition, Animated } from '@/shared/components/ui/AdvancedAnimations';
import { ResponsiveGrid, ResponsiveContainer } from '@/shared/components/ui/ResponsiveSystem';
import ErrorState from '@/shared/components/ui/ErrorState';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { useSettings, useSettingsStore, useSettingsSelectors } from '../hooks';
import { Settings, Shield, Users, Database, Mail, Zap, Globe, Key, Settings2 } from 'lucide-react';

// =========================================
// INTERFACES
// =========================================

export interface SettingsCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<Record<string, any>>;
  color: string;
  count: number;
  isActive: boolean;
  isEnabled: boolean; }

export interface SettingsDashboardProps {
  className?: string;
  onCategorySelect??: (e: any) => void;
  showAdvancedMode?: boolean;
  onAdvancedModeToggle??: (e: any) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

export const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ className = '',
  onCategorySelect,
  showAdvancedMode = false,
  onAdvancedModeToggle
   }) => {
  // ===== HOOKS =====
  const { stats, loading, error, activeCategory, setActiveCategory } = useSettings();

  const { ui, setSidebarOpen, setAdvancedMode } = useSettingsStore();

  const { useGeneralSettingsStats, useAuthSettingsStats } = useSettingsSelectors;
  
  const generalStats = useGeneralSettingsStats();

  const authStats = useAuthSettingsStats();

  // ===== ESTADO LOCAL =====
  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategory);

  // ===== CATEGORIAS DE CONFIGURAÇÕES =====
  const settingsCategories: SettingsCategory[] = useMemo(() => [
    {
      id: 'general',
      name: 'Geral',
      description: 'Configurações básicas do sistema',
      icon: Settings,
      color: 'blue',
      count: generalStats.total,
      isActive: selectedCategory === 'general',
      isEnabled: true
    },
    {
      id: 'auth',
      name: 'Autenticação',
      description: 'Configurações de segurança e login',
      icon: Shield,
      color: 'red',
      count: authStats.total,
      isActive: selectedCategory === 'auth',
      isEnabled: true
    },
    {
      id: 'users',
      name: 'Usuários',
      description: 'Gestão de usuários e permissões',
      icon: Users,
      color: 'green',
      count: 0,
      isActive: selectedCategory === 'users',
      isEnabled: false
    },
    {
      id: 'database',
      name: 'Banco de Dados',
      description: 'Configurações do banco de dados',
      icon: Database,
      color: 'purple',
      count: 0,
      isActive: selectedCategory === 'database',
      isEnabled: false
    },
    {
      id: 'email',
      name: 'Email',
      description: 'Configurações de email e SMTP',
      icon: Mail,
      color: 'orange',
      count: 0,
      isActive: selectedCategory === 'email',
      isEnabled: false
    },
    {
      id: 'integrations',
      name: 'Integrações',
      description: 'APIs e integrações externas',
      icon: Zap,
      color: 'yellow',
      count: 0,
      isActive: selectedCategory === 'integrations',
      isEnabled: false
    },
    {
      id: 'ai',
      name: 'IA',
      description: 'Configurações de inteligência artificial',
      icon: Globe,
      color: 'indigo',
      count: 0,
      isActive: selectedCategory === 'ai',
      isEnabled: false
    },
    {
      id: 'api',
      name: 'API',
      description: 'Tokens e configurações de API',
      icon: Key,
      color: 'gray',
      count: 0,
      isActive: selectedCategory === 'api',
      isEnabled: false
    }
  ], [selectedCategory, generalStats.total, authStats.total]);

  // ===== HANDLERS =====

  /**
   * Selecionar categoria
   */
  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);

    setActiveCategory(categoryId);

    onCategorySelect?.(categoryId);

  }, [setActiveCategory, onCategorySelect]);

  /**
   * Toggle modo avançado
   */
  const handleAdvancedModeToggle = useCallback(() => {
    const newMode = !ui.advancedMode;
    setAdvancedMode(newMode);

    onAdvancedModeToggle?.(newMode);

  }, [ui.advancedMode, setAdvancedMode, onAdvancedModeToggle]);

  // ===== EFEITOS =====

  // Sincronizar categoria selecionada com estado global
  useEffect(() => {
    setSelectedCategory(activeCategory);

  }, [activeCategory]);

  // ===== RENDERIZAÇÃO =====

  if (loading) { return (
        <>
      <PageTransition type="fade" duration={500 } />
      <div className={`py-6 ${className} `}>
           
        </div><div className=" ">$2</div><LoadingSkeleton className="h-8 w-64 mb-2" />
            <LoadingSkeleton className="h-4 w-96" /></div><ResponsiveGrid columns={ xs: 1, sm: 2, md: 3, lg: 4 } gap={ 6 } />
            {Array.from({ length: 8 }).map((_: unknown, index: unknown) => (
              <LoadingSkeleton key={index} className="h-32" />
            ))}
          </ResponsiveGrid></div></PageTransition>);

  }

  if (error) { return (
        <>
      <PageTransition type="fade" duration={500 } />
      <div className={`py-6 ${className} `}>
           
        </div><ErrorState
            title="Erro ao carregar configurações"
            message={ error }
            onRetry={ () => window.location.reload() } /></div></PageTransition>);

  }

  return (
        <>
      <PageTransition type="fade" duration={ 500 } />
      <div className={`py-6 ${className} `}>
           
        </div>{/* Header */}
        <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><h1 className="text-3xl font-bold text-gray-900 dark:text-white" />
                Configurações do Sistema
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2" />
                Gerencie todas as configurações da sua plataforma
              </p></div><div className="{showAdvancedMode && (">$2</div>
                <button
                  onClick={ handleAdvancedModeToggle }
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    ui.advancedMode
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  } `} />
                  <Settings2 className="h-4 w-4" />
                  {ui.advancedMode ? 'Modo Avançado' : 'Modo Simples'}
                </button>
              )}
            </div>
        </div>

        {/* Categories Grid */}
        <ResponsiveGrid
          columns={ xs: 1, sm: 2, md: 3, lg: 4 } gap={ 6 } />
          {(settingsCategories || []).map((category: unknown, index: unknown) => {
            const IconComponent = category.icon;
            const isEnabled = category.isEnabled;
            
            return (
        <>
      <Animated key={category.id} type="fade" />
      <Card 
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                    category.isActive 
                      ? 'ring-2 ring-blue-500 shadow-lg' 
                      : 'hover:shadow-lg'
                  } ${
                    !isEnabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                  onClick={ () => isEnabled && handleCategorySelect(category.id)  }>
                  <Card.Header />
                    <div className=" ">$2</div><div className={`p-2 rounded-lg bg-${category.color} -100 dark:bg-${category.color}-900/20`}>
           
        </div><IconComponent className={`h-6 w-6 text-${category.color} -600 dark:text-${category.color}-400`} / /></div><div className=" ">$2</div><Card.Title className="text-lg flex items-center justify-between" />
                          {category.name}
                          {category.count > 0 && (
                            <span className={`text-xs px-2 py-1 rounded-full bg-${category.color} -100 dark:bg-${category.color}-900/20 text-${category.color}-600 dark:text-${category.color}-400`}>
           
        </span>{category.count}
                            </span>
                          )}
                        </Card.Title>
                        <p className="text-sm text-gray-600 dark:text-gray-300" />
                          {category.description}
                        </p></div></Card.Header>
                  
                  {!isEnabled && (
                    <Card.Content />
                      <div className="Em desenvolvimento">$2</div>
                      </div>
      </Card.Content>
    </>
  )}
                </Card>
              </Animated>);

          })}
        </ResponsiveGrid>

        {/* Quick Stats */}
        <div className=" ">$2</div><Card />
            <Card.Header />
              <Card.Title>Status do Sistema</Card.Title>
            </Card.Header>
            <Card.Content />
              <ResponsiveGrid
                columns={ xs: 2, sm: 4 } gap={ 4 } />
                <div className=" ">$2</div><div className="{stats.totalCategories}">$2</div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Categorias</p></div><div className=" ">$2</div><div className="{stats.totalSettings}">$2</div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Configurações</p></div><div className=" ">$2</div><div className="{stats.activeSettings}">$2</div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Ativas</p></div><div className=" ">$2</div><div className="{stats.maintenanceMode ? 'Manutenção' : '100%'}">$2</div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Status</p></div></ResponsiveGrid>
            </Card.Content></Card></div>

        {/* Advanced Mode Stats */}
        {ui.advancedMode && (
          <div className=" ">$2</div><Card />
              <Card.Header />
                <Card.Title>Estatísticas Avançadas</Card.Title>
              </Card.Header>
              <Card.Content />
                <ResponsiveGrid
                  columns={ xs: 2, sm: 4 } gap={ 4 } />
                  <div className=" ">$2</div><div className="{stats.twoFactorEnabled ? 'Ativo' : 'Inativo'}">$2</div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">2FA</p></div><div className=" ">$2</div><div className="{stats.oauthEnabled ? 'Ativo' : 'Inativo'}">$2</div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">OAuth</p></div><div className=" ">$2</div><div className="{stats.debugMode ? 'Ativo' : 'Inativo'}">$2</div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Debug</p></div><div className=" ">$2</div><div className="{ui.theme}">$2</div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Tema</p></div></ResponsiveGrid>
              </Card.Content></Card></div>
        )}
      </div>
    </PageTransition>);};

// =========================================
// EXPORTS
// =========================================

export default SettingsDashboard;
