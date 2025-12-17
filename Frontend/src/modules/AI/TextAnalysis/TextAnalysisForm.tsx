import React from 'react';
import { Button } from '@/shared/components/ui/Button';

export const TextAnalysisForm: React.FC<{ text: string; onChange?: (e: any) => void; onAnalyze?: (e: any) => void }> = ({ text, onChange, onAnalyze }) => (
  <div className=" ">$2</div><textarea value={text} onChange={(e: unknown) => onChange(e.target.value)} className="w-full h-32 p-3 rounded-lg bg-white/5 border border-white/10 text-white" placeholder="Digite o texto para análise..." />
    <Button onClick={() => onAnalyze({ sentiment: 'positive' })} className="w-full">Analisar</Button>
  </div>);
