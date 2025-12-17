import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const ImageGallery: React.FC<{ images: string[] }> = ({ images    }) => (
  <div className="{images.map((img: unknown, i: unknown) => (">$2</div>
      <Card key={i} className="backdrop-blur-xl bg-white/10 border-white/20" />
        <Card.Content className="p-4 h-48 flex items-center justify-center text-gray-400">Imagem {i + 1}</Card.Content>
      </Card>
    </>
  ))}
  </div>);
