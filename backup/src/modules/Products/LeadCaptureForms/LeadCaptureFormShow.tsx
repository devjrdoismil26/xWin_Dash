import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
type Field = { name: string; label: string; type: string };
const LeadCaptureFormShow: React.FC<{ form?: { name?: string; description?: string; fields?: Field[] } } > = ({ form }) => {
  const fields = Array.isArray(form?.fields) ? form!.fields : [];
  return (
    <AuthenticatedLayout>
      <Head title={`Formulário: ${form?.name || ''}`} />
      <div className="py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <Card>
            <Card.Header>
              <Card.Title>{form?.name || 'Formulário'}</Card.Title>
            </Card.Header>
            <Card.Content>
              {form?.description && <p className="text-gray-600 mb-4">{form.description}</p>}
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {fields.map((f) => (
                  <div key={f.name}>
                    <InputLabel htmlFor={f.name}>{f.label || f.name}</InputLabel>
                    {f.type === 'textarea' ? (
                      <Textarea id={f.name} rows={3} />
                    ) : (
                      <Input id={f.name} />
                    )}
                  </div>
                ))}
                <Button type="submit">Enviar</Button>
              </form>
            </Card.Content>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};
export default LeadCaptureFormShow;
