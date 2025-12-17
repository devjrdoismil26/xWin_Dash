/**
 * Componente LeadNotes
 *
 * @description
 * Componente para exibir e gerenciar notas de um lead específico.
 *
 * @module modules/Leads/LeadsManager/components/LeadNotes
 * @since 1.0.0
 */

import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { Plus, FileText, Clock, User } from 'lucide-react';
import { LeadNote } from '@/types';

/**
 * Props do componente LeadNotes
 *
 * @interface LeadNotesProps
 * @property {LeadNote[]} notes - Lista de notas do lead
 * @property {boolean} loading - Se está carregando
 * @property {number} leadId - ID do lead
 */
interface LeadNotesProps {
  notes: LeadNote[];
  loading: boolean;
  leadId: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente LeadNotes
 *
 * @description
 * Exibe uma lista de notas do lead com opção de adicionar novas notas.
 *
 * @param {LeadNotesProps} props - Props do componente
 * @returns {JSX.Element} Componente de notas
 *
 * @example
 * ```tsx
 * <LeadNotes
 *   notes={ notes }
 *   loading={ false }
 *   leadId={ 123 }
 * / />
 * ```
 */
export const LeadNotes: React.FC<LeadNotesProps> = ({ notes, loading, leadId    }) => {
  const handleAddNote = () => {};

  if (loading) {
    return (
        <>
      <Card className="p-6" />
      <div className=" ">$2</div><LoadingSpinner size="md" / /></div></Card>);

  }

  return (
        <>
      <Card className="p-6" />
      <div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center" />
          <FileText className="w-5 h-5 mr-2" />
          Notas
        </h3>
        <Button onClick={handleAddNote} variant="primary" size="sm" />
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Nota
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className=" ">$2</div><FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nenhuma nota encontrada</p>
      </div>
    </>
  ) : (
        <div className="{(notes || []).map((note: unknown) => (">$2</div>
            <div
              key={ note.id }
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
           
        </div><div className=" ">$2</div><div className=" ">$2</div><User className="w-4 h-4 mr-1" />
                  <span>{note.author?.name || 'Usuário'}</span></div><div className=" ">$2</div><Clock className="w-3 h-3 mr-1" />
                  <span>{new Date(note.created_at).toLocaleString('pt-BR')}</span></div><p className="text-gray-900 dark:text-white whitespace-pre-wrap">{note.content}</p>
              {note.is_private && (
                <span className="Privada">$2</span>
      </span>
    </>
  )}
            </div>
          ))}
        </div>
      )}
    </Card>);};

export default LeadNotes;
