/**
 * Página GenerationDetails - Detalhes de Geração de IA
 * @module modules/AI/pages/GenerationDetails
 * @description
 * Página para exibir detalhes completos de uma geração de IA, incluindo
 * informações completas formatadas em JSON. Integra com PageLayout para
 * fornecer estrutura consistente de página.
 * @since 1.0.0
 */
import React from 'react';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/shared/components/ui/Card';

/**
 * Interface GenerationDetailsProps - Props da página GenerationDetails
 * @interface GenerationDetailsProps
 * @property {object} [generation] - Dados da geração a ser exibida (opcional)
 * @property {string} [generation.id] - ID da geração (opcional)
 * @property {Record<string, any>} [generation] - Dados completos da geração (opcional)
 */
interface GenerationDetailsProps {
  generation?: {
id?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void;
  [key: string]: unknown; } | null;
}

/**
 * Componente GenerationDetails - Página de Detalhes de Geração de IA
 * @component
 * @description
 * Componente que renderiza a página de detalhes de uma geração de IA,
 * exibindo informações completas formatadas em JSON.
 * 
 * @param {GenerationDetailsProps} props - Props da página
 * @returns {JSX.Element} Página de detalhes de geração
 * 
 * @example
 * ```tsx
 * <GenerationDetails generation={ id: '123', type: 'text', result: '...' } / />
 * ```
 */
const GenerationDetails: React.FC<GenerationDetailsProps> = ({ generation    }) => {
  if (!generation) return <PageLayout><div className="p-6">Geração não encontrada</div></PageLayout>;
  return (
        <>
      <PageLayout title={`Geração ${generation.id}`} />
      <Card />
        <Card.Content className="p-6" />
          <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(generation, null, 2)}</pre>
        </Card.Content></Card></PageLayout>);};

export default GenerationDetails;
