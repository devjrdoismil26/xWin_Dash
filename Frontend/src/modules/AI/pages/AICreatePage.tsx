import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIGenerationForm } from '../components/AIGenerationForm';
import { AIResultDisplay } from '../components/AIResultDisplay';

export const AICreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [result, setResult] = React.useState(null);

  return (
            <div className=" ">$2</div><div className=" ">$2</div><Button onClick={() => navigate(-1)} variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" /></Button><h1 className="text-2xl font-bold text-white">Nova Geração IA</h1></div><div className=" ">$2</div><Card className="backdrop-blur-xl bg-white/10 border-white/20" />
          <Card.Header><Card.Title>Configuração</Card.Title></Card.Header>
          <Card.Content />
            <AIGenerationForm onGenerate={setResult} / />
          </Card.Content></Card><Card className="backdrop-blur-xl bg-white/10 border-white/20" />
          <Card.Header><Card.Title>Resultado</Card.Title></Card.Header>
          <Card.Content />
            <AIResultDisplay result={result} / />
          </Card.Content></Card></div>);};

export default AICreatePage;
