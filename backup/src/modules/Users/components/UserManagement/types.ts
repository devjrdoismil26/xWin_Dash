/**
 * Tipos para o User Management Dashboard
 */

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'banned';
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  profile: UserProfile;
  permissions: Permission[];
  subscription?: Subscription;
  activity: UserActivity;
  preferences: UserPreferences;
}

export interface UserRole {
  id: string;
  name: string;
  level: number;
  color: string;
  permissions: string[];
}

export interface UserProfile {
  bio?: string;
  location?: string;
  timezone: string;
  language: string;
  company?: string;
  position?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'inactive' | 'cancelled';
  startDate: string;
  endDate?: string;
}

export interface UserActivity {
  lastLogin: string;
  loginCount: number;
  pageViews: number;
  actionsPerformed: number;
  timeSpent: number;
  devices: string[];
  locations: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showPhone: boolean;
  };
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowth: number;
  topRoles: Array<{
    role: string;
    count: number;
    percentage: number;
  }>;
  userActivity: Array<{
    date: string;
    active: number;
    new: number;
  }>;
}

export interface ActivityEvent {
  id: string;
  type: 'login' | 'logout' | 'profile_update' | 'role_change' | 'permission_granted' | 'permission_revoked';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}