/**
 * Cabeçalho da MediaLibrary
 * Exibe breadcrumbs, busca e controles principais
 */

import React, { memo } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { 
  Search, 
  Upload, 
  Grid, 
  List, 
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  FolderPlus
} from 'lucide-react';
import { useMediaLibrarySimple } from '../hooks/useMediaLibrarySimple';

export const MediaLibraryHeader: React.FC = memo(() => {
  const {
    searchTerm,
    setSearchTerm,
    currentView,
    setCurrentView,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedFolder,
    handleRefresh,
    handleUpload,
    handleCreateFolder,
    breadcrumbs
  } = useMediaLibrarySimple();

  return (
    <Card className="backdrop-blur-xl bg-white/10 border-white/20 mb-6">
      <Card.Content className="p-6">
        <div className="space-y-4">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Media Library</span>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <span>/</span>
                <span className={index === breadcrumbs.length - 1 ? 'text-white font-medium' : ''}>
                  {crumb.name}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Barra de busca e controles */}
          <ResponsiveGrid
            cols={{ base: 1, sm: 2, lg: 4 }}
            gap={4}
            className="items-center"
          >
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar arquivos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Visualização */}
            <div className="flex items-center gap-2">
              <Button
                variant={currentView === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('grid')}
                className="backdrop-blur-sm"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={currentView === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('list')}
                className="backdrop-blur-sm"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={handleCreateFolder}
                variant="outline"
                size="sm"
                className="backdrop-blur-sm bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Pasta
              </Button>
              
              <Button
                onClick={handleUpload}
                className="backdrop-blur-sm bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </ResponsiveGrid>

          {/* Informações da pasta atual */}
          {selectedFolder && (
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <Badge variant="outline" className="backdrop-blur-sm bg-white/10 border-white/20 text-white">
                Pasta: {selectedFolder.name}
              </Badge>
              <Badge variant="outline" className="backdrop-blur-sm bg-white/10 border-white/20 text-white">
                {selectedFolder.itemCount} itens
              </Badge>
              <Badge variant="outline" className="backdrop-blur-sm bg-white/10 border-white/20 text-white">
                {selectedFolder.size} MB
              </Badge>
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
});

MediaLibraryHeader.displayName = 'MediaLibraryHeader';
