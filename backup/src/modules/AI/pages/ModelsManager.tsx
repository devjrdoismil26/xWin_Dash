import React from 'react';
import PageLayout from '@/layouts/PageLayout';
import ModelManager from '@/modules/AI/components/ModelManager.tsx';
const ModelsManager = ({ models = [] }) => (
  <PageLayout title="Gerenciar Modelos">
    <ModelManager models={models} />
  </PageLayout>
);
export default ModelsManager;
