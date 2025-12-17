import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/shared/components/ui/Card';

interface WorkflowsComponentProps {
  auth?: { user?: { id: string;
  name: string;
  email: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };};

}

const WorkflowsComponent: React.FC<WorkflowsComponentProps> = ({ auth    }) => { return (
        <>
      <AuthenticatedLayout user={auth?.user } />
      <Head title="Workflows" / />
      <div className=" ">$2</div><div className=" ">$2</div><Card />
            <Card.Content className="p-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4" />
                Módulo de Workflows
              </h1>
              <p className="text-gray-600" />
                Sistema de gerenciamento de workflows será implementado aqui.
              </p>
            </Card.Content></Card></div>
    </AuthenticatedLayout>);};

export default WorkflowsComponent;