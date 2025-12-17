import React from 'react';
import Card from '@/shared/components/ui/Card';

interface PyLabEditorProps {
  code: string;
  onChange?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void; }

export const PyLabEditor: React.FC<PyLabEditorProps> = ({ code, onChange    }) => {
  return (
        <>
      <Card className="p-4" />
      <textarea
        value={ code }
        onChange={ (e: unknown) => onChange(e.target.value) }
        className="w-full h-96 font-mono text-sm p-4 border rounded"
        placeholder="# Write your Python code here..." />
    </Card>);};
