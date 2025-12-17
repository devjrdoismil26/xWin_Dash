/**
 * Componente RichTextEditor - Editor de Texto Rico
 *
 * @description
 * Componente de editor de texto rico baseado em TinyMCE com toolbar configur?vel,
 * plugins e suporte a formata??o avan?ada. Ideal para campos de texto longo que
 * precisam de formata??o (negrito, it?lico, listas, links, tabelas, etc.).
 *
 * Funcionalidades principais:
 * - Editor WYSIWYG completo
 * - Toolbar configur?vel (negrito, it?lico, listas, links, tabelas, etc.)
 * - Plugins: link, lists, table, code, advlist
 * - Altura customiz?vel
 * - Integra??o com TinyMCE
 * - Suporte a dark mode
 * - Acessibilidade
 *
 * @module components/ui/RichTextEditor
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import RichTextEditor from '@/shared/components/ui/RichTextEditor';
 *
 * <RichTextEditor
 *   value={ content }
 *   onEditorChange={ setContent }
 *   height={ 400 }
 * / />
 * ```
 */

import React from "react";
import { Editor } from '@tinymce/tinymce-react';

/**
 * Props do componente RichTextEditor
 *
 * @description
 * Propriedades que podem ser passadas para o componente RichTextEditor.
 *
 * @interface RichTextEditorProps
 * @property {string} value - Conte?do atual do editor
 * @property {(content: string) => void} onEditorChange - Callback ao alterar conte?do
 * @property {number} [height=300] - Altura do editor em pixels
 * @property {string} [className] - Classes CSS adicionais
 */
export interface RichTextEditorProps {
  value: string;
  onEditorChange?: (e: any) => void;
  height?: number;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente RichTextEditor
 *
 * @description
 * Renderiza um editor de texto rico WYSIWYG com toolbar completa, plugins
 * configurados e suporte a formata??o avan?ada. Baseado em TinyMCE.
 *
 * @component
 * @param {RichTextEditorProps} props - Props do componente
 * @param {string} props.value - Conte?do atual do editor
 * @param {(content: string) => void} props.onEditorChange - Callback ao alterar conte?do
 * @param {number} [props.height=300] - Altura do editor
 * @param {string} [props.className] - Classes CSS adicionais
 * @returns {JSX.Element} Componente de editor de texto rico
 */
const RichTextEditor: React.FC<RichTextEditorProps> = ({ value,
  onEditorChange,
  height = 300,
  className = "",
   }) => { return (
        <>
      <div className={className  }>
      </div><Editor
        value={ value }
        onEditorChange={ (content: unknown) => onEditorChange(content) }
        init={
          menubar: false,
          height,
          plugins: ["link", "lists", "table", "code", "advlist"],
          toolbar:
            "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link table | code",
        } />
    </div>);};

export default RichTextEditor;
