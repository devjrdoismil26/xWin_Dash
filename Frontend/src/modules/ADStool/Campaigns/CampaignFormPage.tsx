/**
 * Página de criação/edição de campanha
 * @module modules/ADStool/Campaigns/CreateEdit
 * @description
 * Página wrapper para criar ou editar campanhas de anúncios.
 * Usa formulário avançado com validação e cálculos automáticos.
 * Integra com AuthenticatedLayout e PageLayout para fornecer
 * estrutura consistente de página.
 * @since 1.0.0
 */

import React from 'react';
import { Head } from '@inertiajs/react';
import CampaignForm from './components/CampaignForm';
import EnhancedCampaignForm from './components/EnhancedCampaignForm';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import { AdsCampaign } from '../types/adsCampaignTypes';

interface CreateEditProps {
  campaign?: AdsCampaign | null;
  isEditing?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const CreateEdit: React.FC<CreateEditProps> = ({ campaign, isEditing = false    }) => {
  const pageTitle = isEditing ? `Editar Campanha: ${campaign?.name || ''}` : 'Criar Nova Campanha';
  return (
    <>
      <AuthenticatedLayout />
      <Head title={pageTitle} />
      <PageLayout>
        <EnhancedCampaignForm 
          campaign={campaign} 
          onSuccess={() => {}} 
          onCancel={() => {}} 
        />
      </PageLayout>
    </>
  );
};

export default CreateEdit;
