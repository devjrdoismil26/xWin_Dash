/**
 * Página GenerationsList - Lista de Gerações de IA
 * @module modules/AI/pages/GenerationsList
 * @description
 * Página para exibir lista de gerações de IA, usando componente GenerationsTable
 * para exibição em tabela. Integra com PageLayout para fornecer estrutura
 * consistente de página.
 * @since 1.0.0
 */
import React from 'react';
import PageLayout from '@/layouts/PageLayout';
import GenerationsTable from '@/modules/AI/components/GenerationsTable';

/**
 * Interface GenerationsListProps - Props da página GenerationsList
 * @interface GenerationsListProps
 * @property {Array} [generations=[]] - Lista de gerações a ser exibida (opcional, padrão: [])
 * @property {function} [onView] - Função callback chamada ao visualizar geração (opcional)
 * @property {(id: string) => void} [onView] - Callback com ID da geração
 * @property {function} [onDelete] - Função callback chamada ao excluir geração (opcional)
 * @property {(id: string) => void} [onDelete] - Callback com ID da geração
 */
interface GenerationsListProps {
  generations?: Array<{ id: string;
  [key: string]: unknown
children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }>;
  onView??: (e: any) => void;
  onDelete??: (e: any) => void;
}

/**
 * Componente GenerationsList - Página de Lista de Gerações de IA
 * @component
 * @description
 * Componente que renderiza a página de lista de gerações de IA, exibindo
 * gerações em tabela com ações de visualização e exclusão.
 * 
 * @param {GenerationsListProps} props - Props da página
 * @returns {JSX.Element} Página de lista de gerações
 * 
 * @example
 * ```tsx
 * <GenerationsList 
 *   generations={ generationsList }
 *   onView={(id: unknown) => navigate(`/generations/${id}`)}
 *   onDelete={ (id: unknown) => handleDelete(id) }
 * />
 * ```
 */
const GenerationsList: React.FC<GenerationsListProps> = ({ generations = [] as unknown[], onView, onDelete    }) => {
  return (
        <>
      <PageLayout title="Gerações" />
      <GenerationsTable generations={generations} onView={onView} onDelete={onDelete} / />
    </PageLayout>);};

export default GenerationsList;
