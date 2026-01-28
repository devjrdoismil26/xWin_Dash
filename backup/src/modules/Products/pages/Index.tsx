import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/components/ui/Card';
const ProductsPageIndex: React.FC = () => (
  <AuthenticatedLayout>
    <Head title="Produtos - Página" />
    <div className="py-8">
      <div className="max-w-5xl mx-auto">
        <Card>
          <Card.Content>
            <p className="text-gray-600">Página de produtos (em construção).</p>
          </Card.Content>
        </Card>
      </div>
    </div>
  </AuthenticatedLayout>
);
export default ProductsPageIndex;
