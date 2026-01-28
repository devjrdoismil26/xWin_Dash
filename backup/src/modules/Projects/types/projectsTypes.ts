// Main types for the Projects module
export interface ProjectCore {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ProjectManager extends ProjectCore {
  mode: ProjectMode;
  modules: string[];
  members: ProjectMember[];
  settings: ProjectSettings;
  statistics: ProjectStatistics;
  lastActivity: string;
}

export interface ProjectAdvanced extends ProjectManager {
  templates: ProjectTemplate[];
  timeline: ProjectTimeline;
  milestones: ProjectMilestone[];
  resources: ProjectResource[];
  budget: ProjectBudget;
  risks: ProjectRisk[];
  reports: ProjectReport[];
  analytics: ProjectAnalytics;
}

export type ProjectStatus = 'active' | 'inactive' | 'archived' | 'draft';
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

// Advanced types (simplified versions)
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  content: any;
  metadata: any;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  rating: number;
  tags: string[];
}

export interface ProjectTimeline {
  id: string;
  projectId: string;
  phases: any[];
  dependencies: any[];
  criticalPath: string[];
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  status: string;
  lastUpdated: string;
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  projectId: string;
  phaseId?: string;
  dueDate: string;
  completedDate?: string;
  status: string;
  progress: number;
  dependencies: string[];
  deliverables: any[];
  notifications: any[];
}

export interface ProjectResource {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  availability: any;
  cost: any;
  skills: string[];
  experience: any;
  assignments: any[];
  performance: any;
}

export interface ProjectBudget {
  id: string;
  projectId: string;
  totalBudget: number;
  allocatedBudget: number;
  spentBudget: number;
  remainingBudget: number;
  currency: string;
  categories: any[];
  phases: any[];
  resources: any[];
  risks: any[];
  forecasts: any[];
  approvals: any[];
  lastUpdated: string;
}

export interface ProjectRisk {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  probability: number;
  impact: number;
  riskScore: number;
  status: string;
  owner: string;
  mitigation: any;
  monitoring: any;
  history: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectReport {
  id: string;
  name: string;
  description: string;
  type: string;
  projectId: string;
  generatedBy: string;
  generatedAt: string;
  period: any;
  data: any;
  format: string;
  status: string;
  recipients: string[];
  scheduled: boolean;
  schedule?: any;
}

export interface ProjectAnalytics {
  id: string;
  projectId: string;
  period: any;
  metrics: any;
  trends: any[];
  benchmarks: any[];
  predictions: any[];
  insights: any[];
  lastUpdated: string;
}

// ========================================
// PROJECT SELECTOR TYPES
// ========================================

export interface ProjectSelectorProps {
  auth: any;
  projects?: Project[];
  currentProject?: Project;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  mode: 'normal' | 'universe';
  status: 'active' | 'inactive' | 'archived';
  members_count: number;
  created_at: string;
  updated_at: string;
  modules?: string[];
}

// ========================================
// COMPONENT PROPS TYPES
// ========================================

export interface AddProjectMemberModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onAdd?: (member: { userName: string; role: ProjectRole }) => void;
}

export interface AdminProjectTableProps {
  projects: Project[];
  loading?: boolean;
  error?: string;
  onProjectUpdate?: (project: Project) => void;
  onProjectDelete?: (projectId: number) => void;
}

export interface ProjectMembersTableProps {
  members: ProjectMember[];
  loading?: boolean;
  error?: string;
  onMemberUpdate?: (member: ProjectMember) => void;
  onMemberRemove?: (memberId: number) => void;
  canManage?: boolean;
}

export interface ProjectsHubProps {
  projects: Project[];
  metrics: ProjectMetrics;
  loading?: boolean;
  error?: string;
  onProjectCreate?: () => void;
  onProjectUpdate?: (project: Project) => void;
  onProjectDelete?: (projectId: number) => void;
}

export interface ProjectSelectProps {
  projects: Project[];
  selectedProject?: Project | null;
  onProjectSelect: (project: Project | null) => void;
  loading?: boolean;
  error?: string;
  placeholder?: string;
}

export interface ProjectMetrics {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  overdue_projects: number;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  team_members: number;
}
