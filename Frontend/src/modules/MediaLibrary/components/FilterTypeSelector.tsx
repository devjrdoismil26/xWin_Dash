import React from 'react';
import { FileType, Image, Video, FileText, Music, Folder } from 'lucide-react';

const mediaTypes = [
  { value: 'all', label: 'Todos', icon: FileType },
  { value: 'image', label: 'Imagens', icon: Image },
  { value: 'video', label: 'Vídeos', icon: Video },
  { value: 'document', label: 'Documentos', icon: FileText },
  { value: 'audio', label: 'Áudio', icon: Music },
  { value: 'folder', label: 'Pastas', icon: Folder }
];

export const FilterTypeSelector: React.FC = () => {
  const [selected, setSelected] = React.useState('all');

  return (
        <>
      <div>
      </div><label className="block text-sm font-medium text-gray-300 mb-2">Tipo de arquivo</label>
      <div className="{mediaTypes.map(({ value, label, icon: Icon }) => (">$2</div>
          <button
            key={ value }
            onClick={ () => setSelected(value) }
            className={`p-2 rounded-lg backdrop-blur-sm border transition-colors flex items-center gap-2 ${
              selected === value
                ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            } `}
  >
            <Icon className="h-4 w-4" />
            <span className="text-sm">{label}</span>
      </button>
    </>
  ))}
      </div>);};
