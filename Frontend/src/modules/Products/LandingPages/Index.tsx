/**
 * Índice de landing pages
 *
 * @description
 * Página para listar e gerenciar landing pages do sistema.
 * Interface básica para gerenciamento de páginas de destino.
 *
 * @module modules/Products/LandingPages/Index
 * @since 1.0.0
 */

import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';

/**
 * Componente LandingPagesIndex
 *
 * @description
 * Renderiza página de listagem de landing pages com card básico
 * e botão para criar nova página. Em construção.
 *
 * @returns {JSX.Element} Página de landing pages
 */
const LandingPagesIndex: React.FC = () => {
  return (
        <>
      <AuthenticatedLayout />
      <Head title="Landing Pages" / />
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h1 className="text-xl font-semibold">Landing Pages</h1>
            <Button>Novo</Button></div><Card />
            <Card.Content />
              <p className="text-gray-600">Listagem de Landing Pages (em construção).</p>
            </Card.Content></Card></div>
    </AuthenticatedLayout>);};

export default LandingPagesIndex;
