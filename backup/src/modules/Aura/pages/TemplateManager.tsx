import React from 'react';
import PageLayout from '@/layouts/PageLayout';
import TemplateEditor from '@/modules/Aura/components/TemplateEditor.tsx';
const TemplateManager = ({ initial = '' }) => (
  <PageLayout title="Templates">
    <TemplateEditor initial={initial} />
  </PageLayout>
);
export default TemplateManager;
