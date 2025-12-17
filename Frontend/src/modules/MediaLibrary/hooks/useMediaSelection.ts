import { useState, useCallback } from 'react';

export const useMediaSelection = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const selectItem = useCallback((id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);

  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedItems(ids);

  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);

  }, []);

  const isSelected = useCallback((id: string) => {
    return selectedItems.includes(id);

  }, [selectedItems]);

  return {
    selectedItems,
    selectItem,
    selectAll,
    clearSelection,
    isSelected};
};
