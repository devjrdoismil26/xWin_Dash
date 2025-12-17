import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';

export const QuestionForm: React.FC<{ onAnswer?: (e: any) => void }> = ({ onAnswer }) => {
  const [question, setQuestion] = React.useState('');

  return (
            <div className=" ">$2</div><Input value={question} onChange={(e: unknown) => setQuestion(e.target.value)} placeholder="Faça uma pergunta..." />
      <Button onClick={() => onAnswer({ text: 'Resposta da IA' })} className="w-full">Perguntar</Button>
    </div>);};
