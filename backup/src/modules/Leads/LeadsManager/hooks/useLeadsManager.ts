// ========================================
// USE LEADS MANAGER HOOK
// ========================================
// Hook para gerenciamento avançado de leads
// Máximo: 200 linhas

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  updateLeadStatus,
  updateLeadScore,
  assignLead,
  unassignLead,
  duplicateLead,
  mergeLeads,
  createLeadNote,
  fetchLeadNotes,
  createLeadTask,
  fetchLeadTasks,
  uploadLeadDocument,
  fetchLeadDocuments,
  deleteLeadDocument,
  searchLeadsAdvanced,
  findDuplicateLeads
} from '../services/leadsManagerService';
import {
  Lead,
  LeadNote,
  LeadTask,
  LeadDocument,
  LeadFilters,
  LeadListResponse
} from '../types';

// ========================================
// INTERFACES
// ========================================

interface UseLeadsManagerState {
  notes: LeadNote[];
  tasks: LeadTask[];
  documents: LeadDocument[];
  duplicates: any[];
  loading: boolean;
  error: string | null;
}

interface UseLeadsManagerActions {
  // Lead Actions
  updateStatus: (id: number, status: string, reason?: string) => Promise<boolean>;
  updateScore: (id: number, score: number, reason?: string) => Promise<boolean>;
  assign: (id: number, userId: number) => Promise<boolean>;
  unassign: (id: number) => Promise<boolean>;
  duplicate: (id: number) => Promise<Lead | null>;
  merge: (primaryId: number, secondaryId: number, mergedData: Partial<Lead>) => Promise<Lead | null>;
  
  // Notes Management
  fetchNotes: (leadId: number) => Promise<void>;
  addNote: (leadId: number, content: string, isPrivate?: boolean) => Promise<boolean>;
  
  // Tasks Management
  fetchTasks: (leadId: number) => Promise<void>;
  addTask: (leadId: number, task: Omit<LeadTask, 'id' | 'lead_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  
  // Documents Management
  fetchDocuments: (leadId: number) => Promise<void>;
  uploadDocument: (leadId: number, file: File) => Promise<boolean>;
  removeDocument: (leadId: number, documentId: number) => Promise<boolean>;
  
  // Advanced Search
  advancedSearch: (filters: LeadFilters) => Promise<Lead[]>;
  findDuplicates: (filters?: { email?: boolean; phone?: boolean; name?: boolean }) => Promise<void>;
  
  // State Management
  clearError: () => void;
  clearNotes: () => void;
  clearTasks: () => void;
  clearDocuments: () => void;
  clearDuplicates: () => void;
}

// ========================================
// HOOK IMPLEMENTATION
// ========================================

export const useLeadsManager = (): UseLeadsManagerState & UseLeadsManagerActions => {
  // ========================================
  // STATE
  // ========================================
  
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [tasks, setTasks] = useState<LeadTask[]>([]);
  const [documents, setDocuments] = useState<LeadDocument[]>([]);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ========================================
  // LEAD ACTIONS
  // ========================================
  
  const updateStatus = useCallback(async (id: number, status: string, reason?: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await updateLeadStatus(id, status, reason);
      
      if (response.success) {
        toast.success('Lead status updated successfully');
        return true;
      } else {
        setError(response.message || 'Failed to update lead status');
        toast.error(response.message || 'Failed to update lead status');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while updating lead status';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateScore = useCallback(async (id: number, score: number, reason?: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await updateLeadScore(id, score, reason);
      
      if (response.success) {
        toast.success('Lead score updated successfully');
        return true;
      } else {
        setError(response.message || 'Failed to update lead score');
        toast.error(response.message || 'Failed to update lead score');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while updating lead score';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const assign = useCallback(async (id: number, userId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await assignLead(id, userId);
      
      if (response.success) {
        toast.success('Lead assigned successfully');
        return true;
      } else {
        setError(response.message || 'Failed to assign lead');
        toast.error(response.message || 'Failed to assign lead');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while assigning lead';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const unassign = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await unassignLead(id);
      
      if (response.success) {
        toast.success('Lead unassigned successfully');
        return true;
      } else {
        setError(response.message || 'Failed to unassign lead');
        toast.error(response.message || 'Failed to unassign lead');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while unassigning lead';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const duplicate = useCallback(async (id: number): Promise<Lead | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await duplicateLead(id);
      
      if (response.success) {
        toast.success('Lead duplicated successfully');
        return response.data;
      } else {
        setError(response.message || 'Failed to duplicate lead');
        toast.error(response.message || 'Failed to duplicate lead');
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while duplicating lead';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const merge = useCallback(async (primaryId: number, secondaryId: number, mergedData: Partial<Lead>): Promise<Lead | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mergeLeads(primaryId, secondaryId, mergedData);
      
      if (response.success) {
        toast.success('Leads merged successfully');
        return response.data;
      } else {
        setError(response.message || 'Failed to merge leads');
        toast.error(response.message || 'Failed to merge leads');
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while merging leads';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================
  // NOTES MANAGEMENT
  // ========================================
  
  const fetchNotes = useCallback(async (leadId: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchLeadNotes(leadId);
      
      if (response.success) {
        setNotes(response.data);
      } else {
        setError(response.message || 'Failed to fetch notes');
        toast.error(response.message || 'Failed to fetch notes');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching notes';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNote = useCallback(async (leadId: number, content: string, isPrivate: boolean = false): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await createLeadNote(leadId, content, isPrivate);
      
      if (response.success) {
        setNotes(prev => [response.data, ...prev]);
        toast.success('Note added successfully');
        return true;
      } else {
        setError(response.message || 'Failed to add note');
        toast.error(response.message || 'Failed to add note');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while adding note';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================
  // TASKS MANAGEMENT
  // ========================================
  
  const fetchTasks = useCallback(async (leadId: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchLeadTasks(leadId);
      
      if (response.success) {
        setTasks(response.data);
      } else {
        setError(response.message || 'Failed to fetch tasks');
        toast.error(response.message || 'Failed to fetch tasks');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching tasks';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (leadId: number, task: Omit<LeadTask, 'id' | 'lead_id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await createLeadTask(leadId, task);
      
      if (response.success) {
        setTasks(prev => [response.data, ...prev]);
        toast.success('Task added successfully');
        return true;
      } else {
        setError(response.message || 'Failed to add task');
        toast.error(response.message || 'Failed to add task');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while adding task';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================
  // DOCUMENTS MANAGEMENT
  // ========================================
  
  const fetchDocuments = useCallback(async (leadId: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchLeadDocuments(leadId);
      
      if (response.success) {
        setDocuments(response.data);
      } else {
        setError(response.message || 'Failed to fetch documents');
        toast.error(response.message || 'Failed to fetch documents');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching documents';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(async (leadId: number, file: File): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await uploadLeadDocument(leadId, file);
      
      if (response.success) {
        setDocuments(prev => [response.data, ...prev]);
        toast.success('Document uploaded successfully');
        return true;
      } else {
        setError(response.message || 'Failed to upload document');
        toast.error(response.message || 'Failed to upload document');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while uploading document';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeDocument = useCallback(async (leadId: number, documentId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await deleteLeadDocument(leadId, documentId);
      
      if (response.success) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        toast.success('Document removed successfully');
        return true;
      } else {
        setError(response.message || 'Failed to remove document');
        toast.error(response.message || 'Failed to remove document');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while removing document';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================
  // ADVANCED SEARCH
  // ========================================
  
  const advancedSearch = useCallback(async (filters: LeadFilters): Promise<Lead[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response: LeadListResponse = await searchLeadsAdvanced(filters);
      
      if (response.success) {
        return response.data.leads;
      } else {
        setError(response.message || 'Failed to perform advanced search');
        toast.error(response.message || 'Failed to perform advanced search');
        return [];
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while performing advanced search';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const findDuplicates = useCallback(async (filters?: { email?: boolean; phone?: boolean; name?: boolean }): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await findDuplicateLeads(filters);
      
      if (response.success) {
        setDuplicates(response.data);
      } else {
        setError(response.message || 'Failed to find duplicate leads');
        toast.error(response.message || 'Failed to find duplicate leads');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while finding duplicate leads';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearNotes = useCallback(() => {
    setNotes([]);
  }, []);

  const clearTasks = useCallback(() => {
    setTasks([]);
  }, []);

  const clearDocuments = useCallback(() => {
    setDocuments([]);
  }, []);

  const clearDuplicates = useCallback(() => {
    setDuplicates([]);
  }, []);

  // ========================================
  // RETURN
  // ========================================
  
  return {
    // State
    notes,
    tasks,
    documents,
    duplicates,
    loading,
    error,
    
    // Actions
    updateStatus,
    updateScore,
    assign,
    unassign,
    duplicate,
    merge,
    fetchNotes,
    addNote,
    fetchTasks,
    addTask,
    fetchDocuments,
    uploadDocument,
    removeDocument,
    advancedSearch,
    findDuplicates,
    clearError,
    clearNotes,
    clearTasks,
    clearDocuments,
    clearDuplicates
  };
};
