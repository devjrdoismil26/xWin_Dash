import React from 'react';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
const GenerationDetails = ({ generation }) => {
  if (!generation) return <PageLayout><div className="p-6">Geração não encontrada</div></PageLayout>;
  return (
    <PageLayout title={`Geração ${generation.id}`}>
      <Card>
        <Card.Content className="p-6">
          <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(generation, null, 2)}</pre>
        </Card.Content>
      </Card>
    </PageLayout>
  );
};
export default GenerationDetails;
