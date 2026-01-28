import { useState, useEffect, useCallback } from 'react';
import { userApiService } from '../services/userApiService';
import { User, UserFilters, UserBulkUpdate, UserBulkDelete, UserImport } from '../types/user.types';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
  status?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  [key: string]: unknown; }

export interface UpdateUserData extends Partial<CreateUserData> {
  id: number;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<Record<string, any> | null>(null);

  // Fetch users
  const fetchUsers = useCallback(async (filters: UserFilters = {}) => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.getUsers(filters);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch users');

      }

      setUsers(response.data?.users || []);

      setPagination(response.data?.pagination || null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');

    } finally {
      setLoading(false);

    } , []);

  // Create user
  const createUser = useCallback(async (data: CreateUserData): Promise<User> => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.createUser(data);

      if (!response.success) {
        throw new Error(response.error || 'Failed to create user');

      }

      const newUser = (response as any).data!;
      setUsers(prev => [newUser, ...prev]);

      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Update user
  const updateUser = useCallback(async (data: UpdateUserData): Promise<User> => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.updateUser(data.id.toString(), data);

      if (!response.success) {
        throw new Error(response.error || 'Failed to update user');

      }

      const updatedUser = (response as any).data!;
      setUsers(prev => prev.map(u => u.id === (data as any).id ? updatedUser : u));

      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Delete user
  const deleteUser = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.deleteUser(id.toString());

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete user');

      }

      setUsers(prev => prev.filter(u => u.id !== id));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Get single user
  const getUser = useCallback(async (id: number): Promise<User> => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.getUserById(id.toString());

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch user');

      }

      return (response as any).data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Update user status
  const updateUserStatus = useCallback(async (id: number, status: string): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.updateUserStatus(id.toString(), status);

      if (!response.success) {
        throw new Error(response.error || 'Failed to update user status');

      }

      setUsers(prev => prev.map(u => 
        u.id === id ? { ...u, status: status as 'active' | 'inactive' | 'suspended' | 'pending' } : u
      ));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user status');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Update user role
  const updateUserRole = useCallback(async (id: number, role: string): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.updateUserRole(id.toString(), role);

      if (!response.success) {
        throw new Error(response.error || 'Failed to update user role');

      }

      setUsers(prev => prev.map(u => 
        u.id === id ? { ...u, role } : u
      ));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Reset user password
  const resetUserPassword = useCallback(async (id: number, newPassword: string): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.resetUserPassword(id.toString(), newPassword, newPassword);

      if (!response.success) {
        throw new Error(response.error || 'Failed to reset user password');

      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset user password');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Send verification email
  const sendVerificationEmail = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.sendVerificationEmail(id.toString());

      if (!response.success) {
        throw new Error(response.error || 'Failed to send verification email');

      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification email');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Get user statistics
  const getUserStats = useCallback(async (): Promise<{
    total_users: number;
    active_users: number;
    inactive_users: number;
    suspended_users: number;
    pending_users: number;
    new_users_today: number;
    users_growth_rate: number;
    average_session_duration: number;
    users_by_role: Record<string, number>;
    users_by_status: Record<string, number>;
  }> => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.getUserStats();

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch user statistics');

      }

      return (response as any).data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user statistics');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Search users
  const searchUsers = useCallback(async (query: string, filters: UserFilters = {}): Promise<User[]> => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.searchUsers(query, filters);

      if (!response.success) {
        throw new Error(response.error || 'Failed to search users');

      }

      return (response as any).data?.results || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search users');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Get users by role
  const getUsersByRole = useCallback(async (role: string, filters: UserFilters = {}): Promise<User[]> => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.getUsersByRole(role, filters);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch users by role');

      }

      return (response as any).data?.users || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users by role');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Get users by status
  const getUsersByStatus = useCallback(async (status: string, filters: UserFilters = {}): Promise<User[]> => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.getUsersByStatus(status, filters);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch users by status');

      }

      return (response as any).data?.users || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users by status');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Bulk update users
  const bulkUpdateUsers = useCallback(async (bulkData: UserBulkUpdate): Promise<{
    processed: number;
    successful: number;
    failed: number;
    errors: string[];
  }> => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.bulkUpdateUsers(bulkData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to bulk update users');

      }

      // Refresh users list after bulk update
      await fetchUsers();

      return (response as any).data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk update users');

      throw err;
    } finally {
      setLoading(false);

    } , [fetchUsers]);

  // Bulk delete users
  const bulkDeleteUsers = useCallback(async (bulkData: UserBulkDelete): Promise<{
    processed: number;
    successful: number;
    failed: number;
    errors: string[];
  }> => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.bulkDeleteUsers(bulkData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to bulk delete users');

      }

      // Refresh users list after bulk delete
      await fetchUsers();

      return (response as any).data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk delete users');

      throw err;
    } finally {
      setLoading(false);

    } , [fetchUsers]);

  // Export users
  const exportUsers = useCallback(async (filters: UserFilters = {}): Promise<{
    file_url: string;
    file_name: string;
    file_size: number;
    export_date: string;
    total_records: number;
  }> => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.exportUsers(filters);

      if (!response.success) {
        throw new Error(response.error || 'Failed to export users');

      }

      return (response as any).data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export users');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Import users
  const importUsers = useCallback(async (importData: UserImport): Promise<{
    total_records: number;
    imported: number;
    skipped: number;
    errors: string[];
    import_id: string;
  }> => {
    try {
      setLoading(true);

      setError(null);

      const response = await userApiService.importUsers(importData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to import users');

      }

      // Refresh users list after import
      await fetchUsers();

      return (response as any).data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import users');

      throw err;
    } finally {
      setLoading(false);

    } , [fetchUsers]);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    updateUserStatus,
    updateUserRole,
    resetUserPassword,
    sendVerificationEmail,
    getUserStats,
    searchUsers,
    getUsersByRole,
    getUsersByStatus,
    bulkUpdateUsers,
    bulkDeleteUsers,
    exportUsers,
    importUsers,};
};

export default useUsers;
