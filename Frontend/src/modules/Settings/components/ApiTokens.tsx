import React, { useState, useEffect } from 'react';
import Card from '@/shared/components/ui/Card';
import ApiTokenTable from './ApiTokenTable';
import Button from '@/shared/components/ui/Button';
import { useSettings } from '../hooks/useSettings';

const ApiTokens: React.FC = () => {
  const { apiTokens, loading, fetchApiTokens } = useSettings();

  useEffect(() => {
    fetchApiTokens();

  }, []);

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>API Tokens</Card.Title>
      </Card.Header>
      <Card.Content />
        <div className=" ">$2</div><Button size="sm">Novo Token</Button>
        </div>
        {loading ? (
          <div className="text-center py-8">Carregando tokens...</div>
        ) : (
          <ApiTokenTable tokens={apiTokens} / />
        )}
      </Card.Content>
    </Card>);};

export default ApiTokens;
