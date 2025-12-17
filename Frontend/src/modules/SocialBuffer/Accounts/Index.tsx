import React, { useState, useEffect } from 'react';
import Card from '@/shared/components/ui/Card';
import { Table } from '@/shared/components/ui/Table';
import Button from '@/shared/components/ui/Button';
import useSocialBuffer from '../hooks/useSocialBuffer';
import { TableRow } from '@/shared/components/ui/TableComponents';
import { TableBody } from '@/shared/components/ui/TableComponents';
import { TableHead } from '@/shared/components/ui/TableComponents';
import { TableCell } from '@/shared/components/ui/TableComponents';

const AccountsIndex: React.FC = () => {
  const { socialAccounts, loading, fetchSocialAccounts } = useSocialBuffer();

  useEffect(() => {
    fetchSocialAccounts();

  }, []);

  return (
            <div className=" ">$2</div><Card />
        <Card.Header />
          <Card.Title>Contas</Card.Title>
        </Card.Header>
        <Card.Content />
          <Table />
            <TableHead />
              <TableRow />
                <TableCell as="th">Rede</TableCell>
                <TableCell as="th">Nome</TableCell>
                <TableCell as="th" className="text-right">Ações</TableCell></TableRow></TableHead>
            <TableBody />
              {loading ? (
                <TableRow />
                  <TableCell colSpan={3} className="text-center py-8" />
                    Carregando contas...
                  </TableCell>
      </TableRow>
    </>
  ) : (
                (socialAccounts || []).map((account: unknown) => (
                  <TableRow key={ account.id } />
                    <TableCell>{account.platform}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell className="text-right" />
                      <Button size="sm" variant="outline">Detalhes</Button></TableCell></TableRow>
                ))
              )}
            </TableBody></Table></Card.Content></Card></div>);};

export default AccountsIndex;
