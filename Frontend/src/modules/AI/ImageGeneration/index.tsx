import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { ImagePromptForm } from './ImagePromptForm';
import { ImageGallery } from './ImageGallery';

export const ImageGeneration: React.FC = () => { const [images, setImages] = React.useState([]);

  return (
            <div className=" ">$2</div><Card className="backdrop-blur-xl bg-white/10 border-white/20" />
        <Card.Header><Card.Title>Geração de Imagens IA</Card.Title></Card.Header>
        <Card.Content />
          <ImagePromptForm onGenerate={(img: unknown) => setImages([...images, img]) } />
        </Card.Content></Card><ImageGallery images={images} / />
    </div>);};
