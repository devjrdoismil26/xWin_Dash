import React from 'react';
import Input from '@/shared/components/ui/Input';

interface CampaignBasicFieldsProps {
  data: Record<string, any>;
  onChange?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void; }

export const CampaignBasicFields: React.FC<CampaignBasicFieldsProps> = ({ data, onChange    }) => {
  return (
            <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium mb-1">Nome da Campanha</label>
        <Input value={data.name as string || ''} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onChange('name', e.target.value) } /></div><div>
           
        </div><label className="block text-sm font-medium mb-1">Orçamento</label>
        <Input type="number" value={data.budget as number || 0} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onChange('budget', parseFloat(e.target.value) || 0) } />
      </div>);};
