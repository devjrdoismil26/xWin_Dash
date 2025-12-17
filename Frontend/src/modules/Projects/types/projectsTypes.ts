// Main types for the Projects module
export interface ProjectCore {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string; }

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
  status: 'active' | 'inactive' | 'pending'; }

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
  [key: string]: unknown; }

export interface ProjectNotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  events: ProjectNotificationEvent[];
  [key: string]: unknown; }

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
  [key: string]: unknown; }

export interface ProjectIntegrationSettings {
  enabledIntegrations: string[];
  webhookUrl?: string;
  apiKey?: string;
  syncSettings: Record<string, any>;
  [key: string]: unknown; }

export interface ProjectAutomationSettings {
  autoArchive: boolean;
  autoArchiveDays: number;
  autoBackup: boolean;
  autoBackupFrequency: 'daily' | 'weekly' | 'monthly';
  autoNotifications: boolean;
  [key: string]: unknown; }

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
  lastActivity: string; }

// Advanced types (simplified versions)
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  content: Record<string, any>;
  metadata: Record<string, any>;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  rating: number;
  tags: string[]; }

export interface ProjectTimeline {
  id: string;
  projectId: string;
  phases: string[];
  dependencies: string[];
  criticalPath: string[];
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  status: string;
  lastUpdated: string; }

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
  deliverables: string[];
  notifications: string[]; }

export interface ProjectResource {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  availability: Record<string, any>;
  cost: Record<string, any>;
  skills: string[];
  experience: Record<string, any>;
  assignments: Record<string, any>[];
  performance: Record<string, any>; }

export interface ProjectBudget {
  id: string;
  projectId: string;
  totalBudget: number;
  allocatedBudget: number;
  spentBudget: number;
  remainingBudget: number;
  currency: string;
  categories: string[];
  phases: string[];
  resources: string[];
  risks: string[];
  forecasts: string[];
  approvals: string[];
  lastUpdated: string; }

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
  mitigation: Record<string, any>;
  monitoring: Record<string, any>;
  history: string[];
  createdAt: string;
  updatedAt: string; }

export interface ProjectReport {
  id: string;
  name: string;
  description: string;
  type: string;
  projectId: string;
  generatedBy: string;
  generatedAt: string;
  period: Record<string, any>;
  data: Record<string, any>;
  format: string;
  status: string;
  recipients: string[];
  scheduled: boolean;
  schedule?: Record<string, any>; }

export interface ProjectAnalytics {
  id: string;
  projectId: string;
  period: Record<string, any>;
  metrics: Record<string, any>;
  trends: string[];
  benchmarks: string[];
  predictions: string[];
  insights: string[];
  lastUpdated: string; }

// ========================================
// PROJECT SELECTOR TYPES
// ========================================

export interface ProjectSelectorProps {
  auth: unknown;
  projects?: Project[];
  currentProject?: Project;
  [key: string]: unknown; }

export interface Project {
  id: number;
  name: string;
  description: string;
  mode: 'normal' | 'universe';
  status: 'active' | 'inactive' | 'archived';
  members_count: number;
  created_at: string;
  updated_at: string;
  modules?: string[]; }

// ========================================
// COMPONENT PROPS TYPES
// ========================================

export interface AddProjectMemberModalProps {
  isOpen?: boolean;
  onClose???: (e: any) => void;
  onAdd??: (e: any) => void; }

export interface AdminProjectTableProps {
  projects: Project[];
  loading?: boolean;
  error?: string;
  onProjectUpdate??: (e: any) => void;
  onProjectDelete??: (e: any) => void;
  [key: string]: unknown; }

export interface ProjectMembersTableProps {
  members: ProjectMember[];
  loading?: boolean;
  error?: string;
  onMemberUpdate??: (e: any) => void;
  onMemberRemove??: (e: any) => void;
  canManage?: boolean;
  [key: string]: unknown; }

export interface ProjectsHubProps {
  projects: Project[];
  metrics: ProjectMetrics;
  loading?: boolean;
  error?: string;
  onProjectCreate???: (e: any) => void;
  onProjectUpdate??: (e: any) => void;
  onProjectDelete??: (e: any) => void;
  [key: string]: unknown; }

export interface ProjectSelectProps {
  projects: Project[];
  selectedProject?: Project | null;
  onProjectSelect?: (e: any) => void;
  loading?: boolean;
  error?: string;
  placeholder?: string;
  [key: string]: unknown; }

export interface ProjectMetrics {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  overdue_projects: number;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  team_members: number; }


// ===== ADDITIONAL PROJECT TYPES =====

export interface ProjectFormData {
  name: string;
  description?: string;
  type: ProjectType;
  start_date?: string;
  end_date?: string;
  budget?: number;
  [key: string]: unknown; }

export type ProjectType = 'internal' | 'client' | 'research' | 'maintenance';

export interface ProjectFilters {
  status?: string[];
  type?: ProjectType[];
  date_from?: string;
  date_to?: string;
  search?: string; }

export interface ProjectActivity {
  id: number;
  project_id: number;
  user_id: number;
  action: string;
  description: string;
  created_at: string; }

export interface ProjectBudgetCategory {
  id: number;
  name: string;
  allocated: number;
  spent: number;
  remaining: number; }

export type ProjectTaskType = 'task' | 'bug' | 'feature' | 'improvement';
export type ProjectTaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ProjectTemplateAdvanced {
  id: number;
  name: string;
  description?: string;
  tasks: string[];
  milestones: string[];
  settings: Record<string, any>; }

// Risk Management Types
export type ProjectRiskProbability = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
export type ProjectRiskImpact = 'negligible' | 'minor' | 'moderate' | 'major' | 'severe';
export type ProjectRiskCategory = 'technical' | 'financial' | 'operational' | 'strategic' | 'external';

export interface ProjectRiskAssessment {
  risk_id: number;
  probability: ProjectRiskProbability;
  impact: ProjectRiskImpact;
  score: number;
  category: ProjectRiskCategory; }

export interface ProjectRiskMitigation {
  risk_id: number;
  strategy: string;
  actions: string[];
  responsible: number;
  deadline: string; }

export interface ProjectRiskMonitoring {
  risk_id: number;
  status: 'active' | 'mitigated' | 'occurred' | 'closed';
  last_review: string;
  next_review: string; }

export interface ProjectRiskResponse {
  risk_id: number;
  type: 'avoid' | 'mitigate' | 'transfer' | 'accept';
  plan: string;
  data?: string;
  success?: boolean;
  message?: string;
  error?: string; }

export interface ProjectRiskReporting {
  period: string;
  total_risks: number;
  active_risks: number;
  mitigated_risks: number;
  occurred_risks: number; }

export interface ProjectRiskCommunication {
  risk_id: number;
  stakeholders: number[];
  message: string;
  sent_at: string; }

export interface ProjectRiskCompliance {
  risk_id: number;
  regulations: string[];
  compliant: boolean;
  notes?: string; }

export interface ProjectRiskSecurity {
  risk_id: number;
  security_level: 'low' | 'medium' | 'high' | 'critical';
  measures: string[]; }

export interface ProjectRiskQuality {
  risk_id: number;
  quality_impact: 'none' | 'low' | 'medium' | 'high';
  mitigation_quality: number; }

export interface ProjectRiskSchedule {
  risk_id: number;
  schedule_impact_days: number;
  critical_path_affected: boolean; }

export interface ProjectRiskProcurement {
  risk_id: number;
  vendor_related: boolean;
  contract_impact: boolean; }

export interface ProjectRiskHumanResource {
  risk_id: number;
  team_impact: boolean;
  skills_gap: boolean;
  resource_availability: boolean; }

export interface ProjectRiskStakeholder {
  risk_id: number;
  stakeholder_id: number;
  concern_level: 'low' | 'medium' | 'high'; }

export interface ProjectRiskIntegration {
  risk_id: number;
  integration_points: string[];
  dependencies: number[]; }

export interface ProjectRiskPerformance {
  risk_id: number;
  performance_impact: number;
  kpi_affected: string[]; }

// Hook Return Types
export interface UseProjectTimelineReturn {
  timeline: string[];
  loading: boolean;
  error: string | null;
  refetch??: (e: any) => void; }

export interface UseProjectMilestonesReturn {
  milestones: string[];
  loading: boolean;
  error: string | null;
  createMilestone?: (e: any) => void;
  updateMilestone?: (e: any) => void;
  deleteMilestone?: (e: any) => void; }

export interface UseProjectResourcesReturn {
  resources: string[];
  loading: boolean;
  error: string | null;
  allocateResource?: (e: any) => void;
  deallocateResource?: (e: any) => void; }

export interface UseProjectBudgetReturn {
  budget: unknown;
  categories: ProjectBudgetCategory[];
  loading: boolean;
  error: string | null;
  updateBudget?: (e: any) => void; }

export interface UseProjectRisksReturn {
  risks: string[];
  loading: boolean;
  error: string | null;
  createRisk?: (e: any) => void;
  updateRisk?: (e: any) => void;
  deleteRisk?: (e: any) => void; }

export interface UseProjectTemplatesReturn {
  templates: ProjectTemplateAdvanced[];
  loading: boolean;
  error: string | null;
  createTemplate?: (e: any) => void;
  applyTemplate?: (e: any) => void; }
