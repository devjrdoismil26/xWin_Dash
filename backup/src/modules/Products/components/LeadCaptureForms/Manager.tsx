import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import LeadCaptureFormForm from './Form.tsx';
const LeadCaptureFormsManager = () => {
  const [forms, setForms] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Formulários</h2>
        <Button onClick={() => { setEditing(null); setOpen(true); }}>Novo</Button>
      </div>
      <Card>
        <Card.Content>
          {forms.length === 0 ? (
            <p className="text-gray-600">Nenhum formulário.</p>
          ) : (
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Cell as="th">Nome</Table.Cell>
                  <Table.Cell as="th">Atualizado</Table.Cell>
                  <Table.Cell as="th" className="text-right">Ações</Table.Cell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {forms.map((f) => (
                  <Table.Row key={f.id}>
                    <Table.Cell>{f.name}</Table.Cell>
                    <Table.Cell>{f.updated_at}</Table.Cell>
                    <Table.Cell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(f); setOpen(true); }}>Editar</Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Card.Content>
      </Card>
      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? 'Editar Formulário' : 'Novo Formulário'} size="lg">
        <LeadCaptureFormForm
          leadCaptureForm={editing}
          onCancel={() => setOpen(false)}
          onSave={(data) => {
            if (editing) setForms((prev) => prev.map((f) => (f.id === editing.id ? { ...editing, ...data } : f)));
            else setForms((prev) => [{ id: Date.now(), ...data }, ...prev]);
            setOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};
export default LeadCaptureFormsManager;
