import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { QuestionForm } from './QuestionForm';
import { AnswerDisplay } from './AnswerDisplay';

export const QuestionAnswering: React.FC = () => {
  const [answer, setAnswer] = React.useState(null);

  return (
            <div className=" ">$2</div><Card className="backdrop-blur-xl bg-white/10 border-white/20" />
        <Card.Header><Card.Title>Perguntas e Respostas IA</Card.Title></Card.Header>
        <Card.Content />
          <QuestionForm onAnswer={setAnswer} / />
        </Card.Content>
      </Card>
      { answer && <AnswerDisplay answer={answer } />}
    </div>);};
