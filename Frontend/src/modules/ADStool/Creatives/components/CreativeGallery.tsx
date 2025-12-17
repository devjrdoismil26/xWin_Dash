/**
 * Galeria de criativos de an?ncios
 *
 * @description
 * Componente para exibir criativos em formato de galeria com grid responsivo.
 * Exibe preview de imagens, tipo e a??es para cada criativo.
 *
 * @module modules/ADStool/Creatives/components/CreativeGallery
 * @since 1.0.0
 */

import React from 'react';
import { Image as ImageIcon, Edit, Trash2 } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { AdsCreative } from '../../types/adsCreativeTypes';

/**
 * Props do componente CreativeGallery
 *
 * @interface CreativeGalleryProps
 * @property {AdsCreative[]} [creatives] - Lista de criativos
 * @property {(creative: AdsCreative) => void} [onEdit] - Callback para editar criativo
 * @property {(creative: AdsCreative) => void} [onDelete] - Callback para excluir criativo
 */
interface CreativeGalleryProps {
  creatives?: AdsCreative[];
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente CreativeGallery
 *
 * @description
 * Renderiza galeria de criativos em grid responsivo com preview de imagens,
 * informa??es b?sicas e bot?es de a??o.
 *
 * @param {CreativeGalleryProps} props - Props do componente
 * @returns {JSX.Element} Galeria de criativos
 */
const CreativeGallery = React.memo<CreativeGalleryProps>(function CreativeGallery({ creatives = [], onEdit, onDelete }) { return (
            <div className="{(creatives || []).map((creative: unknown) => (">$2</div>
        <Card key={creative.id } />
          {creative.preview_url ? (
            <img src={creative.preview_url} alt={creative.name} className="w-full h-40 object-cover rounded-t" />
          ) : (
            <div className=" ">$2</div><ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <Card.Content className="space-y-1" />
            <div className="font-medium text-gray-900">{creative.name}</div>
            <div className="text-xs text-gray-500">{creative.type}</div>
          </Card.Content>
          <Card.Footer />
            <div className=" ">$2</div><Button onClick={() => onEdit?.(creative)} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" /> Editar
              </Button>
              <Button onClick={() => onDelete?.(creative)} variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-1" /> Excluir
              </Button></div></Card.Footer>
      </Card>
    </>
  ))}
    </div>);

});

export default CreativeGallery;
