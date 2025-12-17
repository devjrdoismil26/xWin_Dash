import React from 'react';
import { cn } from '@/lib/utils';

export type TabType = 'basic' | 'metadata' | 'tags' | 'permissions';

interface MediaFormTabsProps {
  activeTab: TabType;
  onTabChange?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const MediaFormTabs: React.FC<MediaFormTabsProps> = ({ activeTab,
  onTabChange
   }) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'basic', label: 'Básico' },
    { id: 'metadata', label: 'Metadados' },
    { id: 'tags', label: 'Tags' },
    { id: 'permissions', label: 'Permissões' }
  ];

  return (
            <div className=" ">$2</div><div className="{tabs.map(tab => (">$2</div>
          <button
            key={ tab.id }
            onClick={ () => onTabChange(tab.id) }
            className={cn(
              'px-4 py-2 font-medium border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            )  }>
            {tab.label}
          </button>
        ))}
      </div>);};
