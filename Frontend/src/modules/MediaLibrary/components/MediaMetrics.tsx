// =========================================
// MEDIA METRICS COMPONENT
// =========================================
// Componente para exibir métricas de mídia
// Máximo: 150 linhas

import React from 'react';
import { TrendingUp, TrendingDown, Archive, Image, Video, FileText, Music, HardDrive } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { AnimatedCounter } from '@/shared/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/shared/components/ui/ResponsiveSystem';
import { MediaStats } from '../types';

interface MediaMetricsProps {
  stats: MediaStats;
  loading?: boolean;
  onRefresh???: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const MediaMetrics: React.FC<MediaMetricsProps> = ({ stats,
  loading = false,
  onRefresh,
  className = ''
   }) => {
  // =========================================
  // HELPER FUNCTIONS
  // =========================================

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];};

  const getStorageStatus = (percentage: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (percentage >= 90) return 'critical';
    if (percentage >= 75) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';};

  const getStorageColor = (status: string): string => {
    switch (status) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    } ;

  // =========================================
  // METRIC CARDS DATA
  // =========================================

  const metricCards = [
    {
      title: 'Total de Arquivos',
      value: stats.total_files,
      icon: Archive,
      color: 'blue',
      trend: '+12%'
    },
    {
      title: 'Imagens',
      value: stats.count_by_type.image,
      icon: Image,
      color: 'green',
      trend: '+8%'
    },
    {
      title: 'Vídeos',
      value: stats.count_by_type.video,
      icon: Video,
      color: 'purple',
      trend: '+15%'
    },
    {
      title: 'Documentos',
      value: stats.count_by_type.document,
      icon: FileText,
      color: 'orange',
      trend: '+5%'
    },
    {
      title: 'Áudio',
      value: stats.count_by_type.audio,
      icon: Music,
      color: 'pink',
      trend: '+3%'
    }
  ];

  const storageStatus = getStorageStatus(stats.storage_percentage);

  // =========================================
  // RENDER
  // =========================================

  return (
        <>
      <div className={`space-y-4 ${className} `}>
      </div><div className=" ">$2</div><h2 className="text-lg font-semibold text-gray-900 dark:text-white" />
          Métricas de Mídia
        </h2>
        {onRefresh && (
          <Button
            onClick={ onRefresh }
            variant="secondary"
            size="sm"
            loading={ loading } />
            Atualizar
          </Button>
        )}
      </div>

      <ResponsiveGrid columns={ default: 2, md: 5 } gap={ 4 } />
        {(metricCards || []).map((metric: unknown, index: unknown) => (
          <Card
            key={ index }
            className="p-4 hover:shadow-lg transition-shadow duration-300" />
            <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600 dark:text-gray-300" />
                  {metric.title}
                </p>
                <div className=" ">$2</div><AnimatedCounter
                    value={ metric.value }
                    className="text-2xl font-bold text-gray-900 dark:text-white"
                  / />
                  <span className=" ">$2</span><TrendingUp className="w-3 h-3" />
                    {metric.trend}
                  </span></div><div className={`p-2 rounded-lg bg-${metric.color} -100 dark:bg-${metric.color}-900/20`}>
           
        </div><metric.icon className={`w-5 h-5 text-${metric.color} -600`} / /></div></Card>
        ))}
      </ResponsiveGrid>

      <ResponsiveGrid columns={ default: 1, lg: 2 } gap={ 4 } />
        {/* Storage Usage */}
        <Card className="p-6" />
          <div className=" ">$2</div><div className=" ">$2</div><HardDrive className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white" />
                Armazenamento
              </h3></div><span className={`text-sm font-medium ${getStorageColor(storageStatus)} `}>
           
        </span>{stats.storage_percentage}%
            </span></div><div className=" ">$2</div><div className=" ">$2</div><span>Usado</span>
              <span>{formatFileSize(stats.storage_used)}</span></div><div className=" ">$2</div><div
                className={`h-2 rounded-full transition-all duration-300 ${
                  storageStatus === 'critical' ? 'bg-red-500' :
                  storageStatus === 'high' ? 'bg-orange-500' :
                  storageStatus === 'medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                } `}
                style={width: `${Math.min(stats.storage_percentage, 100)} %` } / />
           
        </div><div className=" ">$2</div><span>Limite</span>
              <span>{formatFileSize(stats.storage_limit)}</span></div></Card>

        {/* Recent Activity */}
        <Card className="p-6" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4" />
            Atividade Recente
          </h3>
          
          <div className=" ">$2</div><div className=" ">$2</div><span className="Uploads hoje">$2</span>
              </span>
              <span className="{stats.recent_uploads}">$2</span>
              </span></div><div className=" ">$2</div><span className="Total de pastas">$2</span>
              </span>
              <span className="{stats.total_folders}">$2</span>
              </span></div><div className=" ">$2</div><span className="Tamanho total">$2</span>
              </span>
              <span className="{formatFileSize(stats.total_size)}">$2</span>
              </span></div></Card></ResponsiveGrid></div>);};

export default MediaMetrics;
