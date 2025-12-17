import React, { useState } from 'react';
import Button from '@/shared/components/ui/Button';
import { LeadScoreUpdaterProps } from '../types';
import { toast } from 'sonner';
const LeadScoreUpdater: React.FC<LeadScoreUpdaterProps> = ({ leadId, 
  currentScore, 
  onScoreUpdate 
   }) => {
  const [score, setScore] = useState(currentScore);

  const [isUpdating, setIsUpdating] = useState(false);

  const handleScoreChange = (newScore: number) => {
    if (newScore >= 0 && newScore <= 100) {
      setScore(newScore);

    } ;

  const handleUpdate = async () => {
    if (score === currentScore) {
      toast.info('Score não foi alterado');

      return;
    }
    setIsUpdating(true);

    try {
      // Simular atualização do score
      await new Promise(resolve => setTimeout(resolve, 1000));

      onScoreUpdate?.(score);

      toast.success('Score atualizado com sucesso!');

    } catch (error) {
      toast.error('Erro ao atualizar score. Tente novamente.');

      setScore(currentScore); // Reverter em caso de erro
    } finally {
      setIsUpdating(false);

    } ;

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';};

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Baixo';};

  const quickScores = [0, 25, 50, 75, 100];
  return (
            <div className=" ">$2</div><div className=" ">$2</div><h3 className="text-lg font-medium text-gray-900">Atualizar Score</h3>
        <div className="Lead ID: {leadId}">$2</div>
        </div>
      {/* Score Atual */}
      <div className=" ">$2</div><div className={`text-4xl font-bold ${getScoreColor(score)} `}>
           
        </div>{score}
        </div>
        <div className="{getScoreLabel(score)}">$2</div>
        </div>
      {/* Barra de Progresso */}
      <div className=" ">$2</div><div className=" ">$2</div><span>0</span>
          <span>100</span></div><div className=" ">$2</div><div 
            className={`h-3 rounded-full transition-all duration-300 ${
              score >= 80 ? 'bg-green-500' :
              score >= 60 ? 'bg-yellow-500' :
              score >= 40 ? 'bg-orange-500' : 'bg-red-500'
            } `}
            style={width: `${score} %` } ></div></div>
      {/* Controles */}
      <div className="{/* Slider */}">$2</div>
        <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
            Score (0-100)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={ score }
            onChange={ (e: unknown) => handleScoreChange(parseInt(e.target.value)) }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        {/* Input Numérico */}
        <div>
           
        </div><input
            type="number"
            min="0"
            max="100"
            value={ score }
            onChange={ (e: unknown) => handleScoreChange(parseInt(e.target.value) || 0) }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {/* Botões Rápidos */}
        <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
            Valores Rápidos
          </label>
          <div className="{(quickScores || []).map((quickScore: unknown) => (">$2</div>
              <button
                key={ quickScore }
                onClick={ () => handleScoreChange(quickScore) }
                className={`px-3 py-1 text-sm rounded ${
                  score === quickScore
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-800 border-2 border-transparent hover:bg-gray-200'
                } `}
  >
                {quickScore}
              </button>
            ))}
          </div>
      </div>
      {/* Botões de Ação */}
      <div className=" ">$2</div><div className="Score anterior: {currentScore}">$2</div>
        </div>
        <div className=" ">$2</div><Button
            variant="outline"
            onClick={ () => setScore(currentScore) }
            disabled={ isUpdating  }>
            Cancelar
          </Button>
          <Button
            onClick={ handleUpdate }
            disabled={ isUpdating || score === currentScore }
            loading={ isUpdating }
            loadingText="Atualizando..." />
            Atualizar Score
          </Button></div></div>);};

export default LeadScoreUpdater;
