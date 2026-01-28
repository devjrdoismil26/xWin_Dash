import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { useSettings } from '../../hooks/useSettings';

export default function UsersList() {
  const { users, loading, fetchUsers } = useSettings();
  
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div className="py-6">
      <Card>
        <Card.Header>
          <Card.Title>Usuários</Card.Title>
        </Card.Header>
        <Card.Content>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell as="th">Nome</Table.Cell>
                <Table.Cell as="th">Email</Table.Cell>
                <Table.Cell as="th" className="text-right">Ações</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan={3} className="text-center py-8">
                    Carregando usuários...
                  </Table.Cell>
                </Table.Row>
              ) : (
                users.map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell className="text-right">
                      <Button size="sm" variant="outline">Abrir</Button>
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
}
