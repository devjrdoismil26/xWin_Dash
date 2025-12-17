/**
 * Página de Produtos - Alternativa
 *
 * @description
 * Página alternativa de produtos usando layout autenticado.
 * Interface simplificada em construção.
 *
 * @module modules/Products/pages/Index
 * @since 1.0.0
 */

import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/shared/components/ui/Card';

/**
 * Componente ProductsPageIndex
 *
 * @description
 * Renderiza página de produtos com layout autenticado.
 * Interface simplificada em construção.
 *
 * @returns {JSX.Element} Página de produtos
 */
const ProductsPageIndex: React.FC = () => (
  <AuthenticatedLayout />
    <Head title="Produtos - Página" / />
    <div className=" ">$2</div><div className=" ">$2</div><Card />
          <Card.Content />
            <p className="text-gray-600">Página de produtos (em construção).</p>
          </Card.Content></Card></div>
  </AuthenticatedLayout>);

export default ProductsPageIndex;
