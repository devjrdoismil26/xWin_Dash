import { useState, useCallback } from 'react';
import { useMediaSelection } from './useMediaSelection';
import { useMediaOperations } from './useMediaOperations';

export const useMediaManager = () => {
  const [loading, setLoading] = useState(false);

  const selection = useMediaSelection();

  const operations = useMediaOperations();

  const createFolder = useCallback(async (name: string, parentId?: string) => {
    setLoading(true);

    try {
      await operations.createFolder(name, parentId);

    } catch (err) {
      console.error('Erro ao criar pasta:', err);

      throw err;
    } finally {
      setLoading(false);

    } , [operations]);

  const renameFolder = useCallback(async (id: string, newName: string) => {
    setLoading(true);

    try {
      await operations.renameFolder(id, newName);

    } catch (err) {
      console.error('Erro ao renomear pasta:', err);

      throw err;
    } finally {
      setLoading(false);

    } , [operations]);

  const deleteFolder = useCallback(async (id: string) => {
    setLoading(true);

    try {
      await operations.deleteFolder(id);

    } catch (err) {
      console.error('Erro ao excluir pasta:', err);

      throw err;
    } finally {
      setLoading(false);

    } , [operations]);

  const moveFiles = useCallback(async (fileIds: string[], targetFolderId: string) => {
    setLoading(true);

    try {
      await operations.moveFiles(fileIds, targetFolderId);

    } catch (err) {
      console.error('Erro ao mover arquivos:', err);

      throw err;
    } finally {
      setLoading(false);

    } , [operations]);

  return {
    loading,
    ...selection,
    createFolder,
    renameFolder,
    deleteFolder,
    moveFiles};
};
