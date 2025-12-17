import React from 'react';
import { ReactNode } from 'react';

export interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  action??: (e: any) => void;
  icon?: React.ComponentType<{ className?: string;
}>;
}

export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'system' | 'social' | 'marketing' | 'sales';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  pinned: boolean;
  starred: boolean;
  archived: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: string;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
  avatar?: string;
  thumbnail?: string;
  url?: string;
  dismissible: boolean;
  autoRemove?: boolean;
  duration?: number; }

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  email: boolean;
  categories: Record<string, boolean>;
  quiet: {
    enabled: boolean;
  start: string;
  end: string;
  [key: string]: unknown; };

  filters: {
    priority: string[];
    types: string[];
    sources: string[];};

}

export interface NotificationContextType {
  notifications: NotificationItem[];
  settings: NotificationSettings;
  unreadCount: number;
  isOpen: boolean;
  addNotification?: (e: any) => void;
  removeNotification?: (e: any) => void;
  markAsRead?: (e: any) => void;
  markAllAsRead??: (e: any) => void;
  togglePin?: (e: any) => void;
  toggleStar?: (e: any) => void;
  archiveNotification?: (e: any) => void;
  updateSettings?: (e: any) => void;
  openCenter??: (e: any) => void;
  closeCenter??: (e: any) => void;
  clearAll??: (e: any) => void;
  clearRead??: (e: any) => void; }

export interface AdvancedNotificationProviderProps {
  children: ReactNode;
  [key: string]: unknown; }
