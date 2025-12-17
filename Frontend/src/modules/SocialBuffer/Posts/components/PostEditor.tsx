/**
 * Editor de post do SocialBuffer
 *
 * @description
 * Componente para editar conte?do de posts para redes sociais.
 * Editor de texto simples com suporte a formata??o e preview em tempo real.
 *
 * @module modules/SocialBuffer/Posts/components/PostEditor
 * @since 1.0.0
 */

import React, { useState } from 'react';
import Textarea from '@/shared/components/ui/Textarea';

/**
 * Props do componente PostEditor
 *
 * @interface PostEditorProps
 * @property {string} [value] - Valor inicial do texto
 * @property {(value: string) => void} [onChange] - Callback quando texto muda
 */
interface PostEditorProps {
  value?: string;
  onChange?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void; }
const PostEditor: React.FC<PostEditorProps> = ({ value = '', 
  onChange 
   }) => {
  const [text, setText] = useState<string>(value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);

    onChange?.(newValue);};

  return (
            <Textarea 
      rows={ 4 }
      value={ text }
      onChange={ handleChange }
    / />);};

export default PostEditor;
