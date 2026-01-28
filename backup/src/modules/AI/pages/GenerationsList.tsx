import React from 'react';
import PageLayout from '@/layouts/PageLayout';
import GenerationsTable from '@/modules/AI/components/GenerationsTable.tsx';
const GenerationsList = ({ generations = [], onView, onDelete }) => {
  return (
    <PageLayout title="Gerações">
      <GenerationsTable generations={generations} onView={onView} onDelete={onDelete} />
    </PageLayout>
  );
};
export default GenerationsList;
