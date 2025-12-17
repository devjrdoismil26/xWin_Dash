/**
 * Eye de criativo de anúncio
 *
 * @description
 * Componente para exibir preview detalhado de um criativo de anúncio.
 * Suporta diferentes tipos (imagem, vídeo, texto) e exibe informações completas.
 *
 * @module modules/ADStool/Creatives/components/CreativePreview
 * @since 1.0.0
 */

import React from 'react';
import { FileImage, FileVideo, FileText } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';
import { AdsCreative, AdsCreativeType } from '../../types/adsCreativeTypes';

/**
 * Props do componente CreativePreview
 *
 * @interface CreativePreviewProps
 * @property {AdsCreative | null} [creative] - Criativo para preview
 */
interface CreativePreviewProps {
  creative?: AdsCreative | null;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente CreativePreview
 *
 * @description
 * Renderiza preview completo do criativo com imagem/vídeo/texto,
 * informações de tipo, status e metadados.
 *
 * @param {CreativePreviewProps} props - Props do componente
 * @returns {JSX.Element} Eye do criativo
 */
const CreativePreview = React.memo<CreativePreviewProps>(function CreativePreview({ creative }) {
  if (!creative) {
    return (
        <>
      <Card className="h-full" />
      <div className=" ">$2</div><FileImage size={48} className="mb-4" />
          <h3 className="text-lg font-medium">Nenhum criativo selecionado</h3>
          <p className="text-sm">Selecione um criativo para ver sua pré-visualização.</p></div></Card>);

  }
  const getTypeIcon = (type: AdsCreativeType) => {
    const iconMap: Record<string, typeof FileImage> = { image: FileImage, video: FileVideo, text: FileText};

    const IconComponent = iconMap[type] || FileImage;
    return <IconComponent size={ 20 } />;};

  const getTypeBadge = (type: AdsCreativeType) => {
    const typeConfig: Record<string, { variant: string; label: string }> = {
      image: { variant: 'primary', label: 'Imagem' },
      video: { variant: 'secondary', label: 'Vídeo' },
      carousel: { variant: 'warning', label: 'Carrossel' },
      text: { variant: 'outline', label: 'Texto' },};

    const config = typeConfig[type] || { variant: 'outline', label: type};

    return <Badge variant={ config.variant as any }>{config.label}</Badge>;};

  const renderMediaPreview = () => {
    const { type, preview_url, content_text } = creative;
    if (type === 'image' && preview_url) {
      return (
                <div className=" ">$2</div><img
            src={ preview_url }
            alt={ creative.name }
            className="w-full h-full object-cover"
            onError={(e: unknown) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback) (fallback as HTMLElement).style.display = 'flex';
            } />
          <div className=" ">$2</div><span className="text-sm mt-2">Erro ao carregar imagem</span>
          </div>);

    }
    if (type === 'video' && preview_url) { return (
                <div className=" ">$2</div><video className="w-full h-full" controls poster={creative.thumbnail_url || undefined } />
            Seu navegador não suporta vídeos.
          </video>
        </div>);

    }
    if (type === 'text' && content_text) {
      return (
                <div className=" ">$2</div><div className="text-sm text-gray-700 whitespace-pre-wrap">{content_text}</div>);

    }
    return (
              <div className="{getTypeIcon(creative.type)} ">$2</div><span className="text-sm mt-2">Eye não disponível</span>
      </div>);};

  return (
        <>
      <Card className="h-full" />
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900 mb-2">{creative.name}</h3>
            <div className="{getTypeBadge(creative.type)}">$2</div>
              { creative.status && (
                <Badge variant={creative.status === 'active' ? 'success' : 'secondary' } />
                  {creative.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              )}
            </div>
        </div>
        {creative.content?.description && (
          <div className=" ">$2</div><p className="text-gray-600 text-sm">{creative.content.description}</p>
      </div>
    </>
  )}
        <div className="mb-4">{renderMediaPreview()}</div>
        <div className="{creative.file_type && (">$2</div>
            <div className=" ">$2</div><span>Tipo: {creative.file_type}</span>
      </div>
    </>
  )}
          {creative.file_size && (
            <div className=" ">$2</div><span>Tamanho: {creative.file_size}</span>
      </div>
    </>
  )}
        </div>
    </Card>);

});

export default CreativePreview;
