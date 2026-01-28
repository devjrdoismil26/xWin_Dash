import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { LeadScoreUpdaterProps } from '../types';
import { toast } from 'sonner';
const LeadScoreUpdater: React.FC<LeadScoreUpdaterProps> = ({ 
  leadId, 
  currentScore, 
  onScoreUpdate 
}) => {
  const [score, setScore] = useState(currentScore);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleScoreChange = (newScore: number) => {
    if (newScore >= 0 && newScore <= 100) {
      setScore(newScore);
    }
  };
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
    }
  };
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };
  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Baixo';
  };
  const quickScores = [0, 25, 50, 75, 100];
  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Atualizar Score</h3>
        <div className="text-sm text-gray-500">
          Lead ID: {leadId}
        </div>
      </div>
      {/* Score Atual */}
      <div className="text-center">
        <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
          {score}
        </div>
        <div className="text-sm text-gray-600">
          {getScoreLabel(score)}
        </div>
      </div>
      {/* Barra de Progresso */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>0</span>
          <span>100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              score >= 80 ? 'bg-green-500' :
              score >= 60 ? 'bg-yellow-500' :
              score >= 40 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
      {/* Controles */}
      <div className="space-y-4">
        {/* Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Score (0-100)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={score}
            onChange={(e) => handleScoreChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        {/* Input Numérico */}
        <div>
          <input
            type="number"
            min="0"
            max="100"
            value={score}
            onChange={(e) => handleScoreChange(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Botões Rápidos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valores Rápidos
          </label>
          <div className="flex gap-2">
            {quickScores.map((quickScore) => (
              <button
                key={quickScore}
                onClick={() => handleScoreChange(quickScore)}
                className={`px-3 py-1 text-sm rounded ${
                  score === quickScore
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-800 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {quickScore}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Botões de Ação */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-gray-500">
          Score anterior: {currentScore}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setScore(currentScore)}
            disabled={isUpdating}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating || score === currentScore}
            loading={isUpdating}
            loadingText="Atualizando..."
          >
            Atualizar Score
          </Button>
        </div>
      </div>
    </div>
  );
};
export default LeadScoreUpdater;
