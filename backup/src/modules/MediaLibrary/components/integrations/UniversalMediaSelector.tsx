import React, { useEffect, useMemo, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import MediaUploader from '../MediaUploader.tsx';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
export type MediaItem = {
  id: string | number;
  original_filename?: string;
  file_type?: string;
  size_formatted?: string;
  url: string;
  thumbnail_url?: string;
  tags?: string[];
};
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (items: MediaItem[] | MediaItem) => void;
  multiple?: boolean;
  acceptedTypes?: string[];
  title?: string;
  description?: string;
  maxSelections?: number;
};
const UniversalMediaSelector: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
  acceptedTypes = ['image/*', 'video/*', 'application/pdf'],
  title = 'Selecionar Mídia',
  description = 'Escolha arquivos da biblioteca de mídia',
  maxSelections,
}) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selected, setSelected] = useState<Record<string | number, MediaItem>>({});
  const [showUpload, setShowUpload] = useState(false);
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    // Placeholder load
    setTimeout(() => {
      setMedia([]);
      setLoading(false);
    }, 300);
  }, [isOpen]);
  const filtered = useMemo(() => {
    const matchAccepted = (item: MediaItem) => {
      if (!acceptedTypes?.length || !item.file_type) return true;
      return acceptedTypes.some((type) => {
        if (type.endsWith('/*')) return item.file_type?.startsWith(type.replace('/*', '/'));
        if (type === 'application/pdf') return item.file_type?.includes('pdf');
        return true;
      });
    };
    return media.filter((m) => {
      const matchSearch = !searchTerm || (m.original_filename || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = selectedType === 'all' || (m.file_type || '').startsWith(`${selectedType}/`);
      return matchSearch && matchType && matchAccepted(m);
    });
  }, [media, searchTerm, selectedType, acceptedTypes]);
  const toggleSelect = (item: MediaItem) => {
    const next = { ...selected };
    if (next[item.id]) delete next[item.id];
    else {
      if (maxSelections && Object.keys(next).length >= maxSelections) return;
      if (!multiple) return setSelected({ [item.id]: item });
      next[item.id] = item;
    }
    setSelected(next);
  };
  const confirm = () => {
    const arr = Object.values(selected);
    if (arr.length === 0) return;
    onSelect(multiple ? arr : arr[0]);
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
      {description && <p className="text-sm text-gray-600 mb-3">{description}</p>}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex-1">
          <InputLabel htmlFor="media-search">Buscar</InputLabel>
          <Input id="media-search" placeholder="Buscar arquivos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="w-48">
          <InputLabel htmlFor="media-type">Tipo</InputLabel>
          <Select
            id="media-type"
            value={selectedType}
            onChange={(val) => setSelectedType(String(val))}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'image', label: 'Imagens' },
              { value: 'video', label: 'Vídeos' },
              { value: 'audio', label: 'Áudio' },
              { value: 'application', label: 'Documentos' },
            ]}
          />
        </div>
        <div className="self-end">
          <Button variant="outline" onClick={() => setShowUpload(true)}>Upload</Button>
        </div>
      </div>
      <div className="min-h-[280px] max-h-[420px] overflow-y-auto">
        {loading ? (
          <LoadingSpinner text="Carregando mídia..." />
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Nenhum arquivo.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filtered.map((m) => {
              const isSelected = Boolean(selected[m.id]);
              return (
                <Card key={m.id} className={`cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`} onClick={() => toggleSelect(m)}>
                  <div className="relative">
                    {m.thumbnail_url ? (
                      <img src={m.thumbnail_url} alt={m.original_filename || ''} className="w-full h-24 object-cover rounded-t" />
                    ) : (
                      <div className="w-full h-24 bg-gray-100 rounded-t flex items-center justify-center text-2xl">📁</div>
                    )}
                    {isSelected && <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">Selecionado</span>}
                  </div>
                  <Card.Content className="p-2">
                    <p className="text-xs font-medium text-gray-900 truncate">{m.original_filename || 'arquivo'}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-gray-500 truncate">{m.size_formatted || ''}</p>
                      {m.file_type && <Badge variant="secondary">{m.file_type.split('/')[0]}</Badge>}
                    </div>
                  </Card.Content>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t mt-4">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={confirm} disabled={Object.keys(selected).length === 0}>Confirmar</Button>
      </div>
      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Upload de Arquivos" size="lg">
        <MediaUploader onUpload={(files) => {
          const added = Array.from(files as any).map((f: any, i: number) => ({ id: `${Date.now()}-${i}`, original_filename: f.name, url: '', file_type: f.type }));
          setMedia((prev) => [...added, ...prev]);
          setShowUpload(false);
        }} />
      </Modal>
    </Modal>
  );
};
export default UniversalMediaSelector;
