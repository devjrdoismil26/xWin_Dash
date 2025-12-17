import { useState, useEffect, useCallback } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { projectsService } from '../services/projectsService';
import { ProjectTemplateAdvanced, ProjectTimeline, ProjectMilestoneAdvanced, ProjectResource, ProjectBudgetAdvanced, ProjectRisk, UseProjectTemplatesReturn, UseProjectTimelineReturn, UseProjectMilestonesReturn, UseProjectResourcesReturn, UseProjectBudgetReturn, UseProjectRisksReturn } from '../types/projectsTypes';

// ===== TEMPLATES HOOK =====
export const useProjectTemplates = (): UseProjectTemplatesReturn => {
  const [templates, setTemplates] = useState<ProjectTemplateAdvanced[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getTemplates = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const response = await projectsService.getTemplates();

      if (response.success) {
        setTemplates(response.data as ProjectTemplateAdvanced[]);

      } else {
        setError(response.error || 'Erro ao carregar templates');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , []);

  const createTemplate = useCallback(async (data: unknown) => {
    setLoading(true);

    setError(null);

    try {
      const response = await projectsService.createTemplate(data);

      if (response.success) {
        await getTemplates(); // Refresh list
        return (response as any).data as ProjectTemplateAdvanced;
      } else {
        setError(response.error || 'Erro ao criar template');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , [getTemplates]);

  const updateTemplate = useCallback(async (id: string, data: unknown) => {
    setLoading(true);

    setError(null);

    try {
      const response = await projectsService.updateTemplate(id, data);

      if (response.success) {
        await getTemplates(); // Refresh list
        return (response as any).data as ProjectTemplateAdvanced;
      } else {
        setError(response.error || 'Erro ao atualizar template');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , [getTemplates]);

  const deleteTemplate = useCallback(async (id: string) => {
    setLoading(true);

    setError(null);

    try {
      const response = await projectsService.deleteTemplate(id);

      if (response.success) {
        await getTemplates(); // Refresh list
        return true;
      } else {
        setError(response.error || 'Erro ao excluir template');

        return false;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return false;
    } finally {
      setLoading(false);

    } , [getTemplates]);

  useEffect(() => {
    getTemplates();

  }, [getTemplates]);

  return {
    templates,
    loading,
    error,
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate};
};

// ===== TIMELINE HOOK =====
export const useProjectTimeline = (): UseProjectTimelineReturn => {
  const [timeline, setTimeline] = useState<ProjectTimeline | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getTimeline = useCallback(async (projectId: string) => {
    setLoading(true);

    setError(null);

    try {
      const response = await projectsService.getTimeline(projectId);

      if (response.success) {
        setTimeline(response.data as ProjectTimeline);

      } else {
        setError(response.error || 'Erro ao carregar timeline');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , []);

  const updateTimeline = useCallback(async (projectId: string, data: unknown) => {
    setLoading(true);

    setError(null);

    try {
      // Note: This would need to be implemented in the service
      // For now, we'll just refresh the timeline
      await getTimeline(projectId);

      return timeline;
    } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , [getTimeline, timeline]);

  return {
    timeline,
    loading,
    error,
    getTimeline,
    updateTimeline};
};

// ===== MILESTONES HOOK =====
export const useProjectMilestones = (): UseProjectMilestonesReturn => {
  const [milestones, setMilestones] = useState<ProjectMilestoneAdvanced[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getMilestones = useCallback(async (projectId: string) => {
    setLoading(true);

    setError(null);

    try {
      const response = await projectsService.getMilestones(projectId);

      if (response.success) {
        setMilestones(response.data as ProjectMilestoneAdvanced[]);

      } else {
        setError(response.error || 'Erro ao carregar marcos');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , []);

  const createMilestone = useCallback(async (projectId: string, data: unknown) => {
    setLoading(true);

    setError(null);

    try {
      const response = await projectsService.createMilestone(projectId, data);

      if (response.success) {
        await getMilestones(projectId); // Refresh list
        return (response as any).data as ProjectMilestoneAdvanced;
      } else {
        setError(response.error || 'Erro ao criar marco');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , [getMilestones]);

  const updateMilestone = useCallback(async (projectId: string, milestoneId: string, data: unknown) => {
    setLoading(true);

    setError(null);

    try {
      const response = await projectsService.updateMilestone(projectId, milestoneId, data);

      if (response.success) {
        await getMilestones(projectId); // Refresh list
        return (response as any).data as ProjectMilestoneAdvanced;
      } else {
        setError(response.error || 'Erro ao atualizar marco');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , [getMilestones]);

  const deleteMilestone = useCallback(async (projectId: string, milestoneId: string) => {
    setLoading(true);

    setError(null);

    try {
      const response = await projectsService.deleteMilestone(projectId, milestoneId);

      if (response.success) {
        await getMilestones(projectId); // Refresh list
        return true;
      } else {
        setError(response.error || 'Erro ao excluir marco');

        return false;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return false;
    } finally {
      setLoading(false);

    } , [getMilestones]);

  return {
    milestones,
    loading,
    error,
    getMilestones,
    createMilestone,
    updateMilestone,
    deleteMilestone};
};

// ===== RESOURCES HOOK =====
export const useProjectResources = (): UseProjectResourcesReturn => {
  const [resources, setResources] = useState<ProjectResource[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getResources = useCallback(async (projectId: string) => {
    setLoading(true);

    setError(null);

    try {
      const response = await projectsService.getResources(projectId);

      if (response.success) {
        setResources(response.data as ProjectResource[]);

      } else {
        setError(response.error || 'Erro ao carregar recursos');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , []);

  const createResource = useCallback(async (projectId: string, data: unknown) => {
    setLoading(true);

    setError(null);

    try {
      const response = await projectsService.createResource(projectId, data);

      if (response.success) {
        await getResources(projectId); // Refresh list
        return (response as any).data as ProjectResource;
      } else {
        setError(response.error || 'Erro ao criar recurso');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , [getResources]);

  const updateResource = useCallback(async (projectId: string, resourceId: string, data: unknown) => {
    setLoading(true);

    setError(null);

    try {
      // Note: This would need to be implemented in the service
      // For now, we'll just refresh the resources
      await getResources(projectId);

      return null;
    } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , [getResources]);

  const deleteResource = useCallback(async (projectId: string, resourceId: string) => {
    setLoading(true);

    setError(null);

    try {
      // Note: This would need to be implemented in the service
      // For now, we'll just refresh the resources
      await getResources(projectId);

      return true;
    } catch (err: unknown) {
      setError(getErrorMessage(err));

      return false;
    } finally {
      setLoading(false);

    } , [getResources]);

  return {
    resources,
    loading,
    error,
    getResources,
    createResource,
    updateResource,
    deleteResource};
};

// ===== BUDGET HOOK =====
export const useProjectBudget = (): UseProjectBudgetReturn => {
  const [budget, setBudget] = useState<ProjectBudgetAdvanced | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getBudget = useCallback(async (projectId: string) => {
    setLoading(true);

    setError(null);

    try {
      const response = await projectsService.getBudget(projectId);

      if (response.success) {
        setBudget(response.data as ProjectBudgetAdvanced);

      } else {
        setError(response.error || 'Erro ao carregar orçamento');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , []);

  const updateBudget = useCallback(async (projectId: string, data: unknown) => {
    setLoading(true);

    setError(null);

    try {
      const response = await projectsService.updateBudget(projectId, data);

      if (response.success) {
        setBudget(response.data as ProjectBudgetAdvanced);

        return (response as any).data as ProjectBudgetAdvanced;
      } else {
        setError(response.error || 'Erro ao atualizar orçamento');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  return {
    budget,
    loading,
    error,
    getBudget,
    updateBudget};
};

// ===== RISKS HOOK =====
export const useProjectRisks = (): UseProjectRisksReturn => {
  const [risks, setRisks] = useState<ProjectRisk[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getRisks = useCallback(async (projectId: string) => {
    setLoading(true);

    setError(null);

    try {
      const response = await projectsService.getRisks(projectId);

      if (response.success) {
        setRisks(response.data as ProjectRisk[]);

      } else {
        setError(response.error || 'Erro ao carregar riscos');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , []);

  const createRisk = useCallback(async (projectId: string, data: unknown) => {
    setLoading(true);

    setError(null);

    try {
      const response = await projectsService.createRisk(projectId, data);

      if (response.success) {
        await getRisks(projectId); // Refresh list
        return (response as any).data as ProjectRisk;
      } else {
        setError(response.error || 'Erro ao criar risco');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , [getRisks]);

  const updateRisk = useCallback(async (projectId: string, riskId: string, data: unknown) => {
    setLoading(true);

    setError(null);

    try {
      // Note: This would need to be implemented in the service
      // For now, we'll just refresh the risks
      await getRisks(projectId);

      return null;
    } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , [getRisks]);

  const deleteRisk = useCallback(async (projectId: string, riskId: string) => {
    setLoading(true);

    setError(null);

    try {
      // Note: This would need to be implemented in the service
      // For now, we'll just refresh the risks
      await getRisks(projectId);

      return true;
    } catch (err: unknown) {
      setError(getErrorMessage(err));

      return false;
    } finally {
      setLoading(false);

    } , [getRisks]);

  return {
    risks,
    loading,
    error,
    getRisks,
    createRisk,
    updateRisk,
    deleteRisk};
};
