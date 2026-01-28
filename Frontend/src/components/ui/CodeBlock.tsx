import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../ThemeProvider';
import { cn } from '@/lib/utils';

export interface CodeBlockProps {
  children: string;
  language: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, language, className = '' }) => {
  const { theme } = useTheme();
  const codeStyle = theme === 'dark' ? materialDark : materialLight;

  return (
    <div className={cn('rounded-md border border-gray-200 overflow-hidden', className)}>
      <SyntaxHighlighter language={language} style={codeStyle} customStyle={{ margin: 0, padding: '12px' }}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
