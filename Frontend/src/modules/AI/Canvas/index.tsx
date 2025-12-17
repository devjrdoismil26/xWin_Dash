import React, { Suspense, useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/shared/components/ui/Card';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { PageTransition } from '@/shared/components/ui/AdvancedAnimations';
import { getErrorMessage } from '@/utils/errorHelpers';
const GeminiCanvas = React.lazy(() => import('./components/GeminiCanvas'));

const ModernAICanvas = React.lazy(() => import('./components/ModernAICanvas'));

const GeminiCanvasPage: React.FC = () => {
  const [prompts, setPrompts] = useState<Record<string, any>[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [useModernCanvas, setUseModernCanvas] = useState<boolean>(false);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await axios.get(route('ai.prompts.idx'));

        setPrompts(response.data?.data || []);

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
        toast.error('Falha ao carregar a biblioteca de prompts.', { description: errorMessage });

      } finally {
        setIsLoading(false);

      } ;

    fetchPrompts();

  }, []);

  return (
        <>
      <PageTransition type="fade" duration={ 500 } />
      <Head />
        <title>Canvas IA - xWin Dash</title>
        <meta name="description" content="Canvas interativo para IA" / /></Head><AuthenticatedLayout />
        <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><h1 className="text-3xl font-bold text-gray-900">Canvas IA</h1>
                  <p className="mt-2 text-gray-600" />
                    Crie e experimente com prompts de IA de forma visual e interativa.
                  </p></div><button
                  onClick={ () => setUseModernCanvas(!useModernCanvas) }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {useModernCanvas ? 'Canvas Clássico' : 'Canvas Moderno'}
                </button>
              </div>
            { isLoading ? (
              <Card />
                <Card.Content className="p-6 text-center" />
                  <LoadingSpinner size="lg" / />
                  <p className="mt-2 text-gray-600">Carregando Canvas...</p>
                </Card.Content>
      </Card>
    </>
  ) : (
              <Suspense fallback={ <Card />
                  <Card.Content className="p-6 text-center" />
                    <LoadingSpinner size="lg" / />
                    <p className="mt-2 text-gray-600">Carregando Canvas...</p>
                  </Card.Content>
                </Card>
  }>
                {useModernCanvas ? (
                  <ModernAICanvas initialPrompts={prompts} projectId={undefined} / />
                ) : (
                  <GeminiCanvas initialPrompts={prompts} projectId={undefined} / />
                )}
              </Suspense>
            )}
          </div></AuthenticatedLayout></PageTransition>);};

export default GeminiCanvasPage;
