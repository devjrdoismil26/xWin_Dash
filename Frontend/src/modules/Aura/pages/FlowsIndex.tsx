/**
 * P?gina de Fluxos do Aura
 *
 * @description
 * P?gina para visualiza??o e edi??o de fluxos de automa??o do Aura.
 * Exibe canvas de fluxos com n?s e arestas usando layout autenticado.
 *
 * @module modules/Aura/pages/FlowsIndex
 * @since 1.0.0
 */

import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import FlowCanvas from '@/modules/Aura/components/FlowCanvas';

/**
 * Props do componente FlowsIndex
 *
 * @interface FlowsIndexProps
 * @property {any} [auth] - Dados de autentica??o (opcional)
 * @property {Array} [nodes] - Lista de n?s do fluxo (opcional, padr?o: [])
 * @property {Array} [edges] - Lista de arestas do fluxo (opcional, padr?o: [])
 */
interface FlowsIndexProps {
  auth?: string;
  nodes?: string[];
  edges?: string[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente FlowsIndex
 *
 * @description
 * Renderiza p?gina de fluxos do Aura com canvas de visualiza??o.
 * Exibe fluxos de automa??o usando componente FlowCanvas.
 *
 * @param {FlowsIndexProps} props - Props do componente
 * @returns {JSX.Element} P?gina de fluxos
 */
const FlowsIndex: React.FC<FlowsIndexProps> = ({ auth, nodes = [] as unknown[], edges = [] as unknown[]    }) => (
  <AuthenticatedLayout user={ auth?.user } />
    <Head title="Fluxos" / />
    <PageLayout title="Fluxos" />
      <FlowCanvas nodes={nodes} edges={edges} / /></PageLayout></AuthenticatedLayout>);

export default FlowsIndex;
