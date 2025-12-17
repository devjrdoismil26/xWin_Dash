import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';

export const ImagePromptForm: React.FC<{ onGenerate?: (e: any) => void }> = ({ onGenerate }) => {
  const [prompt, setPrompt] = React.useState('');

  return (
            <div className=" ">$2</div><Input value={prompt} onChange={(e: unknown) => setPrompt(e.target.value)} placeholder="Descreva a imagem..." />
      <Button onClick={() => onGenerate({ url: 'generated.jpg' })} className="w-full">Gerar Imagem</Button>
    </div>);};
