// Types for ProjectsManager module - Project management operations
export interface ProjectManager extends ProjectCore {
  mode: ProjectMode;
  modules: string[];
  members: ProjectMember[];
  settings: ProjectSettings;
  statistics: ProjectStatistics;
  lastActivity: string;
}

export type ProjectMode = 'normal' | 'universe';

export interface ProjectMember {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: ProjectRole;
  permissions: ProjectPermission[];
  joinedAt: string;
  lastActiveAt: string;
  status: 'active' | 'inactive' | 'pending';
}

export type ProjectRole = 'owner' | 'admin' | 'member' | 'viewer';

export type ProjectPermission = 
  | 'read'
  | 'write'
  | 'delete'
  | 'manage_members'
  | 'manage_settings'
  | 'export_data'
  | 'view_analytics';

export interface ProjectSettings {
  notifications: ProjectNotificationSettings;
  privacy: ProjectPrivacySettings;
  integrations: ProjectIntegrationSettings;
  automation: ProjectAutomationSettings;
}

export interface ProjectNotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  events: ProjectNotificationEvent[];
}

export type ProjectNotificationEvent = 
  | 'member_joined'
  | 'member_left'
  | 'status_changed'
  | 'milestone_completed'
  | 'deadline_approaching'
  | 'comment_added'
  | 'file_uploaded';

export interface ProjectPrivacySettings {
  visibility: 'private' | 'team' | 'public';
  allowInvites: boolean;
  requireApproval: boolean;
  allowComments: boolean;
  allowFileUploads: boolean;
}

export interface ProjectIntegrationSettings {
  enabledIntegrations: string[];
  webhookUrl?: string;
  apiKey?: string;
  syncSettings: Record<string, any>;
}

export interface ProjectAutomationSettings {
  autoArchive: boolean;
  autoArchiveDays: number;
  autoBackup: boolean;
  autoBackupFrequency: 'daily' | 'weekly' | 'monthly';
  autoNotifications: boolean;
}

export interface ProjectStatistics {
  leads: number;
  workflows: number;
  campaigns: number;
  revenue: number;
  tasks: number;
  completedTasks: number;
  files: number;
  comments: number;
  members: number;
  lastActivity: string;
}

export interface ProjectManagerFilters extends ProjectCoreFilters {
  mode?: ProjectMode;
  role?: ProjectRole;
  hasMembers?: boolean;
  hasActivity?: boolean;
  revenueMin?: number;
  revenueMax?: number;
}

export interface ProjectManagerMetrics extends ProjectCoreMetrics {
  universeProjects: number;
  normalProjects: number;
  totalMembers: number;
  activeMembers: number;
  totalRevenue: number;
  averageRevenue: number;
  projectsWithMembers: number;
  projectsWithoutMembers: number;
}

export interface ProjectInvitation {
  id: string;
  projectId: string;
  email: string;
  role: ProjectRole;
  permissions: ProjectPermission[];
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  token: string;
}

export interface ProjectManagerResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  metadata?: {
    totalMembers?: number;
    totalRevenue?: number;
    lastActivity?: string;
  };
}
