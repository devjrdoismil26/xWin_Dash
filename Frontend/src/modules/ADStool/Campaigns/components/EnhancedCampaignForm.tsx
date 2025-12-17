import React, { useState } from 'react';
import { CampaignBasicFields } from './Enhanced/CampaignFields';
import Button from '@/shared/components/ui/Button';
import { AdsCampaign } from '../../types/adsCampaignTypes';

interface EnhancedCampaignFormProps {
  campaign?: AdsCampaign | null;
  onSuccess???: (e: any) => void;
  onCancel???: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const EnhancedCampaignForm: React.FC<EnhancedCampaignFormProps> = ({ campaign, onSuccess, onCancel    }) => {
  const [data, setData] = useState<Partial<AdsCampaign>>(campaign || {});

  const handleChange = (field: string, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }));};

  return (
            <div className=" ">$2</div><h2 className="text-xl font-bold mb-4">{campaign ? 'Editar Campanha' : 'Nova Campanha'}</h2>
      <CampaignBasicFields data={data} onChange={handleChange} / />
      <div className=" ">$2</div><Button onClick={ onSuccess }>Salvar</Button>
        {onCancel && <Button variant="outline" onClick={ onCancel }>Cancelar</Button>}
      </div>);};

export default EnhancedCampaignForm;
