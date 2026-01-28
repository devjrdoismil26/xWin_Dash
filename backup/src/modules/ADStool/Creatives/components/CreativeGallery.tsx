import React from 'react';
import { Image as ImageIcon, Edit, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
const CreativeGallery = React.memo(function CreativeGallery({ creatives = [], onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {creatives.map((creative) => (
        <Card key={creative.id}>
          {creative.preview_url ? (
            <img src={creative.preview_url} alt={creative.name} className="w-full h-40 object-cover rounded-t" />
          ) : (
            <div className="flex items-center justify-center h-40 bg-gray-100 rounded-t">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <Card.Content className="space-y-1">
            <div className="font-medium text-gray-900">{creative.name}</div>
            <div className="text-xs text-gray-500">{creative.type}</div>
          </Card.Content>
          <Card.Footer>
            <div className="flex gap-2">
              <Button onClick={() => onEdit?.(creative)} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" /> Editar
              </Button>
              <Button onClick={() => onDelete?.(creative)} variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-1" /> Excluir
              </Button>
            </div>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
});
export default CreativeGallery;
