import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/components/ui/Card';
const ProductScheduler: React.FC = () => (
  <AuthenticatedLayout>
    <Head title="Agendador de Produtos" />
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <Card.Content>
            <p className="text-gray-600">Agendador de produtos (em construção).</p>
          </Card.Content>
        </Card>
      </div>
    </div>
  </AuthenticatedLayout>
);
export default ProductScheduler;
