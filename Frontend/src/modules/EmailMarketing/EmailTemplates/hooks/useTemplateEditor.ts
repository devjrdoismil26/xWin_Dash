/**
 * Hook para o editor de templates
 * Gerencia o estado e lógica do editor de templates
 */

import { useState, useCallback } from 'react';
import { TemplateEditor, TemplateElement, TemplateStyles, UseTemplateEditorReturn } from '../types';

export const useTemplateEditor = (initialTemplate?: Partial<EmailTemplate>): UseTemplateEditorReturn => {
  // Estado do editor
  const [editor, setEditor] = useState<TemplateEditor>({
    template: initialTemplate || {
      id: '',
      name: '',
      subject: '',
      content: {
        html: '',
        text: '',
        images: []
      },
      variables: [],
      is_active: false,
      is_public: false,
      created_at: '',
      updated_at: '',
      created_by: '',
      usage_count: 0,
      tags: [],
      description: '',
      version: 1
    },
    is_dirty: false,
    current_step: 'design',
    selected_element: undefined,
    undo_stack: [],
    redo_stack: []
  });

  // Função para atualizar o template
  const updateTemplate = useCallback((updates: unknown) => {
    setEditor(prev => ({
      ...prev,
      template: {
        ...prev.template,
        ...updates
      },
      is_dirty: true
    }));

  }, []);

  // Função para atualizar um elemento
  const updateElement = useCallback((elementId: string, updates: Partial<TemplateElement>) => {
    setEditor(prev => {
      const newTemplate = { ...prev.template};

      // Implementar lógica de atualização de elemento
      return {
        ...prev,
        template: newTemplate,
        is_dirty: true};

    });

  }, []);

  // Função para adicionar elemento
  const addElement = useCallback((element: TemplateElement) => {
    setEditor(prev => {
      const newTemplate = { ...prev.template};

      // Implementar lógica de adição de elemento
      return {
        ...prev,
        template: newTemplate,
        is_dirty: true};

    });

  }, []);

  // Função para remover elemento
  const removeElement = useCallback((elementId: string) => {
    setEditor(prev => {
      const newTemplate = { ...prev.template};

      // Implementar lógica de remoção de elemento
      return {
        ...prev,
        template: newTemplate,
        is_dirty: true};

    });

  }, []);

  // Função para selecionar elemento
  const selectElement = useCallback((elementId: string) => {
    setEditor(prev => ({
      ...prev,
      selected_element: elementId
    }));

  }, []);

  // Função para desselecionar elemento
  const deselectElement = useCallback(() => {
    setEditor(prev => ({
      ...prev,
      selected_element: undefined
    }));

  }, []);

  // Função para desfazer
  const undo = useCallback(() => {
    setEditor(prev => {
      if (prev.undo_stack.length === 0) return prev;
      
      const lastState = prev.undo_stack[prev.undo_stack.length - 1];
      const newUndoStack = prev.undo_stack.slice(0, -1);

      const newRedoStack = [...prev.redo_stack, {
        template: prev.template,
        timestamp: Date.now(),
        action: 'undo'
      }];

      return {
        ...prev,
        template: lastState.template,
        undo_stack: newUndoStack,
        redo_stack: newRedoStack};

    });

  }, []);

  // Função para refazer
  const redo = useCallback(() => {
    setEditor(prev => {
      if (prev.redo_stack.length === 0) return prev;
      
      const nextState = prev.redo_stack[prev.redo_stack.length - 1];
      const newRedoStack = prev.redo_stack.slice(0, -1);

      const newUndoStack = [...prev.undo_stack, {
        template: prev.template,
        timestamp: Date.now(),
        action: 'redo'
      }];

      return {
        ...prev,
        template: nextState.template,
        undo_stack: newUndoStack,
        redo_stack: newRedoStack};

    });

  }, []);

  // Função para salvar template
  const saveTemplate = useCallback(async () => {
    try {
      // Implementar lógica de salvamento
      
      setEditor(prev => ({
        ...prev,
        is_dirty: false
      }));

      return Promise.resolve({
        success: true,
        data: editor.template
      });

    } catch (error) {
      console.error('Error saving template:', error);

      throw error;
    } , [editor.template]);

  // Função para preview do template
  const previewTemplate = useCallback((data: Record<string, any>) => {
    try {
      let html = editor.template.content.html;
      
      // Substituir variáveis
      Object.entries(data).forEach(([key, value]) => {
        const regex = new RegExp(`{${key}`, 'g');

        html = html.replace(regex, String(value));

      });

      return html;
    } catch (error) {
      console.error('Error generating preview:', error);

      return editor.template.content.html;
    } , [editor.template.content.html]);

  // Função para exportar template
  const exportTemplate = useCallback((format: 'html' | 'json') => {
    if (format === 'html') {
      return editor.template.content.html;
    } else {
      return JSON.stringify(editor.template, null, 2);

    } , [editor.template]);

  // Função para importar template
  const importTemplate = useCallback((data: string, format: 'html' | 'json') => {
    try {
      if (format === 'json') {
        const template = JSON.parse(data);

        setEditor(prev => ({
          ...prev,
          template: template,
          is_dirty: true
        }));

      } else {
        setEditor(prev => ({
          ...prev,
          template: {
            ...prev.template,
            content: {
              ...prev.template.content,
              html: data
            } ,
          is_dirty: true
        }));

      } catch (error) {
      console.error('Error importing template:', error);

      throw error;
    } , []);

  // Função para resetar editor
  const resetEditor = useCallback(() => {
    setEditor({
      template: {
        id: '',
        name: '',
        subject: '',
        content: {
          html: '',
          text: '',
          images: []
        },
        variables: [],
        is_active: false,
        is_public: false,
        created_at: '',
        updated_at: '',
        created_by: '',
        usage_count: 0,
        tags: [],
        description: '',
        version: 1
      },
      is_dirty: false,
      current_step: 'design',
      selected_element: undefined,
      undo_stack: [],
      redo_stack: []
    });

  }, []);

  // Estado computado
  const canUndo = editor.undo_stack.length > 0;
  const canRedo = editor.redo_stack.length > 0;

  return {
    editor,
    updateTemplate,
    updateElement,
    addElement,
    removeElement,
    selectElement,
    deselectElement,
    undo,
    redo,
    canUndo,
    canRedo,
    saveTemplate,
    previewTemplate,
    exportTemplate,
    importTemplate,
    resetEditor};
};
