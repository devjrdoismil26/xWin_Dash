/**
 * Componente ResultViewer - Visualizador de Resultados de IA
 * @module modules/AI/components/ResultViewer
 * @description
 * Componente para visualizar resultados de gera??es de IA, incluindo imagens,
 * texto formatado e dados JSON completos. Fornece visualiza??o limpa e organizada
 * dos resultados gerados.
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';

/**
 * Interface ResultViewerProps - Props do componente ResultViewer
 * @interface ResultViewerProps
 * @property {object} [item] - Item de resultado a ser exibido (opcional)
 * @property {string} [item.type] - Tipo do resultado (image, text, etc.) (opcional)
 * @property {string} [item.url] - URL da imagem (se type === 'image') (opcional)
 * @property {string} [item.text] - Texto do resultado (se type === 'text') (opcional)
 * @property {Record<string, any>} [item] - Dados completos do resultado (opcional)
 */
interface ResultViewerProps {
  item?: {
type?: 'image' | 'text' | string;
  url?: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void;
  [key: string]: unknown; } | null;
}

/**
 * Componente ResultViewer - Visualizador de Resultados de IA
 * @component
 * @description
 * Componente que renderiza visualizador de resultados de gera??es de IA,
 * exibindo imagens, texto formatado e dados JSON quando dispon?veis.
 * 
 * @param {ResultViewerProps} props - Props do componente
 * @returns {JSX.Element} Visualizador de resultados
 * 
 * @example
 * ```tsx
 * <ResultViewer item={ type: 'image', url: 'https://...' } / />
 * <ResultViewer item={ type: 'text', text: 'Texto gerado' } / />
 * ```
 */
const ResultViewer: React.FC<ResultViewerProps> = ({ item    }) => {
  if (!item) {
    return (
        <>
      <Card />
      <Card.Content className="p-6 text-gray-500">Nada para mostrar</Card.Content>
      </Card>);

  }
  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Detalhes</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 space-y-3" />
        {item.type === 'image' && <img src={item.url} alt="result" className="max-w-full rounded" />}
        {item.type === 'text' && <pre className="text-sm whitespace-pre-wrap">{item.text}</pre>}
        <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">{JSON.stringify(item, null, 2)}</pre>
      </Card.Content>
    </Card>);};

export default ResultViewer;
