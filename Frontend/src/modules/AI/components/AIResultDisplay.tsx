/**
 * Componente AIResultDisplay - Exibidor de Resultados de IA
 * @module modules/AI/components/AIResultDisplay
 * @description
 * Componente para exibir resultados de gerações de IA, incluindo imagens,
 * texto e dados JSON formatados. Fornece visualização limpa e organizada
 * dos resultados gerados.
 * @since 1.0.0
 */
import React from 'react';
import { Card } from '@/shared/components/ui/Card'

/**
 * Interface AIResultDisplayProps - Props do componente AIResultDisplay
 * @interface AIResultDisplayProps
 * @property {object} [result] - Resultado da geração de IA (opcional)
 * @property {string} [result.imageUrl] - URL da imagem gerada (opcional)
 * @property {string} [result.text] - Texto gerado (opcional)
 * @property {Record<string, any>} [result] - Dados completos do resultado (opcional)
 */
interface AIResultDisplayProps {
  result?: {
imageUrl?: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void;
  [key: string]: unknown; } | null;
}

/**
 * Componente AIResultDisplay - Exibidor de Resultados de IA
 * @component
 * @description
 * Componente que renderiza resultados de gerações de IA, exibindo imagens,
 * texto formatado e dados JSON quando disponíveis.
 * 
 * @param {AIResultDisplayProps} props - Props do componente
 * @returns {JSX.Element} Componente de exibição de resultados
 * 
 * @example
 * ```tsx
 * <AIResultDisplay result={ text: 'Texto gerado', imageUrl: 'https://...' } / />
 * ```
 */
const AIResultDisplay: React.FC<AIResultDisplayProps> = ({ result    }) => {
  if (!result) {
    return (
        <>
      <Card />
      <Card.Content className="p-6 text-sm text-gray-500">Nenhum resultado disponível</Card.Content>
      </Card>);

  }
  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Resultado</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 space-y-3" />
        {result.imageUrl && (
          <img src={result.imageUrl} alt="AI Generated" className="max-w-full rounded" />
        )}
        {result.text && (
          <div className="whitespace-pre-wrap text-sm">{result.text}</div>
        )}
        <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
      </Card.Content>
    </Card>);};

export { AIResultDisplay };

export default AIResultDisplay;
