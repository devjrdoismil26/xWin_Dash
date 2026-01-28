import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/components/ui/Card';
const ProductShow: React.FC<{ product?: any }> = ({ product }) => (
  <AuthenticatedLayout>
    <Head title={`Produto: ${product?.name || ''}`} />
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <Card.Header>
            <Card.Title>{product?.name || 'Produto'}</Card.Title>
          </Card.Header>
          <Card.Content>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">{JSON.stringify(product || {}, null, 2)}</pre>
          </Card.Content>
        </Card>
      </div>
    </div>
  </AuthenticatedLayout>
);
export default ProductShow;
