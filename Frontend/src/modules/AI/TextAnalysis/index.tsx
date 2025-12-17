import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { TextAnalysisForm } from './TextAnalysisForm';
import { TextAnalysisResults } from './TextAnalysisResults';
import { TextAnalysisMetrics } from './TextAnalysisMetrics';

export const TextAnalysis: React.FC = () => {
  const [text, setText] = React.useState('');

  const [results, setResults] = React.useState(null);

  return (
            <div className=" ">$2</div><Card className="backdrop-blur-xl bg-white/10 border-white/20" />
        <Card.Header />
          <Card.Title>Análise de Texto com IA</Card.Title>
        </Card.Header>
        <Card.Content />
          <TextAnalysisForm text={text} onChange={setText} onAnalyze={setResults} / />
        </Card.Content>
      </Card>

      {results && (
        <>
          <TextAnalysisMetrics results={results} / />
          <TextAnalysisResults results={results} / />
        </>
      )}
    </div>);};
