import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { Animated } from '@/components/ui/AdvancedAnimations';
import { useSettings, useSettingsStore, useSettingsSelectors } from '../hooks';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Settings2, 
  Download, 
  Upload, 
  RotateCcw,
  ChevronDown,
  X
} from 'lucide-react';

// =========================================
// INTERFACES
// =========================================

export interface SettingsHeaderProps {
  className?: string;
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onReset?: () => void;
  showAdvancedControls?: boolean;
  searchPlaceholder?: string;
}

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  className = '',
  onSearch,
  onFilter,
  onRefresh,
  onExport,
  onImport,
  onReset,
  showAdvancedControls = false,
  searchPlaceholder = 'Buscar configurações...'
}) => {
  // ===== HOOKS =====
  const { stats, loading, refreshAllSettings } = useSettings();
  const { ui, setViewMode, setSortBy, setSortOrder } = useSettingsStore();
  const { useAdvancedMode } = useSettingsSelectors;
  
  const advancedMode = useAdvancedMode();

  // ===== ESTADO LOCAL =====
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, any>>({
    category: '',
    status: '',
    type: ''
  });

  // ===== HANDLERS =====

  /**
   * Buscar configurações
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  }, [onSearch]);

  /**
   * Aplicar filtros
   */
  const handleFilterChange = useCallback((key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter?.(newFilters);
  }, [filters, onFilter]);

  /**
   * Limpar filtros
   */
  const handleClearFilters = useCallback(() => {
    const clearedFilters = {
      category: '',
      status: '',
      type: ''
    };
    setFilters(clearedFilters);
    onFilter?.(clearedFilters);
  }, [onFilter]);

  /**
   * Atualizar configurações
   */
  const handleRefresh = useCallback(async () => {
    onRefresh?.();
    await refreshAllSettings();
  }, [onRefresh, refreshAllSettings]);

  /**
   * Toggle filtros
   */
  const handleToggleFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  /**
   * Alterar modo de visualização
   */
  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, [setViewMode]);

  /**
   * Alterar ordenação
   */
  const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setSortBy(sortBy);
    setSortOrder(sortOrder);
  }, [setSortBy, setSortOrder]);

  // ===== RENDERIZAÇÃO =====

  return (
    <div className={`mb-6 ${className}`}>
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <Card.Title className="flex items-center gap-2">
                Configurações
                {stats.totalSettings > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {stats.totalSettings}
                  </Badge>
                )}
              </Card.Title>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Gerencie as configurações do sistema
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Botão de atualizar */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>

              {/* Botão de filtros */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleFilters}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros
                {Object.values(filters).some(f => f !== '') && (
                  <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                    !
                  </Badge>
                )}
              </Button>

              {/* Controles avançados */}
              {showAdvancedControls && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onExport}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onImport}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Importar
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onReset}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Resetar
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card.Header>

        <Card.Content>
          {/* Barra de busca */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtros */}
          {showFilters && (
            <Animated type="slideDown" duration={300}>
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Filtro por categoria */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categoria
                    </label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => handleFilterChange('category', value)}
                    >
                      <option value="">Todas as categorias</option>
                      <option value="general">Geral</option>
                      <option value="auth">Autenticação</option>
                      <option value="users">Usuários</option>
                      <option value="database">Banco de Dados</option>
                      <option value="email">Email</option>
                      <option value="integrations">Integrações</option>
                      <option value="ai">IA</option>
                      <option value="api">API</option>
                    </Select>
                  </div>

                  {/* Filtro por status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => handleFilterChange('status', value)}
                    >
                      <option value="">Todos os status</option>
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="maintenance">Manutenção</option>
                      <option value="error">Erro</option>
                    </Select>
                  </div>

                  {/* Filtro por tipo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tipo
                    </label>
                    <Select
                      value={filters.type}
                      onValueChange={(value) => handleFilterChange('type', value)}
                    >
                      <option value="">Todos os tipos</option>
                      <option value="string">Texto</option>
                      <option value="number">Número</option>
                      <option value="boolean">Booleano</option>
                      <option value="json">JSON</option>
                      <option value="array">Array</option>
                    </Select>
                  </div>
                </div>

                {/* Botões de ação dos filtros */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    {Object.values(filters).some(f => f !== '') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Animated>
          )}

          {/* Controles de visualização */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-4">
              {/* Modo de visualização */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Visualização:</span>
                <div className="flex border rounded-lg">
                  <Button
                    variant={ui.viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleViewModeChange('grid')}
                    className="rounded-r-none"
                  >
                    Grid
                  </Button>
                  <Button
                    variant={ui.viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleViewModeChange('list')}
                    className="rounded-l-none"
                  >
                    Lista
                  </Button>
                </div>
              </div>

              {/* Ordenação */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Ordenar por:</span>
                <Select
                  value={ui.sortBy}
                  onValueChange={(value) => handleSortChange(value, ui.sortOrder)}
                >
                  <option value="name">Nome</option>
                  <option value="category">Categoria</option>
                  <option value="updated_at">Data de atualização</option>
                  <option value="created_at">Data de criação</option>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSortChange(ui.sortBy, ui.sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-1"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${ui.sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Estatísticas rápidas */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
              <span>Total: {stats.totalSettings}</span>
              <span>Ativas: {stats.activeSettings}</span>
              {stats.maintenanceMode && (
                <Badge variant="destructive">Manutenção</Badge>
              )}
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

// =========================================
// EXPORTS
// =========================================

export default SettingsHeader;
