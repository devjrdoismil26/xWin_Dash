import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Table } from '@/components/ui/Table';
const LeadCaptureFormsIndex: React.FC = () => {
  const [search, setSearch] = useState('');
  const forms: Array<any> = [];
  return (
    <AuthenticatedLayout>
      <Head title="Formulários de Captura" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Formulários de Captura</h1>
          <Button>Novo</Button>
        </div>
        <Card>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="md:col-span-2">
                <InputLabel htmlFor="search">Buscar</InputLabel>
                <Input id="search" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            {forms.length === 0 ? (
              <p className="text-gray-600">Nenhum formulário encontrado.</p>
            ) : (
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Cell as="th">Nome</Table.Cell>
                    <Table.Cell as="th">Status</Table.Cell>
                    <Table.Cell as="th">Atualizado</Table.Cell>
                    <Table.Cell as="th" className="text-right">Ações</Table.Cell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {forms.map((f) => (
                    <Table.Row key={f.id}>
                      <Table.Cell>{f.name}</Table.Cell>
                      <Table.Cell>{f.status}</Table.Cell>
                      <Table.Cell>{f.updated_at}</Table.Cell>
                      <Table.Cell className="text-right">
                        <Button size="sm" variant="outline">Editar</Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </Card.Content>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
};
export default LeadCaptureFormsIndex;
