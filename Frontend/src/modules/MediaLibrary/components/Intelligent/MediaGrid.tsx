import React from 'react';
import Card from '@/shared/components/ui/Card';

interface MediaItem {
  id: number;
  url: string;
  name: string;
  type: string; }

interface MediaGridProps {
  items: MediaItem[];
  onSelect?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const MediaGrid: React.FC<MediaGridProps> = ({ items, onSelect    }) => {
  return (
            <div className="{items.map(item => (">$2</div>
        <Card key={item.id} className="p-2 cursor-pointer hover:shadow-lg" onClick={ () => onSelect(item.id)  }>
          <img src={item.url} alt={item.name} className="w-full h-32 object-cover rounded" />
          <p className="text-xs mt-2 truncate">{item.name}</p>
      </Card>
    </>
  ))}
    </div>);};
