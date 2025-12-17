import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { Table } from '@/shared/components/ui/Table';
import Modal from '@/shared/components/ui/Modal';
import LeadCaptureFormForm from './Form';
import { TableRow } from '@/shared/components/ui/TableComponents';
import { TableBody } from '@/shared/components/ui/TableComponents';
import { TableHead } from '@/shared/components/ui/TableComponents';
import { TableCell } from '@/shared/components/ui/TableComponents';
const LeadCaptureFormsManager = () => {
  const [forms, setForms] = useState([]);

  const [open, setOpen] = useState(false);

  const [editing, setEditing] = useState<any>(null);

  return (
            <div className=" ">$2</div><div className=" ">$2</div><h2 className="text-lg font-semibold">Formulários</h2>
        <Button onClick={() => { setEditing(null); setOpen(true); } >Novo</Button></div><Card />
        <Card.Content />
          { forms.length === 0 ? (
            <p className="text-gray-600">Nenhum formulário.</p>
          ) : (
            <Table />
              <TableHead />
                <TableRow />
                  <TableCell as="th">Nome</TableCell>
                  <TableCell as="th">Atualizado</TableCell>
                  <TableCell as="th" className="text-right">Ações</TableCell></TableRow></TableHead>
              <TableBody />
                {(forms || []).map((f: unknown) => (
                  <TableRow key={f.id } />
                    <TableCell>{f.name}</TableCell>
                    <TableCell>{f.updated_at}</TableCell>
                    <TableCell className="text-right" />
                      <Button size="sm" variant="outline" onClick={() => { setEditing(f); setOpen(true); } >Editar</Button></TableCell></TableRow>
                ))}
              </TableBody>
      </Table>
    </>
  )}
        </Card.Content></Card><Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? 'Editar Formulário' : 'Novo Formulário'} size="lg">
        <LeadCaptureFormForm
          leadCaptureForm={ editing }
          onCancel={ () => setOpen(false) }
          onSave={(data: unknown) => {
            if (editing) setForms((prev: unknown) => (prev || []).map((f: unknown) => (f.id === editing.id ? { ...editing, ...data } : f)));

            else setForms((prev: unknown) => [{ id: Date.now(), ...data }, ...prev]);

            setOpen(false);

          } /></Modal></div>);};

export default LeadCaptureFormsManager;
