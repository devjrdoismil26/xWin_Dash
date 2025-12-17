import React, { useState, useEffect } from 'react';
import Card from '@/shared/components/ui/Card';
import { Table } from '@/shared/components/ui/Table';
import Button from '@/shared/components/ui/Button';
import { useSettings } from '@/hooks/useSettings';
import { TableRow } from '@/shared/components/ui/TableComponents';
import { TableBody } from '@/shared/components/ui/TableComponents';
import { TableHead } from '@/shared/components/ui/TableComponents';
import { TableCell } from '@/shared/components/ui/TableComponents';

export default function UsersList() {
  const { users, loading, fetchUsers } = useSettings();

  useEffect(() => {
    fetchUsers();

  }, []);

  return (
            <div className=" ">$2</div><Card />
        <Card.Header />
          <Card.Title>Usuários</Card.Title>
        </Card.Header>
        <Card.Content />
          <Table />
            <TableHead />
              <TableRow />
                <TableCell as="th">Nome</TableCell>
                <TableCell as="th">Email</TableCell>
                <TableCell as="th" className="text-right">Ações</TableCell></TableRow></TableHead>
            <TableBody />
              {loading ? (
                <TableRow />
                  <TableCell colSpan={3} className="text-center py-8" />
                    Carregando usuários...
                  </TableCell>
      </TableRow>
    </>
  ) : (
                (users || []).map((user: unknown) => (
                  <TableRow key={ user.id } />
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-right" />
                      <Button size="sm" variant="outline">Abrir</Button></TableCell></TableRow>
                ))
              )}
            </TableBody></Table></Card.Content></Card></div>);

}
