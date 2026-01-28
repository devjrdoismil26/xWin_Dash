import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import ApiTokenTable from './ApiTokenTable.tsx';
import Button from '@/components/ui/Button';
import { useSettings } from '../hooks/useSettings';

const ApiTokens: React.FC = () => {
  const { apiTokens, loading, fetchApiTokens } = useSettings();
  
  useEffect(() => {
    fetchApiTokens();
  }, []);
  return (
    <Card>
      <Card.Header>
        <Card.Title>API Tokens</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="mb-3 text-right">
          <Button size="sm">Novo Token</Button>
        </div>
        {loading ? (
          <div className="text-center py-8">Carregando tokens...</div>
        ) : (
          <ApiTokenTable tokens={apiTokens} />
        )}
      </Card.Content>
    </Card>
  );
};
export default ApiTokens;
