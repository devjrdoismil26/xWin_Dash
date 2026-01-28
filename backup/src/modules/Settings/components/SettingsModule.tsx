import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { PageTransition, Animated } from '@/components/ui/AdvancedAnimations';
import { ResponsiveContainer } from '@/components/ui/ResponsiveSystem';
import { useSettings, useSettingsStore, useSettingsSelectors } from '../hooks';
import { SettingsDashboard, SettingsHeader, GeneralSettings, AuthSettings, UserSettings } from './';
import { Settings, Settings2 } from 'lucide-react';

// =========================================
// INTERFACES
// =========================================

export interface SettingsModuleProps {
  className?: string;
  initialCategory?: string;
  showAdvancedMode?: boolean;
  onCategoryChange?: (category: string) => void;
  onAdvancedModeToggle?: (enabled: boolean) => void;
}

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  className = '',
  initialCategory = 'general',
  showAdvancedMode = true,
  onCategoryChange,
  onAdvancedModeToggle
}) => {
  // ===== HOOKS =====
  const { 
    activeCategory, 
    setActiveCategory, 
    stats, 
    loading, 
    error, 
    refreshAllSettings 
  } = useSettings();
  
  const { ui, setAdvancedMode } = useSettingsStore();
  const { useAdvancedMode } = useSettingsSelectors;
  
  const advancedMode = useAdvancedMode();

  // ===== ESTADO LOCAL =====
  const [currentView, setCurrentView] = useState<'dashboard' | 'category'>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  // ===== HANDLERS =====

  /**
   * Selecionar categoria
   */
  const handleCategorySelect = useCallback((category: string) => {
    setActiveCategory(category);
    setCurrentView('category');
    onCategoryChange?.(category);
  }, [setActiveCategory, onCategoryChange]);

  /**
   * Voltar ao dashboard
   */
  const handleBackToDashboard = useCallback(() => {
    setCurrentView('dashboard');
  }, []);

  /**
   * Toggle modo avançado
   */
  const handleAdvancedModeToggle = useCallback((enabled: boolean) => {
    setAdvancedMode(enabled);
    onAdvancedModeToggle?.(enabled);
  }, [setAdvancedMode, onAdvancedModeToggle]);

  /**
   * Buscar configurações
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  /**
   * Aplicar filtros
   */
  const handleFilter = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
  }, []);

  /**
   * Atualizar configurações
   */
  const handleRefresh = useCallback(async () => {
    await refreshAllSettings();
  }, [refreshAllSettings]);

  // ===== EFEITOS =====

  // Definir categoria inicial
  useEffect(() => {
    if (initialCategory && initialCategory !== activeCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory, activeCategory, setActiveCategory]);

  // ===== RENDERIZAÇÃO DE CATEGORIA =====

  const renderCategoryContent = useCallback(() => {
    switch (activeCategory) {
      case 'general':
        return (
          <GeneralSettings
            onSave={(settings) => {
              console.log('Configurações gerais salvas:', settings);
            }}
            onReset={() => {
              console.log('Configurações gerais resetadas');
            }}
            showAdvancedOptions={advancedMode}
          />
        );
      
      case 'auth':
        return (
          <AuthSettings
            onSave={(settings) => {
              console.log('Configurações de autenticação salvas:', settings);
            }}
            onReset={() => {
              console.log('Configurações de autenticação resetadas');
            }}
            showAdvancedOptions={advancedMode}
          />
        );
      
      case 'users':
        return (
          <UserSettings
            onSave={(settings) => {
              console.log('Configurações de usuário salvas:', settings);
            }}
            onReset={() => {
              console.log('Configurações de usuário resetadas');
            }}
            showAdvancedOptions={advancedMode}
          />
        );
      
      case 'database':
        return (
          <Card>
            <Card.Header>
              <Card.Title>Configurações de Banco de Dados</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-600 dark:text-gray-400">
                Esta seção está em desenvolvimento.
              </p>
            </Card.Content>
          </Card>
        );
      
      case 'email':
        return (
          <Card>
            <Card.Header>
              <Card.Title>Configurações de Email</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-600 dark:text-gray-400">
                Esta seção está em desenvolvimento.
              </p>
            </Card.Content>
          </Card>
        );
      
      case 'integrations':
        return (
          <Card>
            <Card.Header>
              <Card.Title>Configurações de Integrações</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-600 dark:text-gray-400">
                Esta seção está em desenvolvimento.
              </p>
            </Card.Content>
          </Card>
        );
      
      case 'ai':
        return (
          <Card>
            <Card.Header>
              <Card.Title>Configurações de IA</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-600 dark:text-gray-400">
                Esta seção está em desenvolvimento.
              </p>
            </Card.Content>
          </Card>
        );
      
      case 'api':
        return (
          <Card>
            <Card.Header>
              <Card.Title>Configurações de API</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-600 dark:text-gray-400">
                Esta seção está em desenvolvimento.
              </p>
            </Card.Content>
          </Card>
        );
      
      default:
        return (
          <Card>
            <Card.Header>
              <Card.Title>Categoria não encontrada</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-600 dark:text-gray-400">
                A categoria selecionada não foi encontrada.
              </p>
            </Card.Content>
          </Card>
        );
    }
  }, [activeCategory, advancedMode]);

  // ===== RENDERIZAÇÃO PRINCIPAL =====

  return (
    <PageTransition type="fade" duration={500}>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
        <ResponsiveContainer>
          <div className="py-6">
            {/* Header Global */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Settings className="h-8 w-8" />
                    Configurações do Sistema
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Gerencie todas as configurações da sua plataforma
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {showAdvancedMode && (
                    <button
                      onClick={() => handleAdvancedModeToggle(!advancedMode)}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                        advancedMode
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Settings2 className="h-4 w-4" />
                      {advancedMode ? 'Modo Avançado' : 'Modo Simples'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Navegação */}
            {currentView === 'category' && (
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBackToDashboard}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Voltar ao Dashboard
                  </button>
                  
                  <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
                  
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {activeCategory}
                  </span>
                </div>
              </div>
            )}

            {/* Header de Configurações */}
            {currentView === 'category' && (
              <div className="mb-6">
                <SettingsHeader
                  onSearch={handleSearch}
                  onFilter={handleFilter}
                  onRefresh={handleRefresh}
                  showAdvancedControls={advancedMode}
                  searchPlaceholder={`Buscar configurações de ${activeCategory}...`}
                />
              </div>
            )}

            {/* Conteúdo Principal */}
            <div className="space-y-6">
              {currentView === 'dashboard' ? (
                <SettingsDashboard
                  onCategorySelect={handleCategorySelect}
                  showAdvancedMode={showAdvancedMode}
                  onAdvancedModeToggle={handleAdvancedModeToggle}
                />
              ) : (
                <Animated type="slideIn" duration={300}>
                  {renderCategoryContent()}
                </Animated>
              )}
            </div>

            {/* Loading Global */}
            {loading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-3">
                  <LoadingSpinner className="h-6 w-6" />
                  <span className="text-gray-900 dark:text-white">
                    Carregando configurações...
                  </span>
                </div>
              </div>
            )}

            {/* Error Global */}
            {error && (
              <div className="fixed bottom-4 right-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-4 max-w-md z-50">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-800 dark:text-red-200 font-medium">
                    Erro ao carregar configurações
                  </span>
                </div>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                  {error}
                </p>
                <button
                  onClick={handleRefresh}
                  className="mt-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 text-sm underline"
                >
                  Tentar novamente
                </button>
              </div>
            )}
          </div>
        </ResponsiveContainer>
      </div>
    </PageTransition>
  );
};

// =========================================
// EXPORTS
// =========================================

export default SettingsModule;
