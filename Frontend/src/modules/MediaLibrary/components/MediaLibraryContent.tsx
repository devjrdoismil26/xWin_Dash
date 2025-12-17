import React, { memo } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import ErrorState from '@/shared/components/ui/ErrorState';
import { ResponsiveGrid } from '@/shared/components/ui/ResponsiveSystem';
import { Archive } from 'lucide-react';
import { useMediaLibrarySimple } from '../hooks/useMediaLibrarySimple';
import { MediaContentToolbar } from './MediaContentToolbar';
import { MediaFolderGrid } from './MediaFolderGrid';
import { MediaItemGrid } from './MediaItemGrid';

export const MediaLibraryContent: React.FC = memo(() => {
  const {
    loading,
    error,
    currentView,
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    handleFolderClick,
    handleDownload,
    handlePreview,
    handleEdit,
    handleDelete,
    filteredMedia,
    filteredFolders
  } = useMediaLibrarySimple();

  if (loading) {
    return (
        <>
      <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
      <Card.Content className="p-6" />
          <div className=" ">$2</div><LoadingSpinner size="lg" / /></div></Card.Content>
      </Card>);

  }

  if (error) {
    return (
        <>
      <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
      <Card.Content className="p-6" />
          <ErrorState 
            title="Erro ao carregar conteúdo"
            message={ error }
            onRetry={ () => window.location.reload() } />
        </Card.Content>
      </Card>);

  }

  if (filteredMedia.length === 0 && filteredFolders.length === 0) {
    return (
        <>
      <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
      <Card.Content className="p-6" />
          <EmptyState
            title="Nenhum arquivo encontrado"
            description="Esta pasta está vazia ou não há arquivos que correspondam aos seus filtros."
            icon={ Archive }
          / />
        </Card.Content>
      </Card>);

  }

  return (
        <>
      <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
      <Card.Content className="p-6" />
        <div className=" ">$2</div><MediaContentToolbar
            selectedCount={ selectedItems.length }
            totalCount={ filteredMedia.length }
            onSelectAll={ handleSelectAll }
            onDownload={ () => handleDownload(selectedItems) }
            onDelete={ () => handleDelete(selectedItems) } />

          {currentView === 'grid' && (
            <ResponsiveGrid cols={ base: 2, sm: 3, md: 4, lg: 5, xl: 6 } gap={ 4 } />
              <MediaFolderGrid folders={filteredFolders || []} onFolderClick={handleFolderClick} / />
              <MediaItemGrid
                items={ filteredMedia || [] }
                selectedItems={ selectedItems }
                onSelectItem={ handleSelectItem }
                onPreview={ handlePreview }
                onEdit={ handleEdit }
                onDelete={ handleDelete }
                onDownload={ handleDownload }
              / />
            </ResponsiveGrid>
          )}

          {currentView === 'list' && (
            <div className="{(filteredMedia || []).map((item: unknown) => (">$2</div>
                <div
                  key={ item.id }
                  className={`p-4 rounded-lg backdrop-blur-sm border transition-all ${
                    selectedItems.includes(item.id) ? 'bg-blue-500/20 border-blue-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'
                  } `}
                  onClick={ () => handleSelectItem(item.id)  }>
                  <div className=" ">$2</div><span className="text-white">{item.name}</span>
                    <span className="text-gray-400 text-sm">{item.size} bytes</span>
      </div>
    </>
  ))}
            </div>
          )}
        </div>
      </Card.Content>
    </Card>);

});
