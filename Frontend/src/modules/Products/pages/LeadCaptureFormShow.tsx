/**
 * Página de Visualização de Formulário de Captura de Leads
 *
 * @description
 * Página para visualização de formulários de captura de leads.
 * Exibe dados do formulário em formato JSON com layout autenticado.
 *
 * @module modules/Products/pages/LeadCaptureFormShow
 * @since 1.0.0
 */

import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/shared/components/ui/Card';

/**
 * Props do componente LeadCaptureFormShow
 *
 * @interface LeadCaptureFormShowProps
 * @property {Record<string, any>} [form] - Dados do formulário de captura de leads (opcional)
 */
interface LeadCaptureFormShowProps {
  form?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente LeadCaptureFormShow
 *
 * @description
 * Renderiza página de visualização de formulário de captura de leads.
 * Exibe dados do formulário em formato JSON.
 *
 * @param {LeadCaptureFormShowProps} props - Props do componente
 * @returns {JSX.Element} Página de visualização de formulário
 */
const LeadCaptureFormShow: React.FC<LeadCaptureFormShowProps> = ({ form    }) => (
  <AuthenticatedLayout />
    <Head title={`Formulário - ${form?.name || ''}`} / />
    <div className=" ">$2</div><div className=" ">$2</div><Card />
          <Card.Content />
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">{JSON.stringify(form || {}, null, 2)}</pre>
          </Card.Content></Card></div>
  </AuthenticatedLayout>);

export default LeadCaptureFormShow;
