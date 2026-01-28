import React, { useState } from 'react';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
const CreateGeneration = ({ onCreate }) => {
  const [prompt, setPrompt] = useState('');
  return (
    <PageLayout title="Criar Geração">
      <Card>
        <Card.Content className="p-6 space-y-4">
          <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Digite o prompt..." />
          <Button onClick={() => onCreate?.(prompt)}>Criar</Button>
        </Card.Content>
      </Card>
    </PageLayout>
  );
};
export default CreateGeneration;
