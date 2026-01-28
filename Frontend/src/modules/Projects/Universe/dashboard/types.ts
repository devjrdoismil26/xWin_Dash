import React from 'react';

export interface UniverseHubProps {
  onNavigate?: (section: string) => void;
}

export interface UniverseSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export interface UniverseStats {
  totalBlocks: number;
  activeConnections: number;
  aiAgents: number;
  immersiveExperiences: number;
}

export interface UniverseStatus {
  isOperational: boolean;
  lastUpdate: string;
  version: string;
}
