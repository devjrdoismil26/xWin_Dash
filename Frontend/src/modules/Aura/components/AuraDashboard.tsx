/**
 * Revolutionary Aura Dashboard - Orquestrador
 * Dashboard revolucionário para WhatsApp Business Integration
 */
import React, { useState } from 'react';
import { DashboardHeader } from './RevolutionaryDashboard/DashboardHeader';
import { ConnectionsOverview } from './RevolutionaryDashboard/ConnectionsOverview';
import { ChatsSection } from './RevolutionaryDashboard/ChatsSection';
import { FlowsSection } from './RevolutionaryDashboard/FlowsSection';
import { AnalyticsSection } from './RevolutionaryDashboard/AnalyticsSection';

interface RevolutionaryAuraDashboardProps {
  connectionId?: string;
  onRefresh???: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const RevolutionaryAuraDashboard: React.FC<RevolutionaryAuraDashboardProps> = ({ connectionId,
  onRefresh
   }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);

    onRefresh?.();

    setTimeout(() => setRefreshing(false), 1000);};

  return (
            <div className=" ">$2</div><DashboardHeader 
        onRefresh={ handleRefresh }
        refreshing={ refreshing }
        activeTab={ activeTab }
        onTabChange={ setActiveTab  }>
          {activeTab === 'overview' && (
        <>
          <ConnectionsOverview connectionId={connectionId} / />
          <AnalyticsSection / />
        </>
      )}
      
      {activeTab === 'chats' && <ChatsSection />}
      
      {activeTab === 'flows' && <FlowsSection />}
    </div>);};

export default RevolutionaryAuraDashboard;
