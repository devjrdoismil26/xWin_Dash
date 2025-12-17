// ========================================
// HOOK DE GESTÃO DE TEMPLATES DE PROJETO
// ========================================
import { useState, useCallback } from 'react';
import { ProjectTemplate } from '@/types/projectsAdvancedTypes';

export const useProjectTemplates = () => {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getProjectTemplates = useCallback(async (projectId: string): Promise<ProjectTemplate[]> => {
    try {
      setLoading(true);

      setError(null);

      // Mock implementation - in real app this would call the service
      const mockTemplates: ProjectTemplate[] = [
        {
          id: '1',
          name: 'Marketing Campaign Template',
          description: 'Template for marketing campaigns',
          category: 'marketing',
          type: 'project_plan',
          content: {
            structure: {},
            components: [],
            settings: {},
            variables: []
          },
          metadata: {
            version: '1.0.0',
            compatibility: ['1.0.0'],
            dependencies: [],
            features: ['automation', 'analytics'],
            limitations: []
          },
          isPublic: false,
          createdBy: 'user1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 5,
          rating: 4.5,
          tags: ['marketing', 'campaign']
        }
      ];
      
      setTemplates(mockTemplates);

      return mockTemplates;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project templates');

      return [];
    } finally {
      setLoading(false);

    } , []);

  const createProjectTemplate = useCallback(async (projectId: string, templateData: Partial<ProjectTemplate>): Promise<ProjectTemplate | null> => {
    try {
      setLoading(true);

      setError(null);

      // Mock implementation
      const newTemplate: ProjectTemplate = {
        id: Date.now().toString(),
        name: templateData.name || 'New Template',
        description: templateData.description || '',
        category: templateData.category || 'general',
        type: templateData.type || 'project_plan',
        content: templateData.content || {
          structure: {},
          components: [],
          settings: {},
          variables: []
        },
        metadata: templateData.metadata || {
          version: '1.0.0',
          compatibility: ['1.0.0'],
          dependencies: [],
          features: [],
          limitations: []
        },
        isPublic: templateData.isPublic || false,
        createdBy: 'current_user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        rating: 0,
        tags: templateData.tags || []};

      setTemplates(prev => [...prev, newTemplate]);

      return newTemplate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project template');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updateProjectTemplate = useCallback(async (projectId: string, templateId: string, templateData: Partial<ProjectTemplate>): Promise<ProjectTemplate | null> => {
    try {
      setLoading(true);

      setError(null);

      // Mock implementation
      const updatedTemplate: ProjectTemplate = {
        id: templateId,
        name: templateData.name || 'Updated Template',
        description: templateData.description || '',
        category: templateData.category || 'general',
        type: templateData.type || 'project_plan',
        content: templateData.content || {
          structure: {},
          components: [],
          settings: {},
          variables: []
        },
        metadata: templateData.metadata || {
          version: '1.0.0',
          compatibility: ['1.0.0'],
          dependencies: [],
          features: [],
          limitations: []
        },
        isPublic: templateData.isPublic || false,
        createdBy: 'current_user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        rating: 0,
        tags: templateData.tags || []};

      setTemplates(prev => prev.map(t => t.id === templateId ? updatedTemplate : t));

      return updatedTemplate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project template');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const deleteProjectTemplate = useCallback(async (projectId: string, templateId: string): Promise<boolean> => {
    try {
      setLoading(true);

      setError(null);

      // Mock implementation
      setTemplates(prev => prev.filter(t => t.id !== templateId));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project template');

      return false;
    } finally {
      setLoading(false);

    } , []);

  const duplicateProjectTemplate = useCallback(async (projectId: string, templateId: string): Promise<ProjectTemplate | null> => {
    try {
      setLoading(true);

      setError(null);

      const originalTemplate = templates.find(t => t.id === templateId);

      if (!originalTemplate) {
        setError('Template not found');

        return null;
      }
      
      const duplicatedTemplate: ProjectTemplate = {
        ...originalTemplate,
        id: Date.now().toString(),
        name: `${originalTemplate.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0};

      setTemplates(prev => [...prev, duplicatedTemplate]);

      return duplicatedTemplate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate project template');

      return null;
    } finally {
      setLoading(false);

    } , [templates]);

  return {
    templates,
    loading,
    error,
    getProjectTemplates,
    createProjectTemplate,
    updateProjectTemplate,
    deleteProjectTemplate,
    duplicateProjectTemplate};
};
