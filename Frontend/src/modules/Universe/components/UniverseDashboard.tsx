/**
 * Advanced Universe Dashboard - Orquestrador
 */
import React, { useState } from 'react';
import { DashboardHeader } from './UniverseDashboard/DashboardHeader';
import { ProjectsOverview } from './UniverseDashboard/ProjectsOverview';
import { BlocksSection } from './UniverseDashboard/BlocksSection';
import { IntegrationsSection } from './UniverseDashboard/IntegrationsSection';

interface AdvancedUniverseDashboardProps {
  projectId?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const AdvancedUniverseDashboard: React.FC<AdvancedUniverseDashboardProps> = ({ projectId    }) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);

    setTimeout(() => setRefreshing(false), 1000);};

  return (
            <div className=" ">$2</div><DashboardHeader onRefresh={handleRefresh} refreshing={refreshing} / />
      <ProjectsOverview projectId={projectId} / />
      <BlocksSection / />
      <IntegrationsSection / />
    </div>);};

export default AdvancedUniverseDashboard;
