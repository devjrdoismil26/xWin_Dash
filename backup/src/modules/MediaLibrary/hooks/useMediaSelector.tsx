import { useCallback, useState } from 'react';
export type MediaItem = {
  id: string | number;
  filename: string;
  original_filename?: string;
  file_type?: string;
  file_size?: number;
  size_formatted?: string;
  url: string;
  thumbnail_url?: string;
  tags?: string[];
  created_at?: string;
};
export type UseMediaSelectorOptions = {
  multiple?: boolean;
  acceptedTypes?: string[];
  maxSelections?: number;
  filterByModule?: string;
};
export type UseMediaSelectorReturn = {
  isOpen: boolean;
  selectedMedia: MediaItem | MediaItem[] | null;
  openSelector: () => void;
  closeSelector: () => void;
  handleMediaSelect: (media: MediaItem | MediaItem[]) => void;
  clearSelection: () => void;
};
const useMediaSelector = (options: UseMediaSelectorOptions = {}): UseMediaSelectorReturn => {
  const { multiple = false } = options;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | MediaItem[] | null>(multiple ? [] : null);
  const openSelector = useCallback(() => setIsOpen(true), []);
  const closeSelector = useCallback(() => setIsOpen(false), []);
  const handleMediaSelect = useCallback((media: MediaItem | MediaItem[]) => {
    setSelectedMedia(media);
    setIsOpen(false);
  }, []);
  const clearSelection = useCallback(() => setSelectedMedia(multiple ? [] : null), [multiple]);
  return {
    isOpen,
    selectedMedia,
    openSelector,
    closeSelector,
    handleMediaSelect,
    clearSelection,
  };
};
export default useMediaSelector;
