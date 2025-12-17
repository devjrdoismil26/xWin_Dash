import React from 'react';
import { Lead } from '@/types';
import ModernLeadCard from '../../LeadsManager/components/ModernLeadCard';

interface LeadsGridViewProps {
  leads: Lead[];
  selectedLeads: Set<number>;
  onSelectLead?: (e: any) => void;
  onViewLead?: (e: any) => void;
  onEditLead?: (e: any) => void;
  onDeleteLead?: (e: any) => void;
  onUpdateScore??: (e: any) => void;
  onUpdateStatus??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const LeadsGridView: React.FC<LeadsGridViewProps> = ({ leads,
  selectedLeads,
  onSelectLead,
  onViewLead,
  onEditLead,
  onDeleteLead,
  onUpdateScore,
  onUpdateStatus
   }) => {
  return (
            <div className="{leads.map((lead: unknown) => (">$2</div>
        <ModernLeadCard
          key={ lead.id }
          lead={ lead }
          selected={ selectedLeads.has(lead.id) }
          onSelect={ (selected: unknown) => onSelectLead(lead.id, selected) }
          onView={ () => onViewLead(lead) }
          onEdit={ () => onEditLead(lead) }
          onDelete={ () => onDeleteLead(lead) }
          onUpdateScore={ onUpdateScore ? (score: unknown) => onUpdateScore(lead, score) : undefined }
          onUpdateStatus={ onUpdateStatus ? (status: unknown) => onUpdateStatus(lead, status) : undefined } />
      ))}
    </div>);};
