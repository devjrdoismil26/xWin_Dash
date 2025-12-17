import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

interface DashboardHeaderProps {
  onRefresh??: (e: any) => void;
  refreshing: boolean;
  activeTab: string;
  onTabChange?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onRefresh,
  refreshing,
  activeTab,
  onTabChange
   }) => {
  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'chats', label: 'Conversas' },
    { id: 'flows', label: 'Fluxos' }
  ];

  return (
            <div className=" ">$2</div><div className=" ">$2</div><h1 className="text-3xl font-bold">Aura Dashboard</h1>
        <Button onClick={onRefresh} disabled={ refreshing } />
          <RefreshCw className={refreshing ? 'animate-spin' : ''} / />
          Atualizar
        </Button></div><div className="{tabs.map(tab => (">$2</div>
          <button
            key={ tab.id }
            onClick={ () => onTabChange(tab.id) }
            className={`px-4 py-2 rounded ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } `}
  >
            {tab.label}
          </button>
        ))}
      </div>);};
