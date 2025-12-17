/**
 * Componente CodeBlock - Bloco de C?digo com Syntax Highlighting
 *
 * @description
 * Componente que renderiza blocos de c?digo com syntax highlighting usando
 * react-syntax-highlighter e Prism. Suporta m?ltiplas linguagens e ajusta
 * automaticamente o tema baseado no tema atual da aplica??o (light/dark).
 *
 * @example
 * ```tsx
 * <CodeBlock language="typescript" className="my-4" />
 *   const greeting = 'Hello, World!';
 * </CodeBlock>
 * ```
 *
 * @module components/ui/CodeBlock
 * @since 1.0.0
 */
import React from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark, materialLight,  } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../ThemeProvider';
import { cn } from '@/lib/utils';

/**
 * Props do componente CodeBlock
 *
 * @description
 * Propriedades que podem ser passadas para o componente CodeBlock.
 *
 * @interface CodeBlockProps
 * @property {string} children - C?digo a ser destacado (como string)
 * @property {string} language - Linguagem de programa??o para syntax highlighting
 * @property {string} [className] - Classes CSS adicionais para customiza??o
 */
export interface CodeBlockProps {
  /** C?digo a ser destacado (como string) */
children: string;
  /** Linguagem de programa??o para syntax highlighting */
language: string;
  /** Classes CSS adicionais para customiza??o */
className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente CodeBlock
 *
 * @description
 * Renderiza um bloco de c?digo com syntax highlighting, adaptando o tema
 * (materialLight/materialDark) baseado no tema atual da aplica??o.
 *
 * @component
 * @param {CodeBlockProps} props - Props do componente
 * @returns {JSX.Element} Bloco de c?digo estilizado com syntax highlighting
 */
const CodeBlock: React.FC<CodeBlockProps> = ({ children,
  language,
  className = "",
   }) => {
  const { theme } = useTheme();

  const codeStyle = theme === "dark" ? materialDark : materialLight;

  return (
        <>
      <div
      className={cn(
        "rounded-md border border-gray-200 overflow-hidden",
        className,
      )  }>
      </div><SyntaxHighlighter
        language={ language }
        style={codeStyle} customStyle={ margin: 0, padding: "12px" } />
        {children}
      </SyntaxHighlighter>
    </div>);};

export default CodeBlock;
