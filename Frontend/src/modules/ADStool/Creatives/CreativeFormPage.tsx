/**
 * P?gina de cria??o/edi??o de criativo
 *
 * @description
 * P?gina wrapper para criar ou editar criativos de an?ncios.
 * Integra formul?rio com layout autenticado.
 *
 * @module modules/ADStool/Creatives/CreateEdit
 * @since 1.0.0
 */

import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import CreativeForm from './components/CreativeForm';
import { AdsCreative } from '../types/adsCreativeTypes';

interface CreateEditProps {
  creative?: AdsCreative | null;
  campaigns?: Array<{ id: number | string;
  name: string
children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }>;
  isEditing?: boolean;
}
const CreateEdit: React.FC<CreateEditProps> = ({ creative, campaigns = [] as unknown[], isEditing = false    }) => {
  const pageTitle = isEditing ? `Editar Criativo: ${creative?.name || ''}` : 'Criar Novo Criativo';
  return (
        <>
      <AuthenticatedLayout />
      <Head title={pageTitle} / />
      <PageLayout title={ pageTitle } />
        <CreativeForm creative={creative} campaigns={campaigns} / /></PageLayout></AuthenticatedLayout>);};

export default CreateEdit;
