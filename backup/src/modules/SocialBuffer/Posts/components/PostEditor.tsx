import React, { useState } from 'react';
import Textarea from '@/components/ui/Textarea';
interface PostEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}
const PostEditor: React.FC<PostEditorProps> = ({ 
  value = '', 
  onChange 
}) => {
  const [text, setText] = useState<string>(value);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    onChange?.(newValue);
  };
  return (
    <Textarea 
      rows={4} 
      value={text} 
      onChange={handleChange} 
    />
  );
};
export default PostEditor;
