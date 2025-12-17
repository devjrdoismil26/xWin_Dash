// Types for ProjectsAdvanced module - Advanced project features
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

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: ProjectTemplateCategory;
  type: ProjectTemplateType;
  content: ProjectTemplateContent;
  metadata: ProjectTemplateMetadata;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  rating: number;
  tags: string[]; }

export type ProjectTemplateCategory = 
  | 'business'
  | 'marketing'
  | 'development'
  | 'design'
  | 'research'
  | 'education'
  | 'healthcare'
  | 'finance'
  | 'other';

export type ProjectTemplateType = 
  | 'project_plan'
  | 'workflow'
  | 'dashboard'
  | 'report'
  | 'presentation'
  | 'documentation'
  | 'checklist'
  | 'timeline';

export interface ProjectTemplateContent {
  structure: Record<string, any>;
  components: ProjectTemplateComponent[];
  settings: Record<string, any>;
  variables: ProjectTemplateVariable[]; }

export interface ProjectTemplateComponent {
  id: string;
  type: string;
  name: string;
  content: Record<string, any>;
  position: { x: number;
  y: number;
};

  size: { width: number; height: number};

  settings: Record<string, any>;
}

export interface ProjectTemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  defaultValue: string | number | boolean | Record<string, any> | unknown[];
  required: boolean;
  description: string; }

export interface ProjectTemplateMetadata {
  version: string;
  compatibility: string[];
  dependencies: string[];
  features: string[];
  limitations: string[]; }

export interface ProjectTimeline {
  id: string;
  projectId: string;
  phases: ProjectPhase[];
  dependencies: ProjectDependency[];
  criticalPath: string[];
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  status: ProjectTimelineStatus;
  lastUpdated: string; }

export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  status: ProjectPhaseStatus;
  tasks: ProjectTask[];
  dependencies: string[];
  resources: string[];
  budget: number;
  actualCost: number; }

export type ProjectTimelineStatus = 'planning' | 'active' | 'completed' | 'on_hold' | 'cancelled';
export type ProjectPhaseStatus = 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';

export interface ProjectDependency {
  id: string;
  fromPhase: string;
  toPhase: string;
  type: ProjectDependencyType;
  lag: number;
  description: string; }

export type ProjectDependencyType = 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';

export interface ProjectTask {
  id: string;
  name: string;
  description: string;
  phaseId: string;
  assigneeId?: string;
  startDate: string;
  dueDate: string;
  duration: number;
  progress: number;
  status: ProjectTaskStatus;
  priority: ProjectTaskPriority;
  dependencies: string[];
  subtasks: ProjectSubtask[];
  timeEntries: ProjectTimeEntry[];
  comments: ProjectComment[];
  attachments: ProjectFile[]; }

export type ProjectTaskStatus = 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
export type ProjectTaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ProjectSubtask {
  id: string;
  name: string;
  description: string;
  status: ProjectTaskStatus;
  assigneeId?: string;
  dueDate: string;
  completedAt?: string; }

export interface ProjectTimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startTime: string;
  endTime: string;
  duration: number;
  description: string;
  billable: boolean;
  hourlyRate?: number; }

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  projectId: string;
  phaseId?: string;
  dueDate: string;
  completedDate?: string;
  status: ProjectMilestoneStatus;
  progress: number;
  dependencies: string[];
  deliverables: ProjectDeliverable[];
  notifications: ProjectMilestoneNotification[]; }

export type ProjectMilestoneStatus = 'upcoming' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';

export interface ProjectDeliverable {
  id: string;
  name: string;
  description: string;
  type: ProjectDeliverableType;
  status: ProjectDeliverableStatus;
  fileId?: string;
  url?: string;
  dueDate: string;
  completedDate?: string;
  approvedBy?: string;
  approvedAt?: string; }

export type ProjectDeliverableType = 'document' | 'presentation' | 'prototype' | 'report' | 'demo' | 'other';
export type ProjectDeliverableStatus = 'pending' | 'in_progress' | 'completed' | 'approved' | 'rejected';

export interface ProjectMilestoneNotification {
  id: string;
  type: ProjectMilestoneNotificationType;
  message: string;
  sentAt: string;
  recipients: string[];
  status: 'sent' | 'delivered' | 'failed'; }

export type ProjectMilestoneNotificationType = 'reminder' | 'overdue' | 'completed' | 'cancelled';

export interface ProjectResource {
  id: string;
  name: string;
  type: ProjectResourceType;
  category: ProjectResourceCategory;
  description: string;
  availability: ProjectResourceAvailability;
  cost: ProjectResourceCost;
  skills: string[];
  experience: ProjectResourceExperience;
  assignments: ProjectResourceAssignment[];
  performance: ProjectResourcePerformance; }

export type ProjectResourceType = 'human' | 'equipment' | 'material' | 'software' | 'service' | 'other';
export type ProjectResourceCategory = 'internal' | 'external' | 'contractor' | 'vendor';

export interface ProjectResourceAvailability {
  startDate: string;
  endDate: string;
  hoursPerWeek: number;
  timezone: string;
  workingDays: number[];
  holidays: string[];
  conflicts: ProjectResourceConflict[]; }

export interface ProjectResourceConflict {
  id: string;
  type: 'overlap' | 'unavailable' | 'overbooked';
  description: string;
  startDate: string;
  endDate: string;
  severity: 'low' | 'medium' | 'high'; }

export interface ProjectResourceCost {
  hourlyRate?: number;
  dailyRate?: number;
  monthlyRate?: number;
  totalBudget?: number;
  currency: string;
  billingType: 'hourly' | 'daily' | 'monthly' | 'fixed' | 'milestone'; }

export interface ProjectResourceExperience {
  years: number;
  level: 'junior' | 'mid' | 'senior' | 'expert';
  certifications: string[];
  previousProjects: string[];
  references: ProjectResourceReference[]; }

export interface ProjectResourceReference {
  name: string;
  contact: string;
  relationship: string;
  rating: number;
  comments: string; }

export interface ProjectResourceAssignment {
  id: string;
  taskId: string;
  phaseId: string;
  startDate: string;
  endDate: string;
  hoursAllocated: number;
  hoursWorked: number;
  status: ProjectResourceAssignmentStatus;
  role: string;
  responsibilities: string[]; }

export type ProjectResourceAssignmentStatus = 'assigned' | 'active' | 'completed' | 'cancelled';

export interface ProjectResourcePerformance {
  quality: number;
  timeliness: number;
  communication: number;
  collaboration: number;
  overall: number;
  feedback: ProjectResourceFeedback[]; }

export interface ProjectResourceFeedback {
  id: string;
  fromUserId: string;
  rating: number;
  comments: string;
  date: string;
  category: 'quality' | 'timeliness' | 'communication' | 'collaboration' | 'other'; }

export interface ProjectBudget {
  id: string;
  projectId: string;
  totalBudget: number;
  allocatedBudget: number;
  spentBudget: number;
  remainingBudget: number;
  currency: string;
  categories: ProjectBudgetCategory[];
  phases: ProjectBudgetPhase[];
  resources: ProjectBudgetResource[];
  risks: ProjectBudgetRisk[];
  forecasts: ProjectBudgetForecast[];
  approvals: ProjectBudgetApproval[];
  lastUpdated: string; }

export interface ProjectBudgetCategory {
  id: string;
  name: string;
  description: string;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
  subcategories: ProjectBudgetSubcategory[]; }

export interface ProjectBudgetSubcategory {
  id: string;
  name: string;
  budget: number;
  spent: number;
  remaining: number; }

export interface ProjectBudgetPhase {
  id: string;
  phaseId: string;
  name: string;
  budget: number;
  spent: number;
  remaining: number;
  startDate: string;
  endDate: string; }

export interface ProjectBudgetResource {
  id: string;
  resourceId: string;
  name: string;
  budget: number;
  spent: number;
  remaining: number;
  hourlyRate?: number;
  hoursAllocated: number;
  hoursWorked: number; }

export interface ProjectBudgetRisk {
  id: string;
  name: string;
  description: string;
  probability: number;
  impact: number;
  riskScore: number;
  mitigation: string;
  contingency: number;
  status: ProjectBudgetRiskStatus; }

export type ProjectBudgetRiskStatus = 'identified' | 'monitoring' | 'mitigating' | 'resolved' | 'occurred';

export interface ProjectBudgetForecast {
  id: string;
  date: string;
  forecastedSpend: number;
  actualSpend: number;
  variance: number;
  confidence: number;
  assumptions: string[]; }

export interface ProjectBudgetApproval {
  id: string;
  amount: number;
  category: string;
  description: string;
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: ProjectBudgetApprovalStatus;
  comments?: string; }

export type ProjectBudgetApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface ProjectRisk {
  id: string;
  name: string;
  description: string;
  category: ProjectRiskCategory;
  type: ProjectRiskType;
  probability: number;
  impact: number;
  riskScore: number;
  status: ProjectRiskStatus;
  owner: string;
  mitigation: ProjectRiskMitigation;
  monitoring: ProjectRiskMonitoring;
  history: ProjectRiskHistory[];
  createdAt: string;
  updatedAt: string; }

export type ProjectRiskCategory = 
  | 'technical'
  | 'financial'
  | 'schedule'
  | 'resource'
  | 'quality'
  | 'external'
  | 'regulatory'
  | 'security';

export type ProjectRiskType = 'threat' | 'opportunity';
export type ProjectRiskStatus = 'identified' | 'assessed' | 'mitigating' | 'monitoring' | 'resolved' | 'occurred';

export interface ProjectRiskMitigation {
  strategy: ProjectRiskMitigationStrategy;
  actions: ProjectRiskMitigationAction[];
  cost: number;
  timeline: string;
  owner: string;
  status: ProjectRiskMitigationStatus; }

export type ProjectRiskMitigationStrategy = 
  | 'avoid'
  | 'mitigate'
  | 'transfer'
  | 'accept'
  | 'exploit'
  | 'enhance'
  | 'share';

export type ProjectRiskMitigationStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export interface ProjectRiskMitigationAction {
  id: string;
  description: string;
  owner: string;
  dueDate: string;
  status: ProjectRiskMitigationStatus;
  completedAt?: string; }

export interface ProjectRiskMonitoring {
  frequency: ProjectRiskMonitoringFrequency;
  indicators: ProjectRiskIndicator[];
  reports: ProjectRiskReport[];
  lastReview: string;
  nextReview: string; }

export type ProjectRiskMonitoringFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export interface ProjectRiskIndicator {
  id: string;
  name: string;
  description: string;
  type: ProjectRiskIndicatorType;
  threshold: number;
  currentValue: number;
  status: ProjectRiskIndicatorStatus;
  lastUpdated: string; }

export type ProjectRiskIndicatorType = 'numeric' | 'percentage' | 'boolean' | 'text';
export type ProjectRiskIndicatorStatus = 'green' | 'yellow' | 'red';

export interface ProjectRiskReport {
  id: string;
  date: string;
  summary: string;
  changes: ProjectRiskChange[];
  recommendations: string[];
  reviewedBy: string;
  approvedBy?: string; }

export interface ProjectRiskChange {
  type: 'probability' | 'impact' | 'status' | 'mitigation';
  oldValue: unknown;
  newValue: unknown;
  reason: string;
  date: string; }

export interface ProjectRiskHistory {
  id: string;
  action: ProjectRiskHistoryAction;
  description: string;
  userId: string;
  timestamp: string;
  changes: Record<string, any>; }

export type ProjectRiskHistoryAction = 
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'mitigation_added'
  | 'mitigation_updated'
  | 'monitoring_updated'
  | 'reviewed'
  | 'resolved';

export interface ProjectReport {
  id: string;
  name: string;
  description: string;
  type: ProjectReportType;
  projectId: string;
  generatedBy: string;
  generatedAt: string;
  period: ProjectReportPeriod;
  data: ProjectReportData;
  format: ProjectReportFormat;
  status: ProjectReportStatus;
  recipients: string[];
  scheduled: boolean;
  schedule?: ProjectReportSchedule; }

export type ProjectReportType = 
  | 'status'
  | 'progress'
  | 'budget'
  | 'resource'
  | 'risk'
  | 'quality'
  | 'milestone'
  | 'custom';

export interface ProjectReportPeriod {
  startDate: string;
  endDate: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'; }

export interface ProjectReportData {
  summary: ProjectReportSummary;
  metrics: ProjectReportMetrics;
  charts: ProjectReportChart[];
  tables: ProjectReportTable[];
  insights: ProjectReportInsight[];
  recommendations: string[];
  [key: string]: unknown; }

export interface ProjectReportSummary {
  overview: string;
  keyAchievements: string[];
  challenges: string[];
  nextSteps: string[]; }

export interface ProjectReportMetrics {
  progress: number;
  budgetUtilization: number;
  resourceUtilization: number;
  riskScore: number;
  qualityScore: number;
  scheduleAdherence: number; }

export interface ProjectReportChart {
  id: string;
  type: ProjectReportChartType;
  title: string;
  data: Record<string, any>;
  config: Record<string, any>; }

export type ProjectReportChartType = 
  | 'line'
  | 'bar'
  | 'pie'
  | 'area'
  | 'scatter'
  | 'gantt'
  | 'burndown'
  | 'velocity';

export interface ProjectReportTable {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
  summary?: Record<string, any>; }

export interface ProjectReportInsight {
  id: string;
  type: ProjectReportInsightType;
  title: string;
  description: string;
  impact: ProjectReportInsightImpact;
  confidence: number;
  actionable: boolean;
  actions?: string[]; }

export type ProjectReportInsightType = 
  | 'trend'
  | 'anomaly'
  | 'correlation'
  | 'prediction'
  | 'recommendation'
  | 'warning';

export type ProjectReportInsightImpact = 'low' | 'medium' | 'high' | 'critical';

export type ProjectReportFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'html';
export type ProjectReportStatus = 'generating' | 'completed' | 'failed' | 'scheduled';

export interface ProjectReportSchedule {
  frequency: ProjectReportScheduleFrequency;
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string; }

export type ProjectReportScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export interface ProjectAnalytics {
  id: string;
  projectId: string;
  period: ProjectAnalyticsPeriod;
  metrics: ProjectAnalyticsMetrics;
  trends: ProjectAnalyticsTrend[];
  benchmarks: ProjectAnalyticsBenchmark[];
  predictions: ProjectAnalyticsPrediction[];
  insights: ProjectAnalyticsInsight[];
  lastUpdated: string; }

export interface ProjectAnalyticsPeriod {
  startDate: string;
  endDate: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'; }

export interface ProjectAnalyticsMetrics {
  performance: ProjectPerformanceMetrics;
  efficiency: ProjectEfficiencyMetrics;
  quality: ProjectQualityMetrics;
  satisfaction: ProjectSatisfactionMetrics;
  financial: ProjectFinancialMetrics; }

export interface ProjectPerformanceMetrics {
  completionRate: number;
  onTimeDelivery: number;
  scopeCreep: number;
  reworkRate: number;
  velocity: number;
  throughput: number; }

export interface ProjectEfficiencyMetrics {
  resourceUtilization: number;
  timeUtilization: number;
  costEfficiency: number;
  productivity: number;
  wasteReduction: number;
  automationRate: number; }

export interface ProjectQualityMetrics {
  defectRate: number;
  customerSatisfaction: number;
  qualityScore: number;
  complianceRate: number;
  auditScore: number;
  reviewScore: number; }

export interface ProjectSatisfactionMetrics {
  teamSatisfaction: number;
  stakeholderSatisfaction: number;
  clientSatisfaction: number;
  userSatisfaction: number;
  npsScore: number;
  csatScore: number; }

export interface ProjectFinancialMetrics {
  roi: number;
  profitMargin: number;
  costVariance: number;
  budgetAccuracy: number;
  revenueGrowth: number;
  costReduction: number; }

export interface ProjectAnalyticsTrend {
  id: string;
  metric: string;
  direction: 'up' | 'down' | 'stable';
  magnitude: number;
  period: string;
  significance: number;
  description: string; }

export interface ProjectAnalyticsBenchmark {
  id: string;
  metric: string;
  value: number;
  benchmark: number;
  percentile: number;
  industry: string;
  comparison: 'above' | 'below' | 'at';
  description: string; }

export interface ProjectAnalyticsPrediction {
  id: string;
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string;
  factors: string[];
  description: string; }

export interface ProjectAnalyticsInsight {
  id: string;
  type: ProjectAnalyticsInsightType;
  title: string;
  description: string;
  impact: ProjectAnalyticsInsightImpact;
  confidence: number;
  actionable: boolean;
  recommendations: string[];
  relatedMetrics: string[]; }

export type ProjectAnalyticsInsightType = 
  | 'performance'
  | 'efficiency'
  | 'quality'
  | 'risk'
  | 'opportunity'
  | 'anomaly'
  | 'correlation';

export type ProjectAnalyticsInsightImpact = 'low' | 'medium' | 'high' | 'critical';

// Advanced module response types
export interface ProjectAdvancedResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  metadata?: {
    templates?: number;
    milestones?: number;
    resources?: number;
    risks?: number;
    budget?: ProjectBudget;
    analytics?: ProjectAnalytics;
  
  error?: string;};

}
