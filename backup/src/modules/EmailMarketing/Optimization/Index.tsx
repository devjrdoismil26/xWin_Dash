import React, { useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
import CampaignOptimizerDashboard from './components/CampaignOptimizerDashboard.tsx';
import ContentRecommender from './components/ContentRecommender.tsx';
import SendingTimeRecommender from './components/SendingTimeRecommender.tsx';
import SubjectOptimizerForm from './components/SubjectOptimizerForm.tsx';
const EmailMarketingOptimizationIndex: React.FC = () => {
  const [optimizedSubject, setOptimizedSubject] = useState<string | null>(null);
  const [recommendedTime, setRecommendedTime] = useState<any | null>(null);
  const [recommendedContent, setRecommendedContent] = useState<any[]>([]);
  const [fullOptimizationResult, setFullOptimizationResult] = useState<any | null>(null);
  const handleFullOptimize = useCallback((result: any) => {
    setFullOptimizationResult(result || null);
  }, []);
  return (
    <AuthenticatedLayout>
      <Head title="Otimização - Email Marketing" />
      <PageLayout>
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>Otimização de Campanhas</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-6">
              <CampaignOptimizerDashboard onOptimize={handleFullOptimize} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SubjectOptimizerForm onOptimize={setOptimizedSubject} />
                <SendingTimeRecommender onRecommendationSelect={setRecommendedTime} />
              </div>
              <ContentRecommender onContentSelect={(c) => setRecommendedContent((prev) => [...prev, c])} />
              {optimizedSubject && (
                <div className="p-4 rounded-md bg-green-50">
                  <h4 className="font-medium mb-1">Assunto Otimizado</h4>
                  <p className="text-sm text-green-800">{optimizedSubject}</p>
                </div>
              )}
              {recommendedTime && (
                <div className="p-4 rounded-md bg-blue-50">
                  <h4 className="font-medium mb-1">Horário Recomendado</h4>
                  <pre className="text-sm text-blue-800 whitespace-pre-wrap">{JSON.stringify(recommendedTime, null, 2)}</pre>
                </div>
              )}
              {recommendedContent.length > 0 && (
                <div className="p-4 rounded-md bg-amber-50">
                  <h4 className="font-medium mb-1">Conteúdos Recomendados</h4>
                  <ul className="list-disc list-inside text-sm text-amber-800">
                    {recommendedContent.map((c, idx) => (
                      <li key={idx}>{typeof c === 'string' ? c : JSON.stringify(c)}</li>
                    ))}
                  </ul>
                </div>
              )}
              {fullOptimizationResult && (
                <div className="p-4 rounded-md bg-gray-50">
                  <h4 className="font-medium mb-1">Resultado da Otimização Completa</h4>
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">{JSON.stringify(fullOptimizationResult, null, 2)}</pre>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </PageLayout>
    </AuthenticatedLayout>
  );
};
export default EmailMarketingOptimizationIndex;
