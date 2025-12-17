import React, { useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/shared/components/ui/Card';
import CampaignOptimizerDashboard from './components/CampaignOptimizerDashboard';
import ContentRecommender from './components/ContentRecommender';
import SendingTimeRecommender from './components/SendingTimeRecommender';
import SubjectOptimizerForm from './components/SubjectOptimizerForm';
const EmailMarketingOptimizationIndex: React.FC = () => {
  const [optimizedSubject, setOptimizedSubject] = useState<string | null>(null);

  const [recommendedTime, setRecommendedTime] = useState<Record<string, any> | null>(null);

  const [recommendedContent, setRecommendedContent] = useState<unknown[]>([]);

  const [fullOptimizationResult, setFullOptimizationResult] = useState<Record<string, any> | null>(null);

  const handleFullOptimize = useCallback((result: Record<string, any>) => {
    setFullOptimizationResult(result || null);

  }, []);

  return (
        <>
      <AuthenticatedLayout />
      <Head title="Otimização - Email Marketing" / />
      <PageLayout />
        <div className=" ">$2</div><Card />
            <Card.Header />
              <Card.Title>Otimização de Campanhas</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-6" />
              <CampaignOptimizerDashboard onOptimize={handleFullOptimize} / />
              <div className=" ">$2</div><SubjectOptimizerForm onOptimize={setOptimizedSubject} / />
                <SendingTimeRecommender onRecommendationSelect={setRecommendedTime} / /></div><ContentRecommender onContentSelect={ (c: unknown) => setRecommendedContent((prev: unknown) => [...prev, c]) } />
              {optimizedSubject && (
                <div className=" ">$2</div><h4 className="font-medium mb-1">Assunto Otimizado</h4>
                  <p className="text-sm text-green-800">{optimizedSubject}</p>
      </div>
    </>
  )}
              {recommendedTime && (
                <div className=" ">$2</div><h4 className="font-medium mb-1">Horário Recomendado</h4>
                  <pre className="text-sm text-blue-800 whitespace-pre-wrap">{JSON.stringify(recommendedTime, null, 2)}</pre>
      </div>
    </>
  )}
              {recommendedContent.length > 0 && (
                <div className=" ">$2</div><h4 className="font-medium mb-1">Conteúdos Recomendados</h4>
                  <ul className="list-disc list-inside text-sm text-amber-800" />
                    {(recommendedContent || []).map((c: unknown, idx: unknown) => (
                      <li key={ idx }>{typeof c === 'string' ? c : JSON.stringify(c)}</li>
                    ))}
                  </ul>
      </div>
    </>
  )}
              {fullOptimizationResult && (
                <div className=" ">$2</div><h4 className="font-medium mb-1">Resultado da Otimização Completa</h4>
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">{JSON.stringify(fullOptimizationResult, null, 2)}</pre>
      </div>
    </>
  )}
            </Card.Content></Card></div></PageLayout></AuthenticatedLayout>);};

export default EmailMarketingOptimizationIndex;
