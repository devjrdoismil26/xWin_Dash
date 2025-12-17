/**
 * Componente TextGeneration - Geração de Texto com IA
 * @module modules/AI/components/TextGeneration
 * @description
 * Componente para geração de texto com IA, fornecendo formulário simples
 * com input de prompt e botão de geração.
 * @since 1.0.0
 */
import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Textarea from '@/shared/components/ui/Textarea';

/**
 * Interface TextGenerationProps - Props do componente TextGeneration
 * @interface TextGenerationProps
 * @property {function} [onGenerate] - Função callback chamada ao gerar texto (opcional)
 * @property {(text: string) => void} [onGenerate] - Callback com texto do prompt
 */
interface TextGenerationProps {
  onGenerate??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente TextGeneration - Geração de Texto com IA
 * @component
 * @description
 * Componente que renderiza formulário para geração de texto com IA,
 * incluindo área de texto para prompt e botão de geração.
 * 
 * @param {TextGenerationProps} props - Props do componente
 * @returns {JSX.Element} Componente de geração de texto
 * 
 * @example
 * ```tsx
 * <TextGeneration onGenerate={ (text: unknown) =>  } />
 * ```
 */
const TextGeneration: React.FC<TextGenerationProps> = ({ onGenerate    }) => {
  const [text, setText] = useState('');

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Geração de Texto</Card.Title>
      </Card.Header>
      <Card.Content />
        <Textarea value={text} onChange={(e: unknown) => setText(e.target.value)} placeholder="Escreva seu prompt..." />
      </Card.Content>
      <Card.Footer />
        <Button onClick={ () => onGenerate?.(text) }>Gerar</Button>
      </Card.Footer>
    </Card>);};

export default TextGeneration;
