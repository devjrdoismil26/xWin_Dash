/**
 * Media Library Simplificado
 * 
 * @description
 * Biblioteca de mídia simplificada com integração real ao backend.
 * Versão mais limpa e mantível do IntelligentMediaLibrary.
 * 
 * @module modules/MediaLibrary/components/MediaLibrarySimple
 * @since 2.0.0
 */

import React, { useState } from 'react';
import { useValidatedGet } from '@/hooks/useValidatedApi';
import { MediaLibraryDataSchema, type MediaLibraryData, type MediaFile,  } from '@/schemas';
import { Image, Video, FileText, Music, File, Upload, Download, Search, Grid, List, Folder, Star, Eye, Trash2, RefreshCw, Plus, HardDrive,  } from 'lucide-react';

// Components
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import Input from '@/shared/components/ui/Input';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import Progress from '@/shared/components/ui/Progress';

interface MediaLibrarySimpleProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Formata tamanho de arquivo
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;};

/**
 * Retorna ícone baseado no tipo de arquivo
 */
const getFileIcon = (type: MediaFile['type']) => {
  const iconClass = 'w-8 h-8';
  switch (type) {
    case 'image':
      return <Image className={`${iconClass} text-blue-500`} />;
    case 'video':
      return <Video className={`${iconClass} text-purple-500`} />;
    case 'audio':
      return <Music className={`${iconClass} text-green-500`} />;
    case 'document':
      return <FileText className={`${iconClass} text-orange-500`} />;
    default:
      return <File className={`${iconClass} text-gray-500`} />;
  } ;

/**
 * Card de estatística
 */
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}> = ({ title, value, icon, color = 'blue'    }) => (
  <Card className="p-6" />
    <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p></div><div className={`p-3 bg-${color} -100 dark:bg-${color}-900/20 rounded-lg`}>
           
        </div>{icon}
      </div>
  </Card>);

/**
 * Componente principal
 */
export const MediaLibrarySimple: React.FC<MediaLibrarySimpleProps> = ({ className = '',
   }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [searchTerm, setSearchTerm] = useState('');

  // Hook para buscar dados da biblioteca
  const {
    data: libraryData,
    loading,
    error,
    fetch: refreshData,
  } = useValidatedGet<MediaLibraryData>(
    '/api/media/library',
    MediaLibraryDataSchema,
    true // autoFetch);

  // Loading state
  if (loading) {
    return (
              <div className=" ">$2</div><LoadingSpinner size="lg" / />
      </div>);

  }

  // Error state
  if (error || !libraryData) {
    return (
              <div className=" ">$2</div><ErrorState
          title="Erro ao carregar biblioteca"
          description={ typeof error === 'string' ? error : 'Não foi possível carregar os arquivos' }
          onRetry={ refreshData }
        / />
      </div>);

  }

  const { files, folders, stats } = libraryData;

  // Filtrar arquivos
  const filteredFiles = files.filter((file: unknown) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.tags.some((tag: unknown) => tag.toLowerCase().includes(searchTerm.toLowerCase())));

  return (
        <>
      <div className={`space-y-6 ${className} `}>
      </div>{/* Header */}
      <div className=" ">$2</div><div>
           
        </div><h1 className="text-3xl font-bold text-gray-900 dark:text-white" />
            Biblioteca de Mídia
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1" />
            Gerencie seus arquivos e mídias
          </p></div><div className=" ">$2</div><Button variant="outline" onClick={ refreshData } />
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button />
            <Plus className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>

      {/* Estatísticas */}
      <div className=" ">$2</div><StatCard
          title="Total de Arquivos"
          value={ stats.total_files }
          icon={ <File className="w-6 h-6 text-blue-600" /> }
          color="blue" />
        <StatCard
          title="Tamanho Total"
          value={ formatFileSize(stats.total_size) }
          icon={ <HardDrive className="w-6 h-6 text-purple-600" /> }
          color="purple" />
        <StatCard
          title="Favoritos"
          value={ stats.favorites_count }
          icon={ <Star className="w-6 h-6 text-yellow-600" /> }
          color="yellow" />
        <StatCard
          title="Uploads Recentes"
          value={ stats.recent_uploads }
          icon={ <Upload className="w-6 h-6 text-green-600" /> }
          color="green" />
      </div>

      {/* Distribuição por tipo */}
      <Card className="p-6" />
        <h2 className="text-lg font-semibold mb-4">Armazenamento Usado</h2>
        <Progress value={stats.storage_used_percentage} className="h-3 mb-4" />
        <div className=" ">$2</div><div className=" ">$2</div><Image className="w-5 h-5 mx-auto mb-1 text-blue-500" />
            <p className="font-semibold">{stats.by_type.images}</p>
            <p className="text-gray-600 dark:text-gray-400">Imagens</p></div><div className=" ">$2</div><Video className="w-5 h-5 mx-auto mb-1 text-purple-500" />
            <p className="font-semibold">{stats.by_type.videos}</p>
            <p className="text-gray-600 dark:text-gray-400">Vídeos</p></div><div className=" ">$2</div><Music className="w-5 h-5 mx-auto mb-1 text-green-500" />
            <p className="font-semibold">{stats.by_type.audio}</p>
            <p className="text-gray-600 dark:text-gray-400">Áudio</p></div><div className=" ">$2</div><FileText className="w-5 h-5 mx-auto mb-1 text-orange-500" />
            <p className="font-semibold">{stats.by_type.documents}</p>
            <p className="text-gray-600 dark:text-gray-400">Documentos</p></div><div className=" ">$2</div><File className="w-5 h-5 mx-auto mb-1 text-gray-500" />
            <p className="font-semibold">{stats.by_type.others}</p>
            <p className="text-gray-600 dark:text-gray-400">Outros</p></div></Card>

      {/* Busca e Controles */}
      <div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar arquivos..."
            value={ searchTerm }
            onChange={ (e: unknown) => setSearchTerm(e.target.value) }
            className="pl-10" /></div><div className=" ">$2</div><Button
            variant={ viewMode === 'grid' ? 'default' : 'outline' }
            size="sm"
            onClick={ () => setViewMode('grid')  }>
            <Grid className="w-4 h-4" /></Button><Button
            variant={ viewMode === 'list' ? 'default' : 'outline' }
            size="sm"
            onClick={ () => setViewMode('list')  }>
            <List className="w-4 h-4" /></Button></div>

      {/* Lista de Arquivos */}
      {viewMode === 'grid' ? (
        <div className="{filteredFiles.map((file: unknown) => (">$2</div>
            <Card key={file.id} className="overflow-hidden hover:shadow-lg transition-shadow" />
              <div className="{file.type === 'image' && file.thumbnail_url ? (">$2</div>
      <img
                    src={ file.thumbnail_url }
                    alt={ file.name }
                    className="w-full h-full object-cover"
                  / />
    </>
  ) : (
                  getFileIcon(file.type)
                )}
              </div>
              <div className=" ">$2</div><div className=" ">$2</div><h3 className="font-medium text-sm truncate flex-1">{file.name}</h3>
                  {file.is_favorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                </div>
                <div className=" ">$2</div><span>{formatFileSize(file.size)}</span>
                  <span className="uppercase">{file.format}</span>
                </div>
                {file.tags.length > 0 && (
                  <div className="{file.tags.slice(0, 2).map((tag: unknown) => (">$2</div>
                      <Badge key={tag} variant="secondary" className="text-xs" />
                        {tag}
                      </Badge>
                    ))}
                    {file.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs" />
                        +{file.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="{file.views_count !== undefined && (">$2</div>
                    <span className=" ">$2</span><Eye className="w-3 h-3" />
                      {file.views_count}
                    </span>
                  )}
                  {file.downloads_count !== undefined && (
                    <span className=" ">$2</span><Download className="w-3 h-3" />
                      {file.downloads_count}
                    </span>
                  )}
                </div>
      </Card>
    </>
  ))}
        </div>
      ) : (
        <Card />
          <div className="{filteredFiles.map((file: unknown) => (">$2</div>
              <div key={file.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-4">
           
        </div><div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                <div className=" ">$2</div><p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400" />
                    {formatFileSize(file.size)} • {file.format.toUpperCase()}
                  </p></div><div className="{file.tags.length > 0 && (">$2</div>
                    <div className="{file.tags.slice(0, 3).map((tag: unknown) => (">$2</div>
                        <Badge key={tag} variant="secondary" className="text-xs" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Button variant="ghost" size="sm" />
                    <Download className="w-4 h-4" /></Button><Button variant="ghost" size="sm" />
                    <Trash2 className="w-4 h-4" /></Button></div>
            ))}
          </div>
      </Card>
    </>
  )}

      {filteredFiles.length === 0 && (
        <div className=" ">$2</div><File className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2" />
            Nenhum arquivo encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400" />
            {searchTerm ? 'Tente ajustar sua busca' : 'Faça upload de seus primeiros arquivos'}
          </p>
      </div>
    </>
  )}
    </div>);};

export default MediaLibrarySimple;
