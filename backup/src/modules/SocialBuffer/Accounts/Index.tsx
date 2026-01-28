import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import useSocialBuffer from '../hooks/useSocialBuffer';

const AccountsIndex: React.FC = () => {
  const { socialAccounts, loading, fetchSocialAccounts } = useSocialBuffer();
  
  useEffect(() => {
    fetchSocialAccounts();
  }, []);
  return (
    <div className="py-6">
      <Card>
        <Card.Header>
          <Card.Title>Contas</Card.Title>
        </Card.Header>
        <Card.Content>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell as="th">Rede</Table.Cell>
                <Table.Cell as="th">Nome</Table.Cell>
                <Table.Cell as="th" className="text-right">Ações</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan={3} className="text-center py-8">
                    Carregando contas...
                  </Table.Cell>
                </Table.Row>
              ) : (
                socialAccounts.map((account) => (
                  <Table.Row key={account.id}>
                    <Table.Cell>{account.platform}</Table.Cell>
                    <Table.Cell>{account.name}</Table.Cell>
                    <Table.Cell className="text-right">
                      <Button size="sm" variant="outline">Detalhes</Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </Card.Content>
      </Card>
    </div>
  );
};
export default AccountsIndex;
