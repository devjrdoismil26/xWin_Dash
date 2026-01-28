import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

export interface RichTextEditorProps {
  value: string;
  onEditorChange: (content: string) => void;
  height?: number;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onEditorChange, height = 300, className = '' }) => {
  return (
    <div className={className}>
      <Editor
        value={value}
        onEditorChange={(content) => onEditorChange(content)}
        init={{
          menubar: false,
          height,
          plugins: ['link', 'lists', 'table', 'code', 'advlist'],
          toolbar:
            'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link table | code',
        }}
      />
    </div>
  );
};

export default RichTextEditor;
